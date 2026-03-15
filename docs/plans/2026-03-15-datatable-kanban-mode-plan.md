# DataTable Kanban Mode — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `mode` prop to DataTable that switches between table/flat and kanban views, reusing the existing KanbanBoard component.

**Architecture:** When `mode="kanban"`, the DataTable renders KanbanBoard instead of `<Table>`. The grouped column values become kanban columns. Toolbar, views, filters, search remain identical. The consumer provides `renderCard` for card rendering and `onKanbanMove` for drag & drop mutations.

**Tech Stack:** React 19, TanStack Table, @blazz/pro KanbanBoard, @blazz/ui primitives

---

### Task 1: Add mode, renderCard, onKanbanMove types

**Files:**
- Modify: `packages/pro/src/components/blocks/data-table/data-table.types.ts`

**Step 1: Add the 3 new props to DataTableProps**

After the `footerSlot` prop, add:

```typescript
// View mode
/** Rendering mode: "table" (default cells), "flat" (renderRow), or "kanban" (KanbanBoard) */
mode?: "table" | "flat" | "kanban"

/** Custom kanban card renderer. Falls back to renderRow, then auto-generated from visible columns. */
renderCard?: (row: import("@tanstack/react-table").Row<TData>) => React.ReactNode

/** Drag & drop callback when a card moves between kanban columns.
 * Receives the row ID (from getRowId), source column value, and target column value. */
onKanbanMove?: (rowId: string, fromValue: string, toValue: string) => void | Promise<void>
```

**Step 2: Type-check**

Run: `npx tsc --noEmit --project apps/docs/tsconfig.json 2>&1 | grep "data-table.types" | head -5`
Expected: No errors

**Step 3: Commit**

```bash
git add packages/pro/src/components/blocks/data-table/data-table.types.ts
git commit -m "feat(ui): add mode, renderCard, onKanbanMove types to DataTableProps"
```

---

### Task 2: Wire mode prop and render KanbanBoard

**Files:**
- Modify: `packages/pro/src/components/blocks/data-table/data-table.tsx`

**Step 1: Destructure new props**

Add to the destructured props (near renderRow, renderCard etc):
```typescript
mode = "table",
renderCard,
onKanbanMove,
```

**Step 2: Determine effective mode**

After `flatRowStyle`, add:
```typescript
// Determine effective mode — "flat" variant forces flat mode for backward compat
const effectiveMode = mode === "kanban" ? "kanban" : finalVariant === "flat" ? "flat" : mode
```

**Step 3: Import KanbanBoard**

Add import at the top:
```typescript
import { KanbanBoard } from "../kanban-board"
```

**Step 4: Build kanban data from grouped rows**

Before the return, after the `table` instance is created, add a memo:

```typescript
// Kanban: build columns and items from grouped data
const kanbanData = React.useMemo(() => {
    if (effectiveMode !== "kanban" || !enableGrouping || grouping.length === 0) return null

    const groupColumnId = grouping[0]
    const rows = table.getRowModel().rows

    // Collect unique group values for kanban columns
    const groupValues = new Set<string>()
    const flatRows: Array<{ row: typeof rows[0]; groupValue: string }> = []

    for (const row of rows) {
        if (row.getIsGrouped()) {
            const value = String(row.getValue(groupColumnId) ?? "")
            groupValues.add(value)
            // Flatten sub-rows
            for (const subRow of row.subRows) {
                flatRows.push({ row: subRow, groupValue: value })
            }
        }
    }

    // Build KanbanBoard columns
    const kanbanColumns = Array.from(groupValues).map((value) => ({
        id: value,
        label: value,
    }))

    // Build items with id (required by KanbanBoard)
    const kanbanItems = flatRows.map(({ row, groupValue }) => ({
        id: getRowId ? getRowId(row.original) : row.id,
        _row: row,
        _groupValue: groupValue,
        _original: row.original,
    }))

    return { columns: kanbanColumns, items: kanbanItems, groupColumnId }
}, [effectiveMode, enableGrouping, grouping, table, getRowId])
```

**Step 5: Render KanbanBoard when mode is kanban**

In the return JSX, after the toolbar/filters section and before the `<div>` that wraps the `<Table>`, add a conditional:

