"use client"

import type {
	BulkAction,
	DataTableColumnDef,
	DataTableView,
	RowAction,
} from "@blazz/pro/components/blocks/data-table"
import { DataTable } from "@blazz/pro/components/blocks/data-table"
import { Bleed } from "@blazz/ui/components/ui/bleed"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@blazz/ui/components/ui/dropdown-menu"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Input } from "@blazz/ui/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"
import { Textarea } from "@blazz/ui/components/ui/textarea"
import { useMutation, useQuery } from "convex/react"
import { Calendar, CircleCheck, CircleDashed, CircleDot, CircleSlash, Columns3, LayoutList, Pencil, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { DueDatePicker } from "@/components/due-date-picker"
import type { Category } from "@/components/edit-todo-dialog"
import { PriorityIcon, ProjectBadge } from "@/components/edit-todo-dialog"
import { CategoryBadge } from "@/components/manage-categories-sheet"
import { Empty, EmptyActions, EmptyDescription, EmptyIcon, EmptyTitle } from "@blazz/ui/components/ui/empty"
import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { TagInput } from "@/components/tag-input"
import type { Todo } from "@/components/todos-preset"
import { formatDueDate, StatusIcon } from "@/components/todos-preset"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"

type TodoStatus = "triage" | "todo" | "blocked" | "in_progress" | "done"

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
			className={`p-3 rounded-md border border-edge bg-surface-3 cursor-pointer hover:border-accent/50 transition-colors ${todo.status === "done" ? "opacity-60" : ""}`}
			onClick={() => router.push(`/todos/${todo._id}`)}
			role="button"
			tabIndex={0}
			onKeyDown={(e) => e.key === "Enter" && router.push(`/todos/${todo._id}`)}
		>
			<BlockStack gap="200">
				<p className="text-sm text-fg leading-snug">{todo.text}</p>
				<InlineStack gap="150" wrap>
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
					{cat && <CategoryBadge name={cat.name} color={cat.color} icon={cat.icon} />}
				</InlineStack>
				{tags.length > 0 && (
					<InlineStack gap="100" wrap>
						{tags.slice(0, 3).map((tag) => (
							<span
								key={tag}
								className="text-xs text-fg-muted bg-surface border border-edge rounded-full px-1.5 py-0"
							>
								{tag}
							</span>
						))}
						{tags.length > 3 && <span className="text-xs text-fg-muted">+{tags.length - 3}</span>}
					</InlineStack>
				)}
			</BlockStack>
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
				<form onSubmit={handleSubmit}>
					<BlockStack gap="400">
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
							<Select
								value={projectId ?? ""}
								onValueChange={(value) => setProjectId(value || undefined)}
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
						</InlineStack>
						<DueDatePicker value={dueDate} onChange={setDueDate} />
						<Select
							value={categoryId}
							onValueChange={(value) => setCategoryId(value ?? "")}
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

export default function TodosPageClient() {
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

	const remove = useMutation(api.todos.remove)
	const [viewMode, setViewMode] = useState<"kanban" | "list">(() => {
		try {
			const saved = typeof window !== "undefined" ? localStorage.getItem("ops-todos-mode") : null
			if (saved === "list" || saved === "kanban") return saved
		} catch {}
		return "kanban"
	})

	// Persist view mode
	const handleSetViewMode = (mode: "kanban" | "list") => {
		setViewMode(mode)
		try { localStorage.setItem("ops-todos-mode", mode) } catch {}
	}

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

	// ---------------------------------------------------------------------------
	// Flat DataTable — columns (data only, for filtering/sorting/grouping)
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

	const columns = useMemo<DataTableColumnDef<Todo>[]>(
		() => [
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
			{
				accessorKey: "projectName",
				header: "Projet",
				filterConfig: {
					type: "select",
					options: projectList.map((p) => ({ label: p.name, value: p.name })),
					showInlineFilter: true,
					defaultInlineFilter: true,
					filterLabel: "Projet",
				},
			},
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
			{ accessorKey: "createdAt", header: "Créé", enableSorting: true },
		],
		[projectList, categoryList]
	)

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
					conditions: [
						{ id: "c", column: "status", operator: "equals", value: "triage", type: "select" },
					],
				},
			},
			{
				id: "todo",
				name: "Todo",
				isSystem: true,
				filters: {
					id: "f",
					operator: "AND",
					conditions: [
						{ id: "c", column: "status", operator: "equals", value: "todo", type: "select" },
					],
				},
			},
			{
				id: "blocked",
				name: "Bloqué",
				isSystem: true,
				filters: {
					id: "f",
					operator: "AND",
					conditions: [
						{ id: "c", column: "status", operator: "equals", value: "blocked", type: "select" },
					],
				},
			},
			{
				id: "in_progress",
				name: "En cours",
				isSystem: true,
				filters: {
					id: "f",
					operator: "AND",
					conditions: [
						{ id: "c", column: "status", operator: "equals", value: "in_progress", type: "select" },
					],
				},
			},
			{
				id: "done",
				name: "Fait",
				isSystem: true,
				filters: {
					id: "f",
					operator: "AND",
					conditions: [
						{ id: "c", column: "status", operator: "equals", value: "done", type: "select" },
					],
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

	useAppTopBar([{ label: "Todos" }])

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
								Les todos représentent le travail en cours ou à faire. Il n'y a aucun todo pour le moment. Crée ton premier todo pour commencer.
							</EmptyDescription>
							<EmptyActions>
								<Button size="sm" onClick={() => setAddFor("triage")}>
									<Plus className="size-4" />
									Créer un todo
								</Button>
							</EmptyActions>
						</Empty>
					</div>
				) : (viewMode === "list" || viewMode === "kanban") ? (
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
									<DropdownMenuTrigger render={
										<Button variant="ghost" size="icon-sm" className="h-7 w-7">
											{viewMode === "list" ? <LayoutList className="size-3.5" /> : <Columns3 className="size-3.5" />}
										</Button>
									} />
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
							defaultExpanded
							renderGroupHeaderEnd={(row) => (
								<Button
									variant="ghost"
									size="icon-sm"
									onClick={() => setAddFor(row.getValue("status") as TodoStatus ?? "triage")}
									className="text-fg-muted hover:text-fg"
								>
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
							storageKey="ops-todos"
							getRowId={(row) => row._id}
							onRowClick={viewMode === "list" ? (row) => router.push(`/todos/${row._id}`) : undefined}
							renderRow={(row) => {
								const todo = row.original
								const isDone = todo.status === "done"
								const cat = categoryList.find((c) => c._id === todo.categoryId)
								const dueInfo = todo.dueDate && !isDone ? formatDueDate(todo.dueDate) : null
								return (
									<>
										<div
											className={`flex min-w-0 flex-1 items-center gap-3 ${isDone ? "opacity-50" : ""}`}
										>
											<StatusIcon status={todo.status} />
											<span
												className={`truncate text-fg ${isDone ? "line-through" : ""}`}
												style={{ fontSize: 13 }}
											>
												{todo.text}
											</span>
										</div>
										<div className="flex shrink-0 items-center gap-2">
											{dueInfo && (
												<span className={`text-xs whitespace-nowrap ${dueInfo.className}`}>
													{dueInfo.label}
												</span>
											)}
											{cat && <CategoryBadge name={cat.name} color={cat.color} icon={cat.icon} />}
											{todo.projectName && (
												<span className="inline-flex items-center rounded-full bg-surface-3/70 px-2 py-0.5 text-[11px] text-fg-muted whitespace-nowrap">
													{todo.projectName}
												</span>
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
				/>
			)}
		</>
	)
}
