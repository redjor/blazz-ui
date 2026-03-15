"use client"

import type { Table } from "@tanstack/react-table"
import { cn } from "@blazz/ui"
import { Button } from "@blazz/ui"
import { X } from "lucide-react"
import * as React from "react"
import { createPortal } from "react-dom"
import { useDataTableTranslations } from "./data-table.i18n"
import type { BulkAction } from "./data-table.types"

interface DataTableBulkSelectionBarProps<TData> {
	table: Table<TData>
	bulkActions: BulkAction<TData>[]
	locale?: "fr" | "en"
	className?: string
}

/**
 * DataTableBulkSelectionBar - Floating bottom bar for bulk actions
 *
 * Appears as a fixed pill at the bottom of the viewport when rows are selected.
 * Uses a portal to render on document.body (avoids transform containment issues).
 */
export function DataTableBulkSelectionBar<TData>({
	table,
	bulkActions,
	locale = "fr",
	className,
}: DataTableBulkSelectionBarProps<TData>) {
	const t = useDataTableTranslations(locale)
	const selectedCount = table.getFilteredSelectedRowModel().rows.length
	const [mounted, setMounted] = React.useState(false)

	React.useEffect(() => {
		setMounted(true)
	}, [])

	if (selectedCount === 0 || !mounted) {
		return null
	}

	return createPortal(
		<div className="fixed bottom-6 left-1/2 z-50" style={{ transform: "translateX(-50%)" }}>
			<div
				className={cn(
					"flex items-center gap-3 rounded-xl border border-edge bg-surface px-4 py-2.5 shadow-lg",
					className
				)}
			>
				{/* Selection count */}
				<span className="text-sm font-medium text-fg tabular-nums">
					{t.selectedCount(selectedCount)}
				</span>

				{/* Separator */}
				<div className="h-4 w-px bg-edge" />

				{/* Bulk action buttons */}
				{bulkActions.map((action) => (
					<Button
						key={action.id}
						variant={action.variant || "outline"}
						size="sm"
						onClick={() => action.handler(table.getFilteredSelectedRowModel().rows)}
						disabled={action.disabled?.(table.getFilteredSelectedRowModel().rows)}
					>
						{action.icon && <action.icon className="size-3.5" />}
						{action.label}
					</Button>
				))}

				{/* Separator */}
				<div className="h-4 w-px bg-edge" />

				{/* Deselect */}
				<button
					type="button"
					onClick={() => table.resetRowSelection()}
					className="flex items-center gap-1 text-xs text-fg-muted hover:text-fg transition-colors"
				>
					<X className="size-3.5" />
				</button>
			</div>
		</div>,
		document.body
	)
}
