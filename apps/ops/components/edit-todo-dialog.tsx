"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { Input } from "@blazz/ui/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"
import { Textarea } from "@blazz/ui/components/ui/textarea"
import { useMutation } from "convex/react"
import { Flag, Trash2 } from "lucide-react"
import { useState } from "react"
import { CategoryBadge } from "@/components/manage-categories-sheet"
import { TagInput } from "@/components/tag-input"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"

export type Category = { _id: string; name: string; color?: string }

const PRIORITY_ICON: Record<string, { color: string }> = {
	urgent: { color: "text-destructive" },
	high: { color: "text-orange-500" },
	low: { color: "text-fg-muted" },
}

export function PriorityIcon({ priority }: { priority?: string }) {
	if (!priority || priority === "normal") return null
	const config = PRIORITY_ICON[priority]
	if (!config) return null
	return <Flag className={`size-3 shrink-0 ${config.color}`} />
}

export function ProjectBadge({
	projectId,
	projects,
}: {
	projectId?: Id<"projects">
	projects: Doc<"projects">[]
}) {
	if (!projectId) return null
	const proj = projects.find((p) => p._id === projectId)
	if (!proj) return null
	return (
		<Badge variant="secondary" fill="subtle" size="sm" className="max-w-[100px] truncate">
			{proj.name}
		</Badge>
	)
}

export function EditTodoDialog({
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
	const remove = useMutation(api.todos.remove)
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

	async function handleDelete() {
		await remove({ id: todo._id })
		onOpenChange(false)
	}

	return (
		<Dialog
			open={open}
			onOpenChange={(v) => {
				if (!v) resetToTodo()
				onOpenChange(v)
			}}
		>
			<DialogContent size="lg">
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
					<div className="flex justify-between gap-2">
						<Button
							type="button"
							variant="ghost"
							size="icon-sm"
							onClick={handleDelete}
							aria-label="Supprimer"
							className="text-fg-muted hover:text-destructive"
						>
							<Trash2 className="size-4" />
						</Button>
						<div className="flex gap-2">
							<Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
								Annuler
							</Button>
							<Button type="submit" disabled={!text.trim() || unchanged}>
								Sauvegarder
							</Button>
						</div>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	)
}
