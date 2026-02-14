"use client"

import { useState, useRef, useCallback } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

/* ─── Types ─── */

export interface KanbanColumn<T> {
	id: string
	label: string
	variant?: "default" | "success" | "info" | "warning" | "critical" | "outline"
}

export interface KanbanBoardProps<T extends { id: string }> {
	columns: KanbanColumn<T>[]
	items: T[]
	getColumnId: (item: T) => string
	onMove?: (itemId: string, fromColumn: string, toColumn: string) => void | Promise<void>
	renderCard: (item: T) => React.ReactNode
	renderColumnHeader?: (column: KanbanColumn<T>, items: T[]) => React.ReactNode
	columnClassName?: string
	className?: string
}

/* ─── Component ─── */

export function KanbanBoard<T extends { id: string }>({
	columns,
	items,
	getColumnId,
	onMove,
	renderCard,
	renderColumnHeader,
	columnClassName,
	className,
}: KanbanBoardProps<T>) {
	const [dragItemId, setDragItemId] = useState<string | null>(null)
	const [dragOverColumn, setDragOverColumn] = useState<string | null>(null)
	const dragSourceColumn = useRef<string | null>(null)

	const handleDragStart = useCallback(
		(e: React.DragEvent, item: T) => {
			setDragItemId(item.id)
			dragSourceColumn.current = getColumnId(item)
			e.dataTransfer.effectAllowed = "move"
			e.dataTransfer.setData("text/plain", item.id)
		},
		[getColumnId]
	)

	const handleDragOver = useCallback(
		(e: React.DragEvent, columnId: string) => {
			e.preventDefault()
			e.dataTransfer.dropEffect = "move"
			setDragOverColumn(columnId)
		},
		[]
	)

	const handleDragLeave = useCallback(() => {
		setDragOverColumn(null)
	}, [])

	const handleDrop = useCallback(
		async (e: React.DragEvent, targetColumn: string) => {
			e.preventDefault()
			const itemId = e.dataTransfer.getData("text/plain")
			const sourceColumn = dragSourceColumn.current

			setDragItemId(null)
			setDragOverColumn(null)
			dragSourceColumn.current = null

			if (sourceColumn && sourceColumn !== targetColumn && onMove) {
				await onMove(itemId, sourceColumn, targetColumn)
			}
		},
		[onMove]
	)

	const handleDragEnd = useCallback(() => {
		setDragItemId(null)
		setDragOverColumn(null)
		dragSourceColumn.current = null
	}, [])

	return (
		<div className={cn("flex gap-4 overflow-x-auto pb-4", className)}>
			{columns.map((column) => {
				const columnItems = items.filter((item) => getColumnId(item) === column.id)
				const isOver = dragOverColumn === column.id

				return (
					<div
						key={column.id}
						className={cn(
							"flex min-w-[280px] flex-col rounded-lg border bg-muted/30 transition-colors",
							isOver && "border-foreground/30 bg-muted/60",
							columnClassName
						)}
						onDragOver={(e) => handleDragOver(e, column.id)}
						onDragLeave={handleDragLeave}
						onDrop={(e) => handleDrop(e, column.id)}
					>
						{/* Column header */}
						{renderColumnHeader ? (
							renderColumnHeader(column, columnItems)
						) : (
							<div className="flex items-center justify-between border-b p-3">
								<div className="flex items-center gap-2">
									<span className="text-sm font-semibold">{column.label}</span>
									<Badge variant="outline" className="text-xs">
										{columnItems.length}
									</Badge>
								</div>
							</div>
						)}

						{/* Cards */}
						<div className="flex-1 space-y-2 p-2">
							{columnItems.map((item) => (
								<div
									key={item.id}
									draggable={!!onMove}
									onDragStart={(e) => handleDragStart(e, item)}
									onDragEnd={handleDragEnd}
									className={cn(
										"transition-opacity",
										onMove && "cursor-grab active:cursor-grabbing",
										dragItemId === item.id && "opacity-40"
									)}
								>
									{renderCard(item)}
								</div>
							))}
							{columnItems.length === 0 && (
								<p className="py-8 text-center text-xs text-muted-foreground">
									Aucun élément
								</p>
							)}
						</div>
					</div>
				)
			})}
		</div>
	)
}
