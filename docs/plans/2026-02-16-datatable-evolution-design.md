# DataTable Evolution — Design Document

**Date:** 2026-02-16
**Status:** Approved
**Objective:** Transform the DataTable into a polyvalent, feature-complete table framework with exceptional DX (<50 lines for a full-featured table).

## Context

The DataTable is the flagship component of the Pro UI Kit. Current state:
- 7 column builders (text, status, numeric, currency, date, select, imageText)
- 10 presets (6 CRM + 4 general purpose)
- Advanced filters (AND/OR groups), views, inline editing (blur-to-save), i18n
- 5 variants (default, lined, striped, editable, spreadsheet)

What's missing: rich cell types, grouping, row expand, column pinning, keyboard navigation.

## Approach: Hybrid — Builders + Escape Hatch

Cell Registry (declarative builders) as the default, with a `cell` override escape hatch on every builder. Extends the existing factory pattern (`createXxxColumn`) without breaking changes.

```tsx
col.tags("labels", { colorMap: statusColors, max: 3 })         // builder
col.text("name", { cell: ({ row }) => <CustomName row={row} /> }) // override
```

## 1. Cell Types Library

### Tier 1 — Core Business

| Builder | Render | Use case |
|---------|--------|----------|
| `col.tags(key, opts)` | Colored badges inline, `+N` overflow with popover | Labels, skills, categories |
| `col.avatarGroup(key, opts)` | Overlapping circular avatar stack, `+N` | Assignees, team members |
| `col.validation(key, opts)` | Status icon (check/warning/error/info) + tooltip | Incomplete field, past deadline |
| `col.progress(key, opts)` | Mini progress bar + percentage | Completion, quota, scoring |
| `col.rating(key, opts)` | Stars or dots (1-5) | Priority, satisfaction |
| `col.link(key, opts)` | Clickable link with external icon, truncate | URL, email, tel |
| `col.boolean(key, opts)` | Checkbox, toggle, or Yes/No badge | Active, verified, published |

### Tier 2 — Rich Content

| Builder | Render | Use case |
|---------|--------|----------|
| `col.image(key, opts)` | Clickable thumbnail | Products, files |
| `col.sparkline(key, opts)` | Mini line/bar chart in cell | Trends, history |
| `col.colorDot(key, opts)` | Colored dot + label | Category, visual priority |
| `col.duration(key, opts)` | Smart format: "2h 30m", "3 days" | Time spent, SLA |
| `col.relativeDate(key, opts)` | "3h ago", "In 2 days" + tooltip exact date | Created at, updated at |
| `col.user(key, opts)` | Avatar + name + optional subtitle | Creator, owner |

### Tier 3 — Composites

| Builder | Render | Use case |
|---------|--------|----------|
| `col.twoLines(key, opts)` | Main line + gray sub-line | Name + email, title + description |
| `col.keyValue(key, opts)` | Label: Value compact | Metadata, properties |

### Common API per builder

```tsx
col.tags("labels", {
  // Common to all builders
  header: "Labels",
  enableSorting: true,
  enableHiding: true,
  size: 200,
  cell: (props) => <Custom />,  // escape hatch

  // Type-specific
  colorMap: { bug: "red", feature: "blue" },
  max: 3,
  variant: "badge" | "dot",
})
```

Each cell type also provides:
- Default `filterConfig` (tags -> select/in filter, progress -> number/between, etc.)
- Default sort comparator
- Plain text export renderer (for CSV)

## 2. Grouping System

### API

```tsx
<DataTable
  enableGrouping={true}
  defaultGrouping={["stage"]}
  onGroupingChange={(grouping) => {}}
  groupAggregations={{
    amount: "sum",
    probability: "avg",
    _count: true,
  }}
/>
```

### View integration

`DataTableView` extended with:
- `grouping?: string[]` — grouped columns
- `expandedGroups?: string[]` — open groups by default
- `aggregations?: Record<string, AggregationType>`

