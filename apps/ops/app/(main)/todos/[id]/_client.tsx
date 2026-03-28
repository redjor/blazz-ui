"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { Divider } from "@blazz/ui/components/ui/divider"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuTrigger } from "@blazz/ui/components/ui/dropdown-menu"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Popover, PopoverContent, PopoverTrigger } from "@blazz/ui/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import type { JSONContent } from "@tiptap/react"
import { useMutation, useQuery } from "convex/react"
import { ArrowLeft, Copy, Flag, Link, Loader2, MoreHorizontal, Tag, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"
import { DueDatePicker } from "@/components/due-date-picker"
import { DOT_COLOR_MAP, getCategoryIcon, ICON_COLOR_MAP } from "@/components/manage-categories-sheet"
import { TagInput } from "@/components/tag-input"
import { TiptapEditor, type TiptapUpdatePayload } from "@/components/tiptap-editor"
import { StatusIcon } from "@/components/todos-preset"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

const STATUS_OPTIONS = [
	{ value: "triage", label: "Triage" },
	{ value: "todo", label: "Todo" },
	{ value: "blocked", label: "Bloqué" },
	{ value: "in_progress", label: "En cours" },
	{ value: "done", label: "Fait" },
]

const PRIORITY_OPTIONS = [
	{ value: "urgent", label: "Urgent" },
	{ value: "high", label: "High" },
	{ value: "normal", label: "Normal" },
	{ value: "low", label: "Low" },
]

const PRIORITY_ICON: Record<string, React.ReactNode> = {
	urgent: <Flag fill="currentColor" className="size-3 shrink-0 text-destructive" />,
	high: <Flag fill="currentColor" className="size-3 shrink-0 text-orange-500" />,
	normal: <Flag className="size-3 shrink-0 text-fg-muted" />,
	low: <Flag className="size-3 shrink-0 text-fg-muted opacity-40" />,
}

type TodoStatus = "triage" | "todo" | "blocked" | "in_progress" | "done"
type TodoPriority = "urgent" | "high" | "normal" | "low"
type SaveState = "idle" | "pending" | "saving" | "saved" | "error"
type SaveField = "title" | "description"
type EditorValue = JSONContent | string

const EMPTY_EDITOR_DOC: JSONContent = {
	type: "doc",
	content: [{ type: "paragraph" }],
}

function getStoredDescriptionJsonContent(value: unknown): JSONContent | null {
	if (!value) return null
	if (typeof value === "string") {
		try {
			return JSON.parse(value) as JSONContent
		} catch (error) {
			console.error("Failed to parse stored todo description JSON", error)
			return null
		}
	}
	if (typeof value === "object") {
		return value as JSONContent
	}
	return null
}

function getLegacyDescriptionContent(description?: string | null): EditorValue {
	if (!description) return EMPTY_EDITOR_DOC
	return description.startsWith("<") ? description : `<p>${description}</p>`
}

function getCompositeSaveState(saveState: Record<SaveField, SaveState>): SaveState {
	if (saveState.title === "error" || saveState.description === "error") return "error"
	if (saveState.title === "saving" || saveState.description === "saving") return "saving"
	if (saveState.title === "pending" || saveState.description === "pending") return "pending"
	if (saveState.title === "saved" || saveState.description === "saved") return "saved"
	return "idle"
}

function getSaveStateLabel(state: SaveState) {
	switch (state) {
		case "saving":
			return "Enregistrement..."
		case "pending":
			return "Modifications en attente"
		case "saved":
			return "Enregistré"
		case "error":
			return "Erreur d'enregistrement"
		default:
			return null
	}
}

export default function TodoDetailPageClient() {
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

	const [deleteOpen, setDeleteOpen] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [title, setTitle] = useState("")
	const [descriptionContent, setDescriptionContent] = useState<EditorValue>(EMPTY_EDITOR_DOC)
	const [saveState, setSaveState] = useState<Record<SaveField, SaveState>>({
		title: "idle",
		description: "idle",
	})
	const titleInitialized = useRef(false)
	const descInitialized = useRef(false)
	const saveTimeouts = useRef<Record<SaveField, ReturnType<typeof setTimeout> | null>>({
		title: null,
		description: null,
	})
	const saveSequence = useRef<Record<SaveField, number>>({
		title: 0,
		description: 0,
	})

	useEffect(() => {
		if (todo && !titleInitialized.current) {
			setTitle(todo.text)
			setSaveState((current) => ({ ...current, title: "idle" }))
			titleInitialized.current = true
		}
	}, [todo])

	useEffect(() => {
		if (todo && !descInitialized.current) {
			setDescriptionContent(getStoredDescriptionJsonContent(todo.descriptionJson) ?? getLegacyDescriptionContent(todo.description))
			setSaveState((current) => ({ ...current, description: "idle" }))
			descInitialized.current = true
		}
	}, [todo])

	useEffect(() => {
		return () => {
			for (const timeout of Object.values(saveTimeouts.current)) {
				if (timeout) clearTimeout(timeout)
			}
		}
	}, [])

	const compositeState = getCompositeSaveState(saveState)

	const topBarActions = todo ? (
		<>
			<DropdownMenu>
				<DropdownMenuTrigger render={<Button type="button" variant="ghost" size="icon-sm" className="text-fg-muted" />}>
					<MoreHorizontal className="size-4" />
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuItem
						onClick={() => {
							void navigator.clipboard.writeText(window.location.href)
						}}
					>
						<Link className="size-4" />
						Copier le lien
					</DropdownMenuItem>
					<DropdownMenuItem
						onClick={() => {
							void navigator.clipboard.writeText(todo.text)
						}}
					>
						<Copy className="size-4" />
						Copier le titre
					</DropdownMenuItem>
					<DropdownMenuSeparator />
					<DropdownMenuItem variant="destructive" onClick={() => setDeleteOpen(true)}>
						<Trash2 className="size-4" />
						Supprimer
						<DropdownMenuShortcut>⌫</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
			{compositeState !== "idle" && (
				<span className="flex items-center gap-1.5 text-xs text-fg-muted">
					{(compositeState === "saving" || compositeState === "pending") && <Loader2 className="size-3 animate-spin" />}
					{getSaveStateLabel(compositeState)}
				</span>
			)}
		</>
	) : null

	useAppTopBar([{ label: "Todos", href: "/todos" }, { label: todo?.text ?? "…" }], topBarActions)

	function scheduleSave(field: SaveField, callback: () => Promise<void>, delay = 1500) {
		if (!todo) return

		const timeout = saveTimeouts.current[field]
		if (timeout) clearTimeout(timeout)

		const sequence = ++saveSequence.current[field]
		setSaveState((current) => ({
			...current,
			[field]: current[field] === "saving" ? "saving" : "pending",
		}))

		saveTimeouts.current[field] = setTimeout(async () => {
			setSaveState((current) => ({ ...current, [field]: "saving" }))
			try {
				await callback()
				if (saveSequence.current[field] !== sequence) return
				setSaveState((current) => ({ ...current, [field]: "saved" }))
			} catch (error) {
				console.error(`Failed to save ${field}`, error)
				if (saveSequence.current[field] !== sequence) return
				setSaveState((current) => ({ ...current, [field]: "error" }))
			}
		}, delay)
	}

	function handleTitleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
		const nextTitle = e.target.value
		setTitle(nextTitle)

		if (!todo || !titleInitialized.current) return

		const trimmedTitle = nextTitle.trim()
		if (!trimmedTitle) {
			const timeout = saveTimeouts.current.title
			if (timeout) clearTimeout(timeout)
			setSaveState((current) => ({ ...current, title: "idle" }))
			return
		}

		scheduleSave("title", async () => {
			await updateTodo({ id: todo._id, text: trimmedTitle })
		})
	}

	function handleDescriptionChange(payload: TiptapUpdatePayload) {
		setDescriptionContent(payload.json)
		if (!todo || !descInitialized.current) return

		scheduleSave("description", async () => {
			await updateTodo({
				id: todo._id,
				description: payload.text || null,
				descriptionJson: payload.isEmpty ? null : JSON.stringify(payload.json),
			})
		})
	}

	async function updateTodoStatusValue(status: TodoStatus | null) {
		if (!status || !todo) return
		await updateStatus({ id: todo._id, status })
	}

	async function handlePriorityChange(priority: string) {
		if (!todo) return
		await updateTodo({ id: todo._id, priority: (priority || "normal") as TodoPriority })
	}

	async function handleDueDateChange(date: string) {
		if (!todo) return
		await updateTodo({ id: todo._id, dueDate: date || null })
	}

	async function updateProjectValue(projectId: string | null) {
		if (!todo) return
		await updateTodo({ id: todo._id, projectId: (projectId || null) as Id<"projects"> | null })
	}

	async function updateCategoryValue(categoryId: string | null) {
		if (!todo) return
		await updateTodo({ id: todo._id, categoryId: (categoryId || null) as Id<"categories"> | null })
	}

	async function handleTagsChange(tags: string[]) {
		if (!todo) return
		await updateTodo({ id: todo._id, tags: tags.length > 0 ? tags : null })
	}

	async function handleDelete() {
		if (!todo) return
		setIsDeleting(true)
		try {
			await removeTodo({ id: todo._id })
			router.push("/todos")
		} finally {
			setIsDeleting(false)
		}
	}

	if (todo === undefined) {
		return (
			<Box padding="6">
				<BlockStack gap="600">
					<Skeleton className="h-8 w-48" />
					<BlockStack gap="400" className="max-w-3xl mx-auto w-full">
						<Skeleton className="h-10 w-full" />
						<Skeleton className="h-7 w-96" />
						<Skeleton className="h-64 w-full" />
					</BlockStack>
				</BlockStack>
			</Box>
		)
	}

	if (todo === null) {
		return (
			<Box padding="6">
				<BlockStack gap="800">
					<Button variant="ghost" size="sm" onClick={() => router.push("/todos")}>
						<ArrowLeft className="size-4 mr-2" />
						Retour
					</Button>
					<p className="text-center text-fg-muted">Todo introuvable.</p>
				</BlockStack>
			</Box>
		)
	}

	const currentCategory = categoryList.find((c) => c._id === todo.categoryId)

	return (
		<>
			<Box padding="6">
				<BlockStack gap="600">
					{/* Content — single column, centered */}
					<BlockStack gap="400" className="min-w-0 max-w-3xl mx-auto w-full">
						{/* Title */}
						<BlockStack gap="100" className="pt-4">
							<textarea
								value={title}
								onChange={handleTitleChange}
								rows={1}
								className="w-full resize-none overflow-hidden text-3xl font-semibold text-fg bg-transparent border-none outline-none placeholder:text-fg-muted field-sizing-content"
								placeholder="Titre du todo"
							/>
						</BlockStack>

						{/* Inline property bar */}
						<InlineStack gap="050" blockAlign="center" wrap className="rounded-lg border border-edge px-1.5 py-1 w-fit">
							{/* Status */}
							<Select value={todo.status} onValueChange={(value) => void updateTodoStatusValue(value)} items={STATUS_OPTIONS}>
								<SelectTrigger size="sm" className="!border-none !bg-transparent hover:!bg-muted !h-7 gap-1.5 !px-2 !text-xs text-fg-muted !shadow-none">
									<StatusIcon status={todo.status} />
									<SelectValue />
								</SelectTrigger>
								<SelectContent alignItemWithTrigger={false}>
									{STATUS_OPTIONS.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											<InlineStack gap="200" blockAlign="center">
												<StatusIcon status={option.value} />
												{option.label}
											</InlineStack>
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<span className="text-fg-muted/20 text-xs select-none">|</span>

							{/* Due date */}
							<DueDatePicker value={todo.dueDate ?? ""} onChange={handleDueDateChange} compact />

							<span className="text-fg-muted/20 text-xs select-none">|</span>

							{/* Priority */}
							<Select value={todo.priority ?? "normal"} onValueChange={handlePriorityChange} items={PRIORITY_OPTIONS}>
								<SelectTrigger size="sm" className="!border-none !bg-transparent hover:!bg-muted !h-7 gap-1.5 !px-2 !text-xs text-fg-muted !shadow-none">
									{PRIORITY_ICON[todo.priority ?? "normal"]}
									<SelectValue />
								</SelectTrigger>
								<SelectContent alignItemWithTrigger={false}>
									{PRIORITY_OPTIONS.map((option) => (
										<SelectItem key={option.value} value={option.value}>
											<InlineStack gap="200" blockAlign="center">
												{PRIORITY_ICON[option.value]}
												{option.label}
											</InlineStack>
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<span className="text-fg-muted/20 text-xs select-none">|</span>

							{/* Project */}
							<Select
								value={todo.projectId ?? ""}
								onValueChange={(value) => void updateProjectValue(value)}
								items={[{ value: "", label: "Aucun" }, ...projectList.map((project) => ({ value: project._id, label: project.name }))]}
							>
								<SelectTrigger size="sm" className="!border-none !bg-transparent hover:!bg-muted !h-7 gap-1.5 !px-2 !text-xs text-fg-muted !shadow-none">
									<SelectValue placeholder="Projet" />
								</SelectTrigger>
								<SelectContent alignItemWithTrigger={false}>
									<SelectItem value="">Aucun</SelectItem>
									{projectList.map((project) => (
										<SelectItem key={project._id} value={project._id}>
											{project.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							<span className="text-fg-muted/20 text-xs select-none">|</span>

							{/* Category */}
							<Select
								value={todo.categoryId ?? ""}
								onValueChange={(value) => void updateCategoryValue(value)}
								items={[
									{ value: "", label: "Aucune" },
									...categoryList.map((category) => ({
										value: category._id,
										label: category.name,
									})),
								]}
							>
								<SelectTrigger size="sm" className="!border-none !bg-transparent hover:!bg-muted !h-7 gap-1.5 !px-2 !text-xs text-fg-muted !shadow-none">
									{currentCategory ? (
										<>
											{(() => {
												const Icon = getCategoryIcon(currentCategory.icon)
												const iconColor = ICON_COLOR_MAP[currentCategory.color ?? "zinc"] ?? ICON_COLOR_MAP.zinc
												const dotColor = DOT_COLOR_MAP[currentCategory.color ?? "zinc"] ?? DOT_COLOR_MAP.zinc
												return Icon ? <Icon className={`size-3 shrink-0 ${iconColor}`} /> : <span className={`size-2 shrink-0 rounded-full ${dotColor}`} />
											})()}
											<span className="text-xs">{currentCategory.name}</span>
										</>
									) : (
										<span className="text-xs text-fg-muted">Catégorie</span>
									)}
								</SelectTrigger>
								<SelectContent alignItemWithTrigger={false}>
									<SelectItem value="">Aucune</SelectItem>
									{categoryList.map((category) => {
										const CatIcon = getCategoryIcon(category.icon)
										const catIconColor = ICON_COLOR_MAP[category.color ?? "zinc"] ?? ICON_COLOR_MAP.zinc
										const catDotColor = DOT_COLOR_MAP[category.color ?? "zinc"] ?? DOT_COLOR_MAP.zinc
										return (
											<SelectItem key={category._id} value={category._id}>
												{CatIcon ? <CatIcon className={`size-3 shrink-0 ${catIconColor}`} /> : <span className={`size-2 shrink-0 rounded-full ${catDotColor}`} />}
												{category.name}
											</SelectItem>
										)
									})}
								</SelectContent>
							</Select>

							{/* Tags */}
							<span className="text-fg-muted/20 text-xs select-none">|</span>
							<Popover>
								<PopoverTrigger render={<Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs text-fg-muted gap-1.5" />}>
									<Tag className="size-3" />
									{(todo.tags ?? []).length > 0 ? <span className="text-xs">{(todo.tags ?? []).join(", ")}</span> : <span className="text-xs text-fg-muted">Tags</span>}
								</PopoverTrigger>
								<PopoverContent className="w-72 p-3" align="start">
									<TagInput value={todo.tags ?? []} onChange={handleTagsChange} suggestions={allTagsList} />
								</PopoverContent>
							</Popover>
						</InlineStack>

						<Divider />

						{/* Editor — negative margin so text aligns with title (pl-14 is for drag handles) */}
						<div className="-ml-14">
							<TiptapEditor content={descriptionContent} onUpdate={handleDescriptionChange} />
						</div>
					</BlockStack>
				</BlockStack>
			</Box>

			{/* Delete confirmation dialog */}
			<Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Supprimer ce todo ?</DialogTitle>
						<DialogDescription>Cette action est irréversible. Le todo « {todo.text} » sera définitivement supprimé.</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button type="button" variant="outline" onClick={() => setDeleteOpen(false)} disabled={isDeleting}>
							Annuler
						</Button>
						<Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
							{isDeleting ? "Suppression…" : "Supprimer"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}
