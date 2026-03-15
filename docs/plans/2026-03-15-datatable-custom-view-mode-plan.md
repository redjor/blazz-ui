# DataTable Custom View Mode — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `renderBody` render prop to DataTable so consumers can inject any custom view (grid, calendar, matrix, etc.) while keeping the toolbar, views, filters, and search.

**Architecture:** When `renderBody` is provided, it replaces the table/kanban body entirely. It receives a simplified data object with filtered/sorted rows from TanStack Table, so the custom view benefits from all DataTable features (views, filters, search, sorting) without reimplementing them. The toolbar renders normally above the custom body.

**Tech Stack:** React 19, TanStack Table, @blazz/pro DataTable

---

### Task 1: Add renderBody type

**Files:**
- Modify: `packages/pro/src/components/blocks/data-table/data-table.types.ts`

**Step 1: Add the prop**

After the `onKanbanMove` prop, add:

```typescript
	/** Replaces the entire table/kanban body with a custom view.
	 * Receives filtered & sorted rows from TanStack Table — the toolbar, views, filters, and search
	 * still work normally above. Use this for matrix grids, calendars, timelines, or any custom layout.
	 * When provided, mode/variant/renderRow/renderCard are ignored for the body. */
	renderBody?: (info: {
		rows: import("@tanstack/react-table").Row<TData>[]
		data: TData[]
		totalRows: number
		filteredRows: number
	}) => React.ReactNode
```

**Step 2: Type-check**

Run: `npx tsc --noEmit --project apps/docs/tsconfig.json 2>&1 | grep "data-table.types" | head -5`
Expected: No errors

**Step 3: Commit**

```bash
git add packages/pro/src/components/blocks/data-table/data-table.types.ts
git commit -m "feat(ui): add renderBody type to DataTableProps"
```

---

### Task 2: Wire renderBody in DataTable

**Files:**
- Modify: `packages/pro/src/components/blocks/data-table/data-table.tsx`

**Step 1: Destructure renderBody**

Add `renderBody` to the destructured props near `renderRow`, `renderCard`.

**Step 2: Render renderBody when provided**

Find the section after the toolbar/filters and before the kanban/table conditional. The current structure is:

```
toolbar
filters
toolbarBelowSlot
kanban (if mode=kanban)
table (if mode!=kanban)
pagination
footer
bulk bar
```

Add `renderBody` as highest priority — before kanban and table:

```tsx
{renderBody ? (
    renderBody({
        rows: table.getRowModel().rows,
        data: table.getRowModel().rows.map((r) => r.original),
        totalRows: data.length,
        filteredRows: table.getFilteredRowModel().rows.length,
    })
) : effectiveMode === "kanban" && kanbanData ? (
    <KanbanBoard ... />
) : (
    <div ... table wrapper ...>
        <Table ...>
        ...
    </div>
)}
```

Also hide pagination, footer, and bulk bar when renderBody is provided (same as kanban):

```tsx
{!renderBody && effectiveMode !== "kanban" && enablePagination && (...)}
{!renderBody && effectiveMode !== "kanban" && footerSlot}
{!renderBody && effectiveMode !== "kanban" && bulkActions && (...)}
```

**Step 3: Type-check**

Run: `npx tsc --noEmit --project apps/docs/tsconfig.json 2>&1 | grep "data-table.tsx" | head -5`
Expected: No errors

**Step 4: Commit**

```bash
git add packages/pro/src/components/blocks/data-table/data-table.tsx
git commit -m "feat(ui): render custom body when renderBody is provided"
```

---

### Task 3: Test with ops time tracking WeekGrid

**Files:**
- Modify: `apps/ops/app/(main)/time/_client.tsx`

**Step 1: Add a "grid" view mode**

The time tracking page already has week/month/list views. The "week" view currently renders a standalone `WeekGrid`. As a proof of concept, wire the week view through the DataTable using `renderBody`:

In the time page, when `view === "week"`, instead of rendering a separate `<WeekGrid>`, render the `<DataTable>` with `renderBody` that renders the `<WeekGrid>` inside:

```tsx
{view === "week" && (
    <DataTable
        data={weekEntries ?? []}
        columns={columns}
        toolbarLayout="stacked"
        enableSorting
        enableGlobalSearch
        searchPlaceholder="Rechercher…"
        locale="fr"
        renderBody={({ data }) => (
            <WeekGrid
                weekStart={weekStart}
                entries={data}
                projects={activeProjects ?? []}
                onCellClick={...}
                onCellDelete={...}
            />
        )}
    />
)}
```

This is optional — skip if the week view doesn't need toolbar integration. The point is to verify `renderBody` works.

**Step 2: Smoke test**

Verify that:
- The toolbar renders above the WeekGrid
- Search filters the entries passed to WeekGrid
- The WeekGrid renders normally

**Step 3: Commit (only if implemented)**

```bash
git add apps/ops/app/(main)/time/_client.tsx
git commit -m "feat(ops): proof of concept — WeekGrid via DataTable renderBody"
```

---

### Task 4: Update docs

**Files:**
- Modify: `apps/docs/src/routes/_docs/docs/blocks/data-table/composition.tsx`

**Step 1: Add renderBody section**

Add a new section after `footerSlot`:

```tsx
<DocSection id="render-body" title="renderBody">
    <p className="text-fg-muted mb-4">
        Remplace tout le corps (table, kanban) par un composant custom.
        Le toolbar, les vues, les filtres et le search fonctionnent normalement au-dessus.
        Idéal pour des grilles croisées, calendriers, timelines, ou toute mise en page custom.
    </p>
    <pre className="bg-surface-3 rounded-lg p-4 text-sm overflow-x-auto">
{`<DataTable
  data={entries}
  columns={columns}
  toolbarLayout="stacked"
  enableGlobalSearch
  enableAdvancedFilters
  renderBody={({ data, rows, filteredRows }) => (
    <WeekGrid
      entries={data}
      projects={projects}
    />
  )}
/>`}
    </pre>
    <p className="text-fg-muted mt-3 text-sm">
        Props reçus : <code>rows</code> (TanStack Row[]),{" "}
        <code>data</code> (TData[] des rows filtrées),{" "}
        <code>totalRows</code> (count total),{" "}
        <code>filteredRows</code> (count après filtres).
    </p>
</DocSection>
```

Also add to the toc:
```tsx
{ id: "render-body", title: "renderBody" },
```

**Step 2: Commit**

```bash
git add apps/docs/src/routes/_docs/docs/blocks/data-table/composition.tsx
git commit -m "docs: add renderBody section to DataTable composition docs"
```
