# Time Entries Server-Side Filtering Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the current "load everything, filter client-side" pattern with server-side filtering + Convex cursor-based pagination in the time entries list view.

**Architecture:** Add a new `listPaginated` Convex query using `paginationOptsValidator` + `by_date` index. Replace `useQuery(list)` with `usePaginatedQuery(listPaginated)` in the list view. Add a filter bar above the DataTable with dropdowns for project/status/billable and date inputs.

**Tech Stack:** Convex `usePaginatedQuery`, Convex `paginationOptsValidator`, `@blazz/ui` `Select`/`Input`/`Button`, TanStack DataTable (client-side sort + search on loaded subset)

---

## Task 1: Add `listPaginated` Convex query

**Files:**
- Modify: `apps/ops/convex/timeEntries.ts`

**Step 1: Add the import for paginationOptsValidator**

At the top of `apps/ops/convex/timeEntries.ts`, add `paginationOptsValidator` to the import:

```ts
import { v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { paginationOptsValidator } from "convex/server"
```

**Step 2: Add the `listPaginated` query at the end of the file**

```ts
export const listPaginated = query({
  args: {
    projectId: v.optional(v.id("projects")),
    status: v.optional(
      v.union(
        v.literal("draft"),
        v.literal("ready_to_invoice"),
        v.literal("invoiced"),
        v.literal("paid")
      )
    ),
    billable: v.optional(v.boolean()),
    from: v.optional(v.string()),
    to: v.optional(v.string()),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, { projectId, status, billable, from, to, paginationOpts }) => {
    const q = ctx.db.query("timeEntries").withIndex("by_date").order("desc")

    return q
      .filter((q) => {
        const conditions: ReturnType<typeof q.eq>[] = []
        if (projectId !== undefined) conditions.push(q.eq(q.field("projectId"), projectId))
        if (status !== undefined) conditions.push(q.eq(q.field("status"), status))
        if (billable !== undefined) conditions.push(q.eq(q.field("billable"), billable))
        if (from !== undefined) conditions.push(q.gte(q.field("date"), from))
        if (to !== undefined) conditions.push(q.lte(q.field("date"), to))
        return conditions.length > 0
          ? conditions.reduce((acc, cond) => q.and(acc, cond))
          : q.gt(q.field("_creationTime"), -1)
      })
      .paginate(paginationOpts)
  },
})
```

**Step 3: Verify TypeScript is happy**

Run from the monorepo root:
```bash
pnpm --filter @blazz/ops exec tsc --noEmit
```
Expected: no errors (or only pre-existing `ignoreBuildErrors` ones)

**Step 4: Commit**

```bash
git add apps/ops/convex/timeEntries.ts
git commit -m "feat(ops): add listPaginated Convex query for time entries"
```

---

## Task 2: Add filter state + fetch with `usePaginatedQuery` in the list view

**Files:**
- Modify: `apps/ops/app/(main)/time/page.tsx`

**Step 1: Replace the `allEntries` query with `usePaginatedQuery`**

At the top of the component, find:
```ts
import { useMutation, useQuery } from "convex/react"
```
Change to:
```ts
import { useMutation, usePaginatedQuery, useQuery } from "convex/react"
```

**Step 2: Add filter state variables**

Inside `TimePage`, after the existing `useState` declarations, add:

```ts
// Filter state for list view
const [filterProjectId, setFilterProjectId] = useState<Id<"projects"> | undefined>(undefined)
const [filterStatus, setFilterStatus] = useState<
  "draft" | "ready_to_invoice" | "invoiced" | "paid" | undefined
>(undefined)
const [filterBillable, setFilterBillable] = useState<boolean | undefined>(undefined)
const [filterFrom, setFilterFrom] = useState<string | undefined>(undefined)
const [filterTo, setFilterTo] = useState<string | undefined>(undefined)
```

**Step 3: Replace the `allEntries` query**

Remove:
```ts
const allEntries = useQuery(api.timeEntries.list, view === "list" ? {} : "skip")
```

