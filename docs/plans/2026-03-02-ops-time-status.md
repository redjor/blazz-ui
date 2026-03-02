# Ops Time Entry Status System — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a 4-state status system (`draft → ready_to_invoice → invoiced → paid`) to time entries in Blazz Ops, additive to existing `billable`/`invoicedAt` fields.

**Architecture:** New optional `status` field in Convex schema; a pure utility function `getEffectiveStatus` derives the display status from the new field + legacy fields for backward compat; UI exposes status via a badge component, contextual row actions on the time list, and a tabbed filter on the recap page.

**Tech Stack:** Convex (schema + mutations), React 19, `@blazz/ui` components, `react-hook-form` + zod, `date-fns`, Biome (lint/format)

---

## Before you start

Run `pnpm dev:ops` to verify the app loads at http://localhost:3120. Keep it running during all tasks to verify changes live.

Convex schema changes auto-push when the dev server is running and you save the file — no manual `npx convex dev` needed during development.

---

### Task 1: Lib utility — `getEffectiveStatus`

**Files:**
- Create: `apps/ops/lib/time-entry-status.ts`

**Step 1: Create the file**

```ts
// apps/ops/lib/time-entry-status.ts

export type EntryStatus = "draft" | "ready_to_invoice" | "invoiced" | "paid"

export const ENTRY_STATUS_LABELS: Record<EntryStatus, string> = {
  draft: "Brouillon",
  ready_to_invoice: "Prêt à facturer",
  invoiced: "Facturé",
  paid: "Payé",
}

/**
 * Derives the effective status from an entry's fields.
 * Priority: explicit `status` field > legacy `invoicedAt` > default "draft"
 * Returns null for non-billable entries (outside billing scope).
 */
export function getEffectiveStatus(entry: {
  status?: EntryStatus | null
  billable: boolean
  invoicedAt?: number | null
}): EntryStatus | null {
  if (!entry.billable) return null
  if (entry.status) return entry.status
  if (entry.invoicedAt) return "invoiced"
  return "draft"
}

/** Returns all valid next statuses for a given current status. */
export function getAllowedTransitions(current: EntryStatus | null): EntryStatus[] {
  switch (current) {
    case "draft":
      return ["ready_to_invoice"]
    case "ready_to_invoice":
      return ["draft", "invoiced"]
    case "invoiced":
      return ["ready_to_invoice", "paid"]
    case "paid":
      return [] // terminal
    default:
      return []
  }
}
```

**Step 2: Verify it typechecks**

Run: `cd /Users/jonathanruas/Development/blazz-ui-app && pnpm --filter ops exec tsc --noEmit 2>&1 | head -20`

Expected: no errors (or only pre-existing errors about `convex/_generated/`)

**Step 3: Commit**

```bash
git add apps/ops/lib/time-entry-status.ts
git commit -m "feat(ops): add getEffectiveStatus utility for time entry status derivation"
```

---

### Task 2: Convex schema + mutations

**Files:**
- Modify: `apps/ops/convex/schema.ts`
- Modify: `apps/ops/convex/timeEntries.ts`

**Step 1: Add `status` field to schema**

In `apps/ops/convex/schema.ts`, add after `invoicedAt`:

```ts
// Find this block:
  timeEntries: defineTable({
    projectId: v.id("projects"),
    date: v.string(),
    minutes: v.number(),
    hourlyRate: v.number(),
    description: v.optional(v.string()),
    billable: v.boolean(),
    invoicedAt: v.optional(v.number()),
    createdAt: v.number(),
  })

// Replace with:
  timeEntries: defineTable({
    projectId: v.id("projects"),
    date: v.string(),
    minutes: v.number(),
    hourlyRate: v.number(),
    description: v.optional(v.string()),
    billable: v.boolean(),
    invoicedAt: v.optional(v.number()),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("ready_to_invoice"),
        v.literal("invoiced"),
        v.literal("paid"),
      )
    ),
    createdAt: v.number(),
  })
```

