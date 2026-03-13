# Package Registry Dashboard — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `/packages` page to Ops that displays live npm stats for hardcoded packages, synced via Convex cron.

**Architecture:** Convex action fetches npm registry API, upserts into `packages` table, triggered by cron every 15min. Client reads via `useQuery`. UI is a simple card grid page.

**Tech Stack:** Convex (action + cron + schema), Next.js 16, React 19, @blazz/ui (PageHeader, Badge, Skeleton, Card), Lucide icons, date-fns.

---

### Task 1: Schema — Add `packages` table

**Files:**
- Modify: `apps/ops/convex/schema.ts`

**Step 1: Add packages table to schema**

Add after the `todos` table definition:

```ts
packages: defineTable({
  name: v.string(),
  latestVersion: v.string(),
  publishedAt: v.string(),
  weeklyDownloads: v.number(),
  description: v.string(),
  license: v.optional(v.string()),
  unpackedSize: v.optional(v.number()),
  lastSyncedAt: v.number(),
}).index("by_name", ["name"]),
```

**Step 2: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add packages table to convex schema"
```

---

### Task 2: Tracked packages config

**Files:**
- Create: `apps/ops/lib/tracked-packages.ts`

**Step 1: Create the config file**

```ts
export const TRACKED_PACKAGES = ["@blazz/ui"] as const
```

**Step 2: Commit**

```bash
git add apps/ops/lib/tracked-packages.ts
git commit -m "feat(ops): add tracked packages config"
```

---

### Task 3: Convex action + query — sync & read packages

**Files:**
- Create: `apps/ops/convex/packages.ts`

**Step 1: Write the Convex file with action + query**

```ts
import { v } from "convex/values"
import { action, internalMutation, query } from "./_generated/server"
import { internal } from "./_generated/api"

// ── Query ──────────────────────────────────────────────
export const list = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("packages").collect()
  },
})

// ── Internal mutation (called by action) ───────────────
export const upsert = internalMutation({
  args: {
    name: v.string(),
    latestVersion: v.string(),
    publishedAt: v.string(),
    weeklyDownloads: v.number(),
    description: v.string(),
    license: v.optional(v.string()),
    unpackedSize: v.optional(v.number()),
    lastSyncedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("packages")
      .withIndex("by_name", (q) => q.eq("name", args.name))
      .unique()

    if (existing) {
      await ctx.db.patch(existing._id, args)
    } else {
      await ctx.db.insert("packages", args)
    }
  },
})

// ── Action: fetch npm registry ─────────────────────────
export const sync = action({
  args: {},
  handler: async (ctx) => {
    const TRACKED = ["@blazz/ui"]

    for (const name of TRACKED) {
      try {
        const [registryRes, downloadsRes] = await Promise.all([
          fetch(`https://registry.npmjs.org/${encodeURIComponent(name)}`),
          fetch(
            `https://api.npmjs.org/downloads/point/last-week/${encodeURIComponent(name)}`
          ),
        ])

        if (!registryRes.ok) continue

        const registry = await registryRes.json()
        const latestVersion = registry["dist-tags"]?.latest ?? "0.0.0"
        const versionData = registry.versions?.[latestVersion]

        let weeklyDownloads = 0
        if (downloadsRes.ok) {
          const dlData = await downloadsRes.json()
          weeklyDownloads = dlData.downloads ?? 0
        }

        await ctx.runMutation(internal.packages.upsert, {
          name,
          latestVersion,
          publishedAt: registry.time?.[latestVersion] ?? "",
          weeklyDownloads,
          description: registry.description ?? "",
          license: versionData?.license ?? registry.license ?? undefined,
          unpackedSize: versionData?.dist?.unpackedSize ?? undefined,
          lastSyncedAt: Date.now(),
        })
      } catch (e) {
        console.error(`Failed to sync ${name}:`, e)
      }
    }
  },
})
```

**Step 2: Commit**

```bash
git add apps/ops/convex/packages.ts
git commit -m "feat(ops): add packages sync action and list query"
```

---

### Task 4: Cron — schedule sync every 15 minutes

**Files:**
- Create: `apps/ops/convex/crons.ts`

**Step 1: Create the crons file**

```ts
import { cronJobs } from "convex/server"
import { internal } from "./_generated/api"

const crons = cronJobs()

crons.interval("sync npm packages", { minutes: 15 }, internal.packages.sync)

export default crons
```

Note: `sync` action must be exported as an `action` (not `internalAction`) OR referenced via `internal` if using `internalAction`. Since we used `action`, we need to change it to `internalAction` for the cron to call it via `internal`. Alternative: keep as `action` and also expose it for manual trigger — but crons need `internal`.

**Fix:** In `apps/ops/convex/packages.ts`, change the sync export:
- Keep `sync` as `action` (for manual trigger from client)
- Add `syncInternal` as `internalAction` for the cron
- OR simpler: make sync an `internalAction` and add a separate `triggerSync` action wrapper

Simplest approach — make `sync` an `internalAction`, add a thin `triggerSync` action:

In `packages.ts`, change:
```ts
import { action, internalAction, internalMutation, query } from "./_generated/server"

// ... keep upsert and list as-is ...

// Rename sync to internalAction
export const sync = internalAction({
  args: {},
  handler: async (ctx) => {
    // ... same body ...
  },
})

