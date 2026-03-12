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
