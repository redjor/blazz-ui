# Kanban Drag & Drop — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the ChevronLeft/ChevronRight buttons in the todos kanban with native HTML5 drag & drop using the `KanbanBoard` component from `@blazz/ui`.

**Architecture:** Refactor `apps/ops/app/todos/page.tsx` — replace the inline kanban grid with `<KanbanBoard>` from `@blazz/ui/components/blocks/kanban-board`. Strip chevron navigation out of `TodoCard`. Wire `onMove` to the existing `updateStatus` Convex mutation.

**Tech Stack:** `@blazz/ui/components/blocks/kanban-board` (KanbanBoard, KanbanBoardProps), Convex `useMutation(api.todos.updateStatus)`, React `useMemo`.

---

### Task 1: Refactor `TodosPage` kanban to use `<KanbanBoard>`

**Files:**
- Modify: `apps/ops/app/todos/page.tsx`

**Context:** `KanbanBoard` requires `T extends { id: string }`. Convex docs have `_id: Id<"todos">`, not `id`. We create a `TodoWithId` type and a `todoItems` memo that spreads each doc and adds `id: t._id`.

`COLUMNS` is already defined as `{ status: TodoStatus; label: string }[]`. `KanbanBoard` expects `KanbanColumn<T>` which is `{ id: string; label: string }`. We'll map COLUMNS to the right shape.

**Step 1: Add `KanbanBoard` import**

In `apps/ops/app/todos/page.tsx`, after the existing `@blazz/ui` imports, add:

```tsx
import { KanbanBoard } from "@blazz/ui/components/blocks/kanban-board"
```

**Step 2: Add `updateStatus` mutation and `todoItems` memo in `TodosPage`**

After `const projectList = projects ?? []`, add:

```tsx
const updateStatus = useMutation(api.todos.updateStatus)

type TodoWithId = Doc<"todos"> & { id: string }
const todoItems = useMemo<TodoWithId[]>(
  () => (todos ?? []).map((t) => ({ ...t, id: t._id })),
  [todos]
)
```

**Step 3: Replace the inline kanban block with `<KanbanBoard>`**

In `TodosPage`, find the kanban else-branch (the `<div className="grid grid-cols-4 gap-4 items-start">` block with the manual column loop). Replace it — and only the kanban grid `div`, keeping the loading/empty conditions — with `<KanbanBoard>`.

The full kanban section (inside the `viewMode === "kanban"` branch) becomes:

```tsx
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
    <KanbanBoard
      columns={COLUMNS.map((col) => ({ id: col.status, label: col.label }))}
      items={todoItems}
      getColumnId={(t) => t.status}
      onMove={async (id, _from, to) => {
        await updateStatus({ id: id as Id<"todos">, status: to as TodoStatus })
      }}
      renderColumnHeader={(col, colItems) => (
        <div className="flex items-center justify-between px-3 py-2 border-b border-edge">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-fg">{col.label}</span>
            {colItems.length > 0 && (
              <Badge variant="secondary" className="text-xs px-1.5 py-0 tabular-nums">
                {colItems.length}
              </Badge>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setAddFor(col.id as TodoStatus)}
            aria-label={`Ajouter dans ${col.label}`}
          >
            <Plus className="size-3.5" />
          </Button>
        </div>
      )}
      renderCard={(todo) => <TodoCard todo={todo} projects={projectList} />}
    />
  )}
</>
```

**Step 4: Verify the file looks correct**

Run: `grep -n "KanbanBoard\|grid-cols-4" apps/ops/app/todos/page.tsx`

Expected: `KanbanBoard` appears (import + usage), `grid-cols-4` appears only in the loading skeleton (not the kanban grid).

**Step 5: Commit**

```bash
git add apps/ops/app/todos/page.tsx
git commit -m "feat(ops): replace kanban grid with KanbanBoard component"
```

---

### Task 2: Clean up `TodoCard` — remove chevron navigation

**Files:**
- Modify: `apps/ops/app/todos/page.tsx`

