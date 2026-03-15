"use client"

import { useCallback, useRef, useState } from "react"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../lib/with-pro-guard"
import { Badge } from "@blazz/ui"

/* ─── Types ─── */

export interface KanbanColumn<_T> {
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
	renderAfterCards?: (column: KanbanColumn<T>, items: T[]) => React.ReactNode
	columnClassName?: string
	className?: string
}

/* ─── Component ─── */

function KanbanBoardBase<T extends { id: string }>({
	columns,
	items,
	getColumnId,
	onMove,
	renderCard,
	renderColumnHeader,
	renderAfterCards,
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

	const handleDragOver = useCallback((e: React.DragEvent, columnId: string) => {
		e.preventDefault()
		e.dataTransfer.dropEffect = "move"
		setDragOverColumn(columnId)
	}, [])

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
							"flex min-w-[280px] flex-col rounded-lg border border-edge bg-surface transition-colors",
							isOver && "border-fg/30 bg-surface-3/60",
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
						<div className="relative flex-1 min-h-0">
							<div className="absolute inset-0 overflow-y-auto space-y-2 p-2">
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
									<p className="py-8 text-center text-xs text-fg-muted">Aucun élément</p>
								)}
								{renderAfterCards?.(column, columnItems)}
							</div>
							{/* Bottom fade */}
							<div className="pointer-events-none absolute inset-x-0 bottom-0 h-4 rounded-b-lg bg-gradient-to-t from-surface to-transparent" />
						</div>
					</div>
				)
			})}
		</div>
	)
}

export const KanbanBoard = withProGuard(KanbanBoardBase, "KanbanBoard")