Add:
```ts
const {
  results: allEntries,
  status: paginationStatus,
  loadMore,
} = usePaginatedQuery(
  api.timeEntries.listPaginated,
  view === "list"
    ? {
        projectId: filterProjectId,
        status: filterStatus,
        billable: filterBillable,
        from: filterFrom,
        to: filterTo,
      }
    : "skip",
  { initialNumItems: 25 }
)
```

Note: `usePaginatedQuery` with `"skip"` requires the same pattern as `useQuery`. When `view === "week"`, we skip to avoid fetching.

**Step 4: Also load all projects for the project filter dropdown**

The component already loads `activeProjects`. We need ALL projects (including paused/closed) for filtering historical entries. Add:

```ts
const allProjects = useQuery(api.projects.listAll)
```

**Step 5: Commit**

```bash
git add apps/ops/app/(main)/time/page.tsx
git commit -m "feat(ops): wire usePaginatedQuery for time entries list view"
```

---

## Task 3: Build the filter bar component

**Files:**
- Modify: `apps/ops/app/(main)/time/page.tsx`

**Step 1: Add Select import**

Ensure these are imported:
```ts
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { Input } from "@blazz/ui/components/ui/input"
import type { Id } from "@/convex/_generated/dataModel"
```

Note: `Id` is already imported in the file.

**Step 2: Add a `resetFilters` helper**

Inside `TimePage` (near the other handlers):

```ts
function resetFilters() {
  setFilterProjectId(undefined)
  setFilterStatus(undefined)
  setFilterBillable(undefined)
  setFilterFrom(undefined)
  setFilterTo(undefined)
}
const hasActiveFilters =
  filterProjectId !== undefined ||
  filterStatus !== undefined ||
  filterBillable !== undefined ||
  filterFrom !== undefined ||
  filterTo !== undefined
```

**Step 3: Add the filter bar JSX**

Find the `{view === "list" && (` block in the JSX. Replace the opening with:

```tsx
{view === "list" && (
  <div className="space-y-3">
    {/* Filter bar */}
    <div className="flex flex-wrap items-center gap-2">
      {/* Project filter */}
      <Select
        value={filterProjectId ?? ""}
        onValueChange={(val) =>
          setFilterProjectId(val === "" ? undefined : (val as Id<"projects">))
        }
        items={[
          { value: "", label: "Tous les projets" },
          ...(allProjects ?? []).map((p) => ({ value: p._id, label: p.name })),
        ]}
      >
        <SelectTrigger className="h-8 w-[180px] text-xs">
          <SelectValue placeholder="Tous les projets" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tous les projets</SelectItem>
          {(allProjects ?? []).map((p) => (
            <SelectItem key={p._id} value={p._id}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Status filter */}
      <Select
        value={filterStatus ?? ""}
        onValueChange={(val) =>
          setFilterStatus(
            val === ""
              ? undefined
              : (val as "draft" | "ready_to_invoice" | "invoiced" | "paid")
          )
        }
        items={[
          { value: "", label: "Tous les statuts" },
          { value: "draft", label: "Brouillon" },
          { value: "ready_to_invoice", label: "Prêt à facturer" },
          { value: "invoiced", label: "Facturé" },
          { value: "paid", label: "Payé" },
        ]}
      >
        <SelectTrigger className="h-8 w-[180px] text-xs">
          <SelectValue placeholder="Tous les statuts" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Tous les statuts</SelectItem>
          <SelectItem value="draft">Brouillon</SelectItem>
          <SelectItem value="ready_to_invoice">Prêt à facturer</SelectItem>
          <SelectItem value="invoiced">Facturé</SelectItem>
          <SelectItem value="paid">Payé</SelectItem>
        </SelectContent>
      </Select>

      {/* Billable filter */}
      <Select
        value={filterBillable === undefined ? "" : filterBillable ? "true" : "false"}
        onValueChange={(val) =>
          setFilterBillable(val === "" ? undefined : val === "true")
        }
        items={[
          { value: "", label: "Facturable / Non" },
          { value: "true", label: "Facturable" },
          { value: "false", label: "Non facturable" },
        ]}
      >
        <SelectTrigger className="h-8 w-[160px] text-xs">
          <SelectValue placeholder="Facturable / Non" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">Facturable / Non</SelectItem>
          <SelectItem value="true">Facturable</SelectItem>
          <SelectItem value="false">Non facturable</SelectItem>
        </SelectContent>
      </Select>

      {/* Date range */}
      <Input
        type="date"
        className="h-8 w-[140px] text-xs"
        value={filterFrom ?? ""}
        onChange={(e) => setFilterFrom(e.target.value === "" ? undefined : e.target.value)}
        placeholder="Du"
      />
      <Input
        type="date"
        className="h-8 w-[140px] text-xs"
        value={filterTo ?? ""}
        onChange={(e) => setFilterTo(e.target.value === "" ? undefined : e.target.value)}
        placeholder="Au"
      />

      {/* Reset */}
      {hasActiveFilters && (
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="h-8 px-2 text-xs text-muted-fg"
          onClick={resetFilters}
        >
          Réinitialiser
        </Button>
      )}
    </div>

    {/* DataTable */}
    <DataTable
      data={allEntries ?? []}
      columns={columns}
      rowActions={rowActions}
      isLoading={paginationStatus === "LoadingFirstPage"}
      enableSorting
      enableGlobalSearch
      enablePagination={false}
      searchPlaceholder="Rechercher…"
      locale="fr"
      defaultSorting={[{ id: "date", desc: true }]}
    />

    {/* Load more footer */}
    {paginationStatus !== "LoadingFirstPage" && (
      <div className="flex items-center justify-between pt-1 text-sm text-muted-fg">
        <span>{allEntries.length} entrée{allEntries.length !== 1 ? "s" : ""} affichée{allEntries.length !== 1 ? "s" : ""}</span>
        {paginationStatus === "CanLoadMore" && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="h-7 px-3 text-xs"
            onClick={() => loadMore(25)}
          >
            Charger 25 de plus
          </Button>
        )}
        {paginationStatus === "Exhausted" && (
          <span className="text-xs">Toutes les entrées affichées</span>
        )}
        {paginationStatus === "LoadingMore" && (
          <span className="text-xs text-muted-fg">Chargement…</span>
        )}
      </div>
    )}
  </div>
)}
```

