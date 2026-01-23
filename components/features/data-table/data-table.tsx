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
import { DataTableFilterBuilder } from "./data-table-filter-builder"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableReUIFilters } from "./data-table-reui-filters"
import { DataTableRowActions } from "./data-table-row-actions"
import { DataTableRowSelection } from "./data-table-row-selection"
import { DataTableBulkSelectionBar } from "./data-table-bulk-selection-bar"
import { DataTableSaveViewDialog } from "./data-table-save-view-dialog"
import { DataTableRenameViewDialog } from "./data-table-rename-view-dialog"
import { useDataTableConfig } from "./config/data-table-config"

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
	pagination,
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
	onViewSave,
	onViewUpdate,
	onViewDelete,
	onCreateView,
	enableCustomViews = false,
	rowActions,
	bulkActions,
	variant,
	density,
	className,
	isLoading = false,
	loadingComponent,
	emptyComponent,
	hideToolbar = false,
	toolbarActions,
	locale,
	...props
}: DataTableProps<TData, TValue> & VariantProps<typeof dataTableVariants>) {
	// Get configuration from context (with overrides from props)
	const config = useDataTableConfig()

	// Apply configuration with prop overrides
	const finalPagination = {
		pageSize: pagination?.pageSize ?? config.pagination.defaultPageSize,
		pageSizeOptions: pagination?.pageSizeOptions ?? config.pagination.pageSizeOptions,
		showPageInfo: pagination?.showPageInfo ?? config.pagination.showPageInfo,
	}
	const finalVariant = variant ?? config.ui.defaultVariant
	const finalDensity = density ?? config.ui.defaultDensity
	const finalLocale = locale ?? config.i18n.defaultLocale
	const debounceMs = config.performance.searchDebounceMs

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
	const [showInlineFilters, setShowInlineFilters] = React.useState(false)

	// Internal active view state (if not controlled externally)
	const [internalActiveView, setInternalActiveView] = React.useState<DataTableView | null>(
		externalActiveView ||
			(views && views.length > 0 ? views.find((v) => v.isDefault) || views[0] : null)
	)

	// Use external activeView if provided, otherwise use internal state
	const activeView = externalActiveView !== undefined ? externalActiveView : internalActiveView

	// Track if filters came from view (to hide filter badges for view filters)
	const [filtersFromView, setFiltersFromView] = React.useState(false)

	// Save view dialog state
	const [showSaveViewDialog, setShowSaveViewDialog] = React.useState(false)

	// Rename view dialog state
	const [showRenameViewDialog, setShowRenameViewDialog] = React.useState(false)
	const [viewToRename, setViewToRename] = React.useState<DataTableView | null>(null)

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

	// Handle create view
	const handleCreateView = React.useCallback(() => {
		if (onCreateView) {
			onCreateView()
		} else {
			setShowSaveViewDialog(true)
		}
	}, [onCreateView])

	// Generate unique view ID
	const generateViewId = React.useCallback((name: string): string => {
		const slug = name
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, "")
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "")
		return `custom-${slug}-${Date.now()}`
	}, [])

	// Handle save view
	const handleSaveView = React.useCallback(
		(viewData: Omit<DataTableView, "id" | "createdAt" | "updatedAt">) => {
			const newView: DataTableView = {
				...viewData,
				id: generateViewId(viewData.name),
				filters: filterGroup || { id: "root", operator: "AND", conditions: [] },
				sorting,
				columnVisibility,
				isSystem: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			if (onViewSave) {
				onViewSave(newView)
			}

			// Si vue par défaut, mettre à jour toutes les autres vues
			if (viewData.isDefault && views && onViewUpdate) {
				views.forEach((v) => {
					if (v.isDefault && v.id !== newView.id) {
						onViewUpdate(v.id, { isDefault: false })
					}
				})
			}

			// Activer la nouvelle vue
			handleViewChange(newView)
			setShowSaveViewDialog(false)
		},
		[
			generateViewId,
			filterGroup,
			sorting,
			columnVisibility,
			onViewSave,
			handleViewChange,
			views,
			onViewUpdate,
		]
	)

	// Handle duplicate view
	const handleDuplicateView = React.useCallback(
		(viewId: string) => {
			const viewToDuplicate = views?.find((v) => v.id === viewId)
			if (!viewToDuplicate || !onViewSave) return

			// Create a copy with a new name
			const duplicateNumber = views?.filter((v) => v.name.startsWith(viewToDuplicate.name)).length || 1
			const newName = `${viewToDuplicate.name} (${duplicateNumber})`

			const duplicatedView: DataTableView = {
				...viewToDuplicate,
				id: generateViewId(newName),
				name: newName,
				isSystem: false,
				isDefault: false,
				createdAt: new Date(),
				updatedAt: new Date(),
			}

			onViewSave(duplicatedView)
			handleViewChange(duplicatedView)
		},
		[views, onViewSave, generateViewId, handleViewChange]
	)

	// Handle rename view (open dialog)
	const handleRenameView = React.useCallback(
		(viewId: string) => {
			const view = views?.find((v) => v.id === viewId)
			if (!view) return

			setViewToRename(view)
			setShowRenameViewDialog(true)
		},
		[views]
	)

	// Handle save rename
	const handleSaveRename = React.useCallback(
		(viewId: string, newName: string) => {
			if (!onViewUpdate) return

			onViewUpdate(viewId, {
				name: newName,
				updatedAt: new Date(),
			})
			setShowRenameViewDialog(false)
			setViewToRename(null)
		},
		[onViewUpdate]
	)

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

	// Handle search change with debounce (using config)
	React.useEffect(() => {
		const timeout = setTimeout(() => {
			setGlobalFilter(searchValue)
		}, debounceMs)

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
						pageSize: finalPagination.pageSize,
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

			{/* Save View Dialog */}
			{enableCustomViews && (
				<DataTableSaveViewDialog
					open={showSaveViewDialog}
					onOpenChange={setShowSaveViewDialog}
					currentState={{
						filters: filterGroup,
						sorting,
						columnVisibility,
					}}
					existingViews={views || []}
					onSave={handleSaveView}
					locale={finalLocale}
				/>
			)}

			{/* Rename View Dialog */}
			{enableCustomViews && (
				<DataTableRenameViewDialog
					open={showRenameViewDialog}
					onOpenChange={setShowRenameViewDialog}
					view={viewToRename}
					existingViews={views || []}
					onRename={handleSaveRename}
					locale={finalLocale}
				/>
			)}

			{/* Table */}
			<div>
				{/* Actions Bar */}
				<DataTableActionsBar
					views={views}
					activeView={activeView}
					onViewChange={handleViewChange}
					onViewDuplicate={handleDuplicateView}
					onViewRename={handleRenameView}
					onViewDelete={onViewDelete}
					onCreateView={handleCreateView}
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
					showInlineFilters={showInlineFilters}
					onToggleInlineFilters={() => setShowInlineFilters(!showInlineFilters)}
				/>

				{/* Inline Filters */}
				{enableAdvancedFilters && showInlineFilters && (
					<DataTableReUIFilters
						columns={columns as DataTableColumnDef<TData, any>[]}
						filterGroup={filterGroup}
						onFilterChange={handleFilterGroupChange}
						locale={finalLocale}
						variant="outline"
						size="sm"
					/>
				)}

				<div className="relative">
					<Table className={cn(dataTableVariants({ variant: finalVariant, density: finalDensity }))}>
						<TableHeader>
							{/* Column Headers Row - Always visible */}
							{table.getHeaderGroups().map((headerGroup) => (
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
							))}
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

					{/* Bulk Selection Bar - Appears over table header when rows selected */}
					{bulkActions && bulkActions.length > 0 && (
						<DataTableBulkSelectionBar
							table={table}
							bulkActions={bulkActions}
							locale={finalLocale}
						/>
					)}
				</div>

				{/* Pagination */}
				{enablePagination && (
					<DataTablePagination table={table} pageSizeOptions={finalPagination.pageSizeOptions} />
				)}
			</div>
		</div>
	)
}
