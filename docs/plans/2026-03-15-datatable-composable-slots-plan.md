# DataTable Composable Slots — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add 8 composable slot props to DataTable so consumers can inject custom UI in toolbar, group headers, row actions, pagination, and footer.

**Architecture:** All slots are optional props on DataTable. Render props (`render*`) replace default rendering when provided; ReactNode slots (`*Slot`) inject additional content. Priority chains: `renderGroupHeader` > `renderGroupHeaderContent` > default. `renderRowActions` > `rowActions[]`. No breaking changes — all existing behavior preserved when slots are absent.

**Tech Stack:** React 19, TypeScript strict, TanStack Table, @blazz/ui component library

---

### Task 1: Add type definitions for all new props

**Files:**
- Modify: `packages/ui/src/components/blocks/data-table/data-table.types.ts`

**Step 1: Add the new prop types to DataTableProps**

Add these props to the `DataTableProps` interface, before the `renderRow` prop (around line 216):

```typescript
// Toolbar slots
/** ReactNode injected before view pills in the toolbar */
toolbarLeadingSlot?: React.ReactNode
/** ReactNode injected after icon actions in the toolbar */
toolbarTrailingSlot?: React.ReactNode
/** ReactNode injected between toolbar and table */
toolbarBelowSlot?: React.ReactNode

// Group header customization
/** Full replacement of group header row — receives row and default content as fallback */
renderGroupHeader?: (
  row: import("@tanstack/react-table").Row<TData>,
  defaultContent: React.ReactNode
) => React.ReactNode
/** Replaces only the central content of group header (between chevron and aggregations).
 * Priority: renderGroupHeader > renderGroupHeaderContent > default cell renderer */
renderGroupHeaderContent?: (info: {
  row: import("@tanstack/react-table").Row<TData>
  groupValue: unknown
  subRowCount: number
  aggregations: Record<string, React.ReactNode>
}) => React.ReactNode

// Row actions customization
/** Replaces the default ⋯ dropdown menu with custom row actions UI.
 * Priority: renderRowActions > rowActions[]. Also used inside renderRow wrapper. */
renderRowActions?: (row: import("@tanstack/react-table").Row<TData>) => React.ReactNode

// Pagination customization
/** Replaces the default pagination component with custom UI */
renderPagination?: (info: {
  page: number
  pageCount: number
  pageSize: number
  pageSizeOptions: number[]
  totalRows: number
  onNextPage: () => void
  onPrevPage: () => void
  onFirstPage: () => void
  onLastPage: () => void
  onPageSizeChange: (size: number) => void
  canNextPage: boolean
  canPrevPage: boolean
}) => React.ReactNode

// Footer
/** ReactNode injected after the table (and after pagination) */
footerSlot?: React.ReactNode
```

**Step 2: Run type-check**

Run: `npx tsc --noEmit --project apps/ops/tsconfig.json 2>&1 | grep "data-table.types" | head -5`
Expected: No errors (adding optional props is backwards-compatible)

**Step 3: Commit**

```bash
git add packages/ui/src/components/blocks/data-table/data-table.types.ts
git commit -m "feat(ui): add composable slot type definitions to DataTableProps"
```

---

### Task 2: Wire toolbar slots into DataTableActionsBar

**Files:**
- Modify: `packages/ui/src/components/blocks/data-table/data-table-actions-bar.tsx`
- Modify: `packages/ui/src/components/blocks/data-table/data-table.tsx`

**Step 1: Add slot props to DataTableActionsBarProps**

In `data-table-actions-bar.tsx`, add to the `DataTableActionsBarProps` interface (around line 113):

```typescript
/** ReactNode before view pills */
toolbarLeadingSlot?: React.ReactNode
/** ReactNode after icon actions */
toolbarTrailingSlot?: React.ReactNode
```

**Step 2: Render leading slot in stacked layout**

In the stacked layout section (around line 384), find the `{/* Left: View pills */}` div. Insert the leading slot before the view pills:

```tsx
{/* Left: View pills */}
<div ref={containerRef} className="flex items-center gap-1 overflow-x-clip">
  {toolbarLeadingSlot}
  {views && views.length > 0 ? (
```

**Step 3: Render trailing slot in stacked layout**

