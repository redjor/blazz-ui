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
} from "@blazz/ui/components/ui/menu"
import { useDataTableTranslations } from "./data-table.i18n"

interface DataTableSortMenuProps {
	columns: Array<{ id: string; label: string }>
	sorting: SortingState
	onSortingChange: (sorting: SortingState) => void
	locale?: "fr" | "en"
}

export function DataTableSortMenu({
	columns,
	sorting,
	onSortingChange,
	locale = "fr",
}: DataTableSortMenuProps) {
	const t = useDataTableTranslations(locale)
	const currentSort = sorting[0]
	const currentColumnId = currentSort?.id
	const isDescending = currentSort?.desc ?? false

	const handleColumnChange = (columnId: string) => {
		onSortingChange([{ id: columnId, desc: isDescending }])
	}

	const handleDirectionChange = (desc: boolean) => {
		const columnId = currentColumnId || columns[0]?.id
		if (columnId) {
			onSortingChange([{ id: columnId, desc }])
		}
	}

	return (
		<div className="w-64" data-slot="data-table-sort-menu">
			{/* Column Selection */}
			<MenuGroup>
				<MenuGroupLabel>{t.sortBy}</MenuGroupLabel>
				<MenuRadioGroup value={currentColumnId || ""} onValueChange={handleColumnChange}>
					{columns.map((col) => (
						<MenuRadioItem key={col.id} value={col.id}>
							{col.label}
						</MenuRadioItem>
					))}
				</MenuRadioGroup>
			</MenuGroup>

			<MenuSeparator />

			{/* Direction Toggle */}
			<MenuGroup>
				<MenuItem onClick={() => handleDirectionChange(false)}>
					<ArrowUp className="mr-2 h-4 w-4" />
					<span>{t.sortAscending}</span>
				</MenuItem>
				<MenuItem onClick={() => handleDirectionChange(true)}>
					<ArrowDown className="mr-2 h-4 w-4" />
					<span>{t.sortDescending}</span>
				</MenuItem>
			</MenuGroup>
		</div>
	)
}
