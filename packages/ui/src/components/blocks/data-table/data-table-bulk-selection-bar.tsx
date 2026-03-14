"use client"

import type { Table } from "@tanstack/react-table"
import { cn } from "../../../lib/utils"
import { Button } from "../../ui/button"
import { useDataTableTranslations } from "./data-table.i18n"
import type { BulkAction } from "./data-table.types"
import { DataTableRowSelection } from "./data-table-row-selection"

interface DataTableBulkSelectionBarProps<TData> {
	table: Table<TData>
	bulkActions: BulkAction<TData>[]
	locale?: "fr" | "en"
	className?: string
}

/**
 * DataTableBulkSelectionBar - Improved bulk selection overlay
 *
 * Appears over the table header when rows are selected.
 * Displays selection count, deselect button, and bulk action buttons.
 *
 * Layout:
 * - Left: Selection count + Deselect all button
 * - Center: Bulk action buttons
 *
 * @example
 * ```tsx
 * <DataTableBulkSelectionBar
 *   table={table}
 *   bulkActions={bulkActions}
 *   locale="fr"
 * />
 * ```
 */
export function DataTableBulkSelectionBar<TData>({
	table,
	bulkActions,
	locale = "fr",
	className,
}: DataTableBulkSelectionBarProps<TData>) {
	const t = useDataTableTranslations(locale)
	const selectedCount = table.getFilteredSelectedRowModel().rows.length

	// Don't render if no rows are selected
	if (selectedCount === 0) {
		return null
	}

	return (
		<div
			className={cn(
				"absolute top-0 left-0 right-0 h-[42px] border-b border-separator",
				"bg-surface-3/95 backdrop-blur-sm animate-in fade-in-0 duration-200",
				"animate-in fade-in-0 duration-200",
				"flex items-center pl-3 pr-1.5 z-10",
				className
			)}
		>
			<div className="flex items-center justify-between gap-2 w-full">
				{/* Left: Checkbox + Selection count + Deselect all */}
				<div className="flex items-center gap-3">
					<DataTableRowSelection table={table} type="header" />
					<span className="text-xs font-medium">{t.selectedCount(selectedCount)}</span>
					<button
						type="button"
						onClick={() => table.resetRowSelection()}
						className="text-xs text-fg-muted hover:text-fg transition-colors"
					>
						{t.deselectAll}
					</button>
				</div>

				{/* Center: Bulk action buttons */}
				<div className="flex items-center gap-2">
					{bulkActions.map((action) => (
						<Button
							key={action.id}
							variant={action.variant || "outline"}
							size="xs"
							onClick={() => action.handler(table.getFilteredSelectedRowModel().rows)}
							disabled={action.disabled?.(table.getFilteredSelectedRowModel().rows)}
							className="h-7"
						>
							{action.label}
						</Button>
					))}
				</div>
			</div>
		</div>
	)
}
