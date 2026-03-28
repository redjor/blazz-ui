"use client"

import { type AnimateLayoutChanges, defaultAnimateLayoutChanges, useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { X } from "lucide-react"
import type * as React from "react"
import { twMerge } from "tailwind-merge"

interface TabsItemProps {
	/** Unique tab ID — required for drag-and-drop */
	id?: string
	title: string
	icon?: React.ReactNode
	isActive: boolean
	onClick: () => void
	onClose?: () => void
	className?: string
	activeClassName?: string
	closeButtonClassName?: string
}

function TabsItemInner({
	title,
	icon,
	isActive,
	onClick,
	onClose,
	className,
	activeClassName,
	closeButtonClassName,
	isDragging,
	sortableRef,
	sortableStyle,
	sortableAttributes,
	sortableListeners,
}: TabsItemProps & {
	isDragging?: boolean
	sortableRef?: (node: HTMLElement | null) => void
	sortableStyle?: React.CSSProperties
	sortableAttributes?: Record<string, unknown>
	sortableListeners?: Record<string, unknown>
}) {
	return (
		<div
			ref={sortableRef}
			style={sortableStyle}
			{...(sortableAttributes ?? {})}
			{...(sortableListeners ?? {})}
			className={twMerge(
				"group relative flex w-44 items-center rounded-lg text-xs",
				isDragging && "opacity-0",
				isActive ? twMerge("bg-muted font-semibold text-foreground", activeClassName) : "text-muted-foreground bg-muted/50 hover:bg-muted/70 hover:text-foreground",
				className
			)}
		>
			<button type="button" onClick={isDragging ? undefined : onClick} className={twMerge("flex h-7 min-w-0 flex-1 cursor-pointer items-center gap-1.5 truncate pl-2", onClose ? "pr-1" : "pr-2")}>
				{icon && <span className="shrink-0 opacity-60 [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>}
				<span className="block truncate" style={{ maxWidth: 152 }}>
					{title}
				</span>
			</button>
			{onClose && (
				<button
					type="button"
					onClick={isDragging ? undefined : onClose}
					className={twMerge(
						"mr-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm transition-colors hover:bg-zinc-200 dark:hover:bg-zinc-700",
						"opacity-0 group-hover:opacity-100",
						closeButtonClassName
					)}
					aria-label={`Close ${title}`}
				>
					<X className="h-3 w-3" />
				</button>
			)}
		</div>
	)
}

export function TabsItem(props: TabsItemProps) {
	const { id } = props

	if (!id) {
		return <TabsItemInner {...props} />
	}

	return <SortableTabsItem {...props} id={id} />
}

const animateLayoutChanges: AnimateLayoutChanges = (args) => {
	if (args.wasDragging) return false
	return defaultAnimateLayoutChanges(args)
}

function SortableTabsItem(props: TabsItemProps & { id: string }) {
	const { id } = props
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id,
		animateLayoutChanges,
	})

	const style: React.CSSProperties = {
		transform: CSS.Transform.toString(transform),
		transition: transition ?? undefined,
	}

	return (
		<TabsItemInner
			{...props}
			isDragging={isDragging}
			sortableRef={setNodeRef}
			sortableStyle={style}
			sortableAttributes={attributes as unknown as Record<string, unknown>}
			sortableListeners={listeners as unknown as Record<string, unknown>}
		/>
	)
}

/** Static version of TabsItem for use in DragOverlay — no sortable hooks */
export function TabsItemOverlay({ title, icon, isActive, className, activeClassName }: Pick<TabsItemProps, "title" | "icon" | "isActive" | "className" | "activeClassName">) {
	return (
		<div
			className={twMerge(
				"pointer-events-none flex w-44 items-center rounded-lg text-xs shadow-lg",
				isActive ? twMerge("bg-muted font-semibold text-foreground", activeClassName) : twMerge("bg-muted text-muted-foreground", className),
				className
			)}
		>
			<div className="flex h-7 min-w-0 flex-1 items-center gap-1.5 truncate px-2">
				{icon && <span className="shrink-0 opacity-60 [&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>}
				<span className="block truncate" style={{ maxWidth: 152 }}>
					{title}
				</span>
			</div>
		</div>
	)
}
