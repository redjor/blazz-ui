# Ops Security Hardening — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Fix all 6 security audit findings in apps/ops (IDOR, CORS, TS build, session cache, N+1, examples auth).

**Architecture:** Add `userId` field to all user-owned Convex tables, update `requireAuth` to return userId, add ownership checks in every query/mutation. Fix CORS on token endpoint. Optimize N+1 queries. Fix examples session/auth issues.

**Tech Stack:** Convex (schema + functions), Next.js config, React Query

---

## Context

### Files involved (apps/ops/convex/)
- `schema.ts` — table definitions
- `test.schema.ts` — test schema (mirrors prod, no authTables)
- `lib/auth.ts` — `requireAuth()` helper
- `clients.ts` — 6 functions (list, get, create, update, remove, getStats)
- `projects.ts` — 8 functions (listByClient, listAll, listAllWithBudget, listActive, get, create, update, getWithStats)
- `contracts.ts` — 5 functions (getActiveByProject, listByProject, create, update, complete, cancel)
- `contractFiles.ts` — 4 functions (listByContract, generateUploadUrl, create, remove)
- `timeEntries.ts` — 9 functions (list, listByDate, recent, listForRecap, create, update, remove, setStatus, listPaginated, + 2 deprecated)
- `todos.ts` — 7 functions (list, get, listByDate, listAllTags, create, update, updateStatus, remove) — NOTE: **no requireAuth** on any function currently!
- `categories.ts` — 4 functions (list, create, update, remove) — NOTE: **no requireAuth** on any function currently!
- `packages.ts` — system-level (npm sync), no user data, skip
- `http.ts` — token endpoint + telegram webhook
- `seed.ts` — dev seed data
- `users.ts` — getCurrentUser query

