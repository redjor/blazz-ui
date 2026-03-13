# Todo Detail Page — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Replace the modal-based todo editing with a full detail page at `/todos/[id]` featuring a Tiptap rich text editor and a Linear-inspired 2-column layout.

**Architecture:** New dynamic route `app/(main)/todos/[id]/page.tsx` with a main column (title + Tiptap editor) and a sidebar column (metadata fields). New Convex query `get` to fetch a single todo by ID. All click handlers on todos (kanban, list, today page) switch from opening a dialog to `router.push`.

**Tech Stack:** Tiptap (WYSIWYG), Convex (backend), Next.js dynamic route, existing @blazz/ui components

---

### Task 1: Install Tiptap dependencies

**Step 1: Install packages**

Run:
```bash
cd apps/ops && pnpm add @tiptap/react @tiptap/starter-kit @tiptap/extension-task-list @tiptap/extension-task-item @tiptap/extension-placeholder
```

**Step 2: Verify installation**

Run: `cd apps/ops && cat package.json | grep tiptap`
Expected: 5 tiptap packages listed

**Step 3: Commit**

```bash
git add apps/ops/package.json apps/ops/pnpm-lock.yaml pnpm-lock.yaml
git commit -m "feat(ops): add tiptap dependencies for todo rich text editor"
```

---

### Task 2: Add Convex `get` query

**Files:**
- Modify: `apps/ops/convex/todos.ts`

**Step 1: Add get query**

Add after the `list` query (line 32):

```typescript
export const get = query({
	args: { id: v.id("todos") },
	handler: async (ctx, { id }) => {
		return ctx.db.get(id)
	},
})
```

**Step 2: Verify Convex syncs**

Run: `cd apps/ops && npx convex dev --once`
Expected: No errors, function registered

**Step 3: Commit**

```bash
git add apps/ops/convex/todos.ts
git commit -m "feat(ops): add todo get query for detail page"
```

---

### Task 3: Create the Tiptap editor component

**Files:**
- Create: `apps/ops/components/tiptap-editor.tsx`

**Step 1: Create the component**

```tsx
"use client"

import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TaskList from "@tiptap/extension-task-list"
import TaskItem from "@tiptap/extension-task-item"
import Placeholder from "@tiptap/extension-placeholder"
import {
	Bold,
	Italic,
	List,
	ListOrdered,
	Heading2,
	Code,
	CheckSquare,
	Undo,
	Redo,
} from "lucide-react"
import { useCallback, useEffect } from "react"

function ToolbarButton({
	onClick,
	active,
	children,
	title,
}: {
	onClick: () => void
	active?: boolean
	children: React.ReactNode
	title: string
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			title={title}
			className={`p-1.5 rounded-md transition-colors ${
				active ? "bg-raised text-fg" : "text-fg-muted hover:text-fg hover:bg-raised"
			}`}
		>
			{children}
		</button>
	)
}

export function TiptapEditor({
	content,
	onUpdate,
	placeholder = "Ajoutez une description…",
}: {
	content: string
	onUpdate: (html: string) => void
	placeholder?: string
}) {
	const editor = useEditor({
		extensions: [
			StarterKit.configure({
				heading: { levels: [2, 3] },
			}),
			TaskList,
			TaskItem.configure({ nested: true }),
			Placeholder.configure({ placeholder }),
		],
		content,
		editorProps: {
			attributes: {
				class: "prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[200px] px-4 py-3",
			},
		},
		onUpdate: ({ editor }) => {
			onUpdate(editor.getHTML())
		},
	})

	// Sync content when it changes externally (e.g., initial load)
	useEffect(() => {
		if (editor && content !== editor.getHTML()) {
			editor.commands.setContent(content)
		}
	}, [content]) // eslint-disable-line react-hooks/exhaustive-deps

	if (!editor) return null

	return (
		<div className="border border-edge rounded-lg overflow-hidden bg-surface">
			<div className="flex items-center gap-0.5 px-3 py-2 border-b border-edge bg-raised/50">
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
					active={editor.isActive("heading", { level: 2 })}
					title="Titre"
				>
					<Heading2 className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBold().run()}
					active={editor.isActive("bold")}
					title="Gras"
				>
					<Bold className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleItalic().run()}
					active={editor.isActive("italic")}
					title="Italique"
				>
					<Italic className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleCode().run()}
					active={editor.isActive("code")}
					title="Code"
				>
					<Code className="size-4" />
				</ToolbarButton>
				<div className="w-px h-4 bg-edge mx-1" />
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleBulletList().run()}
					active={editor.isActive("bulletList")}
					title="Liste"
				>
					<List className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleOrderedList().run()}
					active={editor.isActive("orderedList")}
					title="Liste numérotée"
				>
					<ListOrdered className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().toggleTaskList().run()}
					active={editor.isActive("taskList")}
					title="Checklist"
				>
					<CheckSquare className="size-4" />
				</ToolbarButton>
				<div className="w-px h-4 bg-edge mx-1" />
				<ToolbarButton
					onClick={() => editor.chain().focus().undo().run()}
					title="Annuler"
				>
					<Undo className="size-4" />
				</ToolbarButton>
				<ToolbarButton
					onClick={() => editor.chain().focus().redo().run()}
					title="Refaire"
				>
					<Redo className="size-4" />
				</ToolbarButton>
			</div>
			<EditorContent editor={editor} />
		</div>
	)
}
```