### Group header UI

```
> Stage: Negotiation (12)          $340,000 total    67% avg probability
```

- Collapse/expand chevron
- Group value rendered with the column's own cell renderer
- Row count
- Aggregations aligned with their respective columns

### Multi-level grouping

Nested groups supported. Toolbar displays grouped columns as draggable chips.

### Aggregation types

| Type | Computation |
|------|-------------|
| `sum` | Sum, formatted per column type |
| `avg` | Average, rounded |
| `min` / `max` | Min/Max |
| `count` | Row count |
| `range` | Min - Max |
| `custom` | `(values) => ReactNode` |

### Column builder integration

```tsx
col.status("stage", {
  enableGrouping: true,    // this column is groupable
  aggregation: "count",    // default aggregation when grouped by something else
})

col.currency("amount", {
  enableGrouping: false,
  aggregation: "sum",
})
```

### Toolbar

"Group by" button next to Sort and Filter. Dropdown with groupable columns, multi-level support, draggable chips to reorder, x button to remove.

## 3. Row Expand / Detail Panel

### API

```tsx
<DataTable
  enableRowExpand={true}
  renderExpandedRow={(row) => <DealDetailPanel deal={row.original} />}
  expandMode="single"           // "single" | "multiple"
  defaultExpanded={false}        // or string[] of IDs
/>
```

### UI

- Chevron column before checkbox (if both active: chevron -> checkbox -> content)
- Expanded panel spans full table width (colspan total)
- Slide-down animation
- Subtle background (`bg-muted/30`)

### Grouping interaction

- Group headers: larger collapse chevron (group level)
- Individual rows: smaller expand chevron (detail level)
- Visually distinct

### Helper components (optional)

| Helper | Description |
|--------|-------------|
| `ExpandedRowGrid` | 2-3 column grid of key-value pairs |
| `ExpandedRowTabs` | Tabs within the panel |
| `ExpandedRowSubTable` | Nested read-only DataTable |

## 4. Column Pinning

### API

```tsx
<DataTable
  enableColumnPinning={true}
  defaultColumnPinning={{
    left: ["select", "expand", "name"],
    right: ["actions"],
  }}
/>
```

Per-column:

```tsx
col.text("name", { pinned: "left" })
col.text("notes", { enablePinning: false })
```

### Visual treatment

- **Shadow separator** — `box-shadow` on inner edge of pinned columns, visible only when content scrolls underneath
- **Opaque background** — `bg-surface` solid on pinned columns
- **Sticky positioning** — CSS `position: sticky` with calculated left/right offsets
- **Z-index layering** — left pinned > scrollable < right pinned, header above all

### Pure CSS implementation

No JS scroll listeners. `position: sticky` + pseudo-elements for shadows. Offset calculation done once at render time.

### Interactions

- Group headers and expanded rows ignore pinning (full width)
- Checkbox always first pinned left, expand chevron second
- Pinned columns cannot be dragged out of their zone
- Pinning state saved in views
- Header context menu: "Pin left" / "Pin right" / "Unpin"

## 5. Inline Cell Editing Advanced

### Two interaction modes

| Mode | Activation | Behavior |
|------|-----------|----------|
| **Cell focus** | Single click or arrow keys | Cell selected (blue outline), arrow keys navigate between cells |
| **Cell edit** | Double-click, Enter, F2, or start typing | Cell in edit mode (input visible), arrows navigate within text |

### Transitions

- **Focus -> Edit:** Enter, F2, double-click, alphanumeric key
- **Edit -> Focus:** Escape (cancel), Tab (save + next), Enter (save + below)
- **Focus -> Focus:** arrow keys, Tab / Shift+Tab

### Keyboard navigation

