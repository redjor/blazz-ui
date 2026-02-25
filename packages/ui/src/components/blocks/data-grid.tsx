"use client"

import { useState, useMemo, useCallback } from "react"
import {
	useReactTable,
	getCoreRowModel,
	flexRender,
	type ColumnDef as TanStackColumnDef,
} from "@tanstack/react-table"
import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { MoreHorizontal, ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

/* ─── Public Column Definition ─── */

export interface ColumnDef<T> {
	id: string
	header: string
	sortable?: boolean
	cell: (row: T) => React.ReactNode
	className?: string
}

/* ─── Row Actions ─── */

export interface RowAction<T> {
	label: string
	icon?: LucideIcon
	onClick: (row: T) => void | Promise<void>
	variant?: "default" | "destructive"
	hidden?: (row: T) => boolean
}

/* ─── Bulk Actions ─── */

export interface DataGridBulkAction {
	label: string
	action: (ids: string[]) => void | Promise<void>
	icon?: string | LucideIcon
	variant?: "default" | "destructive"
	confirm?: boolean
}

/* ─── Props ─── */

export interface DataGridProps<T extends { id: string }> {
	columns: ColumnDef<T>[]
	data: T[]
	totalCount: number
	pageSize?: number
	currentPage?: number
	sortField?: string
	sortDirection?: "asc" | "desc"
	selectable?: boolean
	onSelectionChange?: (ids: string[]) => void
	actions?: RowAction<T>[]
	bulkActions?: DataGridBulkAction[]
	loading?: boolean
	emptyState?: React.ReactNode
	className?: string
}

/* ─── Component ─── */

export function DataGrid<T extends { id: string }>({
	columns,
	data,
	totalCount,
	pageSize = 25,
	currentPage = 1,
	sortField,
	sortDirection,
	selectable = false,
	onSelectionChange,
	actions,
	loading = false,
	emptyState,
	className,
}: DataGridProps<T>) {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({})

	const totalPages = Math.ceil(totalCount / pageSize)

	const updateParams = useCallback(
		(updates: Record<string, string | undefined>) => {
			const params = new URLSearchParams(searchParams.toString())
			for (const [key, value] of Object.entries(updates)) {
				if (value === undefined) {
					params.delete(key)
				} else {
					params.set(key, value)
				}
			}
			router.push(`${pathname}?${params.toString()}`)
		},
		[router, pathname, searchParams]
	)

	const handlePageChange = (page: number) => {
		updateParams({ page: page.toString() })
	}

	const handleSort = (field: string) => {
		if (sortField === field) {
			if (sortDirection === "asc") {
				updateParams({ sortField: field, sortDirection: "desc" })
			} else {
				updateParams({ sortField: undefined, sortDirection: undefined })
			}
		} else {
			updateParams({ sortField: field, sortDirection: "asc" })
		}
	}

	// Build TanStack columns from simple ColumnDef
	const tanstackColumns = useMemo<TanStackColumnDef<T>[]>(() => {
		const cols: TanStackColumnDef<T>[] = []

		if (selectable) {
			cols.push({
				id: "select",
				header: ({ table }) => (
					<Checkbox
						checked={table.getIsAllPageRowsSelected()}
						onCheckedChange={(value) =>
							table.toggleAllPageRowsSelected(!!value)
						}
						aria-label="Tout sélectionner"
					/>
				),
				cell: ({ row }) => (
					<Checkbox
						checked={row.getIsSelected()}
						onCheckedChange={(value) => row.toggleSelected(!!value)}
						aria-label="Sélectionner la ligne"
					/>
				),
				size: 40,
			})
		}

		for (const col of columns) {
			cols.push({
				id: col.id,
				accessorKey: col.id,
				header: () => {
					if (!col.sortable) {
						return (
							<span className="text-sm font-medium">{col.header}</span>
						)
					}
					const isActive = sortField === col.id
					return (
						<button
							type="button"
							className="flex items-center gap-1 text-sm font-medium hover:text-fg"
							onClick={() => handleSort(col.id)}
						>
							{col.header}
							{isActive && sortDirection === "asc" && (
								<ArrowUp className="size-3" />
							)}
							{isActive && sortDirection === "desc" && (
								<ArrowDown className="size-3" />
							)}
							{!isActive && <ArrowUpDown className="size-3 opacity-40" />}
						</button>
					)
				},
				cell: ({ row }) => col.cell(row.original),
			})
		}

		if (actions && actions.length > 0) {
			cols.push({
				id: "actions",
				header: () => null,
				cell: ({ row }) => {
					const visibleActions = actions.filter(
						(a) => !a.hidden || !a.hidden(row.original)
					)
					if (visibleActions.length === 0) return null

					return (
						<div className="flex items-center justify-end gap-1">
							{visibleActions.map((action, i) => (
								<Button
									key={i}
									variant="ghost"
									size="icon-xs"
									onClick={() => action.onClick(row.original)}
								>
									{action.icon ? (
										<action.icon className="size-3.5" />
									) : (
										<MoreHorizontal className="size-3.5" />
									)}
								</Button>
							))}
						</div>
					)
				},
				size: 60,
			})
		}

		return cols
	}, [columns, selectable, actions, sortField, sortDirection])

	const table = useReactTable({
		data,
		columns: tanstackColumns,
		getCoreRowModel: getCoreRowModel(),
		onRowSelectionChange: (updater) => {
			const newSelection =
				typeof updater === "function" ? updater(rowSelection) : updater
			setRowSelection(newSelection)
			if (onSelectionChange) {
				const selectedIds = Object.keys(newSelection).filter(
					(key) => newSelection[key]
				)
				const ids = selectedIds.map((idx) => data[Number(idx)]?.id).filter(Boolean)
				onSelectionChange(ids)
			}
		},
		state: {
			rowSelection,
		},
		getRowId: (row) => row.id,
	})

	// Loading state
	if (loading) {
		return (
			<div className={cn("space-y-2", className)}>
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton key={i} className="h-12 w-full" />
				))}
			</div>
		)
	}

	// Empty state
	if (data.length === 0 && emptyState) {
		return <div className={className}>{emptyState}</div>
	}

	return (
		<div className={cn("space-y-4", className)}>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead
										key={header.id}
										style={{ width: header.getSize() !== 150 ? header.getSize() : undefined }}
									>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
												)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows.map((row) => (
							<TableRow
								key={row.id}
								data-state={row.getIsSelected() ? "selected" : undefined}
							>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(
											cell.column.columnDef.cell,
											cell.getContext()
										)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{totalPages > 1 && (
				<div className="flex items-center justify-between">
					<p className="text-sm text-fg-muted">
						{(currentPage - 1) * pageSize + 1}–
						{Math.min(currentPage * pageSize, totalCount)} sur {totalCount}
					</p>
					<div className="flex items-center gap-1">
						<Button
							variant="outline"
							size="sm"
							disabled={currentPage <= 1}
							onClick={() => handlePageChange(currentPage - 1)}
						>
							Précédent
						</Button>
						<Button
							variant="outline"
							size="sm"
							disabled={currentPage >= totalPages}
							onClick={() => handlePageChange(currentPage + 1)}
						>
							Suivant
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}