**Step 2: Commit**

```bash
git add apps/ops/components/tiptap-editor.tsx
git commit -m "feat(ops): create TiptapEditor component with toolbar"
```

---

### Task 4: Create the todo detail page

**Files:**
- Create: `apps/ops/app/(main)/todos/[id]/page.tsx`

**Step 1: Create the detail page**

```tsx
"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { Combobox, type ComboboxOption } from "@blazz/ui/components/ui/combobox"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { ArrowLeft, Flag, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
import { DueDatePicker } from "@/components/due-date-picker"
import { CategoryBadge } from "@/components/manage-categories-sheet"
import { useOpsTopBar } from "@/components/ops-frame"
import { StatusIcon } from "@/components/todos-preset"
import { TagInput } from "@/components/tag-input"
import { TiptapEditor } from "@/components/tiptap-editor"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

const STATUS_OPTIONS = [
	{ value: "triage", label: "Triage" },
	{ value: "todo", label: "Todo" },
	{ value: "blocked", label: "Bloqué" },
	{ value: "in_progress", label: "En cours" },
	{ value: "done", label: "Fait" },
]

const PRIORITY_OPTIONS: ComboboxOption[] = [
	{ value: "urgent", label: "Urgent", icon: <Flag fill="currentColor" className="size-3 shrink-0 text-destructive" /> },
	{ value: "high", label: "High", icon: <Flag fill="currentColor" className="size-3 shrink-0 text-orange-500" /> },
	{ value: "normal", label: "Normal", icon: <Flag className="size-3 shrink-0 text-fg-muted" /> },
	{ value: "low", label: "Low", icon: <Flag className="size-3 shrink-0 text-fg-muted opacity-40" /> },
]

type TodoStatus = "triage" | "todo" | "blocked" | "in_progress" | "done"
type TodoPriority = "urgent" | "high" | "normal" | "low"

export default function TodoDetailPage() {
	const params = useParams()
	const router = useRouter()
	const todoId = params.id as Id<"todos">

	const todo = useQuery(api.todos.get, { id: todoId })
	const projects = useQuery(api.projects.listActive, {})
	const categories = useQuery(api.categories.list, {})
	const allTags = useQuery(api.todos.listAllTags, {})

	const updateTodo = useMutation(api.todos.update)
	const updateStatus = useMutation(api.todos.updateStatus)
	const removeTodo = useMutation(api.todos.remove)

	const projectList = projects ?? []
	const categoryList = categories ?? []
	const allTagsList = allTags ?? []

	// Local state for title (debounced save)
	const [title, setTitle] = useState("")
	const [description, setDescription] = useState("")
	const titleInitialized = useRef(false)
	const descInitialized = useRef(false)
	const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

	// Initialize state from fetched todo
	useEffect(() => {
		if (todo && !titleInitialized.current) {
			setTitle(todo.text)
			titleInitialized.current = true
		}
	}, [todo])

	useEffect(() => {
		if (todo && !descInitialized.current) {
			// Wrap plain text in <p> for Tiptap compatibility
			const desc = todo.description ?? ""
			setDescription(desc.startsWith("<") ? desc : desc ? `<p>${desc}</p>` : "")
			descInitialized.current = true
		}
	}, [todo])

	useOpsTopBar([
		{ label: "Todos", href: "/todos" },
		{ label: todo?.text ?? "…" },
	])

	// Auto-save with debounce
	const saveField = useCallback(
		(field: "text" | "description", value: string) => {
			if (!todo) return
			if (saveTimeout.current) clearTimeout(saveTimeout.current)
			saveTimeout.current = setTimeout(async () => {
				await updateTodo({
					id: todo._id,
					...(field === "text" ? { text: value } : { description: value || undefined }),
				})
			}, 800)
		},
		[todo, updateTodo]
	)

	function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
		const v = e.target.value
		setTitle(v)
		if (v.trim()) saveField("text", v.trim())
	}

	function handleDescriptionChange(html: string) {
		setDescription(html)
		saveField("description", html)
	}

	async function handleStatusChange(status: string) {
		if (!todo) return
		await updateStatus({ id: todo._id, status: status as TodoStatus })
	}

	async function handlePriorityChange(priority: string) {
		if (!todo) return
		await updateTodo({ id: todo._id, priority: (priority || "normal") as TodoPriority })
	}

	async function handleDueDateChange(date: string) {
		if (!todo) return
		await updateTodo({ id: todo._id, dueDate: date || undefined })
	}

	async function handleProjectChange(projectId: string) {
		if (!todo) return
		await updateTodo({ id: todo._id, projectId: (projectId || undefined) as Id<"projects"> | undefined })
	}

	async function handleCategoryChange(categoryId: string) {
		if (!todo) return
		await updateTodo({ id: todo._id, categoryId: (categoryId || undefined) as Id<"categories"> | undefined })
	}

	async function handleTagsChange(tags: string[]) {
		if (!todo) return
		await updateTodo({ id: todo._id, tags: tags.length > 0 ? tags : undefined })
	}

	async function handleDelete() {
		if (!todo) return
		await removeTodo({ id: todo._id })
		router.push("/todos")
	}

	// Loading state
	if (todo === undefined) {
		return (
			<div className="p-6 space-y-6">
				<Skeleton className="h-8 w-48" />
				<div className="grid gap-6 lg:grid-cols-[1fr_320px]">
					<div className="space-y-4">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-64 w-full" />
					</div>
					<div className="space-y-4">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-10 w-full" />
					</div>
				</div>
			</div>
		)
	}

	// Not found
	if (todo === null) {
		return (
			<div className="p-6">
				<Button variant="ghost" size="sm" onClick={() => router.push("/todos")}>
					<ArrowLeft className="size-4 mr-2" />
					Retour
				</Button>
				<p className="mt-8 text-center text-fg-muted">Todo introuvable.</p>
			</div>
		)
	}

	return (
		<div className="p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center gap-3">
				<Button variant="ghost" size="icon-sm" onClick={() => router.push("/todos")}>
					<ArrowLeft className="size-4" />
				</Button>
				<div className="flex items-center gap-2">
					<StatusIcon status={todo.status} />
					<span className="text-sm text-fg-muted capitalize">
						{STATUS_OPTIONS.find((s) => s.value === todo.status)?.label ?? todo.status}
					</span>
				</div>
			</div>

			{/* 2-column layout */}
			<div className="grid gap-8 lg:grid-cols-[1fr_300px]">
				{/* Main column */}
				<div className="space-y-4 min-w-0">
					<input
						type="text"
						value={title}
						onChange={handleTitleChange}
						className="w-full text-2xl font-semibold text-fg bg-transparent border-none outline-none placeholder:text-fg-muted"
						placeholder="Titre du todo"
					/>
					<TiptapEditor content={description} onUpdate={handleDescriptionChange} />

					{/* Activity placeholder */}
					<div className="pt-8 border-t border-edge">
						<h3 className="text-sm font-medium text-fg-muted mb-4">Activity</h3>
						<p className="text-sm text-fg-muted/60">Bientôt disponible…</p>
					</div>
				</div>

				{/* Sidebar */}
				<div className="space-y-5">
					{/* Status */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-fg-muted uppercase tracking-wider">Status</label>
						<Select
							value={todo.status}
							onValueChange={handleStatusChange}
							items={STATUS_OPTIONS}
						>
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{STATUS_OPTIONS.map((s) => (
									<SelectItem key={s.value} value={s.value}>
										<div className="flex items-center gap-2">
											<StatusIcon status={s.value} />
											{s.label}
										</div>
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Priority */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-fg-muted uppercase tracking-wider">Priorité</label>
						<Combobox
							value={todo.priority ?? "normal"}
							onValueChange={handlePriorityChange}
							options={PRIORITY_OPTIONS}
							placeholder="Priorité"
							searchPlaceholder="Rechercher…"
							emptyMessage="Aucun résultat"
						/>
					</div>

					{/* Due date */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-fg-muted uppercase tracking-wider">Échéance</label>
						<DueDatePicker value={todo.dueDate ?? ""} onChange={handleDueDateChange} />
					</div>

					{/* Project */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-fg-muted uppercase tracking-wider">Projet</label>
						<Select
							value={todo.projectId ?? ""}
							onValueChange={handleProjectChange}
							items={[
								{ value: "", label: "Aucun" },
								...projectList.map((p) => ({ value: p._id, label: p.name })),
							]}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Aucun" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="">Aucun</SelectItem>
								{projectList.map((p) => (
									<SelectItem key={p._id} value={p._id}>{p.name}</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Category */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-fg-muted uppercase tracking-wider">Catégorie</label>
						<Select
							value={todo.categoryId ?? ""}
							onValueChange={handleCategoryChange}
							items={[
								{ value: "", label: "Aucune" },
								...categoryList.map((c) => ({ value: c._id, label: c.name })),
							]}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Aucune" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="">Aucune</SelectItem>
								{categoryList.map((c) => (
									<SelectItem key={c._id} value={c._id}>
										<CategoryBadge name={c.name} color={c.color} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Tags */}
					<div className="space-y-1.5">
						<label className="text-xs font-medium text-fg-muted uppercase tracking-wider">Tags</label>
						<TagInput value={todo.tags ?? []} onChange={handleTagsChange} suggestions={allTagsList} />
					</div>

					{/* Delete */}
					<div className="pt-4 border-t border-edge">
						<Button
							variant="ghost"
							size="sm"
							onClick={handleDelete}
							className="text-fg-muted hover:text-destructive w-full justify-start"
						>
							<Trash2 className="size-4 mr-2" />
							Supprimer ce todo
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}
```

