"use client"

import type { Row, Table } from "@tanstack/react-table"
import { Checkbox } from "@blazz/ui"
import * as React from "react"

// Shared ref for shift-click range selection across all rows in a table
export interface ShiftSelectionRef {
	lastClickedIndex: number | null
}

interface DataTableRowSelectionProps<TData> {
	row?: Row<TData>
	table?: Table<TData>
	type?: "header" | "cell"
	/** Row index in the current row model (for shift-click range selection) */
	rowIndex?: number
	/** Shared ref for tracking last clicked index */
	shiftRef?: React.MutableRefObject<ShiftSelectionRef>
}

export function DataTableRowSelection<TData>({
	row,
	table,
	type = "cell",
	rowIndex,
	shiftRef,
}: DataTableRowSelectionProps<TData>) {
	if (type === "header" && table) {
		const isAllSelected = table.getIsAllPageRowsSelected()
		const isSomeSelected = table.getIsSomePageRowsSelected()

		return (
			// biome-ignore lint/a11y/noStaticElementInteractions: stopPropagation wrapper to prevent row click when selecting checkbox
			<div
				className="flex items-center py-1.5"
				data-slot="data-table-row-selection-header"
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<Checkbox
					checked={isAllSelected}
					indeterminate={!isAllSelected && isSomeSelected}
					onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
					aria-label="Select all rows"
				/>
			</div>
		)
	}

	if (type === "cell" && row) {
		return (
			// biome-ignore lint/a11y/noStaticElementInteractions: stopPropagation wrapper to prevent row click when selecting checkbox
			<div
				className="flex items-center"
				data-slot="data-table-row-selection-cell"
				onMouseDown={(e) => {
					// Prevent text selection when shift-clicking
					if (e.shiftKey) {
						e.preventDefault()
					}
				}}
				onClick={(e) => {
					e.stopPropagation()

					if (e.shiftKey && shiftRef?.current && table && rowIndex !== undefined) {
						// Clear any accidental text selection
						window.getSelection()?.removeAllRanges()

						const lastIndex = shiftRef.current.lastClickedIndex
						if (lastIndex !== null && lastIndex !== rowIndex) {
							const rows = table.getRowModel().rows
							const start = Math.min(lastIndex, rowIndex)
							const end = Math.max(lastIndex, rowIndex)
							for (let i = start; i <= end; i++) {
								const r = rows[i]
								if (r && !r.getIsGrouped()) {
									r.toggleSelected(true)
								}
							}
							shiftRef.current.lastClickedIndex = rowIndex
							return
						}
					}

					row.toggleSelected(!row.getIsSelected())
					if (shiftRef?.current && rowIndex !== undefined) {
						shiftRef.current.lastClickedIndex = rowIndex
					}
				}}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<Checkbox
					checked={row.getIsSelected()}
					tabIndex={-1}
					aria-label="Select row"
				/>
			</div>
		)
	}

	return null
}