**Step 2: Verify schema pushed**

Check the Convex dev server output in your terminal. It should log "Schema updated". If not running, run: `cd apps/ops && npx convex dev --once`

**Step 3: Update `create` mutation** (add `status?` arg)

In `apps/ops/convex/timeEntries.ts`, replace the `create` mutation:

```ts
export const create = mutation({
  args: {
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
        v.literal("paid"),
      )
    ),
  },
  handler: async (ctx, args) => {
    return ctx.db.insert("timeEntries", { ...args, createdAt: Date.now() })
  },
})
```

**Step 4: Update `update` mutation** (add `status?` arg)

Replace the `update` mutation:

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
        v.literal("paid"),
      )
    ),
  },
  handler: async (ctx, { id, ...fields }) => ctx.db.patch(id, fields),
})
```

**Step 5: Add `setStatus` mutation** (after `markInvoiced`, before end of file)

```ts
export const setStatus = mutation({
  args: {
    ids: v.array(v.id("timeEntries")),
    status: v.union(
      v.literal("draft"),
      v.literal("ready_to_invoice"),
      v.literal("invoiced"),
      v.literal("paid"),
    ),
  },
  handler: async (ctx, { ids, status }) => {
    const now = Date.now()
    await Promise.all(
      ids.map(async (id) => {
        const patch: Record<string, unknown> = { status }
        // Keep invoicedAt in sync for backward compat
        if (status === "invoiced") patch.invoicedAt = now
        if (status === "draft" || status === "ready_to_invoice") patch.invoicedAt = undefined
        await ctx.db.patch(id, patch)
      })
    )
  },
})
```

**Step 6: Verify Convex regenerated types**

Check that `apps/ops/convex/_generated/api.d.ts` was updated (file modification time changes when dev server is running).

**Step 7: Commit**

```bash
git add apps/ops/convex/schema.ts apps/ops/convex/timeEntries.ts
git commit -m "feat(ops): add status field to timeEntries schema + setStatus mutation"
```

---

### Task 3: `EntryStatusBadge` component

**Files:**
- Create: `apps/ops/components/entry-status-badge.tsx`

**Step 1: Create the component**

```tsx
// apps/ops/components/entry-status-badge.tsx

import type { EntryStatus } from "@/lib/time-entry-status"
import { ENTRY_STATUS_LABELS } from "@/lib/time-entry-status"
import { cn } from "@blazz/ui/lib/utils"

interface EntryStatusBadgeProps {
  status: EntryStatus | null
}

const statusConfig: Record<
  string,
  { dot: string; text: string }
> = {
  draft: {
    dot: "bg-fg-muted",
    text: "text-fg-muted",
  },
  ready_to_invoice: {
    dot: "bg-amber-500",
    text: "text-amber-600 dark:text-amber-400",
  },
  invoiced: {
    dot: "bg-blue-500",
    text: "text-blue-600 dark:text-blue-400",
  },
  paid: {
    dot: "bg-green-500",
    text: "text-green-600 dark:text-green-400",
  },
}

