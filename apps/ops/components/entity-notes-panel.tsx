"use client"

import { useTabTitle } from "@blazz/tabs"
import { ConfirmationDialog } from "@blazz/ui/components/ui/confirmation-dialog"
import { Empty } from "@blazz/ui/components/ui/empty"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { ScrollArea } from "@blazz/ui/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@blazz/ui/components/ui/tooltip"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { type TreeNode, TreeView } from "@blazz/ui/components/ui/tree-view"
import type { JSONContent } from "@tiptap/react"
import { useMutation, useQuery } from "convex/react"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { FileText, FolderOpen, Loader2, Lock, LockOpen, Pin, Plus, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import type { ChangeEvent } from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { NoteTagPicker } from "@/components/note-tag-picker"
import { TiptapEditor, type TiptapUpdatePayload } from "@/components/tiptap-editor"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { getTagColor } from "@/lib/tag-colors"

type NoteEntityType = "client" | "project" | "contract" | "invoice" | "todo" | "general"
type EditorValue = JSONContent | string
type SaveState = "idle" | "pending" | "saving" | "saved" | "error"
type SaveField = "title" | "content"
type NotesScope = "entity" | "all"

const EMPTY_EDITOR_DOC: JSONContent = {
	type: "doc",
	content: [{ type: "paragraph" }],
}

const ENTITY_TYPE_LABELS: Record<NoteEntityType, string> = {
	general: "Général",
	client: "Clients",
	project: "Projets",
	contract: "Contrats",
	invoice: "Factures",
	todo: "Tâches",
}

function getStoredContent(value: unknown): EditorValue {
	if (!value) return EMPTY_EDITOR_DOC
	if (typeof value === "string") {
		try {
			return JSON.parse(value) as JSONContent
		} catch (error) {
			console.error("Failed to parse note content JSON", error)
			return EMPTY_EDITOR_DOC
		}
	}
	if (typeof value === "object") {
		return value as JSONContent
	}
	return EMPTY_EDITOR_DOC
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

function getCompositeSaveState(saveState: Record<SaveField, SaveState>): SaveState {
	if (saveState.title === "error" || saveState.content === "error") return "error"
	if (saveState.title === "saving" || saveState.content === "saving") return "saving"
	if (saveState.title === "pending" || saveState.content === "pending") return "pending"
	if (saveState.title === "saved" || saveState.content === "saved") return "saved"
	return "idle"
}

function getDisplayTitle(note: Doc<"notes">) {
	const title = note.title.trim()
	return title || "Nouvelle note"
}

function buildTreeData(noteList: Doc<"notes">[], scope: NotesScope): TreeNode[] {
	if (scope === "entity") {
		return noteList.map((note) => ({
			id: note._id,
			label: getDisplayTitle(note),
			icon: note.pinned ? (
				<Pin className="size-3.5 text-amber-500" />
			) : (
				<FileText className="size-3.5" />
			),
		}))
	}

	const groups = new Map<NoteEntityType, Doc<"notes">[]>()
	for (const note of noteList) {
		const type = note.entityType as NoteEntityType
		if (!groups.has(type)) groups.set(type, [])
		groups.get(type)!.push(note)
	}

	const tree: TreeNode[] = []
	for (const [type, notes] of groups) {
		tree.push({
			id: `group:${type}`,
			label: ENTITY_TYPE_LABELS[type] ?? type,
			icon: <FolderOpen className="size-3.5" />,
			children: notes.map((note) => ({
				id: note._id,
				label: getDisplayTitle(note),
				icon: note.pinned ? (
					<Pin className="size-3.5 text-amber-500" />
				) : (
					<FileText className="size-3.5" />
				),
			})),
		})
	}

	return tree
}

export function EntityNotesPanel({
	scope = "entity",
	entityType,
	entityId,
	emptyTitle,
	emptyDescription,
	defaultCreateEntityType,
	initialNoteId,
}: {
	scope?: NotesScope
	entityType: NoteEntityType
	entityId?: string
	emptyTitle: string
	emptyDescription: string
	defaultCreateEntityType?: NoteEntityType
	/** Pre-selected note ID from the URL (e.g. /notes/[id]) */
	initialNoteId?: string
}) {
	const entityNotes = useQuery(api.notes.listByEntity, { entityType, entityId })
	const recentNotes = useQuery(api.notes.listRecent, {})
	const allTags = useQuery(api.tags.list)
	const createNote = useMutation(api.notes.create)
	const updateNote = useMutation(api.notes.update)
	const removeNote = useMutation(api.notes.remove)

	const router = useRouter()

	const [selectedNoteId, setSelectedNoteIdState] = useState<Id<"notes"> | null>(
		(initialNoteId as Id<"notes">) ?? null
	)
	const [title, setTitle] = useState("")
	const [content, setContent] = useState<EditorValue>(EMPTY_EDITOR_DOC)
	const [isCreating, setIsCreating] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
	const [saveState, setSaveState] = useState<Record<SaveField, SaveState>>({
		title: "idle",
		content: "idle",
	})
	const [expandedGroups, setExpandedGroups] = useState<string[]>([])

	const saveTimeouts = useRef<Record<SaveField, ReturnType<typeof setTimeout> | null>>({
		title: null,
		content: null,
	})
	const saveSequence = useRef<Record<SaveField, number>>({
		title: 0,
		content: 0,
	})
	const selectedNoteRef = useRef<Id<"notes"> | null>(null)

	const setSelectedNoteId = useCallback(
		(id: Id<"notes"> | null) => {
			setSelectedNoteIdState(id)
			if (scope === "all") {
				if (id) {
					router.replace(`/notes/${id}`, { scroll: false })
				} else {
					router.replace("/notes", { scroll: false })
				}
			}
		},
		[scope, router]
	)

	const notes = scope === "all" ? recentNotes : entityNotes
	const noteList = notes ?? []
	const selectedNote = useMemo(
		() => noteList.find((note) => note._id === selectedNoteId) ?? null,
		[noteList, selectedNoteId]
	)

	const treeData = useMemo(() => buildTreeData(noteList, scope), [noteList, scope])

	// Update browser tab title with selected note
	useTabTitle(
		scope === "all" && selectedNote ? `Notes · ${getDisplayTitle(selectedNote)}` : "Notes"
	)

	// Auto-expand all groups on first load
	useEffect(() => {
		if (notes === undefined || expandedGroups.length > 0) return
		const groupIds = treeData.filter((n) => n.children).map((n) => n.id)
		if (groupIds.length > 0) setExpandedGroups(groupIds)
	}, [notes, treeData, expandedGroups.length])

	useEffect(() => {
		if (notes === undefined) return

		const selectedStillExists = notes.some((note) => note._id === selectedNoteId)
		if (!selectedNoteId || !selectedStillExists) {
			setSelectedNoteId(notes[0]?._id ?? null)
		}
	}, [notes, selectedNoteId])

	useEffect(() => {
		return () => {
			for (const timeout of Object.values(saveTimeouts.current)) {
				if (timeout) clearTimeout(timeout)
			}
		}
	}, [])

	useEffect(() => {
		if (!selectedNote) {
			selectedNoteRef.current = null
			setTitle("")
			setContent(EMPTY_EDITOR_DOC)
			setSaveState({ title: "idle", content: "idle" })
			return
		}

		if (selectedNoteRef.current === selectedNote._id) return

		selectedNoteRef.current = selectedNote._id
		setTitle(selectedNote.title)
		setContent(getStoredContent(selectedNote.contentJson))
		setSaveState({ title: "idle", content: "idle" })
	}, [selectedNote])

	async function handleCreateNote() {
		setIsCreating(true)
		try {
			const id = await createNote({
				entityType: defaultCreateEntityType ?? entityType,
				entityId:
					defaultCreateEntityType && defaultCreateEntityType !== entityType ? undefined : entityId,
				title: "Nouvelle note",
			})
			setSelectedNoteId(id)
		} finally {
			setIsCreating(false)
		}
	}

	function scheduleSave(field: SaveField, callback: () => Promise<void>, delay = 1200) {
		if (!selectedNote) return

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
				console.error(`Failed to save note ${field}`, error)
				if (saveSequence.current[field] !== sequence) return
				setSaveState((current) => ({ ...current, [field]: "error" }))
			}
		}, delay)
	}

	function handleTitleChange(event: ChangeEvent<HTMLTextAreaElement>) {
		const nextTitle = event.target.value
		setTitle(nextTitle)
		if (!selectedNote) return

		scheduleSave("title", async () => {
			await updateNote({
				id: selectedNote._id,
				title: nextTitle.trim() || "Nouvelle note",
			})
		})
	}

	function handleContentChange(payload: TiptapUpdatePayload) {
		setContent(payload.json)
		if (!selectedNote) return

		scheduleSave("content", async () => {
			await updateNote({
				id: selectedNote._id,
				contentText: payload.text || null,
				contentJson: payload.isEmpty ? null : JSON.stringify(payload.json),
			})
		})
	}

	async function handleTogglePinned() {
		if (!selectedNote) return
		await updateNote({ id: selectedNote._id, pinned: !selectedNote.pinned })
	}

	async function handleToggleLocked() {
		if (!selectedNote) return
		await updateNote({ id: selectedNote._id, locked: !selectedNote.locked })
	}

	async function handleDeleteNote() {
		if (!selectedNote) return
		setIsDeleting(true)
		try {
			const currentId = selectedNote._id
			await removeNote({ id: currentId })
			const currentIndex = noteList.findIndex((note) => note._id === currentId)
			const fallback = noteList[currentIndex + 1] ?? noteList[currentIndex - 1] ?? null
			setSelectedNoteId(fallback?._id ?? null)
		} finally {
			setIsDeleting(false)
		}
	}

	function handleTreeSelect(ids: string[]) {
		const id = ids[0]
		if (!id || id.startsWith("group:")) return
		setSelectedNoteId(id as Id<"notes">)
	}

	const compositeState = getCompositeSaveState(saveState)

	if (notes === undefined) {
		return (
			<div className="flex h-full">
				<div className="w-[240px] shrink-0 border-r border-edge p-3">
					<Skeleton className="mb-3 h-6 w-16 rounded" />
					<Skeleton className="mb-1.5 h-6 rounded" />
					<Skeleton className="mb-1.5 h-6 rounded" />
					<Skeleton className="mb-1.5 h-6 rounded" />
					<Skeleton className="h-6 rounded" />
				</div>
				<div className="flex-1 p-10">
					<Skeleton className="mb-4 h-9 w-1/3 rounded" />
					<Skeleton className="mb-3 h-4 w-40 rounded" />
					<Skeleton className="mb-2 h-4 w-2/3 rounded" />
					<Skeleton className="mb-2 h-4 w-1/2 rounded" />
					<Skeleton className="h-4 w-3/4 rounded" />
				</div>
			</div>
		)
	}

	return (
		<div className="flex h-full">
			{/* ── Sidebar — TreeView ──────────────────────────────── */}
			<div className="flex w-[240px] shrink-0 flex-col border-r border-edge">
				<div className="flex items-center justify-between px-3 py-2.5">
					<span className="text-[11px] font-medium uppercase tracking-wider text-fg-muted">
						Notes
					</span>
					<button
						type="button"
						onClick={() => void handleCreateNote()}
						disabled={isCreating}
						className="flex size-6 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-surface-2 hover:text-fg disabled:opacity-50"
					>
						{isCreating ? (
							<Loader2 className="size-3.5 animate-spin" />
						) : (
							<Plus className="size-3.5" />
						)}
					</button>
				</div>
				<ScrollArea className="min-h-0 flex-1">
					<div className="px-1 pb-3">
						{noteList.length === 0 ? (
							<div className="px-2 py-8">
								<Empty
									size="sm"
									icon={FileText}
									title={emptyTitle}
									description={emptyDescription}
									action={{
										label: "Créer une note",
										onClick: () => void handleCreateNote(),
									}}
								/>
							</div>
						) : (
							<TreeView
								data={treeData}
								selected={selectedNoteId ? [selectedNoteId] : []}
								onSelect={handleTreeSelect}
								expanded={expandedGroups}
								onExpandChange={setExpandedGroups}
							/>
						)}
					</div>
				</ScrollArea>
			</div>

			{/* ── Editor ──────────────────────────────────────────── */}
			<div className="flex min-w-0 flex-1 flex-col">
				{selectedNote ? (
					<>
						{/* Toolbar — minimal */}
						<div className="flex items-center justify-between border-b border-edge px-4 py-1.5">
							<InlineStack gap="200" blockAlign="center" className="text-xs text-fg-muted">
								<button
									type="button"
									onClick={() => void handleTogglePinned()}
									className={`flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-surface-2 ${
										selectedNote.pinned ? "text-amber-500" : "text-fg-muted"
									}`}
								>
									<Pin className={`size-3 ${selectedNote.pinned ? "fill-current" : ""}`} />
									<span>{selectedNote.pinned ? "Épinglée" : "Épingler"}</span>
								</button>
								<button
									type="button"
									onClick={() => void handleToggleLocked()}
									className={`flex items-center gap-1 rounded-md px-2 py-1 transition-colors hover:bg-surface-2 ${
										selectedNote.locked ? "text-brand" : "text-fg-muted"
									}`}
								>
									{selectedNote.locked ? (
										<Lock className="size-3" />
									) : (
										<LockOpen className="size-3" />
									)}
									<span>{selectedNote.locked ? "Verrouillée" : "Verrouiller"}</span>
								</button>
								<NoteTagPicker noteId={selectedNote._id} noteTagIds={selectedNote.tags ?? []} />
								{compositeState !== "idle" ? (
									<span className="flex items-center gap-1.5">
										{compositeState === "saving" || compositeState === "pending" ? (
											<Loader2 className="size-3 animate-spin" />
										) : null}
										{getSaveStateLabel(compositeState)}
									</span>
								) : null}
							</InlineStack>
							<Tooltip>
								<TooltipTrigger
									render={
										<button
											type="button"
											onClick={() => setShowDeleteConfirm(true)}
											disabled={isDeleting || !!selectedNote.locked}
											className="flex items-center gap-1 rounded-md px-2 py-1 text-xs text-fg-muted transition-colors hover:bg-surface-2 hover:text-destructive disabled:opacity-50"
										/>
									}
								>
									{isDeleting ? (
										<Loader2 className="size-3 animate-spin" />
									) : (
										<Trash2 className="size-3" />
									)}
									<span>Supprimer</span>
								</TooltipTrigger>
								{selectedNote.locked ? (
									<TooltipContent>Déverrouille la note pour la supprimer</TooltipContent>
								) : null}
							</Tooltip>
							<ConfirmationDialog
								open={showDeleteConfirm}
								onOpenChange={setShowDeleteConfirm}
								title="Supprimer la note"
								description="Cette note sera supprimée définitivement. Cette action est irréversible."
								confirmLabel="Supprimer"
								cancelLabel="Annuler"
								variant="destructive"
								onConfirm={() => void handleDeleteNote()}
							/>
						</div>

						{/* Content — Obsidian style */}
						<div className="min-h-0 flex-1 overflow-y-auto">
							<div className="mx-auto max-w-3xl px-10 py-12">
								<textarea
									value={title}
									onChange={handleTitleChange}
									readOnly={!!selectedNote.locked}
									rows={1}
									className="mb-2 w-full resize-none overflow-hidden bg-transparent text-[32px] font-bold leading-tight text-fg outline-none placeholder:text-fg-muted field-sizing-content"
									placeholder="Titre de la note"
								/>
								{selectedNote.tags && selectedNote.tags.length > 0 && allTags ? (
									<div className="mb-3 flex flex-wrap items-center gap-1.5">
										{selectedNote.tags.map((tagId) => {
											const tag = allTags.find((t) => t._id === tagId)
											if (!tag) return null
											const color = getTagColor(tag.color)
											return (
												<span
													key={tagId}
													className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${color.bg} ${color.text}`}
												>
													<span className={`size-1.5 rounded-full ${color.dot}`} />
													{tag.name}
												</span>
											)
										})}
									</div>
								) : null}
								<p className="mb-10 text-[13px] text-fg-muted">
									Modifiée{" "}
									{formatDistanceToNow(selectedNote.updatedAt, {
										addSuffix: true,
										locale: fr,
									})}
									{scope === "all" && selectedNote.entityType !== "general" ? (
										<>
											{" · "}
											<span className="uppercase tracking-wide">{selectedNote.entityType}</span>
										</>
									) : null}
								</p>
								<TiptapEditor
									content={content}
									onUpdate={handleContentChange}
									placeholder="Commence à écrire…"
									editable={!selectedNote.locked}
								/>
							</div>
						</div>
					</>
				) : (
					<div className="flex h-full items-center justify-center">
						<Empty
							size="sm"
							icon={FileText}
							title="Sélectionne une note"
							description="Crée une note ou choisis-en une dans la liste."
							action={{
								label: "Nouvelle note",
								onClick: () => void handleCreateNote(),
							}}
						/>
					</div>
				)}
			</div>
		</div>
	)
}
