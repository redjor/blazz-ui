# Todos: Priority Levels & Project Linking — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add priority levels (Urgent/High/Normal/Low) and project linking to the todos kanban board in `apps/ops`.

**Architecture:** Priority is a new optional field on the `todos` Convex table. Project linking already exists in the schema — we only need to expose it in the UI. Both fields are editable in the Create and Edit dialogs. The card shows a colored Flag icon for non-normal priorities and a project badge.

**Tech Stack:** Convex (schema + mutations), React (client component), @blazz/ui Select + Badge primitives, Base UI (no `asChild`, use `render` prop on triggers).

---

### Task 1: Schema — Add priority field to todos

**Files:**
- Modify: `apps/ops/convex/schema.ts`

**Step 1: Add priority union to the todos table definition**

In `apps/ops/convex/schema.ts`, add `priority` inside the `todos` table definition (after `projectId`):

```ts
todos: defineTable({
  text: v.string(),
  description: v.optional(v.string()),
  status: v.union(
    v.literal("triage"),
    v.literal("todo"),
    v.literal("in_progress"),
    v.literal("done")
  ),
  source: v.union(v.literal("app"), v.literal("telegram")),
  projectId: v.optional(v.id("projects")),
  priority: v.optional(v.union(
    v.literal("urgent"),
    v.literal("high"),
    v.literal("normal"),
    v.literal("low")
  )),
  createdAt: v.number(),
})
  .index("by_status", ["status"]),
```

**Step 2: Verify Convex picks it up**

Run: `pnpm dev:ops` (or just check that the Convex dev server in the background re-generates types without errors — no migration needed for optional fields).

**Step 3: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add priority field to todos schema"
```

---

### Task 2: Backend — Update create + add updatePriority mutation

**Files:**
- Modify: `apps/ops/convex/todos.ts`

**Step 1: Add `priority` arg to the `create` mutation**

In `apps/ops/convex/todos.ts`, update the `create` mutation args and handler:

```ts
export const create = mutation({
  args: {
    text: v.string(),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("triage"),
        v.literal("todo"),
        v.literal("in_progress"),
        v.literal("done")
      )
    ),
    source: v.optional(v.union(v.literal("app"), v.literal("telegram"))),
    projectId: v.optional(v.id("projects")),
    priority: v.optional(v.union(
      v.literal("urgent"),
      v.literal("high"),
      v.literal("normal"),
      v.literal("low")
    )),
  },
  handler: async (ctx, { text, description, status = "triage", source = "app", projectId, priority }) => {
    return ctx.db.insert("todos", {
      text,
      description,
      status,
      source,
      projectId,
      priority,
      createdAt: Date.now(),
    })
  },
})
```

**Step 2: Add `updatePriority` mutation at the bottom of the file**

```ts
export const updatePriority = mutation({
  args: {
    id: v.id("todos"),
    priority: v.optional(v.union(
      v.literal("urgent"),
      v.literal("high"),
      v.literal("normal"),
      v.literal("low")
    )),
  },
  handler: async (ctx, { id, priority }) => ctx.db.patch(id, { priority }),
})
```

**Step 3: Commit**

```bash
git add apps/ops/convex/todos.ts
git commit -m "feat(ops): add priority to create mutation and add updatePriority"
```

---

### Task 3: UI — Priority icon on TodoCard

**Files:**
- Modify: `apps/ops/app/todos/page.tsx`

**Step 1: Add priority icon helper above `TodoCard`**

Add this constant map and helper component before the `TodoCard` function:

```tsx
const PRIORITY_ICON: Record<string, { color: string }> = {
  urgent: { color: "text-destructive" },
  high: { color: "text-orange-500" },
  low: { color: "text-fg-muted" },
}

function PriorityIcon({ priority }: { priority?: string }) {
  if (!priority || priority === "normal") return null
  const config = PRIORITY_ICON[priority]
  if (!config) return null
  return <Flag className={`size-3 shrink-0 ${config.color}`} />
}
```

Also add `Flag` to the lucide-react import line:
```tsx
import { CheckSquare, ChevronLeft, ChevronRight, Flag, Pencil, Plus, Trash2 } from "lucide-react"
```

**Step 2: Render PriorityIcon in TodoCard**

In the `TodoCard` function, inside the `<div className="flex items-center gap-1.5">` (where the Telegram badge is), add the icon before the badge:

```tsx
<div className="flex items-center gap-1.5">
  <PriorityIcon priority={todo.priority} />
  {todo.source === "telegram" && (
    <Badge variant="secondary" className="text-xs px-1.5 py-0">Telegram</Badge>
  )}
  {todo.projectId && projects && (
    (() => {
      const proj = projects.find((p) => p._id === todo.projectId)
      return proj ? (
        <Badge variant="secondary" className="text-xs px-1.5 py-0 max-w-[80px] truncate">{proj.name}</Badge>
      ) : null
    })()
  )}