In the stacked layout, find the right side `{/* Right: Icon actions */}` div (around line 460). Insert the trailing slot after the last icon button (Export), before the closing `</div>`:

```tsx
          {/* Export */}
          {onExport && (
            <Button ...>
              <Download className="h-3.5 w-3.5" />
            </Button>
          )}
          {toolbarTrailingSlot}
        </div>
```

**Step 4: Do the same for classic layout**

Apply the same pattern to the classic layout section (leading before views, trailing after actions).

**Step 5: Pass slots from DataTable to DataTableActionsBar**

In `data-table.tsx`, find the `<DataTableActionsBar` call (around line 766) and add:

```tsx
toolbarLeadingSlot={toolbarLeadingSlot}
toolbarTrailingSlot={toolbarTrailingSlot}
```

Also destructure `toolbarLeadingSlot` and `toolbarTrailingSlot` from the DataTable props (around line 148).

**Step 6: Run type-check**

Run: `npx tsc --noEmit --project apps/ops/tsconfig.json 2>&1 | grep -E "data-table\.(tsx|types)|actions-bar" | head -10`
Expected: No errors

**Step 7: Commit**

```bash
git add packages/ui/src/components/blocks/data-table/data-table-actions-bar.tsx packages/ui/src/components/blocks/data-table/data-table.tsx
git commit -m "feat(ui): add toolbarLeadingSlot and toolbarTrailingSlot to DataTable toolbar"
```

---

### Task 3: Add toolbarBelowSlot

**Files:**
- Modify: `packages/ui/src/components/blocks/data-table/data-table.tsx`

**Step 1: Destructure and render toolbarBelowSlot**

In `data-table.tsx`, destructure `toolbarBelowSlot` from props.

Find the section between the inline filters and the `<Table>` (around line 895). Insert:

```tsx
{/* Toolbar below slot */}
{toolbarBelowSlot && (
  <div className="border-b border-separator">
    {toolbarBelowSlot}
  </div>
)}
```

Place this just before `{/* Table */}` / `<div>` that wraps the Table component.

**Step 2: Run type-check**

Run: `npx tsc --noEmit --project apps/ops/tsconfig.json 2>&1 | grep "data-table.tsx" | head -5`
Expected: No errors

**Step 3: Commit**

```bash
git add packages/ui/src/components/blocks/data-table/data-table.tsx
git commit -m "feat(ui): add toolbarBelowSlot to DataTable"
```

---

### Task 4: Add renderGroupHeader and renderGroupHeaderContent

**Files:**
- Modify: `packages/ui/src/components/blocks/data-table/data-table.tsx`

**Step 1: Destructure the new props**

Add `renderGroupHeader` and `renderGroupHeaderContent` to the destructured props (around line 148).

**Step 2: Build the default group header content as a variable**

In the group header rendering section (starts around line 936), extract the current default content into a `defaultGroupContent` variable so it can be passed to `renderGroupHeader`:

