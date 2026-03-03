# Todos List View — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a DataTable list view to the todos page with a kanban/list toggle, following the linear-issues preset pattern.

**Architecture:** Create `apps/ops/components/todos-preset.tsx` (same pattern as `linear-issues.tsx`). Update `apps/ops/app/todos/page.tsx` to add a view toggle and render `<DataTable>` conditionally. The `EditTodoDialog` already exists and is reused for the edit row action. Convex data flows from `TodosPage` → preset config → DataTable.

**Tech Stack:** `@blazz/ui/components/blocks/data-table` (DataTable, DataTableColumnDef, col, createCRUDActions, createBulkActions, createStatusViews), TanStack Table, Convex `useQuery`, Lucide icons (`Columns3`, `LayoutList`).

**Blazz-UI rules in effect:**
- Density: 13px, row-height 40px
- Priority: colored vertical bar 3×14px, no label (Tufte)
- Status: dot 6px + text
- Missing values: `—` (em dash)
- Actions: ⋯ menu at hover only

---

### Task 1: Create `todos-preset.tsx`

**Files:**
- Create: `apps/ops/components/todos-preset.tsx`

**Context:** This file is the DataTable preset for todos. It follows exactly the pattern of `packages/ui/src/components/blocks/data-table/presets/linear-issues.tsx`. The `Todo` type comes from Convex's generated `Doc<"todos">` — but we define a local interface to avoid coupling to Convex types in the preset.

**Step 1: Create the file with imports and types**

```tsx
'use client'

import type { BulkAction, DataTableColumnDef, DataTableView, RowAction } from '@blazz/ui/components/blocks/data-table'
import { DataTableColumnHeader } from '@blazz/ui/components/blocks/data-table/data-table-column-header'
import { col } from '@blazz/ui/components/blocks/data-table/factories/col'
import { createStatusViews } from '@blazz/ui/components/blocks/data-table/factories/view-builders'
import { createCRUDActions, createBulkActions } from '@blazz/ui/components/blocks/data-table/factories/action-builders'

// Local type — mirrors Doc<"todos"> fields we need
export interface Todo {
  _id: string
  text: string
  description?: string
  status: "triage" | "todo" | "in_progress" | "done"
  priority?: "urgent" | "high" | "normal" | "low"
  projectId?: string
  createdAt: number
  // resolved from projects query
  projectName?: string
}

export interface TodosPresetConfig {
  onEdit?: (todo: Todo) => void
  onDelete?: (todo: Todo) => void
  onBulkDelete?: (todos: Todo[]) => void
}

export interface TodosPreset {
  columns: DataTableColumnDef<Todo>[]
  views: DataTableView[]
  rowActions: RowAction<Todo>[]
  bulkActions: BulkAction<Todo>[]
}
```

**Step 2: Add color maps**

```tsx
const priorityBarMap: Record<string, string> = {
  urgent: 'bg-destructive',
  high: 'bg-orange-500',
  normal: 'bg-edge',
  low: 'bg-fg-muted/30',
}

const statusDotMap: Record<string, string> = {
  triage: 'bg-zinc-400',
  todo: 'bg-zinc-500',
  in_progress: 'bg-yellow-500',
  done: 'bg-green-500',
}

const statusLabelMap: Record<string, string> = {
  triage: 'Triage',
  todo: 'Todo',
  in_progress: 'En cours',
  done: 'Fait',
}
```

**Step 3: Add `createTodosPreset` function with columns**