Note: the old closing `)}` after `</DataTable>` must be removed since it's now inside the new `div.space-y-3`.

**Step 4: Remove old `enablePagination` and `pagination` props**

The old DataTable had:
```tsx
enablePagination
pagination={{ pageSize: 25 }}
```
These are replaced by `enablePagination={false}` in the new version above.

**Step 5: Commit**

```bash
git add apps/ops/app/(main)/time/page.tsx
git commit -m "feat(ops): add server-side filter bar + load more to time entries list"
```

---

## Task 4: Verify in the browser

**Step 1: Start the dev server**

```bash
pnpm dev:ops
```

Open `http://localhost:3120`, navigate to "Saisie des heures" → vue "Liste".

**Step 2: Verify filter bar renders**

- The 3 dropdowns and 2 date inputs should appear above the table
- Default state: all dropdowns show placeholder text, date inputs empty

**Step 3: Test each filter**

- Select a project → table refreshes showing only that project's entries
- Select a status → table shows only that status
- Set a date range → only entries in that range
- Select "Non facturable" → only non-billable entries
- "Réinitialiser" button appears when any filter is active and resets all filters

**Step 4: Test load more**

- If more than 25 entries exist: "Charger 25 de plus" button appears at the bottom
- Click it → 25 more entries load, button remains if more exist
- When all loaded → "Toutes les entrées affichées" message

**Step 5: Verify week view is unaffected**

Switch to vue "Semaine" → week grid still works normally.

---

## Notes

- The `list` query is unchanged — still used by `listForRecap` and other places
- Tri par date est fixé côté serveur (DESC). Le tri par d'autres colonnes dans le DataTable reste client-side sur les entrées déjà chargées
- La recherche texte (`enableGlobalSearch`) reste client-side sur le subset chargé
- `usePaginatedQuery` avec `"skip"` ne déclenche aucun réseau quand `view !== "list"`