</div>
```

Note: `projects` will come from the parent `TodosPage` via props — see Task 5.

**Step 3: Pass projects to TodoCard**

Update `TodoCard` signature to accept `projects`:

```tsx
function TodoCard({ todo, projects }: { todo: Doc<"todos">; projects: Doc<"projects">[] }) {
```

**Step 4: Commit**

```bash
git add apps/ops/app/todos/page.tsx
git commit -m "feat(ops): show priority icon and project badge on todo card"
```

---

### Task 4: UI — AddTodoDialog with priority + project select

**Files:**
- Modify: `apps/ops/app/todos/page.tsx`

**Step 1: Add Select imports**

Add to the import block at the top:

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@blazz/ui/components/ui/select"
```

**Step 2: Rewrite `AddTodoDialog`**

Replace the existing `AddTodoDialog` function with:

```tsx
function AddTodoDialog({
  defaultStatus,
  open,
  onOpenChange,
  projects,
}: {
  defaultStatus: TodoStatus
  open: boolean
  onOpenChange: (v: boolean) => void
  projects: Doc<"projects">[]
}) {
  const create = useMutation(api.todos.create)
  const [text, setText] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState<string>("normal")
  const [projectId, setProjectId] = useState<string | undefined>(undefined)

  function reset() {
    setText("")
    setDescription("")
    setPriority("normal")
    setProjectId(undefined)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    await create({
      text: text.trim(),
      description: description.trim() || undefined,
      status: defaultStatus,
      source: "app",
      priority: priority as "urgent" | "high" | "normal" | "low",
      projectId: projectId as Id<"projects"> | undefined,
    })
    reset()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v) }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nouveau todo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            autoFocus
            placeholder="Titre"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Textarea
            placeholder="Description (optionnelle)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={projectId ?? ""} onValueChange={(v) => setProjectId(v || undefined)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Projet (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={!text.trim()}>
              Ajouter
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

Note: you'll need to import `Id` from `@/convex/_generated/dataModel`:
```tsx
import type { Doc, Id } from "@/convex/_generated/dataModel"
```

**Step 3: Commit**

```bash
git add apps/ops/app/todos/page.tsx
git commit -m "feat(ops): add priority and project select to AddTodoDialog"
```

---

### Task 5: UI — EditTodoDialog with priority + project select, wire up TodosPage

**Files:**
- Modify: `apps/ops/app/todos/page.tsx`

**Step 1: Rewrite `EditTodoDialog`**

Replace the existing `EditTodoDialog` with:

```tsx
function EditTodoDialog({
  todo,
  open,
  onOpenChange,
  projects,
}: {
  todo: Doc<"todos">
  open: boolean
  onOpenChange: (v: boolean) => void
  projects: Doc<"projects">[]
}) {
  const updateText = useMutation(api.todos.updateText)
  const updatePriority = useMutation(api.todos.updatePriority)
  const linkProject = useMutation(api.todos.linkProject)
  const [text, setText] = useState(todo.text)
  const [description, setDescription] = useState(todo.description ?? "")
  const [priority, setPriority] = useState(todo.priority ?? "normal")
  const [projectId, setProjectId] = useState(todo.projectId ?? "")

  function resetToTodo() {
    setText(todo.text)
    setDescription(todo.description ?? "")
    setPriority(todo.priority ?? "normal")
    setProjectId(todo.projectId ?? "")
  }

  const unchanged =
    text.trim() === todo.text &&
    description.trim() === (todo.description ?? "") &&
    priority === (todo.priority ?? "normal") &&
    (projectId || undefined) === todo.projectId

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!text.trim()) return
    const promises: Promise<unknown>[] = []
    if (text.trim() !== todo.text || description.trim() !== (todo.description ?? "")) {
      promises.push(updateText({ id: todo._id, text: text.trim(), description: description.trim() || undefined }))
    }
    if (priority !== (todo.priority ?? "normal")) {
      promises.push(updatePriority({ id: todo._id, priority: priority as "urgent" | "high" | "normal" | "low" }))
    }
    const newProjectId = projectId || undefined
    if (newProjectId !== todo.projectId) {
      promises.push(linkProject({ id: todo._id, projectId: newProjectId as Id<"projects"> | undefined }))
    }
    await Promise.all(promises)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) resetToTodo(); onOpenChange(v) }}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le todo</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            autoFocus
            placeholder="Titre"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <Textarea
            placeholder="Description (optionnelle)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
          <div className="flex gap-2">
            <Select value={priority} onValueChange={setPriority}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Priorité" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="urgent">Urgent</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
            <Select value={projectId} onValueChange={setProjectId}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Projet (optionnel)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">Aucun</SelectItem>
                {projects.map((p) => (
                  <SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={!text.trim() || unchanged}>
              Sauvegarder
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

**Step 2: Update `TodosPage` to query active projects and pass down**

In `TodosPage`, add a projects query and pass it to dialogs and cards:

```tsx
export default function TodosPage() {
  const todos = useQuery(api.todos.list, {})
  const projects = useQuery(api.projects.listActive, {})
  const [addFor, setAddFor] = useState<TodoStatus | null>(null)

  const projectList = projects ?? []

  return (
    <OpsFrame>
      <div className="p-6 space-y-6">
        <PageHeader title="Todos" description="Capturez et organisez vos tâches" />

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
      </div>

      {addFor && (
        <AddTodoDialog
          defaultStatus={addFor}
          open={true}
          onOpenChange={(v) => !v && setAddFor(null)}
          projects={projectList}
        />
      )}
    </OpsFrame>
  )
}
```

Also add the `api.projects` import:
```tsx
import { api } from "@/convex/_generated/api"
// api.projects.listActive is already available
```

**Step 3: Verify in browser**

- Open `/todos` in the app
- Create a todo — verify priority select and project select appear
- Edit a todo — verify both selects pre-fill correctly
- Urgent todo → shows red Flag icon on card
- High todo → shows orange Flag icon
- Normal/Low todo → no icon (normal) or gray flag (low)
- Project-linked todo → shows project name badge on card

**Step 4: Commit**

```bash
git add apps/ops/app/todos/page.tsx
git commit -m "feat(ops): add priority and project linking to todos UI"
```