```tsx
if (row.getIsGrouped()) {
  // Compute aggregations for renderGroupHeaderContent
  const computedAggregations: Record<string, React.ReactNode> = {}
  if (groupAggregations) {
    for (const [colId, aggType] of Object.entries(groupAggregations)) {
      if (colId === "_count") continue
      const aggValue = computeAggregation(row.subRows, colId, aggType)
      if (aggValue !== null) computedAggregations[colId] = aggValue
    }
  }

  // Find the grouped cell value
  const groupedCell = row.getAllCells().find((cell) => cell.getIsGrouped())
  const groupValue = groupedCell ? row.getValue(groupedCell.column.id) : undefined

  // Default content (chevron + cell + count + aggregations)
  const defaultGroupContent = (
    <div className="flex w-full items-center gap-2">
      {enableRowSelection && (
        <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
          <Checkbox
            checked={row.getIsAllSubRowsSelected()}
            indeterminate={row.getIsSomeSelected() && !row.getIsAllSubRowsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label={`Select group ${row.id}`}
          />
        </div>
      )}
      <button
        type="button"
        onClick={row.getToggleExpandedHandler()}
        className="flex flex-1 items-center gap-2 text-left font-medium"
      >
        <ChevronRight
          className={cn("h-4 w-4 shrink-0 transition-transform duration-200", row.getIsExpanded() && "rotate-90")}
        />
        {renderGroupHeaderContent ? (
          renderGroupHeaderContent({
            row,
            groupValue,
            subRowCount: row.subRows.length,
            aggregations: computedAggregations,
          })
        ) : (
          <>
            {row.getAllCells().map((cell) => {
              if (cell.getIsGrouped()) {
                return (
                  <span key={cell.id} className="flex items-center gap-2">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    <span className="rounded-full bg-surface-3/70 px-1.5 py-0.5 text-[11px] font-normal tabular-nums text-fg-muted">
                      {row.subRows.length}
                    </span>
                  </span>
                )
              }
              return null
            })}
            {Object.keys(computedAggregations).length > 0 && (
              <span className="ml-auto flex items-center gap-4 text-body-sm font-normal text-fg-muted">
                {Object.entries(computedAggregations).map(([colId, value]) => (
                  <span key={colId}>{value}</span>
                ))}
              </span>
            )}
          </>
        )}
      </button>
    </div>
  )

  // Render: renderGroupHeader > renderGroupHeaderContent (handled above) > default
  return (
    <React.Fragment key={row.id}>
      {renderGroupHeader ? (
        <TableRow
          data-group-header=""
          className={cn("bg-surface hover:bg-surface-3/50", finalVariant === "flat" && "bg-transparent hover:bg-transparent")}
          style={row.depth > 0 ? { position: "relative", left: `${row.depth * 1.5}rem` } : undefined}
        >
          <TableCell
            colSpan={row.getVisibleCells().length}
            className={cn("py-2", finalVariant === "flat" && "rounded-lg")}
            style={groupRowStyle?.(row)}
          >
            {renderGroupHeader(row, defaultGroupContent)}
          </TableCell>
        </TableRow>
      ) : (
        <TableRow
          data-group-header=""
          className={cn("bg-surface hover:bg-surface-3/50", finalVariant === "flat" && "bg-transparent hover:bg-transparent")}
          style={row.depth > 0 ? { position: "relative", left: `${row.depth * 1.5}rem` } : undefined}
        >
          <TableCell
            colSpan={row.getVisibleCells().length}
            className={cn("py-2", finalVariant === "flat" && "rounded-lg")}
            style={groupRowStyle?.(row)}
          >
            {defaultGroupContent}
          </TableCell>
        </TableRow>
      )}
    </React.Fragment>
  )
}
```

Note: the `<TableRow>` wrapper is duplicated because `groupRowStyle` still applies in both cases.

**Step 3: Run type-check**

Run: `npx tsc --noEmit --project apps/ops/tsconfig.json 2>&1 | grep "data-table.tsx" | head -5`
Expected: No errors

**Step 4: Verify ops pages still work**

Run: `pnpm dev:ops` and check `/time` and `/todos` in list view — group headers should render identically.

**Step 5: Commit**

```bash
git add packages/ui/src/components/blocks/data-table/data-table.tsx
git commit -m "feat(ui): add renderGroupHeader and renderGroupHeaderContent to DataTable"
```

---

### Task 5: Add renderRowActions

**Files:**
- Modify: `packages/ui/src/components/blocks/data-table/data-table.tsx`

**Step 1: Destructure renderRowActions from props**

Add `renderRowActions` to the destructured props.

**Step 2: Use renderRowActions in renderRow mode**

Find the `renderRow` block (around line 1020). Replace the row actions injection:

```tsx
{/* Before: */}
{rowActions && rowActions.length > 0 && (
  <Bleed marginBlock="200">
    <DataTableRowActions row={row} actions={rowActions} />
  </Bleed>
)}

{/* After: */}
{renderRowActions ? (
  <Bleed marginBlock="200">
    {renderRowActions(row)}
  </Bleed>
) : rowActions && rowActions.length > 0 ? (
  <Bleed marginBlock="200">
    <DataTableRowActions row={row} actions={rowActions} />
  </Bleed>
) : null}
```

**Step 3: Use renderRowActions in default row mode**

Find the normal row rendering where `DataTableRowActions` is used inside the actions column (the `cols.push` for the "actions" column around line 312). Wrap it:

