"use client"

import type { Row, Table } from "@tanstack/react-table"
import { Checkbox } from "@blazz/ui/components/ui/checkbox"

interface DataTableRowSelectionProps<TData> {
	row?: Row<TData>
	table?: Table<TData>
	type?: "header" | "cell"
}

export function DataTableRowSelection<TData>({
	row,
	table,
	type = "cell",
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
				onClick={(e) => e.stopPropagation()}
				onKeyDown={(e) => e.stopPropagation()}
			>
				<Checkbox
					checked={row.getIsSelected()}
					onCheckedChange={(value) => row.toggleSelected(!!value)}
					aria-label="Select row"
				/>
			</div>
		)
	}

	return null
}
