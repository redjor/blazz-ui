"use client"

import type { BulkAction, DataTableColumnDef, DataTableView, RowAction } from "@blazz/pro/components/blocks/data-table"
import { DataTable } from "@blazz/pro/components/blocks/data-table"
import { Bleed } from "@blazz/ui/components/ui/bleed"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@blazz/ui/components/ui/dropdown-menu"
import { Empty, EmptyActions, EmptyDescription, EmptyTitle } from "@blazz/ui/components/ui/empty"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Input } from "@blazz/ui/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { Textarea } from "@blazz/ui/components/ui/textarea"
import { useMutation, useQuery } from "convex/react"
import { CircleCheck, CircleDashed, CircleDot, CircleSlash, Columns3, Flag, LayoutList, Minus, Pencil, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { DueDatePicker } from "@/components/due-date-picker"
import type { Category } from "@/components/edit-todo-dialog"
import { CategoryBadge } from "@/components/manage-categories-sheet"
import { TagInput } from "@/components/tag-input"
import { TodoCard } from "@/components/todo-card"
import type { Todo } from "@/components/todos-preset"
import { formatDueDate, StatusIcon } from "@/components/todos-preset"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"

type TodoStatus = "triage" | "todo" | "blocked" | "in_progress" | "done"

const allStatuses: { value: TodoStatus; label: string }[] = [
	{ value: "triage", label: "Triage" },
	{ value: "todo", label: "Todo" },
	{ value: "blocked", label: "Bloqué" },
	{ value: "in_progress", label: "En cours" },
	{ value: "done", label: "Fait" },
]

function StatusDropdown({
	todoId,
	currentStatus,
	updateStatus,
}: {
	todoId: Id<"todos">
	currentStatus: TodoStatus
	updateStatus: (args: { id: Id<"todos">; status: TodoStatus }) => Promise<unknown>
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<button type="button" className="cursor-pointer rounded p-0.5 hover:bg-raised transition-colors" onClick={(e) => e.stopPropagation()}>
						<StatusIcon status={currentStatus} />
					</button>
				}
			/>
			<DropdownMenuContent align="start" className="min-w-[180px]" onClick={(e) => e.stopPropagation()}>
				<div className="px-2 py-1.5 text-xs text-fg-muted font-medium">Changer le statut…</div>
				{allStatuses.map((s, i) => (
					<DropdownMenuItem
						key={s.value}
						onClick={async () => {
							if (s.value !== currentStatus) {
								await updateStatus({ id: todoId, status: s.value })
								toast.success(`Statut → ${s.label}`)
							}
						}}
					>
						<StatusIcon status={s.value} />
						<span className="flex-1">{s.label}</span>
						{s.value === currentStatus && <span className="text-fg-muted">✓</span>}
						<kbd className="ml-auto text-[11px] text-fg-muted/50">{i + 1}</kbd>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

type TodoPriority = "urgent" | "high" | "normal" | "low"

const allPriorities: { value: TodoPriority | null; label: string; icon: React.ReactNode }[] = [
	{ value: null, label: "No priority", icon: <Minus className="size-3 text-fg-muted/50" /> },
	{ value: "urgent", label: "Urgent", icon: <Flag fill="currentColor" className="size-3 text-destructive" /> },
	{ value: "high", label: "High", icon: <Flag fill="currentColor" className="size-3 text-orange-500" /> },
	{ value: "normal", label: "Medium", icon: <Flag className="size-3 text-fg-muted" /> },
	{ value: "low", label: "Low", icon: <Flag className="size-3 text-fg-muted opacity-40" /> },
]

function PriorityIcon({ priority }: { priority?: string }) {
	switch (priority) {
		case "urgent":
			return <Flag fill="currentColor" className="size-3 shrink-0 text-destructive" />
		case "high":
			return <Flag fill="currentColor" className="size-3 shrink-0 text-orange-500" />
		case "normal":
			return <Flag className="size-3 shrink-0 text-fg-muted" />
		case "low":
			return <Flag className="size-3 shrink-0 text-fg-muted opacity-40" />
		default:
			return <Minus className="size-3 shrink-0 text-fg-muted/30" />
	}
}

function PriorityDropdown({
	todoId,
	currentPriority,
	updateTodo,
}: {
	todoId: Id<"todos">
	currentPriority?: TodoPriority
	updateTodo: (args: { id: Id<"todos">; priority: TodoPriority | undefined }) => Promise<unknown>
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<button type="button" className="cursor-pointer rounded p-0.5 hover:bg-raised transition-colors" onClick={(e) => e.stopPropagation()}>
						<PriorityIcon priority={currentPriority} />
					</button>
				}
			/>
			<DropdownMenuContent align="start" className="min-w-[180px]" onClick={(e) => e.stopPropagation()}>
				<div className="px-2 py-1.5 text-xs text-fg-muted font-medium">Set priority to…</div>
				{allPriorities.map((p, i) => (
					<DropdownMenuItem
						key={p.value ?? "none"}
						onClick={async () => {
							const newVal = p.value ?? undefined
							if (newVal !== currentPriority) {
								await updateTodo({ id: todoId, priority: newVal })
								toast.success(`Priorité → ${p.label}`)
							}
						}}
					>
						{p.icon}
						<span className="flex-1">{p.label}</span>
						{(p.value ?? undefined) === currentPriority && <span className="text-fg-muted">✓</span>}
						<kbd className="ml-auto text-[11px] text-fg-muted/50">{i}</kbd>
					</DropdownMenuItem>
				))}
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

// ---------------------------------------------------------------------------
// AddTodoDialog
// ---------------------------------------------------------------------------

function AddTodoDialog({
	defaultStatus,
	open,
	onOpenChange,
	projects,
	categories,
	allTags,
	fixedProjectId,
}: {
	defaultStatus: TodoStatus
	open: boolean
	onOpenChange: (v: boolean) => void
	projects: Doc<"projects">[]
	categories: Category[]
	allTags: string[]
	fixedProjectId?: Id<"projects">
}) {
	const create = useMutation(api.todos.create)
	const [text, setText] = useState("")
	const [description, setDescription] = useState("")
	const [priority, setPriority] = useState<string>("normal")
	const [projectId, setProjectId] = useState<string | undefined>(fixedProjectId ?? undefined)
	const [categoryId, setCategoryId] = useState<string>("")
	const [dueDate, setDueDate] = useState("")
	const [tags, setTags] = useState<string[]>([])

	function reset() {
		setText("")
		setDescription("")
		setPriority("normal")
		setDueDate("")
		setProjectId(fixedProjectId ?? undefined)
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
			projectId: fixedProjectId ?? (projectId as Id<"projects"> | undefined),
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
				<form onSubmit={handleSubmit}>
					<BlockStack gap="400">
						<Input autoFocus placeholder="Titre" value={text} onChange={(e) => setText(e.target.value)} />
						<Textarea placeholder="Description (optionnelle)" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
						<InlineStack gap="200">
							<Select
								value={priority}
								onValueChange={(value) => setPriority(value ?? "normal")}
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
							{!fixedProjectId && (
								<Select
									value={projectId ?? ""}
									onValueChange={(value) => setProjectId(value || undefined)}
									items={[{ value: "", label: "Aucun" }, ...projects.map((p) => ({ value: p._id, label: p.name }))]}
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
							)}
						</InlineStack>
						<DueDatePicker value={dueDate} onChange={setDueDate} />
						<Select value={categoryId} onValueChange={(value) => setCategoryId(value ?? "")} items={[{ value: "", label: "Aucune" }, ...categories.map((c) => ({ value: c._id, label: c.name }))]}>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Catégorie (optionnel)" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="">Aucune</SelectItem>
								{categories.map((c) => (
									<SelectItem key={c._id} value={c._id}>
										<CategoryBadge name={c.name} color={c.color} icon={c.icon} />
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<TagInput value={tags} onChange={setTags} suggestions={allTags} />
						<InlineStack gap="200" align="end">
							<Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
								Annuler
							</Button>
							<Button type="submit" disabled={!text.trim()}>
								Ajouter
							</Button>
						</InlineStack>
					</BlockStack>
				</form>
			</DialogContent>
		</Dialog>
	)
}

// ---------------------------------------------------------------------------
// TodosDataTable
// ---------------------------------------------------------------------------

export interface TodosDataTableProps {
	projectId?: Id<"projects">
}

export function TodosDataTable({ projectId }: TodosDataTableProps) {
	const router = useRouter()
	const todos = useQuery(projectId ? api.todos.listByProject : api.todos.list, projectId ? { projectId } : {})
	const projects = useQuery(api.projects.listActive, {})
	const categories = useQuery(api.categories.list, {})
	const allTags = useQuery(api.todos.listAllTags, {})
	const [addFor, setAddFor] = useState<TodoStatus | null>(null)

	const projectList = projects ?? []
	const categoryList = categories ?? []
	const allTagsList = allTags ?? []

	const updateStatus = useMutation(api.todos.updateStatus)
	const updateTodo = useMutation(api.todos.update)
	const remove = useMutation(api.todos.remove)

	const storageKeyPrefix = projectId ? `ops-project-todos` : "ops-todos"
	const viewModeKey = projectId ? `ops-project-todos-mode-${projectId}` : "ops-todos-mode"

	const [viewMode, setViewMode] = useState<"kanban" | "list">(() => {
		try {
			const saved = typeof window !== "undefined" ? localStorage.getItem(viewModeKey) : null
			if (saved === "list" || saved === "kanban") return saved
		} catch {}
		return "kanban"
	})

	const handleSetViewMode = (mode: "kanban" | "list") => {
		setViewMode(mode)
		try {
			localStorage.setItem(viewModeKey, mode)
		} catch {}
	}

	// Build rows sorted by status (group order) then priority (within each group)
	const statusOrder: Record<string, number> = { triage: 0, todo: 1, blocked: 2, in_progress: 3, done: 4 }
	const priorityOrder: Record<string, number> = { urgent: 0, high: 1, normal: 2, low: 3 }
	const todoRows = useMemo<Todo[]>(() => {
		if (!todos) return []
		return todos
			.map((t) => {
				const cat = categoryList.find((c) => c._id === t.categoryId)
				return {
					...t,
					projectName: projectList.find((p) => p._id === t.projectId)?.name,
					categoryName: cat?.name,
					categoryColor: cat?.color,
				}
			})
			.sort((a, b) => {
				const s = (statusOrder[a.status] ?? 99) - (statusOrder[b.status] ?? 99)
				if (s !== 0) return s
				return (priorityOrder[a.priority ?? "normal"] ?? 2) - (priorityOrder[b.priority ?? "normal"] ?? 2)
			})
	}, [todos, projectList, categoryList])

	// ---------------------------------------------------------------------------
	// Flat DataTable — columns
	// ---------------------------------------------------------------------------

	const statusTint: Record<string, string> = {
		triage: "oklch(0.75 0.15 55 / 0.08)",
		todo: "oklch(0.55 0.02 270 / 0.06)",
		blocked: "oklch(0.65 0.15 25 / 0.08)",
		in_progress: "oklch(0.75 0.15 85 / 0.08)",
		done: "oklch(0.70 0.15 150 / 0.08)",
	}

	const statusLabel: Record<string, string> = {
		triage: "Triage",
		todo: "Todo",
		blocked: "Bloqué",
		in_progress: "En cours",
		done: "Fait",
	}

	const columns = useMemo<DataTableColumnDef<Todo>[]>(() => {
		const cols: DataTableColumnDef<Todo>[] = [
			{
				accessorKey: "status",
				header: "Statut",
				cell: ({ row }) => {
					if (!row.getIsGrouped()) return null
					const s = row.original.status
					return (
						<span className="flex items-center gap-1.5 text-xs font-medium text-fg">
							<StatusIcon status={s} />
							{statusLabel[s] ?? s}
						</span>
					)
				},
				sortingFn: (rowA, rowB) => {
					const a = statusOrder[rowA.getValue("status") as string] ?? 99
					const b = statusOrder[rowB.getValue("status") as string] ?? 99
					return a - b
				},
				enableSorting: true,
				filterConfig: {
					type: "select",
					options: [
						{ label: "Triage", value: "triage" },
						{ label: "Todo", value: "todo" },
						{ label: "Bloqué", value: "blocked" },
						{ label: "En cours", value: "in_progress" },
						{ label: "Fait", value: "done" },
					],
					showInlineFilter: true,
					defaultInlineFilter: true,
					filterLabel: "Statut",
				},
			},
			{
				accessorKey: "priority",
				header: "Priorité",
				enableSorting: true,
				filterConfig: {
					type: "select",
					options: [
						{ label: "Urgent", value: "urgent" },
						{ label: "High", value: "high" },
						{ label: "Normal", value: "normal" },
						{ label: "Low", value: "low" },
					],
					showInlineFilter: true,
					defaultInlineFilter: false,
					filterLabel: "Priorité",
				},
			},
			{
				accessorKey: "text",
				header: "Tâche",
				filterConfig: {
					type: "text",
					placeholder: "Rechercher…",
					showInlineFilter: true,
					defaultInlineFilter: false,
					filterLabel: "Tâche",
				},
			},
		]

		// Only include project column when not scoped to a single project
		if (!projectId) {
			cols.push({
				accessorKey: "projectName",
				header: "Projet",
				filterConfig: {
					type: "select",
					options: projectList.map((p) => ({ label: p.name, value: p.name })),
					showInlineFilter: true,
					defaultInlineFilter: true,
					filterLabel: "Projet",
				},
			})
		}

		cols.push(
			{
				accessorKey: "categoryName",
				header: "Catégorie",
				filterConfig: {
					type: "select",
					options: categoryList.map((c) => ({ label: c.name, value: c.name })),
					showInlineFilter: true,
					defaultInlineFilter: false,
					filterLabel: "Catégorie",
				},
			},
			{ accessorKey: "dueDate", header: "Échéance", enableSorting: true },
			{ accessorKey: "createdAt", header: "Créé", enableSorting: true }
		)

		return cols
	}, [projectId, projectList, categoryList])

	const views = useMemo<DataTableView[]>(
		() => [
			{
				id: "all",
				name: "Tous",
				isSystem: true,
				isDefault: true,
				filters: { id: "root", operator: "AND", conditions: [] },
			},
			{
				id: "triage",
				name: "Triage",
				isSystem: true,
				filters: {
					id: "f",
					operator: "AND",
					conditions: [{ id: "c", column: "status", operator: "equals", value: "triage", type: "select" }],
				},
			},
			{
				id: "todo",
				name: "Todo",
				isSystem: true,
				filters: {
					id: "f",
					operator: "AND",
					conditions: [{ id: "c", column: "status", operator: "equals", value: "todo", type: "select" }],
				},
			},
			{
				id: "blocked",
				name: "Bloqué",
				isSystem: true,
				filters: {
					id: "f",
					operator: "AND",
					conditions: [{ id: "c", column: "status", operator: "equals", value: "blocked", type: "select" }],
				},
			},
			{
				id: "in_progress",
				name: "En cours",
				isSystem: true,
				filters: {
					id: "f",
					operator: "AND",
					conditions: [{ id: "c", column: "status", operator: "equals", value: "in_progress", type: "select" }],
				},
			},
			{
				id: "done",
				name: "Fait",
				isSystem: true,
				filters: {
					id: "f",
					operator: "AND",
					conditions: [{ id: "c", column: "status", operator: "equals", value: "done", type: "select" }],
				},
			},
		],
		[]
	)

	const rowActions = useMemo<RowAction<Todo>[]>(
		() => [
			{
				id: "edit",
				label: "Modifier",
				icon: Pencil,
				handler: (row) => router.push(`/todos/${row.original._id}`),
			},
			{
				id: "delete",
				label: "Supprimer",
				icon: Trash2,
				variant: "destructive",
				separator: true,
				requireConfirmation: true,
				confirmationMessage: (row) => `Supprimer "${row.original.text}" ?`,
				handler: async (row) => {
					await remove({ id: row.original._id as Id<"todos"> })
					toast.success("Todo supprimé")
				},
			},
		],
		[remove, router]
	)

	const bulkActions = useMemo<BulkAction<Todo>[]>(
		() => [
			{
				id: "delete",
				label: "Supprimer",
				icon: Trash2,
				variant: "destructive",
				requireConfirmation: true,
				confirmationMessage: (count) => `Supprimer ${count} todo(s) ?`,
				handler: async (rows) => {
					await Promise.all(rows.map((r) => remove({ id: r.original._id as Id<"todos"> })))
					toast.success(`${rows.length} todo(s) supprimé(s)`)
				},
			},
		],
		[remove]
	)

	return (
		<>
			<BlockStack gap="0" className="p-6 h-full">
				{todos !== undefined && todos.length === 0 ? (
					<div className="flex flex-1 items-center justify-center h-full">
						<Empty size="lg">
							<div className="grid grid-cols-2 gap-2 mb-1">
								<CircleDashed className="size-8 text-fg-muted/40" strokeWidth={1.5} />
								<CircleDot className="size-8 text-fg-muted/40" strokeWidth={1.5} />
								<CircleSlash className="size-8 text-fg-muted/40" strokeWidth={1.5} />
								<CircleCheck className="size-8 text-fg-muted/40" strokeWidth={1.5} />
							</div>
							<EmptyTitle>Todos</EmptyTitle>
							<EmptyDescription>
								{projectId
									? "Aucun todo pour ce projet. Crée ton premier todo pour commencer."
									: "Les todos représentent le travail en cours ou à faire. Il n'y a aucun todo pour le moment. Crée ton premier todo pour commencer."}
							</EmptyDescription>
							<EmptyActions>
								<Button size="sm" onClick={() => setAddFor("triage")}>
									<Plus className="size-4" />
									Créer un todo
								</Button>
							</EmptyActions>
						</Empty>
					</div>
				) : viewMode === "list" || viewMode === "kanban" ? (
					<Bleed marginInline="600" marginBlock="600" className="flex flex-col h-full min-h-0">
						<DataTable
							data={todoRows}
							columns={columns}
							views={views}
							rowActions={viewMode === "list" ? rowActions : undefined}
							bulkActions={viewMode === "list" ? bulkActions : undefined}
							mode={viewMode === "kanban" ? "kanban" : undefined}
							toolbarLayout="stacked"
							toolbarTrailingSlot={
								<DropdownMenu>
									<DropdownMenuTrigger
										render={
											<Button variant="ghost" size="icon-sm" className="h-7 w-7">
												{viewMode === "list" ? <LayoutList className="size-3.5" /> : <Columns3 className="size-3.5" />}
											</Button>
										}
									/>
									<DropdownMenuContent align="end">
										<DropdownMenuItem onClick={() => handleSetViewMode("list")}>
											<LayoutList className="size-3.5" />
											Liste
										</DropdownMenuItem>
										<DropdownMenuItem onClick={() => handleSetViewMode("kanban")}>
											<Columns3 className="size-3.5" />
											Kanban
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							}
							enableSorting
							enableGlobalSearch
							enableAdvancedFilters
							enableCustomViews
							enableRowSelection={viewMode === "list"}
							enableGrouping
							defaultGrouping={["status"]}
							defaultSorting={[{ id: "status", desc: false }]}
							defaultExpanded
							renderGroupHeaderEnd={(row) => (
								<Button variant="ghost" size="icon-sm" onClick={() => setAddFor((row.getValue("status") as TodoStatus) ?? "triage")} className="text-fg-muted hover:text-fg">
									<Plus className="size-3.5" />
								</Button>
							)}
							groupRowStyle={(row) => {
								const s = row.getValue("status") as string
								return s ? { background: statusTint[s] ?? "transparent" } : undefined
							}}
							onKanbanMove={async (id, _from, to) => {
								await updateStatus({ id: id as Id<"todos">, status: to as TodoStatus })
							}}
							enablePagination={false}
							searchPlaceholder="Rechercher un todo…"
							locale="fr"
							variant="flat"
							storageKey={projectId ? `${storageKeyPrefix}-${projectId}` : storageKeyPrefix}
							getRowId={(row) => row._id}
							onRowClick={viewMode === "list" ? (row) => router.push(`/todos/${row._id}`) : undefined}
							renderRow={(row) => {
								const todo = row.original
								const isDone = todo.status === "done"
								const cat = categoryList.find((c) => c._id === todo.categoryId)
								const dueInfo = todo.dueDate && !isDone ? formatDueDate(todo.dueDate) : null
								return (
									<>
										<div className={`flex min-w-0 flex-1 items-center gap-3 ${isDone ? "opacity-50" : ""}`}>
											<StatusDropdown todoId={todo._id} currentStatus={todo.status} updateStatus={updateStatus} />
											<PriorityDropdown todoId={todo._id} currentPriority={todo.priority as TodoPriority | undefined} updateTodo={updateTodo} />
											<span className={`truncate text-fg ${isDone ? "line-through" : ""}`} style={{ fontSize: 13 }}>
												{todo.text}
											</span>
										</div>
										<div className="flex shrink-0 items-center gap-2">
											{dueInfo && <span className={`text-xs whitespace-nowrap ${dueInfo.className}`}>{dueInfo.label}</span>}
											{cat && <CategoryBadge name={cat.name} color={cat.color} icon={cat.icon} />}
											{!projectId && todo.projectName && (
												<span className="inline-flex items-center rounded-full bg-muted/70 px-2 py-0.5 text-[11px] text-fg-muted whitespace-nowrap">{todo.projectName}</span>
											)}
										</div>
									</>
								)
							}}
							renderCard={(row) => {
								const todo = row.original
								return <TodoCard todo={todo as unknown as Doc<"todos">} projects={projectList} categories={categoryList} />
							}}
						/>
					</Bleed>
				) : null}
			</BlockStack>

			{addFor && (
				<AddTodoDialog
					defaultStatus={addFor}
					open={true}
					onOpenChange={(v) => !v && setAddFor(null)}
					projects={projectList}
					categories={categoryList}
					allTags={allTagsList}
					fixedProjectId={projectId}
				/>
			)}
		</>
	)
}
