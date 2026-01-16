"use client"

import {
	type ColumnDef,
	type ColumnFiltersState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type Row,
	type RowSelectionState,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table"
import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { Button } from "@/components/ui/button"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import type {
	DataTableColumnDef,
	DataTableProps,
	DataTableView,
	FilterGroup,
} from "./data-table.types"
import { countActiveFilters, createFilterFn } from "./data-table.utils"
import { DataTableActionsBar } from "./data-table-actions-bar"
import { DataTableFilterBadges } from "./data-table-filter-badge"
import { DataTableFilterBuilder } from "./data-table-filter-builder"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableQuickFilters } from "./data-table-quick-filters"
import { DataTableRowActions } from "./data-table-row-actions"
import { DataTableRowSelection } from "./data-table-row-selection"

const dataTableVariants = cva("w-full", {
	variants: {
		variant: {
			default: "border-collapse",
			lined: "[&_tr]:border-b [&_tr]:border-border",
			striped: "[&_tbody_tr:nth-child(even)]:bg-muted/50",
		},
		density: {
			compact: "[&_td]:!py-2 [&_th]:!py-2 [&_td]:!px-2 [&_th]:!px-2",
			default: "",
			comfortable: "[&_td]:!py-4 [&_th]:!py-4 [&_td]:!px-4 [&_th]:!px-4",
		},
	},
	defaultVariants: {
		variant: "lined",
		density: "default",
	},
})

/**
 * DataTable - Advanced data table component built with TanStack React Table v8.
 *
 * Provides enterprise-grade features including:
 * - Advanced filtering with AND/OR logic
 * - Predefined views with localStorage persistence
 * - Row selection with bulk actions
 * - Sorting (single and multi-column)
 * - Pagination with customizable page sizes
 * - Global search with debouncing
 * - Row-level and bulk actions
 * - Multiple visual variants
 *
 * @template TData - The row data type
 * @template TValue - The cell value type (default: unknown)
 *
 * @example
 * ```typescript
 * // Basic usage
 * <DataTable
 *   data={products}
 *   columns={columns}
 * />
 *
 * // Full-featured
 * <DataTable
 *   data={products}
 *   columns={columns}
 *   enableSorting
 *   enablePagination
 *   enableRowSelection
 *   enableGlobalSearch
 *   enableAdvancedFilters
 *   views={views}
 *   activeView={activeView}
 *   onViewChange={setActiveView}
 *   rowActions={rowActions}
 *   bulkActions={bulkActions}
 *   pagination={{ pageSize: 25 }}
 *   variant="lined"
 *   density="default"
 * />
 * ```
 *
 * @see {@link https://tanstack.com/table/v8 TanStack Table Documentation}
 * @see {@link /examples/nextjs-app/components/features/data-table/DATA_TABLE_README.md Complete Documentation}
 */
