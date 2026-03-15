# DataTable Composable Slots — Design

## Goal

Add slot-based composition to the DataTable component so consumers can inject custom UI in the toolbar, group headers, row actions, pagination, and footer — without breaking existing usage.

## Principles

- All props, no compound components — consistent with existing API (`renderRow`, `renderExpandedRow`)
- Render props for replacement (receive data, replace default), ReactNode for injection (add without replacing)
- Simplified objects exposed to render props — never expose TanStack `table` instance
- All new props optional — when absent, identical behavior to current implementation

## New Props

| Prop | Type | Replaces or adds | When absent |
|---|---|---|---|
| `toolbarLeadingSlot` | `ReactNode` | Adds | Nothing |
| `toolbarTrailingSlot` | `ReactNode` | Adds | Nothing |
| `toolbarBelowSlot` | `ReactNode` | Adds | Nothing |
| `renderGroupHeader` | `(row, defaultContent) => ReactNode` | Replaces entire group header | Default rendering |
| `renderGroupHeaderContent` | `(info) => ReactNode` | Replaces central content only | Column cell + count pill |
| `renderRowActions` | `(row) => ReactNode` | Replaces ⋯ menu | `rowActions[]` dropdown |
| `renderPagination` | `(info) => ReactNode` | Replaces pagination | Default DataTablePagination |
| `footerSlot` | `ReactNode` | Adds after table | Nothing |

## Signatures

### renderGroupHeader — full replacement

```tsx
renderGroupHeader?: (
  row: Row<TData>,
  defaultContent: ReactNode
) => ReactNode
```

The `defaultContent` allows wrapping the default without recoding it.

### renderGroupHeaderContent — content only (covers 90% of cases)

```tsx
renderGroupHeaderContent?: (info: {
  row: Row<TData>
  groupValue: unknown
  subRowCount: number
  aggregations: Record<string, ReactNode>
}) => ReactNode
```

Chevron, checkbox, and wrapper remain managed by DataTable.
Priority: `renderGroupHeader` > `renderGroupHeaderContent` > default.

### renderPagination — simplified object

```tsx
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
}) => ReactNode
```

### renderRowActions — full replacement

```tsx
renderRowActions?: (row: Row<TData>) => ReactNode
```

Priority: `renderRowActions` > `rowActions[]`.
When `renderRow` + `renderRowActions` both provided, `renderRowActions` replaces the auto-injected dropdown in the `renderRow` wrapper.

## Toolbar Layout

```
┌──────────────────────────────────────────────────────────────┐
│ [leadingSlot] [view pills...] ← → [icons] [trailingSlot]    │ Row 1
├──────────────────────────────────────────────────────────────┤
│ [search input]                                               │ Row 2 (conditional)
├──────────────────────────────────────────────────────────────┤
│ [inline filters]                                             │ Row 3 (conditional)
├──────────────────────────────────────────────────────────────┤
│ [toolbarBelowSlot]                                           │ Row 4 (new)
├──────────────────────────────────────────────────────────────┤
│ <table> ...                                                  │
├──────────────────────────────────────────────────────────────┤
│ [pagination OR renderPagination]                             │
├──────────────────────────────────────────────────────────────┤
│ [footerSlot]                                                 │
└──────────────────────────────────────────────────────────────┘
```

Same positions for both `classic` and `stacked` toolbar layouts.

## Ops Compatibility

Current usage in apps/ops (time tracking + todos):
- `renderRow` for flat row layout — **not touched**
- `groupRowStyle` for tinted group headers — **not touched**
- `groupAggregations` for totals — **not touched**
- Status column cell with `row.getIsGrouped()` for group header content — **still works when no renderGroupHeader provided**
- `variant="flat"` + `Bleed` + `rowActions[]` + `bulkActions[]` — **not touched**

No changes required in apps/ops.

## Not doing (YAGNI)

- No `renderEmptyGroup` — edge case too rare for v1
- No TanStack `table` instance exposure — never
- No compound components — props are sufficient
- No `renderViewPill` — internal plumbing