**Context:** `TodoCard` currently calls `useMutation(api.todos.updateStatus)` and renders `ChevronLeft`/`ChevronRight` buttons. These are replaced by DnD. Remove them. Also remove the top-level helpers `STATUS_ORDER`, `getPrev`, `getNext` which are no longer needed.

**Step 1: Remove `STATUS_ORDER`, `getPrev`, `getNext`**

Delete these lines from the file (lines 39–49 in the current file):

```tsx
const STATUS_ORDER: TodoStatus[] = ["triage", "todo", "in_progress", "done"]

function getPrev(status: TodoStatus): TodoStatus | null {
	const idx = STATUS_ORDER.indexOf(status)
	return idx > 0 ? STATUS_ORDER[idx - 1] : null
}

function getNext(status: TodoStatus): TodoStatus | null {
	const idx = STATUS_ORDER.indexOf(status)
	return idx < STATUS_ORDER.length - 1 ? STATUS_ORDER[idx + 1] : null
}
```

**Step 2: Rewrite `TodoCard` without chevrons**

Replace the entire `TodoCard` function with:

```tsx
function TodoCard({ todo, projects }: { todo: Doc<"todos">; projects: Doc<"projects">[] }) {
	const remove = useMutation(api.todos.remove)
	const [editing, setEditing] = useState(false)

	return (
		<>
			<div className={`p-3 rounded-md border border-edge bg-raised space-y-2 ${todo.status === "done" ? "opacity-60" : ""}`}>
				<p className="text-sm text-fg leading-snug">{todo.text}</p>
				{todo.description && (
					<p className="text-xs text-fg-muted leading-relaxed whitespace-pre-wrap">{todo.description}</p>
				)}
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-1.5">
						<PriorityIcon priority={todo.priority} />
						{todo.projectId && (() => {
							const proj = projects.find((p) => p._id === todo.projectId)
							return proj ? (
								<Badge variant="secondary" className="text-xs px-1.5 py-0 max-w-[80px] truncate">{proj.name}</Badge>
							) : null
						})()}
					</div>
					<div className="flex items-center gap-1">
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => setEditing(true)}
							aria-label="Modifier"
						>
							<Pencil className="size-3.5" />
						</Button>
						<Button
							variant="ghost"
							size="icon-sm"
							onClick={() => remove({ id: todo._id })}
							aria-label="Supprimer"
							className="text-fg-muted hover:text-destructive"
						>
							<Trash2 className="size-3.5" />
						</Button>
					</div>
				</div>
			</div>
			<EditTodoDialog todo={todo} open={editing} onOpenChange={setEditing} projects={projects} />
		</>
	)
}
```

**Step 3: Remove unused imports**

Remove `ChevronLeft`, `ChevronRight` from the lucide-react import line:

```tsx
// Before
import { CheckSquare, ChevronLeft, ChevronRight, Columns3, Flag, LayoutList, Pencil, Plus, Trash2 } from "lucide-react"

// After
import { CheckSquare, Columns3, Flag, LayoutList, Pencil, Plus, Trash2 } from "lucide-react"
```

**Step 4: Verify no TypeScript issues**

Run: `grep -n "ChevronLeft\|ChevronRight\|updateStatus\|getPrev\|getNext\|STATUS_ORDER" apps/ops/app/todos/page.tsx`

Expected: only `updateStatus` appears — in `TodosPage` where it's called in `onMove`. `ChevronLeft`, `ChevronRight`, `getPrev`, `getNext`, `STATUS_ORDER` should have zero matches.

**Step 5: Commit**

```bash
git add apps/ops/app/todos/page.tsx
git commit -m "feat(ops): remove chevron navigation from TodoCard, DnD handles column moves"
```

---

### Task 3: Verify in browser

**Steps:**
1. Open `http://localhost:3120/todos`
2. Default view = kanban — columns render with header (label + count + + button)
3. Drag a card from one column and drop it on another → status updates (Convex real-time)
4. Card being dragged shows opacity 40%, target column highlights
5. Click "+" in a column header → `AddTodoDialog` opens with correct `defaultStatus`
6. Click pencil on a card → `EditTodoDialog` opens
7. No chevron buttons visible anywhere on cards
8. Switch to list view → DataTable works as before

**No commit needed for this task.**