```tsx
export function createTodosPreset(config: TodosPresetConfig = {}): TodosPreset {
  const { onEdit, onDelete, onBulkDelete } = config

  const columns: DataTableColumnDef<Todo>[] = [
    // Priority — colored vertical bar, no label (Tufte: data-ink)
    {
      accessorKey: 'priority',
      header: () => null,
      cell: ({ row }) => {
        const value = (row.getValue('priority') as string) ?? 'normal'
        const barClass = priorityBarMap[value] ?? 'bg-edge'
        return (
          <div className="flex items-center justify-center">
            <span className={`h-3.5 w-0.5 shrink-0 rounded-sm ${barClass}`} />
          </div>
        )
      },
      enableSorting: true,
      enableHiding: false,
      size: 24,
    } as DataTableColumnDef<Todo>,

    // Title + description (two-lines cell)
    {
      accessorKey: 'text',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Tâche" />,
      cell: ({ row }) => {
        const text = row.getValue('text') as string
        const description = row.original.description
        return (
          <div className="flex flex-col gap-0.5 min-w-0">
            <span className="text-sm font-medium text-fg truncate">{text}</span>
            {description && (
              <span className="text-xs text-fg-muted truncate">{description}</span>
            )}
          </div>
        )
      },
      enableSorting: true,
    } as DataTableColumnDef<Todo>,

    // Status — dot + label
    {
      accessorKey: 'status',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Statut" />,
      cell: ({ row }) => {
        const value = row.getValue('status') as string
        const dotClass = statusDotMap[value] ?? 'bg-zinc-400'
        const label = statusLabelMap[value] ?? value
        return (
          <div className="flex items-center gap-1.5">
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${dotClass}`} />
            <span className="text-sm text-fg-muted">{label}</span>
          </div>
        )
      },
      enableSorting: true,
      size: 120,
    } as DataTableColumnDef<Todo>,

    // Project name — resolved, em-dash if absent
    {
      accessorKey: 'projectName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Projet" />,
      cell: ({ row }) => {
        const name = row.getValue('projectName') as string | undefined
        return (
          <span className={`text-sm ${name ? 'text-fg-muted' : 'text-fg-muted/40'}`}>
            {name ?? '—'}
          </span>
        )
      },
      enableSorting: true,
      size: 160,
    } as DataTableColumnDef<Todo>,

    // Created at — relative date fr-FR
    col.relativeDate<Todo>('createdAt', {
      title: 'Créé',
      locale: 'fr-FR',
    }),
  ]

  const views = createStatusViews({
    column: 'status',
    statuses: [
      { id: 'triage', name: 'Triage', value: 'triage' },
      { id: 'todo', name: 'Todo', value: 'todo' },
      { id: 'in_progress', name: 'En cours', value: 'in_progress' },
      { id: 'done', name: 'Fait', value: 'done' },
    ],
    allViewName: 'Tous',
  })

  const rowActions = createCRUDActions<Todo>({
    onEdit,
    onDelete,
    deleteConfirmation: (row) => `Supprimer "${row.original.text}" ?`,
    labels: { edit: 'Modifier', delete: 'Supprimer' },
  })

  const bulkActions = createBulkActions<Todo>({
    onDelete: onBulkDelete,
    deleteConfirmation: (count) => `Supprimer ${count} todo(s) ?`,
    labels: { delete: 'Supprimer la sélection' },
  })

  return { columns, views, rowActions, bulkActions }
}
```

**Step 4: Verify the file structure looks correct**

Run: `ls apps/ops/components/`
Expected: `todos-preset.tsx` present alongside other component files.

**Step 5: Commit**

```bash
git add apps/ops/components/todos-preset.tsx
git commit -m "feat(ops): add todos DataTable preset"
```

---

### Task 2: Add view toggle + DataTable to `TodosPage`

**Files:**
- Modify: `apps/ops/app/todos/page.tsx`

**Context:** `TodosPage` currently renders a kanban board. We need to:
1. Add `viewMode` state (`"kanban" | "list"`)
2. Add toggle buttons in the `PageHeader` actions area
3. Import `DataTable` and the new preset
4. Build `todoRows` (todos with `projectName` resolved) for the list view
5. Render `<DataTable>` when `viewMode === "list"`, kanban otherwise
6. Wire `onEdit` → open `EditTodoDialog`, `onDelete` → call `remove` mutation

The `EditTodoDialog` is already defined earlier in the file — we use a new state `editingTodo: Doc<"todos"> | null` to control it from the page level (alongside the existing per-card `editing` state in `TodoCard`).

**Step 1: Add new imports at the top of `page.tsx`**

After existing imports, add:
```tsx
import { DataTable } from "@blazz/ui/components/blocks/data-table"
import type { DataTableView } from "@blazz/ui/components/blocks/data-table"
import { Columns3, LayoutList } from "lucide-react"
import { createTodosPreset } from "@/components/todos-preset"
import type { Todo } from "@/components/todos-preset"
```

Also add `useMemo` to the React import:
```tsx
import { useMemo, useState } from "react"
```

**Step 2: Add state and derived data in `TodosPage`**

Inside `TodosPage`, after existing state declarations, add:
```tsx
const remove = useMutation(api.todos.remove)
const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")
const [activeView, setActiveView] = useState<DataTableView | null>(null)
const [editingTodo, setEditingTodo] = useState<Doc<"todos"> | null>(null)

// Build rows with resolved project names for the list view
const todoRows = useMemo<Todo[]>(() => {
  if (!todos) return []
  return todos.map((t) => ({
    ...t,
    projectName: projectList.find((p) => p._id === t.projectId)?.name,
  }))
}, [todos, projectList])

