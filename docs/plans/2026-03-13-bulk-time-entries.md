# Bulk Actions on Time Entries — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add multi-select checkboxes + floating toolbar with bulk status change, billable toggle, and delete on the project detail time entries list.

**Architecture:** Selection state via `useState<Set<string>>` in the page. A new `<BulkActionBar>` component renders as a sticky bottom bar. Two new Convex mutations (`removeBatch`, `setBillable`). Existing `setStatus` already handles batch.

**Tech Stack:** React 19, Convex mutations, @blazz/ui primitives (Button, Checkbox, Dialog), sonner toast.

---

### Task 1: Add `removeBatch` mutation

**Files:**
- Modify: `apps/ops/convex/timeEntries.ts:140-154`

**Step 1: Add the `removeBatch` mutation after the existing `remove`**

```typescript
export const removeBatch = mutation({
	args: { ids: v.array(v.id("timeEntries")) },
	handler: async (ctx, { ids }) => {
		const { userId } = await requireAuth(ctx)
		await Promise.all(
			ids.map(async (id) => {
				const entry = await ctx.db.get(id)
				if (!entry || entry.userId !== userId) throw new ConvexError("Entrée introuvable")
				if (entry.status === "invoiced") throw new ConvexError("Impossible de supprimer une entrée facturée")
				if (entry.status === "paid") throw new ConvexError("Impossible de supprimer une entrée payée")
				await ctx.db.delete(id)
			})
		)
	},
})
```

**Step 2: Commit**

```bash
git add apps/ops/convex/timeEntries.ts
git commit -m "feat(ops): add removeBatch mutation for bulk time entry deletion"
```

---

### Task 2: Add `setBillable` mutation

**Files:**
- Modify: `apps/ops/convex/timeEntries.ts`

**Step 1: Add the `setBillable` mutation after `setStatus`**

```typescript
export const setBillable = mutation({
	args: {
		ids: v.array(v.id("timeEntries")),
		billable: v.boolean(),
	},
	handler: async (ctx, { ids, billable }) => {
		const { userId } = await requireAuth(ctx)
		await Promise.all(
			ids.map(async (id) => {
				const entry = await ctx.db.get(id)
				if (!entry || entry.userId !== userId) throw new ConvexError("Entrée introuvable")
				if (entry.status === "invoiced" || entry.status === "paid") {
					throw new ConvexError("Impossible de modifier une entrée facturée/payée")
				}
				await ctx.db.patch(id, { billable })
			})
		)
	},
})
```

**Step 2: Commit**

```bash
git add apps/ops/convex/timeEntries.ts
git commit -m "feat(ops): add setBillable mutation for bulk billable toggle"
```

---

### Task 3: Create `<BulkActionBar>` component

**Files:**
- Create: `apps/ops/components/bulk-action-bar.tsx`

**Step 1: Create the component**

Props:
- `selectedIds: Set<string>` — current selection
- `entries: Array<{ _id: string; status?: EntryStatus | null; billable: boolean }>` — all entries (to compute allowed actions)
- `onClear: () => void` — deselect all
- `onStatusChange: (ids: string[], status: EntryStatus) => void`
- `onBillableChange: (ids: string[], billable: boolean) => void`
- `onDelete: (ids: string[]) => void`

Logic:
- Filter `entries` to only those in `selectedIds`
- Compute `getAllowedTransitions()` for each selected entry, then intersect all sets
- Determine billable state: all-billable, all-non-billable, or mixed
- Render sticky bar at bottom with:
  - X button + "{n} sélectionnée(s)" label
  - Status transition buttons (from intersection)
  - Billable toggle button(s)
  - Delete button (opens confirmation Dialog)

Uses: `@blazz/ui/components/ui/button`, `@blazz/ui/components/ui/dialog` for delete confirmation, `lucide-react` icons (X, Trash2).

Styling: `fixed bottom-4 left-1/2 -translate-x-1/2 bg-raised border border-edge rounded-lg shadow-lg px-4 py-2.5 flex items-center gap-3 z-50`

**Step 2: Commit**

```bash
git add apps/ops/components/bulk-action-bar.tsx
git commit -m "feat(ops): add BulkActionBar component for time entries"
```

---

### Task 4: Add selection state + checkboxes to project detail page

**Files:**
- Modify: `apps/ops/app/(main)/clients/[id]/projects/[pid]/page.tsx`