**Step 2: Commit**

```bash
git add apps/ops/app/\(main\)/todos/\[id\]/page.tsx
git commit -m "feat(ops): create todo detail page with Tiptap editor and sidebar"
```

---

### Task 5: Update click handlers to navigate instead of opening dialog

**Files:**
- Modify: `apps/ops/app/(main)/todos/page.tsx`
- Modify: `apps/ops/app/(main)/today/page.tsx`

**Step 1: Update kanban card click → router.push**

In `apps/ops/app/(main)/todos/page.tsx`, replace the `TodoCard` component (lines 46-111) to navigate instead of opening EditTodoDialog:

```tsx
function TodoCard({
	todo,
	projects,
	categories,
}: {
	todo: Doc<"todos">
	projects: Doc<"projects">[]
	categories: Category[]
}) {
	const router = useRouter()
	const cat = categories.find((c) => c._id === todo.categoryId)
	const tags = todo.tags ?? []

	return (
		<div
			className={`p-3 rounded-md border border-edge bg-raised space-y-2 cursor-pointer hover:border-accent/50 transition-colors ${todo.status === "done" ? "opacity-60" : ""}`}
			onClick={() => router.push(`/todos/${todo._id}`)}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => e.key === "Enter" && router.push(`/todos/${todo._id}`)}
		>
			<p className="text-sm text-fg leading-snug">{todo.text}</p>
			{todo.description && (
				<p className="text-xs text-fg-muted leading-relaxed whitespace-pre-wrap line-clamp-2">{todo.description}</p>
			)}
			<div className="flex items-center gap-1.5 flex-wrap">
				<PriorityIcon priority={todo.priority} />
				{todo.dueDate && todo.status !== "done" && (() => {
					const { label, className } = formatDueDate(todo.dueDate)
					return (
						<span className={`inline-flex items-center gap-1 text-xs ${className}`}>
							<Calendar className="size-3" />
							{label}
						</span>
					)
				})()}
				<ProjectBadge projectId={todo.projectId} projects={projects} />
				{cat && <CategoryBadge name={cat.name} color={cat.color} />}
			</div>
			{tags.length > 0 && (
				<div className="flex flex-wrap gap-1">
					{tags.slice(0, 3).map((tag) => (
						<span key={tag} className="text-xs text-fg-muted bg-surface border border-edge rounded-full px-1.5 py-0">
							{tag}
						</span>
					))}
					{tags.length > 3 && (
						<span className="text-xs text-fg-muted">+{tags.length - 3}</span>
					)}
				</div>
			)}
		</div>
	)
}
```

