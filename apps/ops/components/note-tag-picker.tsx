"use client"

import { Popover, PopoverContent, PopoverTrigger } from "@blazz/ui/components/ui/popover"
import { ScrollArea } from "@blazz/ui/components/ui/scroll-area"
import { useMutation, useQuery } from "convex/react"
import { Check, Plus, Tag } from "lucide-react"
import { useState } from "react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { TAG_COLORS, getTagColor } from "@/lib/tag-colors"
import type { TagColorKey } from "@/lib/tag-colors"

interface NoteTagPickerProps {
	noteId: Id<"notes">
	noteTagIds: Id<"tags">[]
}

export function NoteTagPicker({ noteId, noteTagIds }: NoteTagPickerProps) {
	const allTags = useQuery(api.tags.list) ?? []
	const createTag = useMutation(api.tags.create)
	const updateNote = useMutation(api.notes.update)

	const [search, setSearch] = useState("")
	const [newColor, setNewColor] = useState<TagColorKey>("blue")
	const [open, setOpen] = useState(false)

	const filtered = allTags.filter((t) =>
		t.name.toLowerCase().includes(search.toLowerCase())
	)

	const exactMatch = allTags.some(
		(t) => t.name.toLowerCase() === search.trim().toLowerCase()
	)

	async function toggleTag(tagId: Id<"tags">) {
		const current = noteTagIds
		const next = current.includes(tagId)
			? current.filter((id) => id !== tagId)
			: [...current, tagId]
		await updateNote({ id: noteId, tags: next })
	}

	async function handleCreate() {
		const trimmed = search.trim()
		if (!trimmed) return
		const id = await createTag({ name: trimmed, color: newColor })
		await updateNote({ id: noteId, tags: [...noteTagIds, id] })
		setSearch("")
	}

	return (
		<Popover open={open} onOpenChange={setOpen}>
			<PopoverTrigger
				className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg"
			>
				<Tag className="size-3" />
				<span>Tags</span>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-[260px] p-0">
				<div className="border-b border-edge px-3 py-2">
					<input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Chercher ou créer un tag…"
						className="w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted/60"
						autoFocus
					/>
				</div>
				<ScrollArea className="max-h-[240px]">
					<div className="p-1">
						{filtered.map((tag) => {
							const color = getTagColor(tag.color)
							const isActive = noteTagIds.includes(tag._id)
							return (
								<button
									key={tag._id}
									type="button"
									onClick={() => void toggleTag(tag._id)}
									className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm transition-colors hover:bg-surface-2"
								>
									<span className={`size-2.5 shrink-0 rounded-full ${color.dot}`} />
									<span className="min-w-0 flex-1 truncate text-left text-fg">{tag.name}</span>
									{isActive ? <Check className="size-3.5 shrink-0 text-brand" /> : null}
								</button>
							)
						})}
						{search.trim() && !exactMatch ? (
							<div className="border-t border-edge mt-1 pt-1">
								<button
									type="button"
									onClick={() => void handleCreate()}
									className="flex w-full items-center gap-2 rounded-md px-2.5 py-1.5 text-sm text-fg transition-colors hover:bg-surface-2"
								>
									<Plus className="size-3.5 shrink-0 text-fg-muted" />
									<span>Créer <strong>{search.trim()}</strong></span>
								</button>
								<div className="flex items-center gap-1.5 px-2.5 py-2">
									{TAG_COLORS.map((c) => (
										<button
											key={c.key}
											type="button"
											onClick={() => setNewColor(c.key)}
											className={`size-5 rounded-full transition-all ${c.dot} ${
												newColor === c.key
													? "ring-2 ring-fg ring-offset-2 ring-offset-surface"
													: "hover:scale-110"
											}`}
											title={c.label}
										/>
									))}
								</div>
							</div>
						) : null}
						{filtered.length === 0 && !search.trim() ? (
							<p className="px-3 py-4 text-center text-xs text-fg-muted">
								Aucun tag. Tape un nom pour en créer.
							</p>
						) : null}
					</div>
				</ScrollArea>
			</PopoverContent>
		</Popover>
	)
}