export function EntryStatusBadge({ status }: EntryStatusBadgeProps) {
  if (!status) {
    return (
      <span className="flex items-center gap-1.5 text-xs text-fg-muted">
        <span className="inline-block size-1.5 rounded-full border border-fg-muted/50" />
        Non facturable
      </span>
    )
  }

  const config = statusConfig[status]

  return (
    <span className={cn("flex items-center gap-1.5 text-xs", config.text)}>
      <span className={cn("inline-block size-1.5 rounded-full", config.dot)} />
      {ENTRY_STATUS_LABELS[status]}
    </span>
  )
}
```

**Step 2: Verify the import path for `cn`**

Run: `grep -r "from.*@blazz/ui/lib/utils" apps/ops/ --include="*.tsx" | head -3`

If there are no results, check how other ops components import cn. It may be `import { cn } from "@blazz/ui"` or a local path. Adjust accordingly.

**Step 3: Commit**

```bash
git add apps/ops/components/entry-status-badge.tsx
git commit -m "feat(ops): add EntryStatusBadge component with 4-state color coding"
```

---

### Task 4: Update `TimeEntryForm` — add status field

**Files:**
- Modify: `apps/ops/components/time-entry-form.tsx`

**Step 1: Extend the zod schema**

In `apps/ops/components/time-entry-form.tsx`, update the `schema` object (after the `billable` field):

```ts
const schema = z.object({
  projectId: z.string().min(1, "Projet requis"),
  date: z.string().min(1, "Date requise"),
  hours: z.coerce.number().min(0.25, "Minimum 15min").max(24),
  description: z.string().optional(),
  billable: z.boolean(),
  status: z.enum(["draft", "ready_to_invoice"]).optional(),
})
```

Note: Only `draft` and `ready_to_invoice` are available in the form. `invoiced` and `paid` are set via workflow actions, not manual entry.

**Step 2: Update `EditDefaults` interface**

```ts
interface EditDefaults {
  id: Id<"timeEntries">
  projectId: string
  date: string
  minutes: number
  description?: string
  billable: boolean
  status?: "draft" | "ready_to_invoice" | "invoiced" | "paid" | null
}
```

**Step 3: Update `useForm` default values**

Add `status` to the default values in both edit and create branches:

```ts
defaultValues: isEdit
  ? {
      projectId: defaultValues.projectId,
      date: defaultValues.date,
      hours: defaultValues.minutes / 60,
      description: defaultValues.description ?? "",
      billable: defaultValues.billable,
      // Clamp to form-allowed values (invoiced/paid become "draft" in form)
      status:
        defaultValues.status === "ready_to_invoice"
          ? "ready_to_invoice"
          : "draft",
    }
  : {
      date: format(new Date(), "yyyy-MM-dd"),
      hours: 1,
      billable: true,
      status: "draft",
    },
```

**Step 4: Pass `status` in the submit handler**

In the `onSubmit` function, pass `status` in both `create` and `update` calls:

For the `create` call:
```ts
await create({
  projectId: values.projectId as Id<"projects">,
  date: values.date,
  minutes: Math.round(values.hours * 60),
  hourlyRate,
  description: values.description,
  billable: values.billable,
  status: values.billable ? (values.status ?? "draft") : undefined,
})
```

For the `update` call:
```ts
await update({
  id: defaultValues.id,
  projectId: values.projectId as Id<"projects">,
  date: values.date,
  minutes: Math.round(values.hours * 60),
  hourlyRate,
  description: values.description,
  billable: values.billable,
  status: values.billable ? (values.status ?? "draft") : undefined,
})
```

**Step 5: Add the status select field in the JSX**

Add this block after the `billable` checkbox and before `<DialogFooter>`:

```tsx
{watch("billable") && (
  <div className="space-y-1.5">
    <Label>Statut</Label>
    <Select
      value={watch("status") ?? "draft"}
      onValueChange={(v) =>
        setValue("status", v as "draft" | "ready_to_invoice")
      }
    >
      <SelectTrigger className="w-full">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="draft">Brouillon</SelectItem>
        <SelectItem value="ready_to_invoice">Prêt à facturer</SelectItem>
      </SelectContent>
    </Select>
  </div>
)}
```

**Step 6: Run lint**

Run: `pnpm --filter ops exec biome check --write src/ 2>/dev/null || pnpm lint 2>&1 | grep -A3 "time-entry-form"`

Fix any import ordering issues Biome flags.

**Step 7: Commit**

```bash
git add apps/ops/components/time-entry-form.tsx
git commit -m "feat(ops): add status select to TimeEntryForm (draft / ready_to_invoice)"
```

---

### Task 5: Update time page list — merge columns + contextual row actions

**Files:**
- Modify: `apps/ops/app/time/page.tsx`

**Step 1: Add imports**

At the top of the file, add:

```ts
import { EntryStatusBadge } from "@/components/entry-status-badge"
import { getEffectiveStatus } from "@/lib/time-entry-status"
```

**Step 2: Add `setStatus` mutation**

After the existing `const unmarkInvoiced = useMutation(api.timeEntries.unmarkInvoiced)` line:

```ts
const setStatus = useMutation(api.timeEntries.setStatus)
```

**Step 3: Replace the two status columns with one**

In the `columns` useMemo, replace the two blocks:

```ts
// REMOVE this block:
{
  accessorKey: "billable",
  header: "Facturable",
  cell: ({ row }) =>
    row.original.billable ? null : (
      <span className="flex items-center gap-1.5 text-xs text-fg-muted">
        <span className="inline-block size-1.5 rounded-full bg-fg-muted" />
        Non facturable
      </span>
    ),
},
{
  accessorKey: "invoicedAt",
  header: "Statut",
  cell: ({ row }) =>
    row.original.invoicedAt ? (
      <span className="flex items-center gap-1.5 text-xs text-fg-muted">
        <span className="inline-block size-1.5 rounded-full bg-green-500" />
        Facturé
      </span>
    ) : null,
},

