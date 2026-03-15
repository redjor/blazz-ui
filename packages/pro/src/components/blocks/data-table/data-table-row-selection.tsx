"use client"

import type { Row, Table } from "@tanstack/react-table"
import { Checkbox } from "@blazz/ui"
import * as React from "react"

// Shared ref for shift-click range selection across all rows in a table
export interface ShiftSelectionRef {
	lastClickedId: string | null
}

interface DataTableRowSelectionProps<TData> {
	row?: Row<TData>
	table?: Table<TData>
	type?: "header" | "cell"
	/** Shared ref for tracking last clicked row */
	shiftRef?: React.MutableRefObject<ShiftSelectionRef>
}

export function DataTableRowSelection<TData>({
	row,
	table,
	type = "cell",
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
					if (e.shiftKey) {
						e.preventDefault()
					}
				}}
				onClick={(e) => {
					e.stopPropagation()

					if (e.shiftKey && shiftRef?.current && table) {
						window.getSelection()?.removeAllRanges()

						const lastId = shiftRef.current.lastClickedId
						if (lastId !== null && lastId !== row.id) {
							const rows = table.getRowModel().rows
							// Find indices in the row model (not row.index which is data-source index)
							const lastIdx = rows.findIndex((r) => r.id === lastId)
							const currentIdx = rows.findIndex((r) => r.id === row.id)

							if (lastIdx !== -1 && currentIdx !== -1) {
								const start = Math.min(lastIdx, currentIdx)
								const end = Math.max(lastIdx, currentIdx)
								for (let i = start; i <= end; i++) {
									const r = rows[i]
									if (r && !r.getIsGrouped()) {
										r.toggleSelected(true)
									}
								}
								shiftRef.current.lastClickedId = row.id
								return
							}
						}
					}

					row.toggleSelected(!row.getIsSelected())
					if (shiftRef?.current) {
						shiftRef.current.lastClickedId = row.id
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