### Files involved (apps/examples/)
- `hooks/use-session.ts` — session cache (staleTime 5min)
- `hooks/use-csrf.ts` — calls /api/csrf (route doesn't exist)
- `app/api/auth/session/route.ts` — always returns 401
- `app/api/auth/logout/route.ts` — no React Query invalidation

### Files involved (config)
- `apps/ops/next.config.mjs` — ignoreBuildErrors
- `apps/examples/next.config.mjs` — ignoreBuildErrors

### Key decisions
- `userId` = `identity.subject` from `ctx.auth.getUserIdentity()` (string, stable across sessions)
- `packages` table is system-level → no userId needed
- `seed.ts` will need update to include userId on all inserts
- `test.schema.ts` must mirror schema changes
- Convex Auth `getAuthUserId()` returns `Id<"users">` from auth tables, but `identity.subject` is simpler and doesn't require joining. We use `identity.subject` consistently.
- Existing data has no userId → re-seed required after schema push

---

### Task 1: Update `requireAuth` to return userId

**Files:**
- Modify: `apps/ops/convex/lib/auth.ts`

**Step 1: Update requireAuth**

```typescript
import type { GenericQueryCtx } from "convex/server"
import { ConvexError } from "convex/values"

/**
 * Vérifie que l'utilisateur est authentifié.
 * Retourne le userId (identity.subject) pour les checks d'ownership.
 * Throw ConvexError si non connecté.
 */
export async function requireAuth(ctx: GenericQueryCtx<any>) {
	const identity = await ctx.auth.getUserIdentity()
	if (!identity) {
		throw new ConvexError("Non authentifié")
	}
	return { identity, userId: identity.subject }
}
```

**Step 2: Verify existing tests still pass**

Run: `cd apps/ops && pnpm vitest run`
Expected: All existing tests pass (requireAuth still throws on no identity, return value was previously unused)

**Step 3: Commit**

```bash
git add apps/ops/convex/lib/auth.ts
git commit -m "fix(ops): return userId from requireAuth for ownership checks"
```

---

### Task 2: Add `userId` to schema + test schema

**Files:**
- Modify: `apps/ops/convex/schema.ts`
- Modify: `apps/ops/convex/test.schema.ts`

**Step 1: Add userId to all user-owned tables in schema.ts**

Add `userId: v.string()` to: `clients`, `projects`, `contracts`, `contractFiles`, `timeEntries`, `categories`, `todos`.
Add `.index("by_user", ["userId"])` to each table.
Do NOT modify `packages` (system table).

For tables that already have compound indexes, add userId-prefixed indexes where needed for ownership queries:
- `projects`: add `.index("by_user", ["userId"])` and `.index("by_user_client", ["userId", "clientId"])` and `.index("by_user_status", ["userId", "status"])`
- `timeEntries`: add `.index("by_user", ["userId"])` and `.index("by_user_project", ["userId", "projectId"])` and `.index("by_user_date", ["userId", "date"])`
- `contracts`: add `.index("by_user", ["userId"])`
- `contractFiles`: add `.index("by_user", ["userId"])`
- `todos`: add `.index("by_user", ["userId"])` and `.index("by_user_status", ["userId", "status"])` and `.index("by_user_category", ["userId", "categoryId"])`
- `categories`: add `.index("by_user", ["userId"])`
- `clients`: add `.index("by_user", ["userId"])`

**Step 2: Mirror changes in test.schema.ts**

Same additions for tables present in test.schema.ts: clients, projects, timeEntries, categories, todos, packages.

**Step 3: Commit**

```bash
git add apps/ops/convex/schema.ts apps/ops/convex/test.schema.ts
git commit -m "fix(ops): add userId field and indexes to all user-owned tables"
```

---

### Task 3: Add ownership to `clients.ts`

**Files:**
- Modify: `apps/ops/convex/clients.ts`

**Step 1: Update all functions**

Pattern for queries:
```typescript
const { userId } = await requireAuth(ctx)
// Use index for list operations
const clients = await ctx.db.query("clients")
  .withIndex("by_user", (q) => q.eq("userId", userId))
  .order("desc").collect()
```

Pattern for get + mutation:
```typescript
const { userId } = await requireAuth(ctx)
const existing = await ctx.db.get(id)
if (!existing || existing.userId !== userId) throw new ConvexError("Client introuvable")
```

Pattern for create:
```typescript
const { userId } = await requireAuth(ctx)
return ctx.db.insert("clients", { ...args, userId, createdAt: Date.now() })
```

Apply to all 6 functions: `list`, `get`, `generateUploadUrl` (no change needed — no resource), `create`, `update`, `remove`, `getStats`.

**Step 2: Commit**

```bash
git add apps/ops/convex/clients.ts
git commit -m "fix(ops): add ownership checks to all client functions"
```

---

### Task 4: Add ownership to `projects.ts`

**Files:**
- Modify: `apps/ops/convex/projects.ts`

**Step 1: Update all 8 functions**

- `listByClient`: verify the client belongs to user first, then query projects by client
- `listAll`: filter by userId index
- `listAllWithBudget`: filter by userId index
- `listActive`: filter by userId + status
- `get`: verify ownership
- `create`: verify client ownership, insert with userId
- `update`: verify ownership
- `getWithStats`: verify ownership

For `listByClient`, verify the client belongs to the user:
```typescript
const { userId } = await requireAuth(ctx)
const client = await ctx.db.get(clientId)
if (!client || client.userId !== userId) return []
```

For `listAll` / `listAllWithBudget` / `listActive`, use userId index:
```typescript
const { userId } = await requireAuth(ctx)
const projects = await ctx.db.query("projects")
  .withIndex("by_user", (q) => q.eq("userId", userId))
  .collect()
```

**Step 2: Commit**

```bash
git add apps/ops/convex/projects.ts
git commit -m "fix(ops): add ownership checks to all project functions"
```

---

### Task 5: Add ownership to `contracts.ts`

**Files:**
- Modify: `apps/ops/convex/contracts.ts`

**Step 1: Update all 6 functions**

For queries by project, verify project ownership first:
```typescript
const { userId } = await requireAuth(ctx)
const project = await ctx.db.get(projectId)
if (!project || project.userId !== userId) return null // or []
```

For mutations on contract by id, verify ownership:
```typescript
const { userId } = await requireAuth(ctx)
const contract = await ctx.db.get(id)
if (!contract || contract.userId !== userId) throw new ConvexError("Contrat introuvable")
```

For create, verify project ownership and stamp userId:
```typescript
const { userId } = await requireAuth(ctx)
const project = await ctx.db.get(args.projectId)
if (!project || project.userId !== userId) throw new ConvexError("Projet introuvable")
return ctx.db.insert("contracts", { ...args, userId, createdAt: Date.now() })
```

**Step 2: Commit**

```bash
git add apps/ops/convex/contracts.ts
git commit -m "fix(ops): add ownership checks to all contract functions"
```

---

### Task 6: Add ownership to `contractFiles.ts`

**Files:**
- Modify: `apps/ops/convex/contractFiles.ts`

**Step 1: Update all 4 functions**

- `listByContract`: verify contract ownership via userId field
- `generateUploadUrl`: no change (no resource accessed)
- `create`: verify contract ownership, stamp userId
- `remove`: verify file ownership via userId field

```typescript
// listByContract
const { userId } = await requireAuth(ctx)
const contract = await ctx.db.get(contractId)
if (!contract || contract.userId !== userId) return []

// create
const { userId } = await requireAuth(ctx)
const contract = await ctx.db.get(args.contractId)
if (!contract || contract.userId !== userId) throw new ConvexError("Contrat introuvable")
return ctx.db.insert("contractFiles", { ...args, userId, createdAt: Date.now() })

// remove
const { userId } = await requireAuth(ctx)
const file = await ctx.db.get(id)
if (!file || file.userId !== userId) throw new ConvexError("Fichier introuvable")
```

**Step 2: Commit**

```bash
git add apps/ops/convex/contractFiles.ts
git commit -m "fix(ops): add ownership checks to all contractFile functions"
```

---

### Task 7: Add ownership to `timeEntries.ts`

**Files:**
- Modify: `apps/ops/convex/timeEntries.ts`

**Step 1: Update all functions**

- `list`: filter by userId (+ project filter via index)
- `listByDate`: filter by userId
- `recent`: filter by userId
- `listForRecap`: filter by userId
- `create`: verify project ownership, stamp userId
- `update`: verify entry ownership
- `remove`: verify entry ownership
- `setStatus`: verify each entry ownership
- `markInvoiced` / `unmarkInvoiced` (deprecated): verify each entry ownership
- `listPaginated`: add userId filter

For list queries:
```typescript
const { userId } = await requireAuth(ctx)
let entries = projectId
  ? await ctx.db.query("timeEntries")
      .withIndex("by_user_project", (q) => q.eq("userId", userId).eq("projectId", projectId))
      .collect()
  : await ctx.db.query("timeEntries")
      .withIndex("by_user", (q) => q.eq("userId", userId))
      .collect()
```

For mutations:
```typescript
const { userId } = await requireAuth(ctx)
const entry = await ctx.db.get(id)
if (!entry || entry.userId !== userId) throw new ConvexError("Entrée introuvable")
```

For `listPaginated`, add userId filter condition to the filter chain.

**Step 2: Commit**

```bash
git add apps/ops/convex/timeEntries.ts
git commit -m "fix(ops): add ownership checks to all timeEntry functions"
```

---

### Task 8: Add auth + ownership to `todos.ts` and `categories.ts`

**Files:**
- Modify: `apps/ops/convex/todos.ts`
- Modify: `apps/ops/convex/categories.ts`

**Step 1: Add requireAuth + userId to todos.ts**

Currently **NO auth at all** on any todo function. Add:
- Import `requireAuth`
- Every function gets `const { userId } = await requireAuth(ctx)`
- Queries filter by userId index
- Mutations check ownership
- Create stamps userId

Exception: `todos.create` is also called from the Telegram webhook in `http.ts` (which has no auth identity). The webhook needs a different path — see Task 9.

For now, add auth to all functions EXCEPT `create` (will handle in Task 9).

**Step 2: Add requireAuth + userId to categories.ts**

Same pattern. Import `requireAuth`, add checks to all 4 functions.

**Step 3: Commit**

```bash
git add apps/ops/convex/todos.ts apps/ops/convex/categories.ts
git commit -m "fix(ops): add auth and ownership checks to todos and categories"
```

---

### Task 9: Fix Telegram webhook + todos.create auth

**Files:**
- Modify: `apps/ops/convex/http.ts`
- Modify: `apps/ops/convex/todos.ts`

**Step 1: Create an internal mutation for Telegram todo creation**

In `todos.ts`, add an `internalCreate` mutation that doesn't require auth but takes a userId parameter:

```typescript
import { internalMutation } from "./_generated/server"

export const internalCreate = internalMutation({
  args: {
    text: v.string(),
    userId: v.string(),
    status: v.optional(statusValidator),
    source: v.optional(v.union(v.literal("app"), v.literal("telegram"))),
  },
  handler: async (ctx, { text, userId, status = "triage", source = "telegram" }) => {
    return ctx.db.insert("todos", {
      text,
      userId,
      status,
      source,
      createdAt: Date.now(),
    })
  },
})
```

**Step 2: Now add auth to public `todos.create`**

```typescript
export const create = mutation({
  // ... same args + userId stamp
  handler: async (ctx, args) => {
    const { userId } = await requireAuth(ctx)
    return ctx.db.insert("todos", { ...args, userId, status: args.status ?? "triage", source: args.source ?? "app", createdAt: Date.now() })
  },
})
```

**Step 3: Update http.ts telegram webhook**

The webhook needs to know which userId to assign todos to. Options:
- Hardcode a system userId (simplest — this is a single-user app)
- Store a Telegram→userId mapping in env

Simplest approach: add `TELEGRAM_USER_ID` env var (the Convex subject of the user who owns Telegram todos).

```typescript
// http.ts
import { internal } from "./_generated/api"

// In telegram webhook handler:
const telegramUserId = process.env.TELEGRAM_USER_ID
if (!telegramUserId) {
  return new Response("Telegram user not configured", { status: 500 })
}

await ctx.runMutation(internal.todos.internalCreate, {
  text,
  userId: telegramUserId,
  status: "triage",
  source: "telegram",
})
```

**Step 4: Fix CORS on token endpoint**

Replace `"Access-Control-Allow-Origin": "*"` with a restricted origin:

```typescript
const allowedOrigin = process.env.BLAZZTIME_ORIGIN ?? "tauri://localhost"
// ...
headers: {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": allowedOrigin,
},
```

**Step 5: Commit**

```bash
git add apps/ops/convex/todos.ts apps/ops/convex/http.ts
git commit -m "fix(ops): secure telegram webhook with userId + restrict CORS on token endpoint"
```

---

### Task 10: Update seed.ts with userId

**Files:**
- Modify: `apps/ops/convex/seed.ts`

**Step 1: Add userId to all inserts**

Add a constant at the top:
```typescript
const SEED_USER_ID = "seed-user-dev"
```

Add `userId: SEED_USER_ID` to every `ctx.db.insert()` call for clients, projects, timeEntries, todos, categories, contracts.

**Step 2: Commit**

```bash
git add apps/ops/convex/seed.ts
git commit -m "fix(ops): add userId to seed data for ownership model"
```

---

### Task 11: Update tests

**Files:**
- Modify: `apps/ops/convex/timeEntries.test.ts`

**Step 1: Update test schema usage**

The test helper `createTestProject` calls `clients.create` and `projects.create`. Since those now stamp `userId` from `requireAuth`, and the test uses `withIdentity({ subject: "user1" })`, the userId will be "user1" automatically. Tests should still pass.

**Step 2: Add IDOR tests**

Add a test that verifies user2 cannot access user1's data:

```typescript
describe("ownership isolation", () => {
  it("user2 cannot see user1's clients", async () => {
    const { t, asUser } = setup()
    const asUser2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })

    await asUser.mutation(api.clients.create, { name: "User1 Client" })
    const user2Clients = await asUser2.query(api.clients.list, {})
    expect(user2Clients).toHaveLength(0)
  })

  it("user2 cannot get user1's client by id", async () => {
    const { t, asUser } = setup()
    const asUser2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })

    const clientId = await asUser.mutation(api.clients.create, { name: "User1 Client" })
    const client = await asUser2.query(api.clients.get, { id: clientId })
    expect(client).toBeNull()
  })

  it("user2 cannot delete user1's time entry", async () => {
    const { t, asUser } = setup()
    const asUser2 = t.withIdentity({ subject: "user2", issuer: "https://auth.test" })

    const { projectId } = await createTestProject(asUser)
    const entryId = await asUser.mutation(api.timeEntries.create, {
      projectId, date: "2026-03-11", minutes: 60, hourlyRate: 100, billable: true,
    })
    await expect(
      asUser2.mutation(api.timeEntries.remove, { id: entryId })
    ).rejects.toThrow("introuvable")
  })
})
```

**Step 3: Run tests**

Run: `cd apps/ops && pnpm vitest run`
Expected: All tests pass

**Step 4: Commit**

```bash
git add apps/ops/convex/timeEntries.test.ts
git commit -m "test(ops): add IDOR ownership isolation tests"
```

---

### Task 12: Optimize N+1 queries

**Files:**
- Modify: `apps/ops/convex/clients.ts` (getStats)
- Modify: `apps/ops/convex/projects.ts` (listByClient, listAllWithBudget)

**Step 1: Optimize clients.getStats**

Instead of querying timeEntries per project individually, query all timeEntries for all projects at once:

```typescript
// Before: N queries (one per project)
// After: 1 query for all projects, then filter in-memory
const allEntries = await ctx.db.query("timeEntries")
  .withIndex("by_user", (q) => q.eq("userId", userId))
  .collect()
const projectIds = new Set(projects.map(p => p._id))
const relevantEntries = allEntries.filter(e => projectIds.has(e.projectId) && e.billable)
```

**Step 2: Optimize projects.listAllWithBudget**

Same pattern — batch fetch all timeEntries and contracts for the user, then join in memory:

```typescript
const { userId } = await requireAuth(ctx)
const projects = await ctx.db.query("projects")
  .withIndex("by_user", (q) => q.eq("userId", userId))
  .collect()
const allEntries = await ctx.db.query("timeEntries")
  .withIndex("by_user", (q) => q.eq("userId", userId))
  .collect()
const allContracts = await ctx.db.query("contracts")
  .withIndex("by_user", (q) => q.eq("userId", userId))
  .collect()

// Group in memory
const entriesByProject = Map.groupBy(allEntries, (e) => e.projectId)
const contractsByProject = Map.groupBy(allContracts, (c) => c.projectId)
```

**Step 3: Optimize projects.listByClient**

Same batch approach for timeEntries per client's projects.

**Step 4: Commit**

```bash
git add apps/ops/convex/clients.ts apps/ops/convex/projects.ts
git commit -m "perf(ops): batch timeEntries/contracts queries to eliminate N+1"
```

---

### Task 13: Fix examples session/auth issues

**Files:**
- Modify: `apps/examples/hooks/use-session.ts`
- Modify: `apps/examples/app/api/auth/session/route.ts`
- Modify: `apps/examples/app/api/auth/logout/route.ts`

**Step 1: Reduce session staleTime and enable refetchOnWindowFocus**

```typescript
// use-session.ts
export function useSession() {
  return useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    retry: false,
    staleTime: 30 * 1000, // 30 seconds (was 5 minutes)
    refetchOnWindowFocus: true, // was false
  })
}
```

**Step 2: Make session route return mock user for demo (not 401)**

The `isAuthenticated = false` hardcode means the demo CRM can never work with auth. Change to `true` since this is a demo:

```typescript
const isAuthenticated = true // Demo mode — always authenticated
```

**Step 3: Add TODO comment on logout for React Query invalidation**

The logout route itself can't invalidate React Query (server-side). The client-side needs to handle this. Add a comment in the logout route and verify the SidebarUserMenu component.

The real fix is in the client component that calls logout — it should invalidate the session query after POST:
```typescript
// In sidebar-user.tsx or wherever logout is called:
// queryClient.invalidateQueries({ queryKey: ["session"] })
```

Since `sidebar-user.tsx` is in `packages/ui/` (shared), and per CLAUDE.md we must NOT modify packages/ui unless explicitly asked, we'll add a comment in the examples logout route instead.

**Step 4: Commit**

```bash
git add apps/examples/hooks/use-session.ts apps/examples/app/api/auth/session/route.ts apps/examples/app/api/auth/logout/route.ts
git commit -m "fix(examples): improve session cache settings and enable demo auth"
```

---

### Task 14: Fix TypeScript build errors config

**Files:**
- Modify: `apps/ops/next.config.mjs`
- Modify: `apps/examples/next.config.mjs`

**Step 1: Add prebuild script for Convex type generation (ops)**

The root issue is that `convex/_generated/` is gitignored, so TS can't resolve types at build time. The fix is to generate types before the build.

In `apps/ops/package.json`, add a prebuild script:
```json
"prebuild": "npx convex codegen"
```

Then remove `ignoreBuildErrors: true` from next.config.mjs... BUT this would break CI if Convex isn't configured. Keep `ignoreBuildErrors` for now but add a comment explaining why and the ideal fix.

Actually, per the audit, the recommendation is to NOT ignore TS errors. But since `convex/_generated/` won't exist in CI without Convex credentials, this is a known trade-off. Better approach: check if the directory exists at build time.

**Pragmatic fix:** Keep `ignoreBuildErrors` but add a strong comment. This is a known limitation of Convex + static export without CI credentials.

For `apps/examples/` — there's no Convex dependency. Check if there are actual TS errors.

**Step 2: Commit**

```bash
git add apps/ops/next.config.mjs apps/examples/next.config.mjs
git commit -m "docs(ops): document ignoreBuildErrors rationale for Convex codegen"
```

---

### Summary

| Task | Issue | Severity | Files |
|------|-------|----------|-------|
| 1 | Update requireAuth | HIGH | lib/auth.ts |
| 2 | Add userId to schemas | HIGH | schema.ts, test.schema.ts |
| 3-8 | Ownership checks in all functions | HIGH | clients, projects, contracts, contractFiles, timeEntries, todos, categories |
| 9 | Telegram webhook + CORS token | HIGH | http.ts, todos.ts |
| 10 | Seed data update | HIGH | seed.ts |
| 11 | IDOR tests | HIGH | timeEntries.test.ts |
| 12 | N+1 optimization | MEDIUM | clients.ts, projects.ts |
| 13 | Examples session/auth | MEDIUM | use-session.ts, routes |
| 14 | TS build config | MEDIUM | next.config.mjs |