export function DataTable<TData, TValue = unknown>({
	data,
	columns,
	getRowId,
	enableSorting = true,
	enableMultiSort = false,
	defaultSorting = [],
	onSortingChange,
	enablePagination = true,
	pagination = { pageSize: 25, pageSizeOptions: [10, 25, 50, 100] },
	onPaginationChange,
	enableRowSelection = false,
	enableSelectAll = true,
	onRowSelectionChange,
	enableGlobalSearch = true,
	searchPlaceholder = "Search...",
	enableAdvancedFilters = false,
	defaultFilterGroup,
	onFilterGroupChange,
	views,
	activeView: externalActiveView,
	onViewChange,
	onViewDelete,
	onCreateView,
	enableCustomViews = false,
	rowActions,
	bulkActions,
	variant = "lined",
	density = "default",
	className,
	isLoading = false,
	loadingComponent,
	emptyComponent,
	hideToolbar = false,
	toolbarActions,
	...props
}: DataTableProps<TData, TValue> & VariantProps<typeof dataTableVariants>) {
	// Prevent hydration mismatch by only rendering after mount
	const [isMounted, setIsMounted] = React.useState(false)

	React.useEffect(() => {
		setIsMounted(true)
	}, [])

	// State
	const [sorting, setSorting] = React.useState<SortingState>(defaultSorting)
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
	const [globalFilter, setGlobalFilter] = React.useState("")

	// Search state for actions bar
	const [searchOpen, setSearchOpen] = React.useState(false)
	const [searchValue, setSearchValue] = React.useState("")

	// Advanced filter state
	const [filterGroup, setFilterGroup] = React.useState<FilterGroup | null>(
		defaultFilterGroup || null
	)
	const [isFilterBuilderOpen, setIsFilterBuilderOpen] = React.useState(false)

	// Internal active view state (if not controlled externally)
	const [internalActiveView, setInternalActiveView] = React.useState<DataTableView | null>(
		externalActiveView ||
			(views && views.length > 0 ? views.find((v) => v.isDefault) || views[0] : null)
	)

	// Use external activeView if provided, otherwise use internal state
	const activeView = externalActiveView !== undefined ? externalActiveView : internalActiveView

	// Track if filters came from view (to hide filter badges for view filters)
	const [filtersFromView, setFiltersFromView] = React.useState(false)

	// Apply view when it changes
	React.useEffect(() => {
		if (!activeView) return

		// Apply filters from view
		if (activeView.filters) {
			setFilterGroup(activeView.filters)
			setFiltersFromView(true) // Mark filters as coming from view
		}

		// Apply sorting from view
		if (activeView.sorting) {
			setSorting(activeView.sorting)
		}

		// Apply column visibility from view
		if (activeView.columnVisibility) {
			setColumnVisibility(activeView.columnVisibility)
		}
	}, [activeView])

	// Handle view change
	const handleViewChange = React.useCallback(
		(view: DataTableView) => {
			if (onViewChange) {
				onViewChange(view)
			} else {
				setInternalActiveView(view)
			}
		},
		[onViewChange]
	)

	// Handle filter group changes
	const handleFilterGroupChange = React.useCallback(
		(newFilterGroup: FilterGroup | null) => {
			setFilterGroup(newFilterGroup)
			setFiltersFromView(false) // Mark filters as manually created
			if (onFilterGroupChange) {
				onFilterGroupChange(newFilterGroup)
			}
		},
		[onFilterGroupChange]
	)

	// Handle remove individual filter condition
	const handleRemoveCondition = React.useCallback(
		(conditionId: string) => {
			if (!filterGroup) return

			const newFilterGroup = {
				...filterGroup,
				conditions: filterGroup.conditions.filter((c) => c.id !== conditionId),
			}

			setFiltersFromView(false) // Mark as manually modified
			handleFilterGroupChange(newFilterGroup.conditions.length > 0 ? newFilterGroup : null)
		},
		[filterGroup, handleFilterGroupChange]
	)

	// Handle clear all filters
	const handleClearAllFilters = React.useCallback(() => {
		setFiltersFromView(false) // Mark as manually modified
		handleFilterGroupChange(null)
	}, [handleFilterGroupChange])

	// Build columns with selection and actions
	const tableColumns = React.useMemo<ColumnDef<TData, any>[]>(() => {
		const cols: ColumnDef<TData, any>[] = []

		// Add selection column if enabled
		if (enableRowSelection) {
			cols.push({
				id: "select",
				header: ({ table }) => <DataTableRowSelection table={table} type="header" />,
				cell: ({ row }) => <DataTableRowSelection row={row} type="cell" />,
				enableSorting: false,
				enableHiding: false,
				size: 40,
			})
		}

		// Add data columns
		cols.push(...columns)

		// Add actions column if provided
		if (rowActions && rowActions.length > 0) {
			cols.push({
				id: "actions",
				header: () => null,
				cell: ({ row }) => <DataTableRowActions row={row} actions={rowActions} />,
				enableSorting: false,
				enableHiding: false,
				size: 50,
			})
		}

		return cols
	}, [columns, enableRowSelection, rowActions])

	// Extract sortable columns for sort menu
	const sortableColumns = React.useMemo(() => {
		return columns
			.filter((col) => col.enableSorting !== false)
			.map((col) => {
				const id = "accessorKey" in col ? String(col.accessorKey) : col.id || ""
				let label = id

				// Try to extract label from header
				if (typeof col.header === "string") {
					label = col.header
				} else if ("header" in col && col.header) {
					// For DataTableColumnHeader, extract title prop if possible
					// This is a simplified version - in production might need more robust extraction
					label = id.charAt(0).toUpperCase() + id.slice(1)
				}

				return { id, label }
			})
			.filter((col) => col.id) // Remove columns without id
	}, [columns])

	// Handle search change with debounce
	React.useEffect(() => {
		const timeout = setTimeout(() => {
			setGlobalFilter(searchValue)
		}, 300)

		return () => clearTimeout(timeout)
	}, [searchValue])

	// Filter data based on advanced filters
	const filteredData = React.useMemo(() => {
		if (!enableAdvancedFilters || !filterGroup) {
			return data
		}

		const filterFn = createFilterFn<TData>(filterGroup)

		// Create temporary rows to filter
		return data.filter((item, index) => {
			// Create a minimal row object for filtering
			const row = {
				id: getRowId ? getRowId(item) : String(index),
				original: item,
				getValue: (columnId: string) => {
					const column = columns.find((col) => "accessorKey" in col && col.accessorKey === columnId)
					if (!column || !("accessorKey" in column)) return undefined
					return (item as any)[column.accessorKey as string]
				},
			} as Row<TData>

			return filterFn(row)
		})
	}, [data, enableAdvancedFilters, filterGroup, columns, getRowId])

	// Create table instance
	const table = useReactTable({
		data: filteredData,
		columns: tableColumns,
		getRowId,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
			globalFilter,
		},
		enableRowSelection,
		onSortingChange: (updater) => {
			setSorting(updater)
			if (onSortingChange) {
				const newSorting = typeof updater === "function" ? updater(sorting) : updater
				onSortingChange(newSorting)
			}
		},
		onColumnFiltersChange: setColumnFilters,
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: (updater) => {
			setRowSelection(updater)
			if (onRowSelectionChange) {
				const newSelection = typeof updater === "function" ? updater(rowSelection) : updater
				onRowSelectionChange(newSelection)
			}
		},
		onGlobalFilterChange: setGlobalFilter,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
		getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
		enableMultiSort,
		initialState: {
			pagination: enablePagination
				? {
						pageSize: pagination.pageSize,
						pageIndex: 0,
					}
				: undefined,
		},
	})

	// Handle pagination changes
	React.useEffect(() => {
		if (onPaginationChange && enablePagination) {
			const state = table.getState().pagination
			onPaginationChange(state)
		}
	}, [onPaginationChange, enablePagination, table.getState])

	// Wait for mount to prevent hydration mismatch
	if (!isMounted) {
		return (
			<div className="flex h-[400px] flex-col items-center justify-center space-y-2">
				{loadingComponent || (
					<>
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
						<p className="text-sm text-muted-foreground">Loading...</p>
					</>
				)}
			</div>
		)
	}

	// Empty state
	if (!isLoading && data.length === 0) {
		return (
			<div className="flex h-[400px] flex-col items-center justify-center space-y-2">
				{emptyComponent || <p className="text-sm text-muted-foreground">No data available</p>}
			</div>
		)
	}

	// Loading state
	if (isLoading) {
		return (
			<div className="flex h-[400px] flex-col items-center justify-center space-y-2">
				{loadingComponent || (
					<>
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-muted border-t-primary" />
						<p className="text-sm text-muted-foreground">Loading...</p>
					</>
				)}
			</div>
		)
	}

	return (
		<div className={cn(className)} data-slot="data-table">
			{/* Filter Badges - Only show for manually created filters, not view filters */}
			{enableAdvancedFilters && filterGroup && !filtersFromView && (
				<DataTableFilterBadges
					filterGroup={filterGroup}
					onRemoveCondition={handleRemoveCondition}
					onClearAll={handleClearAllFilters}
				/>
			)}

			{/* Filter Builder Dialog */}
			{enableAdvancedFilters && (
				<DataTableFilterBuilder
					open={isFilterBuilderOpen}
					onOpenChange={setIsFilterBuilderOpen}
					columns={columns as DataTableColumnDef<TData, any>[]}
					filterGroup={filterGroup}
					onApply={handleFilterGroupChange}
				/>
			)}

			{/* Table */}
			<div>
				{/* Actions Bar */}
				<DataTableActionsBar
					views={views}
					activeView={activeView}
					onViewChange={handleViewChange}
					onViewDelete={onViewDelete}
					onCreateView={onCreateView}
					enableCustomViews={enableCustomViews}
					searchOpen={searchOpen}
					onSearchOpenChange={setSearchOpen}
					searchValue={searchValue}
					onSearchChange={setSearchValue}
					searchPlaceholder={searchPlaceholder}
					sorting={sorting}
					onSortingChange={setSorting}
					sortableColumns={sortableColumns}
					filterCount={filterGroup ? countActiveFilters(filterGroup) : 0}
					onOpenFilterBuilder={() => setIsFilterBuilderOpen(true)}
				/>

				{/* Quick Filters Bar */}
				{enableAdvancedFilters && (
					<DataTableQuickFilters
						columns={columns as DataTableColumnDef<TData, any>[]}
						filterGroup={filterGroup}
						onFilterChange={handleFilterGroupChange}
						onOpenFilterBuilder={() => setIsFilterBuilderOpen(true)}
					/>
				)}

				<Table className={cn(dataTableVariants({ variant, density }))}>
					<TableHeader>
						{/* Bulk Actions Row - Replaces column headers when rows selected */}
						{bulkActions &&
						bulkActions.length > 0 &&
						table.getFilteredSelectedRowModel().rows.length > 0 ? (
							<TableRow className="bg-muted/50 hover:bg-muted/50">
								<TableHead colSpan={tableColumns.length} className="h-8 px-2">
									<div className="flex items-center justify-between gap-2">
										<div className="flex items-center gap-2 pl-2">
											{table.getFilteredSelectedRowModel().rows.length} rows selected
											{/** biome-ignore lint/a11y/useButtonType: <explanation> */}
											<button
												onClick={() => table.resetRowSelection()}
												className="ml-2 text-muted-foreground hover:text-foreground"
											>
												✕
											</button>
										</div>
										<div className="flex items-center gap-2">
											{bulkActions.map((action) => (
												<Button
													key={action.id}
													variant={action.variant || "outline"}
													size="sm"
													onClick={() => action.handler(table.getFilteredSelectedRowModel().rows)}
													disabled={action.disabled?.(table.getFilteredSelectedRowModel().rows)}
													className="h-8 "
												>
													{action.icon && <action.icon className="mr-2 h-3.5 w-3.5" />}
													{action.label}
												</Button>
											))}
										</div>
									</div>
								</TableHead>
							</TableRow>
						) : (
							/* Column Headers Row - Only shown when no rows selected */
							table
								.getHeaderGroups()
								.map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											return (
												<TableHead
													key={header.id}
													style={{
														width: header.getSize() !== 150 ? header.getSize() : undefined,
													}}
												>
													{header.isPlaceholder
														? null
														: flexRender(header.column.columnDef.header, header.getContext())}
												</TableHead>
											)
										})}
									</TableRow>
								))
						)}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(cell.column.columnDef.cell, cell.getContext())}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={columns.length} className="h-24 text-center">
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{/* Pagination */}
			{enablePagination && (
				<DataTablePagination table={table} pageSizeOptions={pagination.pageSizeOptions} />
			)}
		</div>
	)
}
