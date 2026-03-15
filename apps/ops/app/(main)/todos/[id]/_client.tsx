"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import { Combobox, type ComboboxOption } from "@blazz/ui/components/ui/combobox"
import { Divider } from "@blazz/ui/components/ui/divider"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Label } from "@blazz/ui/components/ui/label"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import type { JSONContent } from "@tiptap/react"
import { useMutation, useQuery } from "convex/react"
import { ArrowLeft, Flag, Trash2 } from "lucide-react"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useRef, useState } from "react"
import { DueDatePicker } from "@/components/due-date-picker"
import { CategoryBadge } from "@/components/manage-categories-sheet"
import { useOpsTopBar } from "@/components/ops-frame"
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

const PRIORITY_OPTIONS: ComboboxOption[] = [
	{
		value: "urgent",
		label: "Urgent",
		icon: <Flag fill="currentColor" className="size-3 shrink-0 text-destructive" />,
	},
	{
		value: "high",
		label: "High",
		icon: <Flag fill="currentColor" className="size-3 shrink-0 text-orange-500" />,
	},
	{ value: "normal", label: "Normal", icon: <Flag className="size-3 shrink-0 text-fg-muted" /> },
	{
		value: "low",
		label: "Low",
		icon: <Flag className="size-3 shrink-0 text-fg-muted opacity-40" />,
	},
]

type TodoStatus = "triage" | "todo" | "blocked" | "in_progress" | "done"
type TodoPriority = "urgent" | "high" | "normal" | "low"
type SaveState = "idle" | "pending" | "saving" | "saved" | "error"
type SaveField = "title" | "description"
type EditorValue = JSONContent | string

const EMPTY_EDITOR_DOC: JSONContent = {
	type: "doc",
	content: [{ type: "paragraph" }],
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
			setDescriptionContent(
				(todo.descriptionJson as JSONContent | undefined) ??
					getLegacyDescriptionContent(todo.description)
			)
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

	useOpsTopBar([{ label: "Todos", href: "/todos" }, { label: todo?.text ?? "…" }])

	function scheduleSave(field: SaveField, callback: () => Promise<void>, delay = 800) {
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

	const saveStateLabel = useMemo(
		() => getSaveStateLabel(getCompositeSaveState(saveState)),
		[saveState]
	)

	function handleTitleChange(e: React.ChangeEvent<HTMLInputElement>) {
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
				descriptionJson: payload.isEmpty ? null : payload.json,
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
		await removeTodo({ id: todo._id })
		router.push("/todos")
	}

	if (todo === undefined) {
		return (
			<Box padding="6">
				<BlockStack gap="600">
					<Skeleton className="h-8 w-48" />
					<div className="grid gap-6 lg:grid-cols-[1fr_320px]">
						<BlockStack gap="400">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-64 w-full" />
						</BlockStack>
						<BlockStack gap="400">
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
							<Skeleton className="h-10 w-full" />
						</BlockStack>
					</div>
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

	return (
		<Box padding="6">
			<BlockStack gap="600">
				<InlineStack gap="300" blockAlign="center">
					<Button variant="ghost" size="icon-sm" onClick={() => router.push("/todos")}>
						<ArrowLeft className="size-4" />
					</Button>
					<InlineStack gap="200" blockAlign="center">
						<StatusIcon status={todo.status} />
						<span className="text-sm text-fg-muted">
							{STATUS_OPTIONS.find((option) => option.value === todo.status)?.label ?? todo.status}
						</span>
					</InlineStack>
					{saveStateLabel ? <span className="text-xs text-fg-muted">{saveStateLabel}</span> : null}
				</InlineStack>

				<div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
					<BlockStack gap="400" className="min-w-0 max-w-3xl justify-self-center w-full">
						<input
							type="text"
							value={title}
							onChange={handleTitleChange}
							className="w-full text-3xl font-semibold text-fg bg-transparent border-none outline-none placeholder:text-fg-muted"
							placeholder="Titre du todo"
						/>
						<TiptapEditor content={descriptionContent} onUpdate={handleDescriptionChange} />
					</BlockStack>

					<BlockStack gap="500">
						<BlockStack gap="150">
							<Label className="text-xs text-fg-muted">Status</Label>
							<Select
								value={todo.status}
								onValueChange={(value) => void updateTodoStatusValue(value)}
								items={STATUS_OPTIONS}
							>
								<SelectTrigger className="w-full">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
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
						</BlockStack>

						<BlockStack gap="150">
							<Label className="text-xs text-fg-muted">Priorité</Label>
							<Combobox
								value={todo.priority ?? "normal"}
								onValueChange={handlePriorityChange}
								options={PRIORITY_OPTIONS}
								placeholder="Priorité"
								searchPlaceholder="Rechercher…"
								emptyMessage="Aucun résultat"
							/>
						</BlockStack>

						<BlockStack gap="150">
							<Label className="text-xs text-fg-muted">Échéance</Label>
							<DueDatePicker value={todo.dueDate ?? ""} onChange={handleDueDateChange} />
						</BlockStack>

						<BlockStack gap="150">
							<Label className="text-xs text-fg-muted">Projet</Label>
							<Select
								value={todo.projectId ?? ""}
								onValueChange={(value) => void updateProjectValue(value)}
								items={[
									{ value: "", label: "Aucun" },
									...projectList.map((project) => ({ value: project._id, label: project.name })),
								]}
							>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Aucun" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="">Aucun</SelectItem>
									{projectList.map((project) => (
										<SelectItem key={project._id} value={project._id}>
											{project.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</BlockStack>

						<BlockStack gap="150">
							<Label className="text-xs text-fg-muted">Catégorie</Label>
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
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Aucune" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="">Aucune</SelectItem>
									{categoryList.map((category) => (
										<SelectItem key={category._id} value={category._id}>
											<CategoryBadge name={category.name} color={category.color} />
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</BlockStack>

						<BlockStack gap="150">
							<Label className="text-xs text-fg-muted">Tags</Label>
							<TagInput
								value={todo.tags ?? []}
								onChange={handleTagsChange}
								suggestions={allTagsList}
							/>
						</BlockStack>

						<Divider />

						<Button
							variant="ghost"
							size="sm"
							onClick={handleDelete}
							className="text-fg-muted hover:text-destructive w-full justify-start"
						>
							<Trash2 className="size-4 mr-2" />
							Supprimer ce todo
						</Button>
					</BlockStack>
				</div>
			</BlockStack>
		</Box>
	)
}
