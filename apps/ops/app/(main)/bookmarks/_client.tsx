"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { Button } from "@blazz/ui/components/ui/button"
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
import { useMutation, useQuery } from "convex/react"
import { Bookmark, Plus, Search } from "lucide-react"
import { useCallback, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { BookmarkCard } from "@/components/bookmark-card"
import {
	BookmarkCollectionsSidebar,
	type CollectionFilter,
} from "@/components/bookmark-collections-sidebar"
import { BookmarkFormDialog } from "@/components/bookmark-form-dialog"
import { CollectionFormDialog } from "@/components/collection-form-dialog"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"

const TYPES = [
	{ value: undefined, label: "Tous" },
	{ value: "tweet" as const, label: "Tweet" },
	{ value: "youtube" as const, label: "YouTube" },
	{ value: "image" as const, label: "Image" },
	{ value: "video" as const, label: "Vidéo" },
	{ value: "link" as const, label: "Lien" },
]

function GridSkeleton() {
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
			{Array.from({ length: 8 }).map((_, i) => (
				<div key={i} className="rounded-lg border border-edge bg-surface overflow-hidden">
					<Skeleton className="aspect-video w-full" />
					<div className="p-3 space-y-2">
						<Skeleton className="h-3 w-16 rounded-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-3 w-24" />
					</div>
				</div>
			))}
		</div>
	)
}