// REPLACE WITH this single block:
{
  id: "status",
  header: "Statut",
  cell: ({ row }) => (
    <EntryStatusBadge status={getEffectiveStatus(row.original)} />
  ),
},
```

**Step 4: Replace row actions with status-aware transitions**

Replace the entire `rowActions` useMemo with:

```ts
const rowActions = useMemo<RowAction<TimeEntry>[]>(
  () => [
    {
      id: "edit",
      label: "Modifier",
      icon: Pencil,
      handler: (row) => setEditing(row.original),
    },
    {
      id: "mark-ready",
      label: "Prêt à facturer",
      hidden: (row) => getEffectiveStatus(row.original) !== "draft",
      handler: async (row) => {
        try {
          await setStatus({ ids: [row.original._id], status: "ready_to_invoice" })
          toast.success("Marqué prêt à facturer")
        } catch {
          toast.error("Erreur")
        }
      },
    },
    {
      id: "revert-to-draft",
      label: "Revenir en brouillon",
      hidden: (row) => getEffectiveStatus(row.original) !== "ready_to_invoice",
      handler: async (row) => {
        try {
          await setStatus({ ids: [row.original._id], status: "draft" })
          toast.success("Remis en brouillon")
        } catch {
          toast.error("Erreur")
        }
      },
    },
    {
      id: "mark-invoiced",
      label: "Marquer facturé",
      hidden: (row) => getEffectiveStatus(row.original) !== "ready_to_invoice",
      handler: async (row) => {
        try {
          await setStatus({ ids: [row.original._id], status: "invoiced" })
          toast.success("Marqué facturé")
        } catch {
          toast.error("Erreur")
        }
      },
    },
    {
      id: "revert-to-ready",
      label: "Revenir à prêt à facturer",
      hidden: (row) => getEffectiveStatus(row.original) !== "invoiced",
      handler: async (row) => {
        try {
          await setStatus({ ids: [row.original._id], status: "ready_to_invoice" })
          toast.success("Revenu à prêt à facturer")
        } catch {
          toast.error("Erreur")
        }
      },
    },
    {
      id: "mark-paid",
      label: "Marquer payé",
      hidden: (row) => getEffectiveStatus(row.original) !== "invoiced",
      handler: async (row) => {
        try {
          await setStatus({ ids: [row.original._id], status: "paid" })
          toast.success("Marqué payé")
        } catch {
          toast.error("Erreur")
        }
      },
    },
    {
      id: "delete",
      label: "Supprimer",
      icon: Trash2,
      variant: "destructive",
      separator: true,
      requireConfirmation: true,
      confirmationMessage: () => "Supprimer cette entrée ? Cette action est irréversible.",
      handler: async (row) => {
        try {
          await remove({ id: row.original._id })
          toast.success("Entrée supprimée")
        } catch {
          toast.error("Erreur lors de la suppression")
        }
      },
    },
  ],
  [remove, setStatus]
)
```

**Step 5: Remove unused imports**

Remove `RotateCcw` from the lucide-react import since `unmark-invoiced` action is gone and `RotateCcw` is no longer used. Also remove `unmarkInvoiced` from the useMutation line.

**Step 6: Verify in browser**

Open http://localhost:3120/time, switch to List view. Check:
- Column "Statut" shows colored badges
- Row menu shows correct actions based on each entry's current status

**Step 7: Run lint**

Run: `pnpm --filter ops exec biome check --write apps/ops/app/time/page.tsx 2>/dev/null || true`

**Step 8: Commit**

```bash
git add apps/ops/app/time/page.tsx
git commit -m "feat(ops): merge status columns + contextual row actions on time list"
```

---

### Task 6: Update recap page — tabs filter + new actions

**Files:**
- Modify: `apps/ops/app/recap/page.tsx`

**Step 1: Add imports**

Add at top:

```ts
import { EntryStatusBadge } from "@/components/entry-status-badge"
import { getEffectiveStatus, type EntryStatus } from "@/lib/time-entry-status"
```

**Step 2: Add `statusFilter` state + `setStatus` mutation**

After the existing state declarations:

```ts
const [statusFilter, setStatusFilter] = useState<EntryStatus>("ready_to_invoice")
const setStatus = useMutation(api.timeEntries.setStatus)
```

**Step 3: Update the `listForRecap` query to include invoiced entries**

Change the `entries` query call to always include all billable entries:

```ts
const entries = useQuery(api.timeEntries.listForRecap, {
  projectId: projectId ? (projectId as Id<"projects">) : undefined,
  from: periodDates?.from,
  to: periodDates?.to,
  includeInvoiced: true,  // changed: fetch all, filter by status client-side
})
```

**Step 4: Update `filteredEntries` to apply status filter**

Replace the existing `filteredEntries` derived value:

```ts
const filteredByClient =
  !projectId && clientId && clientProjects
    ? entries?.filter((e) => clientProjects.some((p) => p._id === e.projectId))
    : entries

