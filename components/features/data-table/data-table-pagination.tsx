"use client"

import type { Table } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
	table: Table<TData>
	pageSizeOptions?: number[]
}

export function DataTablePagination<TData>({
	table,
	pageSizeOptions = [10, 25, 50, 100],
}: DataTablePaginationProps<TData>) {
	const totalRows = table.getFilteredRowModel().rows.length
	const currentPage = table.getState().pagination.pageIndex + 1
	const pageSize = table.getState().pagination.pageSize
	const totalPages = table.getPageCount()
	const _startRow = currentPage === 1 ? 1 : (currentPage - 1) * pageSize + 1
	const _endRow = Math.min(currentPage * pageSize, totalRows)

	return (
		<div
			className="flex items-center justify-between p-2 border-t"
			data-slot="data-table-pagination"
		>
			<div className="flex-1 text-sm text-muted-foreground">
				<div className="flex items-center space-x-2">
					<Select
						value={String(pageSize)}
						onValueChange={(value) => {
							table.setPageSize(Number(value))
						}}
					>
						<SelectTrigger className="h-8 w-auto">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{pageSizeOptions.map((size) => (
								<SelectItem key={size} value={String(size)}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<p className="text-xs font-medium">Lignes par page</p>
				</div>
			</div>
			<div className="flex items-center space-x-4 lg:space-x-6">
					<div className="flex w-[100px] items-center justify-center text-xs font-medium">
						Page {currentPage} of {totalPages}
					</div>
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							size="icon-sm"
							onClick={() => table.setPageIndex(0)}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to first page</span>
							<ChevronsLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							size="icon-sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							<span className="sr-only">Go to previous page</span>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="h-8 w-8 p-0"
							size="icon-sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to next page</span>
							<ChevronRight className="h-4 w-4" />
						</Button>
						<Button
							variant="outline"
							className="hidden h-8 w-8 p-0 lg:flex"
							size="icon-sm"
							onClick={() => table.setPageIndex(table.getPageCount() - 1)}
							disabled={!table.getCanNextPage()}
						>
							<span className="sr-only">Go to last page</span>
							<ChevronsRight className="h-4 w-4" />
						</Button>
					</div>
			</div>
		</div>
	)
}