export default function BookmarksPageClient() {
	// State
	const [activeFilter, setActiveFilter] = useState<CollectionFilter>({ type: "all" })
	const [typeFilter, setTypeFilter] = useState<
		"tweet" | "youtube" | "image" | "video" | "link" | undefined
	>(undefined)
	const [tagFilter, setTagFilter] = useState<Id<"tags"> | undefined>(undefined)
	const [searchQuery, setSearchQuery] = useState("")
	const [debouncedSearch, setDebouncedSearch] = useState("")
	const searchTimer = useRef<ReturnType<typeof setTimeout>>(null)

	// Dialogs
	const [addOpen, setAddOpen] = useState(false)
	const [editBookmark, setEditBookmark] = useState<Doc<"bookmarks"> | undefined>(undefined)
	const [collectionDialogOpen, setCollectionDialogOpen] = useState(false)
	const [editCollection, setEditCollection] = useState<Doc<"bookmarkCollections"> | undefined>(
		undefined
	)

	// Tags query (lifted from BookmarkCard to avoid N+1)
	const allTags = useQuery(api.tags.list)

	// Read Later setting
	const readLaterCollectionId = useQuery(api.settings.get, { key: "readLaterCollectionId" })
	const moveBookmark = useMutation(api.bookmarks.move)

	// Mutations
	const archiveBookmark = useMutation(api.bookmarks.archive)
	const removeBookmark = useMutation(api.bookmarks.remove)
	const updateBookmark = useMutation(api.bookmarks.update)

	// Query
	const bookmarks = useQuery(api.bookmarks.list, {
		collectionId: activeFilter.type === "collection" ? activeFilter.collectionId : undefined,
		type: typeFilter,
		tag: tagFilter,
		archived: activeFilter.type === "archived" ? true : undefined,
		uncategorized: activeFilter.type === "uncategorized" ? true : undefined,
		search: debouncedSearch || undefined,
	})

	// Top bar
	const topBarActions = useMemo(
		() => (
			<Button size="icon-sm" variant="ghost" onClick={() => setAddOpen(true)}>
				<Plus className="size-4" />
			</Button>
		),
		[]
	)
	useAppTopBar([{ label: "Bookmarks" }], topBarActions)

	// Debounced search
	const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		const val = e.target.value
		setSearchQuery(val)
		if (searchTimer.current) clearTimeout(searchTimer.current)
		searchTimer.current = setTimeout(() => setDebouncedSearch(val), 300)
	}, [])

	// Actions
	const handleArchive = async (id: Id<"bookmarks">) => {
		try {
			await archiveBookmark({ id })
			toast.success("Bookmark archivé")
		} catch {
			toast.error("Erreur")
		}
	}

	const handleDelete = async (id: Id<"bookmarks">) => {
		if (!window.confirm("Supprimer ce bookmark ?")) return
		try {
			await removeBookmark({ id })
			toast.success("Bookmark supprimé")
		} catch {
			toast.error("Erreur")
		}
	}

	const handlePin = async (bookmark: Doc<"bookmarks">) => {
		try {
			await updateBookmark({ id: bookmark._id, pinned: !bookmark.pinned })
			toast.success(bookmark.pinned ? "Désépinglé" : "Épinglé")
		} catch {
			toast.error("Erreur")
		}
	}

	const handleReadLater = async (id: Id<"bookmarks">) => {
		if (!readLaterCollectionId) return
		try {
			await moveBookmark({
				ids: [id],
				collectionId: readLaterCollectionId as Id<"bookmarkCollections">,
			})
			toast.success("Ajouté à Read Later")
		} catch {
			toast.error("Erreur")
		}
	}

	return (
		<div className="flex h-full flex-col">
			{/* Toolbar */}
			<div className="flex items-center gap-3 border-b border-edge px-4 py-3">
				<Button size="sm" onClick={() => setAddOpen(true)}>
					<Plus className="size-4 mr-1.5" />
					Ajouter
				</Button>

				{/* Type filter pills */}
				<div className="flex items-center gap-1">
					{TYPES.map((t) => (
						<Button
							key={t.label}
							size="sm"
							variant={typeFilter === t.value ? "default" : "outline"}
							onClick={() => setTypeFilter(t.value)}
						>
							{t.label}
						</Button>
					))}
				</div>

				{/* Tag filter */}
				{allTags && allTags.length > 0 && (
					<Select
						value={tagFilter ?? ""}
						onValueChange={(val) => setTagFilter(val ? (val as Id<"tags">) : undefined)}
						items={[
							{ value: "", label: "Tous les tags" },
							...allTags.map((t) => ({ value: t._id, label: t.name })),
						]}
					>
						<SelectTrigger className="w-40 h-8">
							<SelectValue placeholder="Tous les tags" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="">Tous les tags</SelectItem>
							{allTags.map((t) => (
								<SelectItem key={t._id} value={t._id}>
									{t.name}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				)}

				{/* Search */}
				<div className="relative ml-auto w-56">
					<Search className="absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-fg-muted" />
					<Input
						placeholder="Rechercher..."
						className="pl-8 h-8"
						value={searchQuery}
						onChange={handleSearchChange}
					/>
				</div>
			</div>

			{/* Content */}
			<div className="flex flex-1 overflow-hidden">
				{/* Sidebar */}
				<div className="border-r border-edge p-3 overflow-y-auto">
					<BookmarkCollectionsSidebar
						activeFilter={activeFilter}
						onSelect={setActiveFilter}
						onCreateCollection={() => {
							setEditCollection(undefined)
							setCollectionDialogOpen(true)
						}}
						onEditCollection={(col) => {
							setEditCollection(col)
							setCollectionDialogOpen(true)
						}}
					/>
				</div>

				{/* Grid */}
				<div className="flex-1 overflow-y-auto p-4">
					{/* Loading */}
					{bookmarks === undefined && <GridSkeleton />}

					{/* Empty */}
					{bookmarks?.length === 0 && (
						<Empty
							icon={Bookmark}
							title="Aucun bookmark"
							description="Ajoutez votre premier bookmark"
							action={{
								label: "Ajouter un bookmark",
								onClick: () => setAddOpen(true),
								icon: Plus,
							}}
						/>
					)}

					{/* Grid of cards */}
					{bookmarks && bookmarks.length > 0 && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
							{bookmarks.map((bk) => (
								<BookmarkCard
									key={bk._id}
									bookmark={bk}
									tags={allTags}
									onEdit={() => setEditBookmark(bk)}
									onArchive={() => handleArchive(bk._id)}
									onDelete={() => handleDelete(bk._id)}
									onPin={() => handlePin(bk)}
									onReadLater={readLaterCollectionId ? () => handleReadLater(bk._id) : undefined}
								/>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Add/Edit bookmark dialog */}
			<BookmarkFormDialog
				open={addOpen || !!editBookmark}
				onOpenChange={(open) => {
					if (!open) {
						setAddOpen(false)
						setEditBookmark(undefined)
					}
				}}
				bookmark={editBookmark}
				defaultCollectionId={
					activeFilter.type === "collection" ? activeFilter.collectionId : undefined
				}
			/>

			{/* Collection form dialog */}
			<CollectionFormDialog
				open={collectionDialogOpen}
				onOpenChange={setCollectionDialogOpen}
				collection={editCollection}
			/>
		</div>
	)
}