const filteredEntries = filteredByClient?.filter(
  (e) => getEffectiveStatus(e) === statusFilter
)
```

**Step 5: Update the totals** (they already derive from `filteredEntries`, no change needed)

**Step 6: Add status tab pills**

Add the following UI block between the filter bar and the table (after the closing `</div>` of the filter section):

```tsx
{/* Status filter tabs */}
<div className="flex items-center gap-1 rounded-lg border border-edge p-0.5 bg-raised w-fit">
  {(["ready_to_invoice", "invoiced", "paid"] as const).map((s) => (
    <button
      key={s}
      type="button"
      onClick={() => setStatusFilter(s)}
      className={cn(
        "h-7 px-3 text-xs rounded-md transition-colors",
        statusFilter === s
          ? "bg-surface shadow-sm font-medium text-fg"
          : "text-fg-muted hover:text-fg"
      )}
    >
      <EntryStatusBadge status={s} />
    </button>
  ))}
</div>
```

You'll need to add `import { cn } from "@blazz/ui/lib/utils"` at the top (check existing imports first — it may already be there).

**Step 7: Update action buttons**

Replace the action buttons section at the bottom:

```tsx
<div className="flex gap-3">
  <Button variant="outline" onClick={handleExportCSV}>
    <Download className="size-4 mr-1.5" />
    Export CSV
  </Button>
  {statusFilter === "ready_to_invoice" && (
    <Button onClick={() => setShowConfirm(true)}>
      <CheckCheck className="size-4 mr-1.5" />
      Marquer comme facturé ({filteredEntries?.length ?? 0})
    </Button>
  )}
  {statusFilter === "invoiced" && (
    <Button onClick={() => setShowMarkPaid(true)}>
      <CheckCheck className="size-4 mr-1.5" />
      Marquer comme payé ({filteredEntries?.length ?? 0})
    </Button>
  )}