// Build preset once (stable reference via useMemo)
const preset = useMemo(() => createTodosPreset({
  onEdit: (todo) => {
    const doc = todos?.find((t) => t._id === todo._id)
    if (doc) setEditingTodo(doc)
  },
  onDelete: async (todo) => {
    await remove({ id: todo._id as any })
  },
  onBulkDelete: async (items) => {
    await Promise.all(items.map((t) => remove({ id: t._id as any })))
  },
}), [todos, remove])
```

**Step 3: Update `PageHeader` to include view toggle**

Find:
```tsx
<PageHeader title="Todos" description="Capturez et organisez vos tâches" />
```

Replace with:
```tsx
<PageHeader
  title="Todos"
  description="Capturez et organisez vos tâches"
  actions={
    <div className="flex items-center gap-1 rounded-md border border-edge p-0.5">
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setViewMode("kanban")}
        className={viewMode === "kanban" ? "bg-raised" : ""}
        aria-label="Vue kanban"
      >
        <Columns3 className="size-3.5" />
      </Button>
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setViewMode("list")}
        className={viewMode === "list" ? "bg-raised" : ""}
        aria-label="Vue liste"
      >
        <LayoutList className="size-3.5" />
      </Button>
    </div>
  }
/>
```

**Step 4: Add list view rendering**

After the existing kanban block (inside `<div className="p-6 space-y-6">`), add the list view rendering. The full content area becomes a conditional:

Replace the section that renders the kanban/empty/loading states:

```tsx
{viewMode === "list" ? (
  <DataTable
    data={todoRows}
    columns={preset.columns}
    views={preset.views}
    activeView={activeView}
    onViewChange={setActiveView}
    rowActions={preset.rowActions}
    bulkActions={preset.bulkActions}
    enableRowSelection
    enableSorting
    getRowId={(row) => row._id}
  />
) : (
  /* existing kanban block — todos === undefined ? loading : todos.length === 0 ? empty : kanban grid */
  <>
    {todos === undefined ? (
      <div className="grid grid-cols-4 gap-4">
        {COLUMNS.map((col) => (
          <div key={col.status} className="space-y-3">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-20 w-full rounded-md" />
            <Skeleton className="h-20 w-full rounded-md" />
          </div>
        ))}
      </div>
    ) : todos.length === 0 ? (
      <Empty
        icon={CheckSquare}
        title="Aucun todo"
        description="Créez un todo depuis l'app ou envoyez un message à votre bot Telegram"
        action={{ label: "Nouveau todo", onClick: () => setAddFor("triage"), icon: Plus }}
      />
    ) : (
      <div className="grid grid-cols-4 gap-4 items-start">
        {COLUMNS.map((col) => {
          const colTodos = todos.filter((t) => t.status === col.status)
          return (
            <div key={col.status} className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-fg">{col.label}</span>
                  {colTodos.length > 0 && (
                    <Badge variant="secondary" className="text-xs px-1.5 py-0 tabular-nums">
                      {colTodos.length}
                    </Badge>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  onClick={() => setAddFor(col.status)}
                  aria-label={`Ajouter dans ${col.label}`}
                >
                  <Plus className="size-3.5" />
                </Button>
              </div>
              <div className="space-y-2">
                {colTodos.length === 0 ? (
                  <div className="border border-dashed border-edge rounded-md p-4 text-xs text-fg-muted text-center">
                    Vide
                  </div>
                ) : (
                  colTodos.map((todo) => <TodoCard key={todo._id} todo={todo} projects={projectList} />)
                )}
              </div>
            </div>
          )
        })}
      </div>
    )}
  </>
)}
```

**Step 5: Add `editingTodo` dialog at bottom of JSX**

After the `{addFor && <AddTodoDialog ... />}` block, add:
```tsx
{editingTodo && (
  <EditTodoDialog
    todo={editingTodo}
    open={true}
    onOpenChange={(v) => !v && setEditingTodo(null)}
    projects={projectList}
  />
)}
```

**Step 6: Verify no TypeScript issues**

Check the `remove` mutation import — it's already called inside `TodoCard`. In `TodosPage` we now also call it, so we need `useMutation(api.todos.remove)` at the page level. This is a new call — make sure it's added in the state block (Step 2 above already includes it).

**Step 7: Commit**

```bash
git add apps/ops/app/todos/page.tsx
git commit -m "feat(ops): add list view toggle and DataTable to todos page"
```

---

### Task 3: Verify in browser

**Steps:**
1. Open `http://localhost:3120/todos`
2. Default view = kanban — should look identical to before
3. Click the `LayoutList` toggle button → switches to list view
4. Verify columns: priority bar, title+description, status dot+label, project name, createdAt
5. Click the status view tabs (Tous / Triage / Todo / En cours / Fait) — filters the rows
6. Click ⋯ on a row → "Modifier" opens `EditTodoDialog`, "Supprimer" shows confirm dialog
7. Click `Columns3` toggle → back to kanban, everything still works

**No commit needed for this task — it's verification only.**
