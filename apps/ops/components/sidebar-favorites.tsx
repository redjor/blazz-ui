"use client"

import { closestCenter, DndContext, type DragEndEvent, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useMutation, useQuery } from "convex/react"
import { Bookmark, CheckSquare, FileText, FolderOpen, GripVertical, Rss, Star, Users } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ComponentType } from "react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

const entityTypeIcons: Record<string, ComponentType<{ className?: string }>> = {
	client: Users,
	project: FolderOpen,
	todo: CheckSquare,
	note: FileText,
	bookmark: Bookmark,
	feedItem: Rss,
}

const urlMap: Record<string, (id: string) => string> = {
	client: (id) => `/clients/${id}`,
	project: (id) => `/projects/${id}`,
	todo: () => "/todos",
	note: (id) => `/notes/${id}`,
	bookmark: () => "/bookmarks",
	feedItem: () => "/veille",
}

interface FavoriteItem {
	_id: Id<"favorites">
	entityType: string
	entityId: string
	label: string
	order: number
}

function SortableFavorite({ item }: { item: FavoriteItem }) {
	const pathname = usePathname()
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
		id: item._id,
	})
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	}

	const Icon = entityTypeIcons[item.entityType] ?? Star
	const url = (urlMap[item.entityType] ?? (() => "/"))(item.entityId)
	const isActive = pathname === url

	return (
		<div ref={setNodeRef} style={style} className="group flex items-center">
			<button type="button" {...attributes} {...listeners} className="opacity-0 group-hover:opacity-100 p-0.5 cursor-grab text-fg-muted">
				<GripVertical className="size-3" />
			</button>
			<Link
				href={url}
				className={`flex items-center gap-2 flex-1 rounded-md px-2 py-1.5 text-sm truncate transition-colors ${
					isActive ? "bg-raised text-fg font-medium" : "text-fg-muted hover:text-fg hover:bg-raised/50"
				}`}
			>
				<Icon className="size-4 shrink-0" />
				<span className="truncate">{item.label}</span>
			</Link>
		</div>
	)
}

export function SidebarFavorites() {
	const favorites = useQuery(api.favorites.list)
	const reorder = useMutation(api.favorites.reorder)

	const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }))

	if (!favorites || favorites.length === 0) return null

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event
		if (!over || active.id === over.id || !favorites) return

		const oldIndex = favorites.findIndex((f) => f._id === active.id)
		const newIndex = favorites.findIndex((f) => f._id === over.id)
		if (oldIndex === -1 || newIndex === -1) return

		const reordered = [...favorites]
		const [moved] = reordered.splice(oldIndex, 1)
		reordered.splice(newIndex, 0, moved)

		reorder({ orderedIds: reordered.map((f) => f._id) })
	}

	return (
		<div className="px-2 py-1">
			<div className="px-2 py-1 text-xs font-medium text-fg-muted uppercase tracking-wider">Favoris</div>
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext items={favorites.map((f) => f._id)} strategy={verticalListSortingStrategy}>
					{favorites.map((fav) => (
						<SortableFavorite key={fav._id} item={fav} />
					))}
				</SortableContext>
			</DndContext>
		</div>
	)
}
