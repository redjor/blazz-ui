"use client"

import type { Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown } from "lucide-react"
import type * as React from "react"
import { cn } from "@blazz/ui"
import { Button } from "@blazz/ui"

interface DataTableColumnHeaderProps<TData, TValue> extends React.HTMLAttributes<HTMLDivElement> {
	column: Column<TData, TValue>
	title: string
}

export function DataTableColumnHeader<TData, TValue>({
	column,
	title,
	className,
}: DataTableColumnHeaderProps<TData, TValue>) {
	if (!column.getCanSort()) {
		return <div className={cn(className)}>{title}</div>
	}

	const isSorted = column.getIsSorted()

	return (
		<div
			className={cn("flex items-center space-x-2", className)}
			data-slot="data-table-column-header"
		>
			<Button
				variant="ghost"
				size="sm"
				className="-ml-3 data-[state=open]:bg-muted text-xs font-medium"
				onClick={() => {
					// Toggle sorting: false -> asc -> desc -> false
					const currentSort = column.getIsSorted()
					if (!currentSort) {
						column.toggleSorting(false) // asc
					} else if (currentSort === "asc") {
						column.toggleSorting(true) // desc
					} else {
						column.clearSorting() // clear
					}
				}}
			>
				<span>{title}</span>
				{isSorted === "desc" ? (
					<ArrowDown className="ml-2 h-4 w-4" />
				) : isSorted === "asc" ? (
					<ArrowUp className="ml-2 h-4 w-4" />
				) : (
					<ChevronsUpDown className="ml-2 h-4 w-4" />
				)}
			</Button>
		</div>
	)
}