Key changes:
- Remove `useState(false)` for `editing`
- Remove `EditTodoDialog` render
- Remove `allTags` prop (no longer needed)
- Add `useRouter()` import
- Click → `router.push(/todos/${todo._id})`

**Step 2: Update list row actions → navigate**

In the `createTodosPreset` call (~line 290), change `onEdit` to navigate:

```tsx
const preset = useMemo(() => createTodosPreset({
	onEdit: (todo) => router.push(`/todos/${todo._id}`),
	onDelete: async (todo) => {
		await remove({ id: todo._id as Id<"todos"> })
	},
	onBulkDelete: async (items) => {
		await Promise.all(items.map((t) => remove({ id: t._id as Id<"todos"> })))
	},
}), [remove, router])
```

Add `const router = useRouter()` at the top of `TodosPage`.

**Step 3: Remove EditTodoDialog from todos page**

Remove the `editingTodo` state and the `<EditTodoDialog>` render block at the bottom of the page (lines 266, 456-466). Also remove the import of `EditTodoDialog` if no longer needed.

**Step 4: Update today page → navigate**

In `apps/ops/app/(main)/today/page.tsx`, replace todo click handler (line 240):

```tsx
onClick={() => router.push(`/todos/${todo._id}`)}
```

Add `import { useRouter } from "next/navigation"` and `const router = useRouter()` in the component.