| Key | Action |
|-----|--------|
| Arrow keys | Navigate between cells (focus mode) |
| Tab / Shift+Tab | Next / previous editable cell |
| Enter | Focus: enter edit. Edit: save + move down |
| Escape | Edit: cancel + return to focus. Focus: deselect |
| Delete | Clear cell value |
| Ctrl+C | Copy cell text value |
| Ctrl+V | Paste into cell |
| Ctrl+Z | Undo last edit |
| Ctrl+Shift+Z | Redo |

Active cell tracked by `{ rowId, columnId }` state. Uses `data-row` / `data-col` attributes for programmatic focus.

### Inline validation

```tsx
col.editableText("email", {
  validate: (value) => {
    if (!value) return { level: "error", message: "Required" }
    if (!isEmail(value)) return { level: "warning", message: "Invalid email format" }
    return null
  },
  validateOn: "blur",  // "change" | "blur" | "submit"
})
```

| Level | Visual | Behavior |
|-------|--------|----------|
| `error` | Red border + X icon | Blocks save, previous value restored |
| `warning` | Orange border + warning icon | Saves anyway, tooltip with message |
| `info` | Blue border + info icon | Informational only |

### Undo / Redo

Edit history stack (50 entries default, configurable via `editHistorySize`).
Undo/redo calls the same `onCellEdit` callback — single persistence path.

### API

```tsx
<DataTable
  enableCellEditing={true}
  onCellEdit={(rowId, columnId, value, previousValue) => {}}
  editValidation="cell"       // "cell" | "row"
  editHistorySize={50}
/>
```

### Feature interactions

- Row selection: checkbox click = selection (no cell focus). Space in focus = toggle selection.
- Row expand: chevron still clickable. Arrows don't navigate into expanded panel.
- Grouping: group headers not keyboard-navigable. Arrows skip between groups.
- Column pinning: keyboard navigation crosses pinned zones transparently.
- Sort/filter change: resets focus, preserves edit history.

## 6. Unified API & Preset System

### The `col` namespace

Replaces verbose `createXxxColumn()` factories with concise `col.*` methods. The old factories remain exported — zero breaking change.

```tsx
// Before
createTextColumn<Deal>({ accessorKey: "name", header: "Name" })

// After
col.text("name")
```

### Presets v2

Presets become configuration objects instead of components:

```tsx
export const crmDealsPreset = definePreset<Deal>({
  columns: [...],
  defaultGrouping: ["stage"],
  defaultColumnPinning: { left: ["select", "contact"], right: ["actions"] },
  enableCellEditing: true,
  enableRowExpand: true,
  views: [
    views.system("Pipeline", { grouping: ["stage"], sorting: [...] }),
    views.system("My deals", { filters: currentUserFilter }),
  ],
})

// Usage
<DataTable {...crmDealsPreset} data={deals} renderExpandedRow={...} />
```

`definePreset` is fully typed. Spread injects all props, dev overrides what they want.

### Feature matrix

| Feature | Activation prop | Dependencies |
|---------|----------------|--------------|
| Rich cell types | None (via `col.*`) | — |
| Grouping | `enableGrouping` | — |
| Aggregations | `groupAggregations` | grouping |
| Row expand | `enableRowExpand` + `renderExpandedRow` | — |
| Column pinning | `enableColumnPinning` | — |
| Cell editing keyboard | `enableCellEditing` | editable columns |
| Inline validation | `validate` on column | cell editing |
| Undo/Redo | Automatic | cell editing |
| Views with grouping | existing `views` | — |

Every feature is opt-in. Zero breaking change.

## Out of Scope

- **Virtualization** — Separate concern (tanstack-virtual), can be added later without API changes.
- **Server-side grouping** — Client-side first. `onGroupingChange` callback enables server-side later.
- **Drag & drop rows** — Handled by @dnd-kit elsewhere.
- **Column resize** — Separate scope, same approach as virtualization.
- **Multi-cell selection** (Excel-like range select) — Too complex for target use case.
- **Formulas** — Not a spreadsheet.
- **Cell-level permissions** — Editable yes/no per column, not per cell.
- **Collaborative editing** — No real-time multi-user.
