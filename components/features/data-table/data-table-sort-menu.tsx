"use client"

import type { SortingState } from "@tanstack/react-table"
import { ArrowDown, ArrowUp } from "lucide-react"
import {
	MenuGroup,
	MenuGroupLabel,
	MenuItem,
	MenuRadioGroup,
	MenuRadioItem,
	MenuSeparator,
} from "@/components/ui/menu"

interface DataTableSortMenuProps {
	columns: Array<{ id: string; label: string }>
	sorting: SortingState
	onSortingChange: (sorting: SortingState) => void
}

export function DataTableSortMenu({ columns, sorting, onSortingChange }: DataTableSortMenuProps) {
	const currentSort = sorting[0]
	const currentColumnId = currentSort?.id
	const isDescending = currentSort?.desc ?? false

	const handleColumnChange = (columnId: string) => {
		onSortingChange([{ id: columnId, desc: isDescending }])
	}

	const handleDirectionChange = (desc: boolean) => {
		if (currentColumnId) {
			onSortingChange([{ id: currentColumnId, desc }])
		}
	}

	return (
		<div className="w-64" data-slot="data-table-sort-menu">
			{/* Column Selection */}
			<MenuGroup>
				<MenuGroupLabel>Trier par</MenuGroupLabel>
				<MenuRadioGroup value={currentColumnId || ""} onValueChange={handleColumnChange}>
					{columns.map((col) => (
						<MenuRadioItem key={col.id} value={col.id}>
							{col.label}
						</MenuRadioItem>
					))}
				</MenuRadioGroup>
			</MenuGroup>

			{currentColumnId && (
				<>
					<MenuSeparator />

					{/* Direction Toggle */}
					<MenuGroup>
						<MenuItem onClick={() => handleDirectionChange(false)}>
							<ArrowUp className="mr-2 h-4 w-4" />
							<span>Du plus ancien au plus récent</span>
						</MenuItem>
						<MenuItem onClick={() => handleDirectionChange(true)}>
							<ArrowDown className="mr-2 h-4 w-4" />
							<span>Du plus récent au plus ancien</span>
						</MenuItem>
					</MenuGroup>
				</>
			)}
		</div>
	)
}
