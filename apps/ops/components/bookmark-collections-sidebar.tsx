"use client"

import { Button } from "@blazz/ui/components/ui/button"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@blazz/ui/components/ui/dropdown-menu"
import { useMutation, useQuery } from "convex/react"
import {
	Archive,
	Bookmark,
	ChevronRight,
	FolderOpen,
	Inbox,
	MoreHorizontal,
	Pencil,
	Plus,
	Trash2,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"

export interface CollectionFilter {
	type: "all" | "collection" | "uncategorized" | "archived"
	collectionId?: Id<"bookmarkCollections">
}

interface BookmarkCollectionsSidebarProps {
	activeFilter: CollectionFilter
	onSelect: (filter: CollectionFilter) => void
	onCreateCollection: () => void
	onEditCollection?: (collection: Doc<"bookmarkCollections">) => void
}

export function BookmarkCollectionsSidebar({
	activeFilter,
	onSelect,
	onCreateCollection,
	onEditCollection,
}: BookmarkCollectionsSidebarProps) {
	const collections = useQuery(api.bookmarkCollections.list)
	const removeCollection = useMutation(api.bookmarkCollections.remove)
	const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())

	const topLevel = collections?.filter((c) => !c.parentId).sort((a, b) => a.order - b.order) ?? []

	const getChildren = (parentId: Id<"bookmarkCollections">) =>
		collections?.filter((c) => c.parentId === parentId).sort((a, b) => a.order - b.order) ?? []

	const toggleExpand = (id: string) => {
		setExpandedIds((prev) => {
			const next = new Set(prev)
			if (next.has(id)) next.delete(id)
			else next.add(id)
			return next
		})
	}

	const handleDelete = async (id: Id<"bookmarkCollections">) => {
		if (!window.confirm("Supprimer cette collection ? Les bookmarks ne seront pas supprimés."))
			return
		try {
			await removeCollection({ id })
			toast.success("Collection supprimée")
			if (activeFilter.type === "collection" && activeFilter.collectionId === id) {
				onSelect({ type: "all" })
			}
		} catch {
			toast.error("Erreur")
		}
	}

	const itemClass = (active: boolean) =>
		`flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors ${
			active ? "bg-brand/10 text-brand font-medium" : "text-fg-muted hover:bg-surface hover:text-fg"
		}`

	return (
		<div className="w-56 shrink-0 space-y-1">
			{/* All bookmarks */}
			<button
				type="button"
				onClick={() => onSelect({ type: "all" })}
				className={itemClass(activeFilter.type === "all")}
			>
				<Bookmark className="size-4 shrink-0" />
				<span className="truncate">Tous les bookmarks</span>
			</button>

			{/* Uncategorized */}
			<button
				type="button"
				onClick={() => onSelect({ type: "uncategorized" })}
				className={itemClass(activeFilter.type === "uncategorized")}
			>
				<Inbox className="size-4 shrink-0" />
				<span className="truncate">Non trié</span>
			</button>

			{/* Collections header */}
			<div className="flex items-center justify-between pt-3 pb-1 px-2">
				<span className="text-xs font-medium uppercase tracking-wider text-fg-muted">
					Collections
				</span>
				<Button size="icon-sm" variant="ghost" className="size-5" onClick={onCreateCollection}>
					<Plus className="size-3" />
				</Button>
			</div>

			{/* Collection items */}
			{topLevel.map((col) => {
				const children = getChildren(col._id)
				const hasChildren = children.length > 0
				const isExpanded = expandedIds.has(col._id)
				const isActive = activeFilter.type === "collection" && activeFilter.collectionId === col._id

				return (
					<div key={col._id}>
						<div className="group flex items-center">
							{/* Collection name */}
							<button
								type="button"
								onClick={() => onSelect({ type: "collection", collectionId: col._id })}
								className={`${itemClass(isActive)} flex-1 min-w-0`}
							>
								<span className="shrink-0">{col.icon || <FolderOpen className="size-4" />}</span>
								<span className="truncate">{col.name}</span>
								{hasChildren && (
									<ChevronRight
										className={`size-3 ml-auto text-fg-muted transition-transform shrink-0 ${
											isExpanded ? "rotate-90" : ""
										}`}
										onClick={(e) => {
											e.stopPropagation()
											toggleExpand(col._id)
										}}
									/>
								)}
							</button>

							{/* Context menu */}
							<div className="opacity-0 group-hover:opacity-100 transition-opacity">
								<DropdownMenu>
									<DropdownMenuTrigger
										render={<Button size="icon-sm" variant="ghost" className="size-5" />}
									>
										<MoreHorizontal className="size-3" />
									</DropdownMenuTrigger>
									<DropdownMenuContent align="end">
										{onEditCollection && (
											<DropdownMenuItem onClick={() => onEditCollection(col)}>
												<Pencil className="size-4 mr-2" />
												Modifier
											</DropdownMenuItem>
										)}
										<DropdownMenuItem
											onClick={() => handleDelete(col._id)}
											className="text-red-600 dark:text-red-400"
										>
											<Trash2 className="size-4 mr-2" />
											Supprimer
										</DropdownMenuItem>
									</DropdownMenuContent>
								</DropdownMenu>
							</div>
						</div>

						{/* Children */}
						{hasChildren && isExpanded && (
							<div className="ml-5 space-y-0.5">
								{children.map((child) => {
									const isChildActive =
										activeFilter.type === "collection" && activeFilter.collectionId === child._id
									return (
										<div key={child._id} className="group flex items-center">
											<button
												type="button"
												onClick={() =>
													onSelect({
														type: "collection",
														collectionId: child._id,
													})
												}
												className={`${itemClass(isChildActive)} flex-1 min-w-0`}
											>
												<span className="shrink-0">
													{child.icon || <FolderOpen className="size-3.5" />}
												</span>
												<span className="truncate">{child.name}</span>
											</button>

											<div className="opacity-0 group-hover:opacity-100 transition-opacity">
												<DropdownMenu>
													<DropdownMenuTrigger
														render={<Button size="icon-sm" variant="ghost" className="size-5" />}
													>
														<MoreHorizontal className="size-3" />
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														{onEditCollection && (
															<DropdownMenuItem onClick={() => onEditCollection(child)}>
																<Pencil className="size-4 mr-2" />
																Modifier
															</DropdownMenuItem>
														)}
														<DropdownMenuItem
															onClick={() => handleDelete(child._id)}
															className="text-red-600 dark:text-red-400"
														>
															<Trash2 className="size-4 mr-2" />
															Supprimer
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</div>
										</div>
									)
								})}
							</div>
						)}
					</div>
				)
			})}

			{/* Archived */}
			<div className="pt-3">
				<button
					type="button"
					onClick={() => onSelect({ type: "archived" })}
					className={itemClass(activeFilter.type === "archived")}
				>
					<Archive className="size-4 shrink-0" />
					<span className="truncate">Archivés</span>
				</button>
			</div>
		</div>
	)
}