Remove `editingTodo` state, `EditTodoDialog` import, and the EditTodoDialog render block (lines 297-306).

**Step 5: Add `useRouter` import to todos page**

Add to imports:
```tsx
import { useRouter } from "next/navigation"
```

**Step 6: Commit**

```bash
git add apps/ops/app/\(main\)/todos/page.tsx apps/ops/app/\(main\)/today/page.tsx
git commit -m "feat(ops): wire todo clicks to navigate to detail page"
```

---

### Task 6: Add Tiptap prose styles

**Files:**
- Modify: `apps/ops/app/globals.css`

**Step 1: Add Tiptap styles**

Add at the end of `globals.css`:

```css
/* Tiptap editor */
.tiptap p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: var(--fg-muted);
  opacity: 0.5;
  pointer-events: none;
  height: 0;
}

.tiptap ul[data-type="taskList"] {
  list-style: none;
  padding: 0;
}

.tiptap ul[data-type="taskList"] li {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.tiptap ul[data-type="taskList"] li > label {
  margin-top: 0.25rem;
}

.tiptap ul[data-type="taskList"] li > div {
  flex: 1;
}
```

**Step 2: Commit**

```bash
git add apps/ops/app/globals.css
git commit -m "style(ops): add tiptap editor and task list styles"
```

---

### Task 7: Verify and test

**Step 1: Run dev server**

Run: `cd apps/ops && pnpm dev`
Expected: No build errors

**Step 2: Manual test checklist**

- [ ] Navigate to `/todos` → kanban view loads
- [ ] Click a todo card → navigates to `/todos/[id]`
- [ ] Title editable inline, auto-saves on debounce
- [ ] Tiptap editor loads with existing description (plain text wrapped in `<p>`)
- [ ] Toolbar works: bold, italic, headings, lists, task lists, code
- [ ] Sidebar fields all work: status, priority, due date, project, category, tags
- [ ] Back button returns to `/todos`
- [ ] Delete button removes todo and redirects
- [ ] Today page → click todo → navigates to detail page
- [ ] List view → Edit action → navigates to detail page

**Step 3: Final commit if any fixes needed**