**Step 1: Add selection state**

```typescript
const [selection, setSelection] = useState<Set<string>>(new Set())
```

Add helper functions:
```typescript
const toggleEntry = (id: string) => {
  setSelection((prev) => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })
}

const editableEntries = filteredEntries.filter((e) => {
  const s = getEffectiveStatus(e)
  return s !== "invoiced" && s !== "paid"
})

const allSelected = editableEntries.length > 0 && editableEntries.every((e) => selection.has(e._id))

const toggleAll = () => {
  if (allSelected) {
    setSelection(new Set())
  } else {
    setSelection(new Set(editableEntries.map((e) => e._id)))
  }
}
```

**Step 2: Add "select all" checkbox in the entries header row**

Above the entries list (next to "Entrées de temps" heading area), add a Checkbox when entries exist.

**Step 3: Add per-row checkbox**

In each entry row, prepend a Checkbox (only for editable entries). Non-editable rows get an empty spacer of the same width.

**Step 4: Clear selection when filter changes**

Add `useEffect` to clear selection when `statusFilter` changes:
```typescript
useEffect(() => { setSelection(new Set()) }, [statusFilter])
```

**Step 5: Commit**

```bash
git add apps/ops/app/\(main\)/clients/\[id\]/projects/\[pid\]/page.tsx
git commit -m "feat(ops): add multi-select checkboxes to time entries list"
```

---

### Task 5: Wire BulkActionBar + mutations into the page

**Files:**
- Modify: `apps/ops/app/(main)/clients/[id]/projects/[pid]/page.tsx`

**Step 1: Import and wire mutations**

```typescript
import { BulkActionBar } from "@/components/bulk-action-bar"

const bulkSetStatus = useMutation(api.timeEntries.setStatus)
const bulkRemove = useMutation(api.timeEntries.removeBatch)
const bulkSetBillable = useMutation(api.timeEntries.setBillable)
```

**Step 2: Add handlers**

```typescript
const handleBulkStatus = async (ids: string[], status: EntryStatus) => {
  try {
    await bulkSetStatus({ ids: ids as Id<"timeEntries">[], status })
    toast.success(`${ids.length} entrée(s) → ${ENTRY_STATUS_LABELS[status]}`)
    setSelection(new Set())
  } catch (e) {
    toast.error(e instanceof Error ? e.message : "Erreur")
  }
}

const handleBulkBillable = async (ids: string[], billable: boolean) => {
  try {
    await bulkSetBillable({ ids: ids as Id<"timeEntries">[], billable })
    toast.success(`${ids.length} entrée(s) → ${billable ? "Facturable" : "Non facturable"}`)
    setSelection(new Set())
  } catch (e) {
    toast.error(e instanceof Error ? e.message : "Erreur")
  }
}

const handleBulkDelete = async (ids: string[]) => {
  try {
    await bulkRemove({ ids: ids as Id<"timeEntries">[] })
    toast.success(`${ids.length} entrée(s) supprimée(s)`)
    setSelection(new Set())
  } catch (e) {
    toast.error(e instanceof Error ? e.message : "Erreur")
  }
}
```

**Step 3: Render BulkActionBar at the bottom of the page**

```tsx
{selection.size > 0 && (
  <BulkActionBar
    selectedIds={selection}
    entries={filteredEntries}
    onClear={() => setSelection(new Set())}
    onStatusChange={handleBulkStatus}
    onBillableChange={handleBulkBillable}
    onDelete={handleBulkDelete}
  />
)}
```

**Step 4: Commit**

```bash
git add apps/ops/app/\(main\)/clients/\[id\]/projects/\[pid\]/page.tsx
git commit -m "feat(ops): wire bulk actions toolbar to time entries"
```

---

### Task 6: Manual smoke test

**Step 1: Run dev server**

```bash
pnpm dev:ops
```

**Step 2: Test scenarios**

1. Navigate to a project with time entries
2. Check individual entries → toolbar appears with correct count
3. Use "select all" → only editable entries selected
4. Verify status buttons = intersection of allowed transitions
5. Change status in bulk → toast + entries update + selection clears
6. Toggle billable in bulk → toast + entries update
7. Delete in bulk → confirmation dialog → toast + entries removed
8. Mix incompatible statuses → verify no status buttons appear
9. Change status filter → selection clears

**Step 3: Final commit if any polish needed**