```tsx
{effectiveMode === "kanban" && kanbanData ? (
    <KanbanBoard
        columns={kanbanData.columns}
        items={kanbanData.items}
        getColumnId={(item) => item._groupValue}
        className="flex-1 min-h-0"
        columnClassName="!min-w-[300px] w-[300px]"
        onMove={onKanbanMove ? async (itemId, from, to) => {
            await onKanbanMove(itemId, from, to)
        } : undefined}
        renderCard={(item) => {
            if (renderCard) return renderCard(item._row)
            if (renderRow) return renderRow(item._row)
            // Fallback: render row original as JSON (dev only)
            return <div className="p-2 text-xs">{JSON.stringify(item._original, null, 2)}</div>
        }}
        renderColumnHeader={(column, colItems) => {
            // Find the grouped row for this column to get the cell renderer
            const groupedRow = table.getRowModel().rows.find(
                (r) => r.getIsGrouped() && String(r.getValue(kanbanData.groupColumnId)) === column.id
            )

            // Get aggregations
            const computedAggregations: Record<string, React.ReactNode> = {}
            if (groupAggregations && groupedRow) {
                for (const [colId, aggType] of Object.entries(groupAggregations)) {
                    if (colId === "_count") continue
                    const aggValue = computeAggregation(groupedRow.subRows, colId, aggType)
                    if (aggValue !== null) computedAggregations[colId] = aggValue
                }
            }

            return (
                <div className="flex items-center justify-between px-3 py-2 border-b border-edge">
                    <div className="flex items-center gap-2">
                        {/* Render the grouped column's cell if we have a grouped row */}
                        {groupedRow && (() => {
                            const cell = groupedRow.getAllCells().find((c) => c.getIsGrouped())
                            if (!cell) return <span className="text-sm font-medium">{column.label}</span>
                            return flexRender(cell.column.columnDef.cell, cell.getContext())
                        })()}
                        <span className="rounded-full bg-surface-3/70 px-1.5 py-0.5 text-[11px] tabular-nums text-fg-muted">
                            {colItems.length}
                        </span>
                        {/* Aggregations */}
                        {Object.keys(computedAggregations).length > 0 && (
                            <span className="flex items-center gap-2 text-xs text-fg-muted">
                                {Object.entries(computedAggregations).map(([colId, value]) => (
                                    <span key={colId}>{value}</span>
                                ))}
                            </span>
                        )}
                    </div>
                    {renderGroupHeaderEnd && groupedRow && (
                        <div onClick={(e) => e.stopPropagation()}>
                            {renderGroupHeaderEnd(groupedRow)}
                        </div>
                    )}
                </div>
            )
        }}
    />
) : null}
```

**Step 6: Hide table when kanban is active**

Wrap the existing `<div>` that contains the `<Table>` with:
```tsx
{effectiveMode !== "kanban" && (
    <div ...existing table wrapper...>
        ...
    </div>
)}
```

Also hide pagination and footer when kanban:
```tsx
{effectiveMode !== "kanban" && enablePagination && (...)}
{effectiveMode !== "kanban" && footerSlot}
```

**Step 7: Type-check**

Run: `npx tsc --noEmit --project apps/docs/tsconfig.json 2>&1 | grep "data-table.tsx" | head -5`
Expected: No errors

**Step 8: Commit**

```bash
git add packages/pro/src/components/blocks/data-table/data-table.tsx
git commit -m "feat(ui): render KanbanBoard when mode=kanban in DataTable"
```

---

### Task 3: Migrate todos page to use DataTable kanban mode

**Files:**
- Modify: `apps/ops/app/(main)/todos/_client.tsx`

**Step 1: Replace the separate KanbanBoard usage with DataTable mode prop**

The todos page currently switches between `<DataTable>` (list mode) and `<KanbanBoard>` (kanban mode) manually. Replace with a single `<DataTable>` that handles both modes.

Key changes:
- Remove the separate `<KanbanBoard>` block
- Add `mode={viewMode === "kanban" ? "kanban" : "flat"}` to the DataTable
- Add `renderCard` for the kanban card rendering (reuse existing `TodoCard` component)
- Add `onKanbanMove` for status updates
- The DataTable renders in both modes, toolbar always visible
- Remove the `Bleed` conditional wrapping (DataTable shows in both modes now)

**Step 2: Update the mode dropdown**

The dropdown in `toolbarTrailingSlot` now controls `mode` on the DataTable instead of switching between two different components.

**Step 3: Smoke test**

- List view: grouped by status, flat mode, renderRow
- Kanban view: columns by status, cards with TodoCard, drag & drop updates status
- Switching between views preserves filters and search
- Toolbar (views, search, filters) works in both modes

**Step 4: Commit**

```bash
git add apps/ops/app/(main)/todos/_client.tsx
git commit -m "feat(ops): use DataTable kanban mode for todos — single component for both views"
```

---

### Task 4: Final type-check and smoke test

**Step 1: Full type-check**

Run: `npx tsc --noEmit --project apps/ops/tsconfig.json 2>&1 | grep -E "data-table|todos/_client" | head -20`
Expected: No new errors

**Step 2: Smoke test in browser**

- `/todos` in list mode: flat DataTable grouped by status
- `/todos` switch to kanban: KanbanBoard with same data, drag works
- Switch back to list: data preserved
- Apply a view filter (e.g. "En cours"): both modes show filtered data
- Search: works in both modes
- Bulk actions: only in list mode (no selection in kanban)

**Step 3: Commit if fixes needed**

```bash
git add -A
git commit -m "fix(ui): address type-check and smoke test issues for kanban mode"
```
