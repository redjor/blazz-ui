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
import { KanbanBoard } from "@blazz/ui/components/blocks/kanban-board"
import { useMutation, useQuery } from "convex/react"
import { CheckSquare, ChevronLeft, ChevronRight, Columns3, Flag, LayoutList, Pencil, Plus, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { OpsBreadcrumb } from "@/components/ops-breadcrumb"
import { OpsFrame } from "@/components/ops-frame"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { createTodosPreset } from "@/components/todos-preset"
import type { Todo } from "@/components/todos-preset"

type TodoStatus = "triage" | "todo" | "in_progress" | "done"

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

function TodoCard({ todo, projects }: { todo: Doc<"todos">; projects: Doc<"projects">[] }) {
	const updateStatus = useMutation(api.todos.updateStatus)
	const remove = useMutation(api.todos.remove)
	const [editing, setEditing] = useState(false)
	const prev = getPrev(todo.status)
	const next = getNext(todo.status)

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
			</div>
			<EditTodoDialog todo={todo} open={editing} onOpenChange={setEditing} projects={projects} />
		</>
	)
}

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
						<Select
							value={projectId ?? ""}
							onValueChange={(v) => setProjectId(v || undefined)}
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
	const [addFor, setAddFor] = useState<TodoStatus | null>(null)

	const projectList = projects ?? []

	const updateStatus = useMutation(api.todos.updateStatus)

	type TodoWithId = Doc<"todos"> & { id: string }
	const todoItems = useMemo<TodoWithId[]>(
		() => (todos ?? []).map((t) => ({ ...t, id: t._id })),
		[todos]
	)

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

	// Build preset — stable reference, does not depend on todos data
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
			{editingTodo && (
				<EditTodoDialog
					key={editingTodo._id}
					todo={editingTodo}
					open={true}
					onOpenChange={(v) => !v && setEditingTodo(null)}
					projects={projectList}
				/>
			)}
		</OpsFrame>
	)
}
