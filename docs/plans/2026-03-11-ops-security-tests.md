# Ops Time Tracking — Security Guards + Tests

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Sécuriser les mutations Convex (auth + business guards) et couvrir le time tracking avec des tests unitaires et Convex.

**Architecture:** Helper `requireAuth` vérifie l'identité sur toutes les mutations/queries. Guards métier sur delete/update des entries invoiced/paid. Validation server-side des transitions de status. Tests via vitest (lib/) + convex-test (mutations).

**Tech Stack:** Convex, convex-test, vitest, zod

---

### Task 1: Setup vitest pour apps/ops

**Files:**
- Create: `apps/ops/vitest.config.ts`
- Modify: `apps/ops/package.json`

**Step 1: Install convex-test**

Run: `cd apps/ops && pnpm add -D convex-test vitest`
Expected: packages added to devDependencies

**Step 2: Create vitest config**

```ts
// apps/ops/vitest.config.ts
import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    include: [
      "lib/**/*.test.ts",
      "convex/**/*.test.ts",
    ],
  },
})
```

**Step 3: Add test script to package.json**

Add to `scripts`:
```json
"test": "vitest run",
"test:watch": "vitest"
```

**Step 4: Verify config**

Run: `cd apps/ops && pnpm test`
Expected: "No test files found" (pas d'erreur de config)

**Step 5: Commit**

```bash
git add apps/ops/vitest.config.ts apps/ops/package.json
git commit -m "test(ops): add vitest + convex-test setup"
```

---

### Task 2: Tests unitaires — lib/format.ts

**Files:**
- Create: `apps/ops/lib/format.test.ts`

**Step 1: Write tests**

```ts
import { describe, expect, it } from "vitest"
import { formatMinutes, formatCurrency, Currency, formatBytes } from "./format"

describe("formatMinutes", () => {
  it("formats full hours", () => {
    expect(formatMinutes(60)).toBe("1h")
    expect(formatMinutes(120)).toBe("2h")
  })

  it("formats hours and minutes", () => {
    expect(formatMinutes(90)).toBe("1h30")
    expect(formatMinutes(75)).toBe("1h15")
  })

  it("formats minutes only", () => {
    expect(formatMinutes(30)).toBe("0h30")
    expect(formatMinutes(5)).toBe("0h05")
  })

  it("formats zero", () => {
    expect(formatMinutes(0)).toBe("0h")
  })
})

describe("formatCurrency", () => {
  it("formats EUR by default", () => {
    expect(formatCurrency(1234)).toMatch(/€/)
    expect(formatCurrency(1234)).toMatch(/1[\s\u202f]?234/)
  })

  it("rounds to integer", () => {
    expect(formatCurrency(99.7)).toMatch(/100/)
  })

  it("formats zero", () => {
    expect(formatCurrency(0)).toMatch(/€/)
    expect(formatCurrency(0)).toMatch(/0/)
  })
})

describe("formatBytes", () => {
  it("formats bytes", () => {
    expect(formatBytes(500)).toBe("500 B")
  })

  it("formats kilobytes", () => {
    expect(formatBytes(1024)).toBe("1.0 kB")
    expect(formatBytes(1536)).toBe("1.5 kB")
  })

  it("formats megabytes", () => {
    expect(formatBytes(1048576)).toBe("1.0 MB")
  })
})
```

**Step 2: Run tests**

Run: `cd apps/ops && pnpm test`
Expected: All PASS

**Step 3: Commit**

```bash
git add apps/ops/lib/format.test.ts
git commit -m "test(ops): add format utility tests"
```

---

### Task 3: Tests unitaires — lib/rate.ts

**Files:**
- Create: `apps/ops/lib/rate.test.ts`

**Step 1: Write tests**

```ts
import { describe, expect, it } from "vitest"
import { computeHourlyRate } from "./rate"

describe("computeHourlyRate", () => {
  it("divides TJM by hours per day", () => {
    expect(computeHourlyRate(800, 8)).toBe(100)
    expect(computeHourlyRate(700, 7)).toBe(100)
  })

  it("handles fractional results", () => {
    expect(computeHourlyRate(500, 7)).toBeCloseTo(71.43, 1)
  })

  it("falls back to 8h when hoursPerDay is 0", () => {
    expect(computeHourlyRate(800, 0)).toBe(100)
  })

  it("falls back to 8h when hoursPerDay is negative", () => {
    expect(computeHourlyRate(800, -1)).toBe(100)
  })
})
```

**Step 2: Run tests**

Run: `cd apps/ops && pnpm test`
Expected: All PASS

**Step 3: Commit**

```bash
git add apps/ops/lib/rate.test.ts
git commit -m "test(ops): add rate utility tests"
```

---

### Task 4: Tests unitaires — lib/time-entry-status.ts

**Files:**
- Create: `apps/ops/lib/time-entry-status.test.ts`

**Step 1: Write tests**

```ts
import { describe, expect, it } from "vitest"
import { getEffectiveStatus, getAllowedTransitions } from "./time-entry-status"

describe("getEffectiveStatus", () => {
  it("returns null for non-billable", () => {
    expect(getEffectiveStatus({ billable: false })).toBeNull()
  })

  it("returns explicit status when set", () => {
    expect(getEffectiveStatus({ billable: true, status: "invoiced" })).toBe("invoiced")
    expect(getEffectiveStatus({ billable: true, status: "paid" })).toBe("paid")
  })

  it("falls back to invoiced when invoicedAt is set (legacy)", () => {
    expect(getEffectiveStatus({ billable: true, invoicedAt: 1234 })).toBe("invoiced")
  })

  it("defaults to draft for billable without status", () => {
    expect(getEffectiveStatus({ billable: true })).toBe("draft")
  })

  it("prefers explicit status over invoicedAt", () => {
    expect(getEffectiveStatus({ billable: true, status: "paid", invoicedAt: 1234 })).toBe("paid")
  })
})

describe("getAllowedTransitions", () => {
  it("draft → ready_to_invoice", () => {
    expect(getAllowedTransitions("draft")).toEqual(["ready_to_invoice"])
  })

  it("ready_to_invoice → draft or invoiced", () => {
    expect(getAllowedTransitions("ready_to_invoice")).toEqual(["draft", "invoiced"])
  })

  it("invoiced → ready_to_invoice or paid", () => {
    expect(getAllowedTransitions("invoiced")).toEqual(["ready_to_invoice", "paid"])
  })

  it("paid is terminal", () => {
    expect(getAllowedTransitions("paid")).toEqual([])
  })

  it("null returns empty", () => {
    expect(getAllowedTransitions(null)).toEqual([])
  })
})
```

**Step 2: Run tests**

Run: `cd apps/ops && pnpm test`
Expected: All PASS

**Step 3: Commit**

```bash
git add apps/ops/lib/time-entry-status.test.ts
git commit -m "test(ops): add time-entry-status utility tests"
```

---

### Task 5: Créer le helper requireAuth

**Files:**
- Create: `apps/ops/convex/lib/auth.ts`

**Step 1: Write failing test**

Create `apps/ops/convex/lib/auth.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { convexTest } from "convex-test"
import schema from "../schema"
import { api } from "../_generated/api"

// We test requireAuth indirectly through a mutation that uses it.
// Tests will be written after Task 6 adds auth to mutations.
// This file is a placeholder to verify convex-test works.

describe("convex-test setup", () => {
  it("can create a test instance", async () => {
    const t = convexTest(schema)
    await t.run(async (ctx) => {
      const entries = await ctx.db.query("timeEntries").collect()
      expect(entries).toEqual([])
    })
  })
})
```

**Step 2: Run test to verify convex-test works**

Run: `cd apps/ops && pnpm test`
Expected: PASS

**Step 3: Write the requireAuth helper**

Create `apps/ops/convex/lib/auth.ts`:

```ts
import { GenericQueryCtx } from "convex/server"
import { ConvexError } from "convex/values"

/**
 * Vérifie que l'utilisateur est authentifié.
 * Throw ConvexError si non connecté.
 * Mono-user: on vérifie juste la présence d'une identité, pas de filtre userId.
 */
export async function requireAuth(ctx: GenericQueryCtx<any>) {
  const identity = await ctx.auth.getUserIdentity()
  if (!identity) {
    throw new ConvexError("Non authentifié")
  }
  return identity
}
```

**Step 4: Commit**

```bash
git add apps/ops/convex/lib/auth.ts apps/ops/convex/lib/auth.test.ts
git commit -m "feat(ops): add requireAuth helper"
```

---

### Task 6: Ajouter auth guards sur timeEntries mutations

**Files:**
- Modify: `apps/ops/convex/timeEntries.ts`

**Step 1: Write failing tests**

Create `apps/ops/convex/timeEntries.test.ts`:

```ts
import { describe, expect, it } from "vitest"
import { convexTest } from "convex-test"
import schema from "./schema"
import { api } from "./_generated/api"

function setup() {
  const t = convexTest(schema)
  const asUser = t.withIdentity({ subject: "user1", issuer: "https://auth.test" })
  return { t, asUser }
}

describe("timeEntries auth", () => {
  it("create rejects unauthenticated", async () => {
    const { t } = setup()
    await expect(
      t.mutation(api.timeEntries.create, {
        projectId: "fake" as any,
        date: "2026-03-11",
        minutes: 60,
        hourlyRate: 100,
        billable: true,
      })
    ).rejects.toThrow("Non authentifié")
  })

  it("remove rejects unauthenticated", async () => {
    const { t } = setup()
    await expect(
      t.mutation(api.timeEntries.remove, { id: "fake" as any })
    ).rejects.toThrow("Non authentifié")
  })

  it("update rejects unauthenticated", async () => {
    const { t } = setup()
    await expect(
      t.mutation(api.timeEntries.update, {
        id: "fake" as any,
        projectId: "fake" as any,
        date: "2026-03-11",
        minutes: 60,
        hourlyRate: 100,
        billable: true,
      })
    ).rejects.toThrow("Non authentifié")
  })

  it("setStatus rejects unauthenticated", async () => {
    const { t } = setup()
    await expect(
      t.mutation(api.timeEntries.setStatus, {
        ids: [],
        status: "invoiced",
      })
    ).rejects.toThrow("Non authentifié")
  })
})
```

**Step 2: Run tests — should fail (no auth check yet)**

Run: `cd apps/ops && pnpm test`
Expected: FAIL — mutations don't throw "Non authentifié"

**Step 3: Add requireAuth to all mutations**

Modify `apps/ops/convex/timeEntries.ts`:

Add import at top:
```ts
import { requireAuth } from "./lib/auth"
```

Add `await requireAuth(ctx)` as first line of each mutation handler:
- `create.handler`
- `update.handler`
- `remove.handler`
- `setStatus.handler`
- `markInvoiced.handler`
- `unmarkInvoiced.handler`

Example for `create`:
```ts
handler: async (ctx, args) => {
  await requireAuth(ctx)
  return ctx.db.insert("timeEntries", { ...args, createdAt: Date.now() })
},
```

**Step 4: Run tests — should pass**

Run: `cd apps/ops && pnpm test`
Expected: All PASS

**Step 5: Commit**

```bash
git add apps/ops/convex/timeEntries.ts apps/ops/convex/timeEntries.test.ts
git commit -m "feat(ops): add auth guards to timeEntries mutations"
```

---

### Task 7: Ajouter auth guards sur clients + projects mutations

**Files:**
- Modify: `apps/ops/convex/clients.ts`
- Modify: `apps/ops/convex/projects.ts`

**Step 1: Add requireAuth to clients.ts mutations**

Add import:
```ts
import { requireAuth } from "./lib/auth"
```

Add `await requireAuth(ctx)` to: `create`, `update`, `remove`, `generateUploadUrl`

**Step 2: Add requireAuth to projects.ts mutations**

Add import:
```ts
import { requireAuth } from "./lib/auth"
```

Add `await requireAuth(ctx)` to: `create`, `update`

**Step 3: Run tests**

Run: `cd apps/ops && pnpm test`
Expected: All PASS (existing tests still green)

**Step 4: Commit**

```bash
git add apps/ops/convex/clients.ts apps/ops/convex/projects.ts
git commit -m "feat(ops): add auth guards to clients + projects mutations"
```

---

### Task 8: Guard suppression entries invoiced/paid

**Files:**
- Modify: `apps/ops/convex/timeEntries.ts`
- Modify: `apps/ops/convex/timeEntries.test.ts`

**Step 1: Write failing tests**

Add to `apps/ops/convex/timeEntries.test.ts`:

```ts
describe("timeEntries business guards", () => {
  async function createProject(t: ReturnType<typeof convexTest>, asUser: any) {
    // Create a client first
    const clientId = await asUser.mutation(api.clients.create, { name: "Test Client" })
    // Create a project
    const projectId = await asUser.mutation(api.projects.create, {
      clientId,
      name: "Test Project",
      tjm: 800,
      hoursPerDay: 8,
      currency: "EUR",
      status: "active",
    })
    return { clientId, projectId }
  }

  it("cannot delete an invoiced entry", async () => {
    const { t, asUser } = setup()
    const { projectId } = await createProject(t, asUser)

    const entryId = await asUser.mutation(api.timeEntries.create, {
      projectId,
      date: "2026-03-01",
      minutes: 60,
      hourlyRate: 100,
      billable: true,
      status: "invoiced",
    })

    await expect(
      asUser.mutation(api.timeEntries.remove, { id: entryId })
    ).rejects.toThrow("facturé")
  })

  it("cannot delete a paid entry", async () => {
    const { t, asUser } = setup()
    const { projectId } = await createProject(t, asUser)

    const entryId = await asUser.mutation(api.timeEntries.create, {
      projectId,
      date: "2026-03-01",
      minutes: 60,
      hourlyRate: 100,
      billable: true,
      status: "paid",
    })

    await expect(
      asUser.mutation(api.timeEntries.remove, { id: entryId })
    ).rejects.toThrow("payé")
  })

  it("can delete a draft entry", async () => {
    const { t, asUser } = setup()
    const { projectId } = await createProject(t, asUser)

    const entryId = await asUser.mutation(api.timeEntries.create, {
      projectId,
      date: "2026-03-01",
      minutes: 60,
      hourlyRate: 100,
      billable: true,
      status: "draft",
    })

    // Should not throw
    await asUser.mutation(api.timeEntries.remove, { id: entryId })

    await t.run(async (ctx) => {
      const entry = await ctx.db.get(entryId)
      expect(entry).toBeNull()
    })
  })
})
```

**Step 2: Run tests — should fail**

Run: `cd apps/ops && pnpm test`
Expected: FAIL — remove doesn't guard invoiced/paid

**Step 3: Implement guard in remove mutation**

```ts
export const remove = mutation({
  args: { id: v.id("timeEntries") },
  handler: async (ctx, { id }) => {
    await requireAuth(ctx)
    const entry = await ctx.db.get(id)
    if (!entry) throw new ConvexError("Entrée introuvable")
    if (entry.status === "invoiced") {
      throw new ConvexError("Impossible de supprimer une entrée facturée")
    }
    if (entry.status === "paid") {
      throw new ConvexError("Impossible de supprimer une entrée payée")
    }
    return ctx.db.delete(id)
  },
})
```

Add `ConvexError` import at top:
```ts
import { ConvexError, v } from "convex/values"
```

**Step 4: Run tests — should pass**

Run: `cd apps/ops && pnpm test`
Expected: All PASS

**Step 5: Commit**

```bash
git add apps/ops/convex/timeEntries.ts apps/ops/convex/timeEntries.test.ts
git commit -m "feat(ops): guard deletion of invoiced/paid entries"
```

---

### Task 9: Guard update entries invoiced/paid

**Files:**
- Modify: `apps/ops/convex/timeEntries.ts`
- Modify: `apps/ops/convex/timeEntries.test.ts`

**Step 1: Write failing tests**

Add to the `business guards` describe block:

```ts
it("cannot update an invoiced entry", async () => {
  const { t, asUser } = setup()
  const { projectId } = await createProject(t, asUser)

  const entryId = await asUser.mutation(api.timeEntries.create, {
    projectId,
    date: "2026-03-01",
    minutes: 60,
    hourlyRate: 100,
    billable: true,
    status: "invoiced",
  })

  await expect(
    asUser.mutation(api.timeEntries.update, {
      id: entryId,
      projectId,
      date: "2026-03-01",
      minutes: 120, // trying to change
      hourlyRate: 100,
      billable: true,
      status: "invoiced",
    })
  ).rejects.toThrow("facturé")
})

it("cannot update a paid entry", async () => {
  const { t, asUser } = setup()
  const { projectId } = await createProject(t, asUser)

  const entryId = await asUser.mutation(api.timeEntries.create, {
    projectId,
    date: "2026-03-01",
    minutes: 60,
    hourlyRate: 100,
    billable: true,
    status: "paid",
  })

  await expect(
    asUser.mutation(api.timeEntries.update, {
      id: entryId,
      projectId,
      date: "2026-03-01",
      minutes: 120,
      hourlyRate: 100,
      billable: true,
      status: "paid",
    })
  ).rejects.toThrow("payé")
})

it("can update a draft entry", async () => {
  const { t, asUser } = setup()
  const { projectId } = await createProject(t, asUser)

  const entryId = await asUser.mutation(api.timeEntries.create, {
    projectId,
    date: "2026-03-01",
    minutes: 60,
    hourlyRate: 100,
    billable: true,
  })

  await asUser.mutation(api.timeEntries.update, {
    id: entryId,
    projectId,
    date: "2026-03-01",
    minutes: 120,
    hourlyRate: 100,
    billable: true,
  })

  await t.run(async (ctx) => {
    const entry = await ctx.db.get(entryId)
    expect(entry?.minutes).toBe(120)
  })
})
```

**Step 2: Run tests — should fail**

Run: `cd apps/ops && pnpm test`
Expected: FAIL — update doesn't guard

**Step 3: Implement guard in update mutation**

```ts
export const update = mutation({
  args: {
    id: v.id("timeEntries"),
    projectId: v.id("projects"),
    date: v.string(),
    minutes: v.number(),
    hourlyRate: v.number(),
    description: v.optional(v.string()),
    billable: v.boolean(),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("ready_to_invoice"),
        v.literal("invoiced"),
        v.literal("paid")
      )
    ),
  },
  handler: async (ctx, { id, ...fields }) => {
    await requireAuth(ctx)
    const entry = await ctx.db.get(id)
    if (!entry) throw new ConvexError("Entrée introuvable")
    if (entry.status === "invoiced") {
      throw new ConvexError("Impossible de modifier une entrée facturée")
    }
    if (entry.status === "paid") {
      throw new ConvexError("Impossible de modifier une entrée payée")
    }
    return ctx.db.patch(id, fields)
  },
})
```

**Step 4: Run tests — should pass**

Run: `cd apps/ops && pnpm test`
Expected: All PASS

**Step 5: Commit**

```bash
git add apps/ops/convex/timeEntries.ts apps/ops/convex/timeEntries.test.ts
git commit -m "feat(ops): guard update of invoiced/paid entries"
```

---

### Task 10: Valider transitions de status server-side

**Files:**
- Create: `apps/ops/convex/lib/status.ts`
- Modify: `apps/ops/convex/timeEntries.ts`
- Modify: `apps/ops/convex/timeEntries.test.ts`

**Step 1: Create server-side transition validator**

```ts
// apps/ops/convex/lib/status.ts
import { ConvexError } from "convex/values"

export type EntryStatus = "draft" | "ready_to_invoice" | "invoiced" | "paid"

const ALLOWED_TRANSITIONS: Record<EntryStatus, EntryStatus[]> = {
  draft: ["ready_to_invoice"],
  ready_to_invoice: ["draft", "invoiced"],
  invoiced: ["ready_to_invoice", "paid"],
  paid: [],
}

/**
 * Validates a status transition. Throws ConvexError if invalid.
 */
export function validateTransition(from: EntryStatus, to: EntryStatus) {
  const allowed = ALLOWED_TRANSITIONS[from] ?? []
  if (!allowed.includes(to)) {
    throw new ConvexError(
      `Transition invalide : ${from} → ${to}. Transitions permises : ${allowed.join(", ") || "aucune"}`
    )
  }
}
```

**Step 2: Write failing tests**

Add to `apps/ops/convex/timeEntries.test.ts`:

```ts
describe("timeEntries status transitions", () => {
  async function createProject(t: ReturnType<typeof convexTest>, asUser: any) {
    const clientId = await asUser.mutation(api.clients.create, { name: "Test Client" })
    const projectId = await asUser.mutation(api.projects.create, {
      clientId,
      name: "Test Project",
      tjm: 800,
      hoursPerDay: 8,
      currency: "EUR",
      status: "active",
    })
    return { clientId, projectId }
  }

  it("allows draft → ready_to_invoice", async () => {
    const { t, asUser } = setup()
    const { projectId } = await createProject(t, asUser)

    const entryId = await asUser.mutation(api.timeEntries.create, {
      projectId,
      date: "2026-03-01",
      minutes: 60,
      hourlyRate: 100,
      billable: true,
    })

    await asUser.mutation(api.timeEntries.setStatus, {
      ids: [entryId],
      status: "ready_to_invoice",
    })

    await t.run(async (ctx) => {
      const entry = await ctx.db.get(entryId)
      expect(entry?.status).toBe("ready_to_invoice")
    })
  })

  it("rejects draft → paid (skip transition)", async () => {
    const { t, asUser } = setup()
    const { projectId } = await createProject(t, asUser)

    const entryId = await asUser.mutation(api.timeEntries.create, {
      projectId,
      date: "2026-03-01",
      minutes: 60,
      hourlyRate: 100,
      billable: true,
    })

    await expect(
      asUser.mutation(api.timeEntries.setStatus, {
        ids: [entryId],
        status: "paid",
      })
    ).rejects.toThrow("Transition invalide")
  })

  it("rejects draft → invoiced (skip transition)", async () => {
    const { t, asUser } = setup()
    const { projectId } = await createProject(t, asUser)

    const entryId = await asUser.mutation(api.timeEntries.create, {
      projectId,
      date: "2026-03-01",
      minutes: 60,
      hourlyRate: 100,
      billable: true,
    })

    await expect(
      asUser.mutation(api.timeEntries.setStatus, {
        ids: [entryId],
        status: "invoiced",
      })
    ).rejects.toThrow("Transition invalide")
  })

  it("rejects paid → anything (terminal)", async () => {
    const { t, asUser } = setup()
    const { projectId } = await createProject(t, asUser)

    const entryId = await asUser.mutation(api.timeEntries.create, {
      projectId,
      date: "2026-03-01",
      minutes: 60,
      hourlyRate: 100,
      billable: true,
      status: "paid",
    })

    await expect(
      asUser.mutation(api.timeEntries.setStatus, {
        ids: [entryId],
        status: "draft",
      })
    ).rejects.toThrow("Transition invalide")
  })
})
```

**Step 3: Run tests — should fail**

Run: `cd apps/ops && pnpm test`
Expected: FAIL — setStatus doesn't validate transitions

**Step 4: Update setStatus mutation**

```ts
import { validateTransition, type EntryStatus } from "./lib/status"

export const setStatus = mutation({
  args: {
    ids: v.array(v.id("timeEntries")),
    status: v.union(
      v.literal("draft"),
      v.literal("ready_to_invoice"),
      v.literal("invoiced"),
      v.literal("paid")
    ),
  },
  handler: async (ctx, { ids, status }) => {
    await requireAuth(ctx)
    const now = Date.now()
    await Promise.all(
      ids.map(async (id) => {
        const entry = await ctx.db.get(id)
        if (!entry) throw new ConvexError("Entrée introuvable")

        const currentStatus: EntryStatus = entry.status ?? "draft"
        validateTransition(currentStatus, status)

        const patch: Record<string, unknown> = { status }
        if (status === "invoiced") patch.invoicedAt = now
        if (status === "draft" || status === "ready_to_invoice") patch.invoicedAt = undefined
        await ctx.db.patch(id, patch)
      })
    )
  },
})
```

**Step 5: Run tests — should pass**

Run: `cd apps/ops && pnpm test`
Expected: All PASS

**Step 6: Commit**

```bash
git add apps/ops/convex/lib/status.ts apps/ops/convex/timeEntries.ts apps/ops/convex/timeEntries.test.ts
git commit -m "feat(ops): validate status transitions server-side"
```

---

### Task 11: Tests convex-test — create + authenticated flow

**Files:**
- Modify: `apps/ops/convex/timeEntries.test.ts`

**Step 1: Add create + read flow tests**

Add to `apps/ops/convex/timeEntries.test.ts`:

```ts
describe("timeEntries CRUD", () => {
  async function createProject(t: ReturnType<typeof convexTest>, asUser: any) {
    const clientId = await asUser.mutation(api.clients.create, { name: "Test Client" })
    const projectId = await asUser.mutation(api.projects.create, {
      clientId,
      name: "Test Project",
      tjm: 800,
      hoursPerDay: 8,
      currency: "EUR",
      status: "active",
    })
    return { clientId, projectId }
  }

  it("creates an entry with correct fields", async () => {
    const { t, asUser } = setup()
    const { projectId } = await createProject(t, asUser)

    const entryId = await asUser.mutation(api.timeEntries.create, {
      projectId,
      date: "2026-03-11",
      minutes: 90,
      hourlyRate: 100,
      description: "Feature work",
      billable: true,
      status: "draft",
    })

    await t.run(async (ctx) => {
      const entry = await ctx.db.get(entryId)
      expect(entry).not.toBeNull()
      expect(entry?.minutes).toBe(90)
      expect(entry?.hourlyRate).toBe(100)
      expect(entry?.description).toBe("Feature work")
      expect(entry?.billable).toBe(true)
      expect(entry?.status).toBe("draft")
      expect(entry?.createdAt).toBeGreaterThan(0)
    })
  })

  it("defaults status to undefined when not provided", async () => {
    const { t, asUser } = setup()
    const { projectId } = await createProject(t, asUser)

    const entryId = await asUser.mutation(api.timeEntries.create, {
      projectId,
      date: "2026-03-11",
      minutes: 60,
      hourlyRate: 100,
      billable: true,
    })

    await t.run(async (ctx) => {
      const entry = await ctx.db.get(entryId)
      expect(entry?.status).toBeUndefined()
    })
  })

  it("lists entries filtered by project", async () => {
    const { t, asUser } = setup()
    const { projectId } = await createProject(t, asUser)

    await asUser.mutation(api.timeEntries.create, {
      projectId,
      date: "2026-03-11",
      minutes: 60,
      hourlyRate: 100,
      billable: true,
    })

    const entries = await asUser.query(api.timeEntries.list, { projectId })
    expect(entries).toHaveLength(1)
    expect(entries[0].projectId).toBe(projectId)
  })
})
```

**Step 2: Run tests**

Run: `cd apps/ops && pnpm test`
Expected: All PASS

**Step 3: Commit**

```bash
git add apps/ops/convex/timeEntries.test.ts
git commit -m "test(ops): add CRUD integration tests for timeEntries"
```

---

### Task 12: Ajouter auth guards sur les queries sensibles

**Files:**
- Modify: `apps/ops/convex/timeEntries.ts`
- Modify: `apps/ops/convex/clients.ts`
- Modify: `apps/ops/convex/projects.ts`

**Note:** Les queries contiennent des données financières. On ajoute `requireAuth` sur toutes les queries aussi.

**Step 1: Add requireAuth to all query handlers**

In `timeEntries.ts`, add `await requireAuth(ctx)` as first line of:
- `list.handler`
- `recent.handler`
- `listForRecap.handler`
- `listPaginated.handler`

In `clients.ts`:
- `list.handler`
- `get.handler`
- `getStats.handler`

In `projects.ts`:
- `listByClient.handler`
- `listAll.handler`
- `listAllWithBudget.handler`
- `listActive.handler`
- `get.handler`
- `getWithStats.handler`

**Step 2: Run tests**

Run: `cd apps/ops && pnpm test`
Expected: Some tests may fail if queries are called without auth — update test setup to always use `asUser` for queries too.

**Step 3: Fix any broken tests**

Ensure all `t.query(...)` calls in tests use `asUser.query(...)` instead.

**Step 4: Commit**

```bash
git add apps/ops/convex/timeEntries.ts apps/ops/convex/clients.ts apps/ops/convex/projects.ts
git commit -m "feat(ops): add auth guards to all queries"
```

---

### Task 13: Vérification finale

**Step 1: Run all tests**

Run: `cd apps/ops && pnpm test`
Expected: All PASS

**Step 2: Type-check**

Run: `cd apps/ops && pnpm type-check`
Expected: No errors (or only pre-existing ones from convex/_generated)

**Step 3: Manual smoke test**

Run: `cd apps/ops && pnpm dev`
- Verify login works
- Create a time entry → should work
- Try deleting a "draft" entry → should work
- Change an entry to "invoiced" → should work
- Try deleting the invoiced entry → should show error toast
- Try changing an invoiced entry directly to "paid" via UI → should follow correct workflow (invoiced → paid is valid)

**Step 4: Final commit if any fixes**

```bash
git add -u
git commit -m "fix(ops): address test/type issues from security guards"
```
