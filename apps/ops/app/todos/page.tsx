"use client"

import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { Empty } from "@blazz/ui/components/ui/empty"
import { Input } from "@blazz/ui/components/ui/input"
import { Textarea } from "@blazz/ui/components/ui/textarea"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"
import { DataTable } from "@blazz/ui/components/blocks/data-table"
import type { DataTableView } from "@blazz/ui/components/blocks/data-table"
import { useMutation, useQuery } from "convex/react"
import { CheckSquare, ChevronLeft, ChevronRight, Columns3, Flag, LayoutList, Pencil, Plus, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { OpsBreadcrumb } from "@/components/ops-breadcrumb"
import { OpsFrame } from "@/components/ops-frame"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { createTodosPreset } from "@/components/todos-preset"
import type { Todo } from "@/components/todos-preset"
import { ManageCategoriesSheet, CategoryBadge, getCategoryColorClasses } from "@/components/manage-categories-sheet"
import { TagInput } from "@/components/tag-input"

type TodoStatus = "triage" | "todo" | "in_progress" | "done"
type Category = { _id: string; name: string; color?: string }

const COLUMNS: { status: TodoStatus; label: string }[] = [
	{ status: "triage", label: "Triage" },
	{ status: "todo", label: "Todo" },
	{ status: "in_progress", label: "En cours" },
	{ status: "done", label: "Fait" },
]

const STATUS_ORDER: TodoStatus[] = ["triage", "todo", "in_progress", "done"]

function getPrev(status: TodoStatus): TodoStatus | null {
	const idx = STATUS_ORDER.indexOf(status)
	return idx > 0 ? STATUS_ORDER[idx - 1] : null
}

function getNext(status: TodoStatus): TodoStatus | null {
	const idx = STATUS_ORDER.indexOf(status)
	return idx < STATUS_ORDER.length - 1 ? STATUS_ORDER[idx + 1] : null
}

function EditTodoDialog({
	todo,
	open,
	onOpenChange,
	projects,
	categories,
	allTags,
}: {
	todo: Doc<"todos">
	open: boolean
	onOpenChange: (v: boolean) => void
	projects: Doc<"projects">[]
	categories: Category[]
	allTags: string[]
}) {
	const updateTodo = useMutation(api.todos.update)
	const [text, setText] = useState(todo.text)
	const [description, setDescription] = useState(todo.description ?? "")
	const [priority, setPriority] = useState(todo.priority ?? "normal")
	const [projectId, setProjectId] = useState(todo.projectId ?? "")
	const [categoryId, setCategoryId] = useState(todo.categoryId ?? "")
	const [tags, setTags] = useState<string[]>(todo.tags ?? [])

	function resetToTodo() {
		setText(todo.text)
		setDescription(todo.description ?? "")
		setPriority(todo.priority ?? "normal")
		setProjectId(todo.projectId ?? "")
		setCategoryId(todo.categoryId ?? "")
		setTags(todo.tags ?? [])
	}

	const unchanged =
		text.trim() === todo.text &&
		description.trim() === (todo.description ?? "") &&
		priority === (todo.priority ?? "normal") &&
		(projectId || undefined) === todo.projectId &&
		(categoryId || undefined) === todo.categoryId &&
		JSON.stringify(tags) === JSON.stringify(todo.tags ?? [])

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault()
		if (!text.trim()) return
		await updateTodo({
			id: todo._id,
			text: text.trim(),
			description: description.trim() || undefined,
			priority: priority as "urgent" | "high" | "normal" | "low",
			projectId: (projectId || undefined) as Id<"projects"> | undefined,
			categoryId: (categoryId || undefined) as Id<"categories"> | undefined,
			tags: tags.length > 0 ? tags : undefined,
		})
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
						<Select
							value={projectId}
							onValueChange={setProjectId}
							items={[{ value: "", label: "Aucun" }, ...projects.map((p) => ({ value: p._id, label: p.name }))]}
						>
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
					<Select
						value={categoryId}
						onValueChange={setCategoryId}
						items={[{ value: "", label: "Aucune" }, ...categories.map((c) => ({ value: c._id, label: c.name }))]}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Catégorie (optionnel)" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">Aucune</SelectItem>
							{categories.map((c) => (
								<SelectItem key={c._id} value={c._id}>
									<CategoryBadge name={c.name} color={c.color} />
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<TagInput value={tags} onChange={setTags} suggestions={allTags} />
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

function TodoCard({
	todo,
	projects,
	categories,
	allTags,
}: {
	todo: Doc<"todos">
	projects: Doc<"projects">[]
	categories: Category[]
	allTags: string[]
}) {
	const updateStatus = useMutation(api.todos.updateStatus)
	const remove = useMutation(api.todos.remove)
	const [editing, setEditing] = useState(false)
	const prev = getPrev(todo.status)
	const next = getNext(todo.status)

	const cat = categories.find((c) => c._id === todo.categoryId)

	return (
		<>
			<div className={`p-3 rounded-md border border-edge bg-raised space-y-2 ${todo.status === "done" ? "opacity-60" : ""}`}>
				<p className="text-sm text-fg leading-snug">{todo.text}</p>
				{todo.description && (
					<p className="text-xs text-fg-muted leading-relaxed whitespace-pre-wrap">{todo.description}</p>
				)}
				<div className="flex flex-col gap-1.5">
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-1.5 flex-wrap">
							<PriorityIcon priority={todo.priority} />
							{todo.projectId && (() => {
								const proj = projects.find((p) => p._id === todo.projectId)
								return proj ? (
									<Badge variant="secondary" className="text-xs px-1.5 py-0 max-w-[80px] truncate">{proj.name}</Badge>
								) : null
							})()}
							{cat && <CategoryBadge name={cat.name} color={cat.color} />}
						</div>
						<div className="flex items-center gap-1">
							{prev && (
								<Button
									variant="ghost"
									size="icon-sm"
									onClick={() => updateStatus({ id: todo._id, status: prev })}
									aria-label="Reculer"
								>
									<ChevronLeft className="size-3.5" />
								</Button>
							)}
							{next && (
								<Button
									variant="ghost"
									size="icon-sm"
									onClick={() => updateStatus({ id: todo._id, status: next })}
									aria-label="Avancer"
								>
									<ChevronRight className="size-3.5" />
								</Button>
							)}
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
					{(todo.tags ?? []).length > 0 && (
						<div className="flex flex-wrap gap-1">
							{(todo.tags ?? []).slice(0, 3).map((tag) => (
								<span key={tag} className="text-xs text-fg-muted bg-surface border border-edge rounded-full px-1.5 py-0">
									{tag}
								</span>
							))}
							{(todo.tags ?? []).length > 3 && (
								<span className="text-xs text-fg-muted">+{(todo.tags ?? []).length - 3}</span>
							)}
						</div>
					)}
				</div>
			</div>
			<EditTodoDialog
				todo={todo}
				open={editing}
				onOpenChange={setEditing}
				projects={projects}
				categories={categories}
				allTags={allTags}
			/>
		</>
	)
}

function AddTodoDialog({
	defaultStatus,
	open,
	onOpenChange,
	projects,
	categories,
	allTags,
}: {
	defaultStatus: TodoStatus
	open: boolean
	onOpenChange: (v: boolean) => void
	projects: Doc<"projects">[]
	categories: Category[]
	allTags: string[]
}) {
	const create = useMutation(api.todos.create)
	const [text, setText] = useState("")
	const [description, setDescription] = useState("")
	const [priority, setPriority] = useState<string>("normal")
	const [projectId, setProjectId] = useState<string>("")
	const [categoryId, setCategoryId] = useState<string>("")
	const [tags, setTags] = useState<string[]>([])

	function reset() {
		setText("")
		setDescription("")
		setPriority("normal")
		setProjectId("")
		setCategoryId("")
		setTags([])
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
			projectId: (projectId || undefined) as Id<"projects"> | undefined,
			categoryId: (categoryId || undefined) as Id<"categories"> | undefined,
			tags: tags.length > 0 ? tags : undefined,
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
						<Select
							value={projectId}
							onValueChange={setProjectId}
							items={[{ value: "", label: "Aucun" }, ...projects.map((p) => ({ value: p._id, label: p.name }))]}
						>
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
					<Select
						value={categoryId}
						onValueChange={setCategoryId}
						items={[{ value: "", label: "Aucune" }, ...categories.map((c) => ({ value: c._id, label: c.name }))]}
					>
						<SelectTrigger className="w-full">
							<SelectValue placeholder="Catégorie (optionnel)" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">Aucune</SelectItem>
							{categories.map((c) => (
								<SelectItem key={c._id} value={c._id}>
									<CategoryBadge name={c.name} color={c.color} />
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<TagInput value={tags} onChange={setTags} suggestions={allTags} />
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

export default function TodosPage() {
	const todos = useQuery(api.todos.list, {})
	const projects = useQuery(api.projects.listActive, {})
	const categories = useQuery(api.categories.list, {})
	const allTags = useQuery(api.todos.listAllTags, {})

	const projectList = projects ?? []
	const categoryList = categories ?? []
	const allTagsList = allTags ?? []

	const remove = useMutation(api.todos.remove)
	const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")
	const [activeView, setActiveView] = useState<DataTableView | null>(null)
	const [editingTodo, setEditingTodo] = useState<Doc<"todos"> | null>(null)
	const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)
	const [addFor, setAddFor] = useState<TodoStatus | null>(null)

	// Build rows with resolved names for the list view
	const todoRows = useMemo<Todo[]>(() => {
		if (!todos) return []
		return todos.map((t) => {
			const cat = categoryList.find((c) => c._id === t.categoryId)
			return {
				...t,
				projectName: projectList.find((p) => p._id === t.projectId)?.name,
				categoryName: cat?.name,
				categoryColor: cat?.color,
			}
		})
	}, [todos, projectList, categoryList])

	// Filtered todos for kanban view
	const filteredTodos = useMemo(() => {
		if (!todos) return []
		if (!activeCategoryId) return todos
		return todos.filter((t) => t.categoryId === activeCategoryId)
	}, [todos, activeCategoryId])

	// Build preset — stable reference
	const preset = useMemo(() => createTodosPreset({
		onEdit: (todo) => setEditingTodo(todo as unknown as Doc<"todos">),
		onDelete: async (todo) => {
			await remove({ id: todo._id as Id<"todos"> })
		},
		onBulkDelete: async (items) => {
			await Promise.all(items.map((t) => remove({ id: t._id as Id<"todos"> })))
		},
	}), [remove])

	return (
		<OpsFrame topBar={<OpsBreadcrumb items={[{ label: "Todos" }]} />}>
			<div className="p-6 space-y-6">
				<PageHeader
					title="Todos"
					description="Capturez et organisez vos tâches"
					actionsSlot={
						<div className="flex items-center gap-2">
							<ManageCategoriesSheet />
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
						</div>
					}
				/>

				{viewMode === "list" ? (
					<DataTable
						data={todoRows}
						columns={preset.columns}
						views={preset.views}
						activeView={activeView}
						onViewChange={(view) => setActiveView(view)}
						rowActions={preset.rowActions}
						bulkActions={preset.bulkActions}
						enableRowSelection
						enableSorting
						enableAdvancedFilters
						getRowId={(row) => row._id}
					/>
				) : (
					<>
						{/* Category filter bar */}
						{categoryList.length > 0 && (
							<div className="flex flex-wrap gap-1.5">
								<button
									type="button"
									onClick={() => setActiveCategoryId(null)}
									className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
										activeCategoryId === null
											? "bg-brand text-white"
											: "bg-raised border border-edge text-fg-muted hover:text-fg"
									}`}
								>
									Tous
								</button>
								{categoryList.map((cat) => {
									const isActive = activeCategoryId === cat._id
									const cls = getCategoryColorClasses(cat.color)
									return (
										<button
											key={cat._id}
											type="button"
											onClick={() => setActiveCategoryId(isActive ? null : cat._id)}
											className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${
												isActive
													? `${cls.bg} ${cls.text} border-transparent`
													: "bg-raised border-edge text-fg-muted hover:text-fg"
											}`}
										>
											{cat.name}
										</button>
									)
								})}
							</div>
						)}

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
									const colTodos = filteredTodos.filter((t) => t.status === col.status)
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
													colTodos.map((todo) => (
														<TodoCard
															key={todo._id}
															todo={todo}
															projects={projectList}
															categories={categoryList}
															allTags={allTagsList}
														/>
													))
												)}
											</div>
										</div>
									)
								})}
							</div>
						)}
					</>
				)}
			</div>

			{addFor && (
				<AddTodoDialog
					defaultStatus={addFor}
					open={true}
					onOpenChange={(v) => !v && setAddFor(null)}
					projects={projectList}
					categories={categoryList}
					allTags={allTagsList}
				/>
			)}
			{editingTodo && (
				<EditTodoDialog
					key={editingTodo._id}
					todo={editingTodo}
					open={true}
					onOpenChange={(v) => !v && setEditingTodo(null)}
					projects={projectList}
					categories={categoryList}
					allTags={allTagsList}
				/>
			)}
		</OpsFrame>
	)
}