```tsx
if (rowActions && rowActions.length > 0) {
  cols.push({
    id: "actions",
    header: () => null,
    cell: ({ row }) => renderRowActions
      ? renderRowActions(row)
      : <DataTableRowActions row={row} actions={rowActions} />,
    enableSorting: false,
    enableHiding: false,
    size: 50,
  })
}
```

Note: also push the actions column when `renderRowActions` is provided even if `rowActions` is empty:

```tsx
if ((rowActions && rowActions.length > 0) || renderRowActions) {
  cols.push({
    id: "actions",
    header: () => null,
    cell: ({ row }) => renderRowActions
      ? renderRowActions(row)
      : <DataTableRowActions row={row} actions={rowActions!} />,
    enableSorting: false,
    enableHiding: false,
    size: 50,
  })
}
```

**Step 4: Run type-check**

Run: `npx tsc --noEmit --project apps/ops/tsconfig.json 2>&1 | grep "data-table.tsx" | head -5`
Expected: No errors

**Step 5: Commit**

```bash
git add packages/ui/src/components/blocks/data-table/data-table.tsx
git commit -m "feat(ui): add renderRowActions to DataTable"
```

---

### Task 6: Add renderPagination

**Files:**
- Modify: `packages/ui/src/components/blocks/data-table/data-table.tsx`

**Step 1: Destructure renderPagination from props**

**Step 2: Replace pagination rendering**

Find the `{/* Pagination */}` section at the bottom of the component (around line 1130). Replace:

```tsx
{enablePagination && (
  renderPagination ? (
    renderPagination({
      page: table.getState().pagination.pageIndex,
      pageCount: table.getPageCount(),
      pageSize: table.getState().pagination.pageSize,
      pageSizeOptions: finalPagination.pageSizeOptions ?? [10, 25, 50, 100],
      totalRows: table.getFilteredRowModel().rows.length,
      onNextPage: () => table.nextPage(),
      onPrevPage: () => table.previousPage(),
      onFirstPage: () => table.setPageIndex(0),
      onLastPage: () => table.setPageIndex(table.getPageCount() - 1),
      onPageSizeChange: (size) => table.setPageSize(size),
      canNextPage: table.getCanNextPage(),
      canPrevPage: table.getCanPreviousPage(),
    })
  ) : (
    <DataTablePagination
      table={table}
      pageSizeOptions={finalPagination.pageSizeOptions}
      locale={finalLocale}
    />
  )
)}
```

**Step 3: Run type-check**

Run: `npx tsc --noEmit --project apps/ops/tsconfig.json 2>&1 | grep "data-table.tsx" | head -5`
Expected: No errors

**Step 4: Commit**

```bash
git add packages/ui/src/components/blocks/data-table/data-table.tsx
git commit -m "feat(ui): add renderPagination to DataTable"
```

---

### Task 7: Add footerSlot

**Files:**
- Modify: `packages/ui/src/components/blocks/data-table/data-table.tsx`

**Step 1: Destructure footerSlot from props**

**Step 2: Render footerSlot after pagination**

After the pagination section, add:

```tsx
{/* Footer slot */}
{footerSlot}
```

**Step 3: Run type-check**

Run: `npx tsc --noEmit --project apps/ops/tsconfig.json 2>&1 | grep "data-table.tsx" | head -5`
Expected: No errors

**Step 4: Commit**

```bash
git add packages/ui/src/components/blocks/data-table/data-table.tsx
git commit -m "feat(ui): add footerSlot to DataTable"
```

---

### Task 8: Final type-check and ops smoke test

**Step 1: Full type-check**

Run: `npx tsc --noEmit --project apps/ops/tsconfig.json 2>&1 | grep -E "data-table|time/_client|todos/_client" | head -20`
Expected: No new errors (pre-existing errors in other files are OK)

**Step 2: Dev smoke test**

Run: `pnpm dev:ops`

Check:
- `/time` — list view: grouped by status, flat variant, tinted group headers, renderRow, row actions, bulk actions all work identically
- `/todos` — list view: same checks
- `/time` — week and month views: unaffected
- `/todos` — kanban view: unaffected

**Step 3: Final commit if any fixes needed**

```bash
git add -A
git commit -m "fix(ui): address type-check and smoke test issues for composable slots"
```
