# DataTable Kanban Mode — Design

## Goal

Add a `mode` prop to the DataTable that switches between table, flat list, and kanban views. The kanban mode reuses the existing `KanbanBoard` component from `@blazz/pro`. Toolbar, views, filters, and search remain identical across all modes.

## New Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `mode` | `"table" \| "flat" \| "kanban"` | `"table"` | Rendering mode |
| `renderCard` | `(row: Row<TData>) => ReactNode` | — | Custom kanban card renderer. Falls back to `renderRow`, then visible columns. |
| `onKanbanMove` | `(rowId: string, fromValue: string, toValue: string) => void` | — | Drag & drop callback between kanban columns |

## Architecture

When `mode="kanban"`:
- The DataTable renders `KanbanBoard` (from `@blazz/pro/components/blocks/kanban-board`) instead of `<Table>`
- Kanban columns = distinct values of the grouped column (`defaultGrouping[0]`)
- The filtered data (after views/filters/search) is grouped and passed to `KanbanBoard`
- `enableRowSelection` is ignored (no checkboxes in kanban)
- `enablePagination` is ignored
- `renderRow` is not used (use `renderCard` instead)
- `variant` prop has no effect in kanban mode

## Kanban Column Headers

Built automatically from:
- The cell renderer of the grouped column (same as flat mode group headers)
- Count of items in the column
- `renderGroupHeaderEnd(row)` slot (e.g. "+" button)

## Drag & Drop

- Uses `@dnd-kit` via the existing `KanbanBoard` component
- When a card is moved, `onKanbanMove(rowId, fromValue, toValue)` is called
- The consumer handles the mutation (Convex, API, etc.)
- No optimistic update from the DataTable — the consumer controls the data

## Render Priority for Cards

1. `renderCard(row)` if provided
2. `renderRow(row)` as fallback
3. Auto-generated card from visible column values (last resort)

## What Stays the Same

- All existing props work identically when `mode` is `"table"` or `"flat"`
- `mode` is optional, default `"table"` = current behavior
- The toolbar (views, search, filters, sort, slots) renders identically in all modes
- `groupRowStyle` still applies in flat mode, ignored in kanban (KanbanBoard has its own styling)

## Consumer Example (ops/todos)

```tsx
const [mode, setMode] = useState<"flat" | "kanban">("flat")

<DataTable
  mode={mode}
  data={todoRows}
  columns={columns}
  enableGrouping
  defaultGrouping={["status"]}
  renderRow={(row) => <FlatRow todo={row.original} />}
  renderCard={(row) => <TodoCard todo={row.original} />}
  onKanbanMove={async (id, _from, to) => {
    await updateStatus({ id, status: to })
  }}
  renderGroupHeaderEnd={(row) => (
    <Button size="icon-sm" variant="ghost" onClick={() => addTodo(row.getValue("status"))}>
      <Plus className="size-3.5" />
    </Button>
  )}
  toolbarTrailingSlot={
    <ModeDropdown value={mode} onChange={setMode} />
  }
/>
```

## YAGNI — Not Doing

- No built-in mode toggle in toolbar (consumer uses `toolbarTrailingSlot`)
- No kanban-specific column configuration (uses grouping)
- No multi-column drag (one card at a time)
- No swimlanes (horizontal grouping)
- No lazy loading of KanbanBoard (can add later if bundle size matters)
