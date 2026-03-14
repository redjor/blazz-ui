"use client"

import type { DataTableView } from "@blazz/ui/components/blocks/data-table"
import { DataTable } from "@blazz/ui/components/blocks/data-table"
import { KanbanBoard } from "@blazz/ui/components/blocks/kanban-board"
import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { Empty } from "@blazz/ui/components/ui/empty"
import { Input } from "@blazz/ui/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { Textarea } from "@blazz/ui/components/ui/textarea"
import { useMutation, useQuery } from "convex/react"
import { Calendar, CheckSquare, Columns3, LayoutList, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { DueDatePicker } from "@/components/due-date-picker"
import type { Category } from "@/components/edit-todo-dialog"
import { PriorityIcon, ProjectBadge } from "@/components/edit-todo-dialog"
import {
	CategoryBadge,
	getCategoryColorClasses,
	ManageCategoriesSheet,
} from "@/components/manage-categories-sheet"
import { useOpsTopBar } from "@/components/ops-frame"
import { TagInput } from "@/components/tag-input"
import type { Todo } from "@/components/todos-preset"
import { createTodosPreset, formatDueDate, StatusIcon } from "@/components/todos-preset"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"

type TodoStatus = "triage" | "todo" | "blocked" | "in_progress" | "done"
type TodoWithId = Doc<"todos"> & { id: string }

const COLUMNS: { status: TodoStatus; label: string }[] = [
	{ status: "triage", label: "Triage" },
	{ status: "todo", label: "Todo" },
	{ status: "blocked", label: "Bloqué" },
	{ status: "in_progress", label: "En cours" },
	{ status: "done", label: "Fait" },
]

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
			className={`p-3 rounded-md border border-edge bg-surface-3 space-y-2 cursor-pointer hover:border-accent/50 transition-colors ${todo.status === "done" ? "opacity-60" : ""}`}
			onClick={() => router.push(`/todos/${todo._id}`)}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => e.key === "Enter" && router.push(`/todos/${todo._id}`)}
		>
			<p className="text-sm text-fg leading-snug">{todo.text}</p>
			<div className="flex items-center gap-1.5 flex-wrap">
				<PriorityIcon priority={todo.priority} />
				{todo.dueDate &&
					todo.status !== "done" &&
					(() => {
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
						<span
							key={tag}
							className="text-xs text-fg-muted bg-surface border border-edge rounded-full px-1.5 py-0"
						>
							{tag}
						</span>
					))}
					{tags.length > 3 && <span className="text-xs text-fg-muted">+{tags.length - 3}</span>}
				</div>
			)}
		</div>
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
	const [projectId, setProjectId] = useState<string | undefined>(undefined)
	const [categoryId, setCategoryId] = useState<string>("")
	const [dueDate, setDueDate] = useState("")
	const [tags, setTags] = useState<string[]>([])

	function reset() {
		setText("")
		setDescription("")
		setPriority("normal")
		setDueDate("")
		setProjectId(undefined)
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
			dueDate: dueDate || undefined,
			priority: priority as "urgent" | "high" | "normal" | "low",
			projectId: projectId as Id<"projects"> | undefined,
			categoryId: (categoryId || undefined) as Id<"categories"> | undefined,
			tags: tags.length > 0 ? tags : undefined,
		})
		reset()
		onOpenChange(false)
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				if (!v) reset()
				onOpenChange(v)
			}}
		>
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
						<Select
							value={priority}
							onValueChange={setPriority}
							items={[
								{ value: "urgent", label: "Urgent" },
								{ value: "high", label: "High" },
								{ value: "normal", label: "Normal" },
								{ value: "low", label: "Low" },
							]}
						>
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
							items={[
								{ value: "", label: "Aucun" },
								...projects.map((p) => ({ value: p._id, label: p.name })),
							]}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Projet (optionnel)" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="">Aucun</SelectItem>
								{projects.map((p) => (
									<SelectItem key={p._id} value={p._id}>
										{p.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
					<DueDatePicker value={dueDate} onChange={setDueDate} />
					<Select
						value={categoryId}
						onValueChange={setCategoryId}
						items={[
							{ value: "", label: "Aucune" },
							...categories.map((c) => ({ value: c._id, label: c.name })),
						]}
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
	const router = useRouter()
	const todos = useQuery(api.todos.list, {})
	const projects = useQuery(api.projects.listActive, {})
	const categories = useQuery(api.categories.list, {})
	const allTags = useQuery(api.todos.listAllTags, {})
	const [addFor, setAddFor] = useState<TodoStatus | null>(null)

	const projectList = projects ?? []
	const categoryList = categories ?? []
	const allTagsList = allTags ?? []

	const updateStatus = useMutation(api.todos.updateStatus)

	const todoItems = useMemo<TodoWithId[]>(
		() => (todos ?? []).map((t) => ({ ...t, id: t._id })),
		[todos]
	)

	const remove = useMutation(api.todos.remove)
	const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")
	const [activeView, setActiveView] = useState<DataTableView | null>(null)
	const [activeCategoryId, setActiveCategoryId] = useState<string | null>(null)

	// Filtered items for kanban view
	const filteredItems = useMemo<TodoWithId[]>(() => {
		if (!activeCategoryId) return todoItems
		return todoItems.filter((t) => t.categoryId === activeCategoryId)
	}, [todoItems, activeCategoryId])

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

	// Build preset — stable reference, does not depend on todos data
	const preset = useMemo(
		() =>
			createTodosPreset({
				onEdit: (todo) => router.push(`/todos/${todo._id}`),
				onDelete: async (todo) => {
					await remove({ id: todo._id as Id<"todos"> })
				},
				onBulkDelete: async (items) => {
					await Promise.all(items.map((t) => remove({ id: t._id as Id<"todos"> })))
				},
			}),
		[remove, router]
	)

	useOpsTopBar([{ label: "Todos" }])

	return (
		<>
			<div className="flex flex-col p-6 gap-6 h-full">
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
									className={viewMode === "kanban" ? "bg-surface-3" : ""}
									aria-label="Vue kanban"
								>
									<Columns3 className="size-3.5" />
								</Button>
								<Button
									variant="ghost"
									size="icon-sm"
									onClick={() => setViewMode("list")}
									className={viewMode === "list" ? "bg-surface-3" : ""}
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
					<div className="flex flex-col flex-1 min-h-0 gap-6">
						{/* Category filter bar */}
						{categoryList.length > 0 && (
							<div className="flex flex-wrap gap-1.5">
								<button
									type="button"
									onClick={() => setActiveCategoryId(null)}
									className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
										activeCategoryId === null
											? "bg-brand text-white"
											: "bg-surface-3 border border-edge text-fg-muted hover:text-fg"
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
													: "bg-surface-3 border-edge text-fg-muted hover:text-fg"
											}`}
										>
											{cat.name}
										</button>
									)
								})}
							</div>
						)}

						{todos === undefined ? (
							<div className="flex gap-4 overflow-x-auto pb-4">
								{COLUMNS.map((col) => (
									<div key={col.status} className="w-[330px] min-w-[330px] space-y-3">
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
								items={filteredItems}
								className="flex-1 min-h-0"
								columnClassName="!min-w-[330px] w-[330px] group"
								getColumnId={(t) => t.status}
								onMove={async (id, _from, to) => {
									await updateStatus({ id: id as Id<"todos">, status: to as TodoStatus })
								}}
								renderColumnHeader={(col, colItems) => (
									<div className="flex items-center justify-between px-3 py-1.5 border-b border-edge">
										<div className="flex items-center gap-2">
											<StatusIcon status={col.id} />
											<span className="text-sm font-medium text-fg">{col.label}</span>
											{colItems.length > 0 && (
												<Badge variant="secondary" fill="subtle" size="xs" className="tabular-nums">
													{colItems.length}
												</Badge>
											)}
										</div>
										<Button
											variant="ghost"
											size="icon-sm"
											onClick={() => setAddFor(col.id as TodoStatus)}
											aria-label={`Ajouter dans ${col.label}`}
											className="opacity-0 group-hover:opacity-100 transition-opacity"
										>
											<Plus className="size-3.5" />
										</Button>
									</div>
								)}
								renderCard={(todo) => (
									<TodoCard todo={todo} projects={projectList} categories={categoryList} />
								)}
								renderAfterCards={(col) => (
									<button
										type="button"
										onClick={() => setAddFor(col.id as TodoStatus)}
										className="flex items-center justify-center w-full p-3 rounded-md border border-dashed border-edge text-fg-muted opacity-0 group-hover:opacity-100 transition-opacity hover:text-fg"
									>
										<Plus className="size-4" />
									</button>
								)}
							/>
						)}
					</div>
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
		</>
	)
}