// Public wrapper for manual trigger
export const triggerSync = action({
  args: {},
  handler: async (ctx) => {
    await ctx.runAction(internal.packages.sync)
  },
})
```

Cron file references `internal.packages.sync` — works.
Client refresh button calls `api.packages.triggerSync` — works.

**Step 2: Commit**

```bash
git add apps/ops/convex/crons.ts apps/ops/convex/packages.ts
git commit -m "feat(ops): add cron to sync packages every 15min"
```

---

### Task 5: Format helpers

**Files:**
- Modify: `apps/ops/lib/format.ts`

**Step 1: Add formatBytes helper**

Append to the file:

```ts
export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  const kb = bytes / 1024
  if (kb < 1024) return `${kb.toFixed(1)} kB`
  const mb = kb / 1024
  return `${mb.toFixed(1)} MB`
}
```

**Step 2: Commit**

```bash
git add apps/ops/lib/format.ts
git commit -m "feat(ops): add formatBytes helper"
```

---

### Task 6: Packages page UI

**Files:**
- Create: `apps/ops/app/(main)/packages/page.tsx`

**Step 1: Create the page**

```tsx
"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useAction, useQuery } from "convex/react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { ExternalLink, Package, RefreshCw } from "lucide-react"
import { useState } from "react"
import { api } from "@/convex/_generated/api"
import { formatBytes } from "@/lib/format"

export default function PackagesPage() {
  const packages = useQuery(api.packages.list)
  const triggerSync = useAction(api.packages.triggerSync)
  const [syncing, setSyncing] = useState(false)

  const handleSync = async () => {
    setSyncing(true)
    try {
      await triggerSync()
    } finally {
      setSyncing(false)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <PageHeader
        title="Packages"
        description="Suivi des packages npm publiés"
        actions={
          <Button
            variant="outline"
            size="sm"
            onClick={handleSync}
            disabled={syncing}
          >
            <RefreshCw className={syncing ? "animate-spin" : ""} />
            Refresh
          </Button>
        }
      />

      {packages === undefined ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 1 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-edge p-5 space-y-3">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      ) : packages.length === 0 ? (
        <div className="text-center py-12">
          <Package className="mx-auto h-10 w-10 text-fg-muted mb-3" />
          <p className="text-sm text-fg-muted">
            Aucun package synchronisé.
          </p>
          <Button variant="outline" size="sm" className="mt-3" onClick={handleSync}>
            Synchroniser maintenant
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <div
              key={pkg._id}
              className="rounded-lg border border-edge bg-raised p-5 space-y-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <a
                    href={`https://www.npmjs.com/package/${pkg.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-fg hover:underline inline-flex items-center gap-1"
                  >
                    {pkg.name}
                    <ExternalLink className="h-3 w-3 text-fg-muted" />
                  </a>
                  {pkg.description && (
                    <p className="text-xs text-fg-muted mt-0.5 line-clamp-2">
                      {pkg.description}
                    </p>
                  )}
                </div>
                <Badge variant="secondary" className="shrink-0 font-mono text-xs">
                  v{pkg.latestVersion}
                </Badge>
              </div>

              <div className="grid grid-cols-2 gap-y-1.5 text-xs">
                <div className="text-fg-muted">Downloads/semaine</div>
                <div className="text-fg font-mono text-right tabular-nums">
                  {pkg.weeklyDownloads.toLocaleString("fr-FR")}
                </div>

                {pkg.unpackedSize != null && (
                  <>
                    <div className="text-fg-muted">Taille</div>
                    <div className="text-fg font-mono text-right">
                      {formatBytes(pkg.unpackedSize)}
                    </div>
                  </>
                )}

                {pkg.license && (
                  <>
                    <div className="text-fg-muted">License</div>
                    <div className="text-fg text-right">{pkg.license}</div>
                  </>
                )}

                {pkg.publishedAt && (
                  <>
                    <div className="text-fg-muted">Publié</div>
                    <div className="text-fg text-right">
                      {formatDistanceToNow(new Date(pkg.publishedAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </div>
                  </>
                )}
              </div>

              {pkg.lastSyncedAt && (
                <p className="text-[11px] text-fg-muted/60 pt-1 border-t border-edge-subtle">
                  Sync{" "}
                  {formatDistanceToNow(new Date(pkg.lastSyncedAt), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add apps/ops/app/\(main\)/packages/page.tsx
git commit -m "feat(ops): add packages page UI"
```

---

### Task 7: Sidebar — add Packages nav item

**Files:**
- Modify: `apps/ops/components/ops-frame.tsx`

**Step 1: Add Package import and nav item**

Add `Package` to the lucide-react import:
```ts
import { CheckSquare, Clock, FolderOpen, LayoutDashboard, Package, Sun, Users } from "lucide-react";
```

Add to `navItems` array after "Todos":
```ts
{ title: "Packages", url: "/packages", icon: Package },
```

**Step 2: Commit**

```bash
git add apps/ops/components/ops-frame.tsx
git commit -m "feat(ops): add packages to sidebar navigation"
```

---

### Task 8: Verify — run dev and test manually

**Step 1: Start Convex dev to push schema**

```bash
cd apps/ops && npx convex dev --once
```

Expected: Schema pushed successfully with new `packages` table.

**Step 2: Start the app**

```bash
pnpm dev:ops
```

**Step 3: Navigate to `/packages`**

Expected: Empty state with "Synchroniser maintenant" button.

**Step 4: Click "Synchroniser maintenant"**

Expected: After a few seconds, card appears for `@blazz/ui` with version, downloads, size, etc. (If not yet published on npm, the card will show with defaults — that's fine.)

**Step 5: Final commit if any fixups needed**

```bash
git add -A
git commit -m "fix(ops): packages page fixups"
```