</div>
```

**Step 8: Add `showMarkPaid` state + dialog**

Add state: `const [showMarkPaid, setShowMarkPaid] = useState(false)`

Add handler:

```ts
const handleMarkPaid = async () => {
  if (!filteredEntries?.length) return
  const ids = filteredEntries.map((e) => e._id)
  try {
    await setStatus({ ids, status: "paid" })
    toast.success(`${ids.length} entrée(s) marquées comme payées`)
    setShowMarkPaid(false)
  } catch {
    toast.error("Erreur")
  }
}
```

Update the existing `handleMarkInvoiced` to use `setStatus` instead of `markInvoiced`:

```ts
const handleMarkInvoiced = async () => {
  if (!filteredEntries?.length) return
  const ids = filteredEntries.map((e) => e._id)
  try {
    await setStatus({ ids, status: "invoiced" })
    toast.success(`${ids.length} entrée(s) marquées comme facturées`)
    setShowConfirm(false)
  } catch {
    toast.error("Erreur")
  }
}
```

Add the "mark paid" confirmation dialog (after the existing `showConfirm` dialog):

```tsx
<Dialog open={showMarkPaid} onOpenChange={setShowMarkPaid}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Marquer comme payé ?</DialogTitle>
    </DialogHeader>
    <p className="text-sm text-fg-muted">
      {filteredEntries?.length ?? 0} entrée(s) seront marquées comme payées.
      Cette action peut être annulée depuis la page Temps.
    </p>
    <DialogFooter>
      <Button type="button" variant="outline" onClick={() => setShowMarkPaid(false)}>
        Annuler
      </Button>
      <Button onClick={handleMarkPaid}>Confirmer</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>
```

**Step 9: Verify in browser**

Open http://localhost:3120/recap. Check:
- Three tabs: "Prêt à facturer" / "Facturé" / "Payé"
- Default tab shows ready_to_invoice entries
- "Marquer comme facturé" button visible only on "Prêt à facturer" tab
- "Marquer comme payé" button visible only on "Facturé" tab
- After marking as invoiced, entries disappear from "Prêt à facturer" and appear in "Facturé"

**Step 10: Run lint**

Run: `pnpm --filter ops exec biome check --write apps/ops/app/recap/page.tsx 2>/dev/null || true`

**Step 11: Remove unused `markInvoiced` mutation** if `useMutation(api.timeEntries.markInvoiced)` is no longer used in the file.

**Step 12: Commit**

```bash
git add apps/ops/app/recap/page.tsx
git commit -m "feat(ops): add status tabs + mark-paid action to recap page"
```

---

## Final verification

1. Open http://localhost:3120/time — List view
   - Create a new entry → status shows "Brouillon"
   - Row action: mark as "Prêt à facturer" → badge updates to orange
   - Row action: revert to "Brouillon" → badge goes back to grey
   - Mark as "Facturé" → badge turns blue
   - Mark as "Payé" → badge turns green, no further actions available

2. Open http://localhost:3120/recap
   - "Prêt à facturer" tab shows only ready entries
   - "Marquer comme facturé" bulk action works → entries move to "Facturé" tab
   - "Marquer comme payé" bulk action works on "Facturé" tab

3. Legacy entries (no `status` field, with `invoicedAt`) → display as "Facturé" ✓
4. Legacy entries (no `status` field, no `invoicedAt`, `billable: true`) → display as "Brouillon" ✓
5. Legacy entries (`billable: false`) → display as "Non facturable" ✓
