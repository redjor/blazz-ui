"use client"

import {
	type Column,
	type ColumnDef,
	type ColumnFiltersState,
	type ColumnPinningState,
	type ExpandedState,
	flexRender,
	type GroupingState,
	getCoreRowModel,
	getExpandedRowModel,
	getFilteredRowModel,
	getGroupedRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	type Row,
	type RowSelectionState,
	type SortingState,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table"
import type { VariantProps } from "class-variance-authority"
import { ChevronRight, ListFilter } from "lucide-react"
import { Bleed } from "../../ui/bleed"
import { Button } from "../../ui/button"
import * as React from "react"
import { cn } from "../../../lib/utils"
import { Checkbox } from "../../ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../ui/table"
import { useDataTableConfig } from "./config/data-table-config"
import { dataTableVariants } from "./data-table.styles"
import type { DataTableColumnDef, DataTableProps } from "./data-table.types"
import { countActiveFilters, createDataFilterFn } from "./data-table.utils"
import { DataTableActionsBar } from "./data-table-actions-bar"
import { DataTableBulkSelectionBar } from "./data-table-bulk-selection-bar"
import { DataTableFilterBuilder } from "./data-table-filter-builder"
import { DataTablePagination } from "./data-table-pagination"
import { DataTableRenameViewDialog } from "./data-table-rename-view-dialog"
import { DataTableReUIFilters } from "./data-table-reui-filters"
import { DataTableRowActions } from "./data-table-row-actions"
import { DataTableRowSelection } from "./data-table-row-selection"
import { DataTableSaveViewDialog } from "./data-table-save-view-dialog"
import { DataTableSkeleton } from "./data-table-skeleton"
import type { AggregationType } from "./data-table-view.types"
import { useCellNavigation } from "./hooks/use-cell-navigation"
import { useDataTableSearch } from "./hooks/use-data-table-search"
import { useDataTableViews } from "./hooks/use-data-table-views"
import { useEditHistory } from "./hooks/use-edit-history"

function computeAggregation(
	subRows: Row<any>[],
	columnId: string,
	aggType: AggregationType
): React.ReactNode {
	if (typeof aggType === "function") {
		const values = subRows.map((r) => r.getValue(columnId))
		return aggType(values)
	}

	const values = subRows
		.map((r) => r.getValue(columnId))
		.filter((v): v is number => typeof v === "number")

	if (values.length === 0) return null

	switch (aggType) {
		case "sum":
			return values.reduce((a, b) => a + b, 0).toLocaleString()
		case "avg":
			return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
		case "min":
			return Math.min(...values).toLocaleString()
		case "max":
			return Math.max(...values).toLocaleString()
		case "count":
			return `${subRows.length}`
		case "range":
			return `${Math.min(...values).toLocaleString()} – ${Math.max(...values).toLocaleString()}`
		default:
			return null
	}
}

function getPinningStyles(column: Column<any, unknown>, isHeader = false): React.CSSProperties {
	const isPinned = column.getIsPinned()
	if (!isPinned) return {}

	return {
		position: "sticky",
		left: isPinned === "left" ? `${column.getStart("left")}px` : undefined,
		right: isPinned === "right" ? `${column.getAfter("right")}px` : undefined,
		zIndex: isHeader ? 2 : 1,
	}
}

export function DataTable<TData, TValue = unknown>({
	data,
	columns,
	getRowId,
	enableSorting = true,
	enableMultiSort = false,
	defaultSorting = [],
	onSortingChange,
	defaultColumnVisibility = {},
	enableColumnPinning = false,
	defaultColumnPinning,
	onColumnPinningChange,
	enableRowExpand = false,
	renderExpandedRow,
	expandMode = "multiple",
	defaultExpanded = false,
	enableGrouping = false,
	defaultGrouping = [],
	onGroupingChange,
	groupAggregations,
	enablePagination = true,
	pagination,
	onPaginationChange,
	enableRowSelection = false,
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
	onRowClick,
	variant,
	density,
	className,
	isLoading = false,
	loadingComponent,
	emptyComponent,
	enableCellEditing = false,
	onCellEdit,
	editHistorySize = 50,
	hideToolbar = false,
	hideHeaders = false,
	combineSearchAndFilters = false,
	toolbarLayout = "classic",
	groupRowStyle,
	renderRow,
	locale,
	...props
}: DataTableProps<TData, TValue> & VariantProps<typeof dataTableVariants>) {
	// Get configuration from context (with overrides from props)
	const config = useDataTableConfig()

	// Apply configuration with prop overrides
	const finalPagination = React.useMemo(
		() => ({
			pageIndex: pagination?.pageIndex ?? 0,
			pageSize: pagination?.pageSize ?? config.pagination.defaultPageSize,
			pageSizeOptions: pagination?.pageSizeOptions ?? config.pagination.pageSizeOptions,
			showPageInfo: pagination?.showPageInfo ?? config.pagination.showPageInfo,
			pageCount: pagination?.pageCount,
		}),
		[
			pagination?.pageIndex,
			pagination?.pageSize,
			pagination?.pageSizeOptions,
			pagination?.showPageInfo,
			pagination?.pageCount,
			config.pagination.defaultPageSize,
			config.pagination.pageSizeOptions,
			config.pagination.showPageInfo,
		]
	)
	const finalVariant = variant ?? config.ui.defaultVariant
	const finalDensity = density ?? config.ui.defaultDensity
	const finalLocale = locale ?? config.i18n.defaultLocale
	const debounceMs = config.performance.searchDebounceMs

	// Prevent hydration mismatch by only rendering after mount
	const [isMounted, setIsMounted] = React.useState(false)

	React.useEffect(() => {
		setIsMounted(true)
	}, [])

	// Core table state
	const [sorting, setSorting] = React.useState<SortingState>(defaultSorting)
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>(defaultColumnVisibility)
	const [columnPinning, setColumnPinning] = React.useState<ColumnPinningState>({
		left: defaultColumnPinning?.left ?? [],
		right: defaultColumnPinning?.right ?? [],
	})
	const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})
	const [expanded, setExpanded] = React.useState<ExpandedState>(() => {
		if (defaultExpanded === true) return true
		if (Array.isArray(defaultExpanded)) {
			return Object.fromEntries(defaultExpanded.map((id) => [id, true]))
		}
		return {}
	})
	const [grouping, setGrouping] = React.useState<GroupingState>(defaultGrouping)
	const [paginationState, setPaginationState] = React.useState({
		pageIndex: finalPagination.pageIndex,
		pageSize: finalPagination.pageSize,
	})

	// Sync pageIndex when it changes externally (e.g., URL navigation)
	React.useEffect(() => {
		if (finalPagination.pageIndex !== paginationState.pageIndex) {
			setPaginationState((prev) => ({ ...prev, pageIndex: finalPagination.pageIndex }))
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [finalPagination.pageIndex, paginationState.pageIndex])

	// Search hook
	const { searchOpen, setSearchOpen, searchValue, setSearchValue, globalFilter, setGlobalFilter } =
		useDataTableSearch({
			debounceMs,
			onSearchChange: props.onSearchChange,
		})

	// Views hook
	const viewsHook = useDataTableViews(
		{
			views,
			externalActiveView,
			defaultFilterGroup,
			onViewChange,
			onViewSave,
			onViewUpdate,
			onViewDelete,
			onCreateView,
			onFilterGroupChange,
			enableCustomViews,
			setSorting,
			setColumnVisibility,
			setColumnPinning,
			setGrouping: enableGrouping ? setGrouping : undefined,
		},
		sorting,
		columnVisibility,
		columnPinning,
		enableGrouping ? grouping : undefined
	)

	// Fade effect on data/view changes
	const tableBodyRef = React.useRef<HTMLTableSectionElement>(null)
	const prevDataRef = React.useRef(data)
	const prevViewIdRef = React.useRef(viewsHook.activeView?.id)

	React.useEffect(() => {
		if (prevDataRef.current !== data || prevViewIdRef.current !== viewsHook.activeView?.id) {
			const el = tableBodyRef.current
			if (el) {
				el.style.animation = "none"
				void el.offsetHeight
				el.style.animation = "fade-in 150ms ease-out"
			}
			prevDataRef.current = data
			prevViewIdRef.current = viewsHook.activeView?.id
		}
	}, [data, viewsHook.activeView?.id])

	// Build columns with selection and actions
	const tableColumns = React.useMemo<ColumnDef<TData, TValue>[]>(() => {
		const cols: ColumnDef<TData, TValue>[] = []

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

		if (enableRowExpand) {
			cols.push({
				id: "expand",
				header: () => null,
				cell: ({ row }) => (
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation()
							row.toggleExpanded()
						}}
						className="flex items-center justify-center p-1 text-fg-muted hover:text-fg"
					>
						<ChevronRight
							className={cn(
								"h-4 w-4 transition-transform duration-200",
								row.getIsExpanded() && "rotate-90"
							)}
						/>
					</button>
				),
				enableSorting: false,
				enableHiding: false,
				size: 32,
			})
		}

		cols.push(...columns)

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
	}, [columns, enableRowSelection, enableRowExpand, rowActions])

	// Extract sortable columns for sort menu
	const sortableColumns = React.useMemo(() => {
		return columns
			.filter((col) => col.enableSorting !== false)
			.map((col) => {
				const id = "accessorKey" in col ? String(col.accessorKey) : col.id || ""
				let label = id

				if (typeof col.header === "string") {
					label = col.header
				} else if ("header" in col && col.header) {
					label = id.charAt(0).toUpperCase() + id.slice(1)
				}

				return { id, label }
			})
			.filter((col) => col.id)
	}, [columns])

	// Extract groupable columns for group menu
	const groupableColumns = React.useMemo(() => {
		if (!enableGrouping) return []
		return columns
			.filter((col) => {
				const id = "accessorKey" in col ? String(col.accessorKey) : col.id || ""
				return id && col.enableSorting !== false
			})
			.map((col) => {
				const id = "accessorKey" in col ? String(col.accessorKey) : col.id || ""
				let label = id
				if (typeof col.header === "string") {
					label = col.header
				} else {
					label = id.charAt(0).toUpperCase() + id.slice(1)
				}
				return { id, label }
			})
	}, [columns, enableGrouping])

	// Extract filterable columns for filter dropdown (stacked toolbar)
	const filterableColumns = React.useMemo(() => {
		return columns
			.filter((col) => col.filterConfig)
			.map((col) => {
				const id = "accessorKey" in col ? String(col.accessorKey) : col.id || ""
				let label = col.filterConfig?.filterLabel || id
				if (!col.filterConfig?.filterLabel) {
					if (typeof col.header === "string") {
						label = col.header
					} else {
						label = id.charAt(0).toUpperCase() + id.slice(1)
					}
				}
				return {
					id,
					label,
					type: col.filterConfig?.type || "text",
					options: col.filterConfig?.options,
				}
			})
			.filter((col) => col.id)
	}, [columns])

	// Derive active filter values per column from the current filter group
	const activeFilterValues = React.useMemo(() => {
		const result: Record<string, any[]> = {}
		if (!viewsHook.filterGroup) return result
		for (const cond of viewsHook.filterGroup.conditions) {
			if (cond.operator === "equals") {
				if (!result[cond.column]) result[cond.column] = []
				result[cond.column].push(cond.value)
			} else if (cond.operator === "in" && Array.isArray(cond.value)) {
				result[cond.column] = [...(result[cond.column] || []), ...cond.value]
			}
		}
		return result
	}, [viewsHook.filterGroup])

	// Toggle a filter value on/off for a column (checkbox multi-select)
	const handleToggleFilterValue = React.useCallback(
		(columnId: string, value: any, type: string) => {
			const currentValues = activeFilterValues[columnId] ?? []
			const isActive = currentValues.some((v: any) => String(v) === String(value))
			const newValues = isActive
				? currentValues.filter((v: any) => String(v) !== String(value))
				: [...currentValues, value]

			// Remove existing conditions for this column
			const existingConditions = (viewsHook.filterGroup?.conditions ?? []).filter(
				(c) => c.column !== columnId
			)

			// Add new condition if values remain
			const conditions =
				newValues.length === 0
					? existingConditions
					: newValues.length === 1
						? [
								...existingConditions,
								{
									id: `qf-${columnId}`,
									column: columnId,
									operator: "equals" as const,
									value: newValues[0],
									type: type as "text" | "number" | "date" | "boolean" | "select",
								},
							]
						: [
								...existingConditions,
								{
									id: `qf-${columnId}`,
									column: columnId,
									operator: "in" as const,
									value: newValues,
									type: type as "text" | "number" | "date" | "boolean" | "select",
								},
							]

			const newGroup = {
				id: viewsHook.filterGroup?.id ?? "root",
				operator: (viewsHook.filterGroup?.operator ?? "AND") as "AND" | "OR",
				conditions,
				groups: viewsHook.filterGroup?.groups ?? [],
			}

			viewsHook.handleFilterGroupChange(conditions.length === 0 ? null : newGroup)
			if (!viewsHook.showInlineFilters && newValues.length > 0) {
				viewsHook.setShowInlineFilters(true)
			}
		},
		[viewsHook, activeFilterValues]
	)

	// Add an empty filter for a column (user will fill in the value in the filter bar)
	const handleAddColumnFilter = React.useCallback(
		(columnId: string) => {
			const colDef = columns.find((c) => {
				const id = "accessorKey" in c ? String(c.accessorKey) : c.id || ""
				return id === columnId
			})
			const filterType = colDef?.filterConfig?.type || "text"
			const condition = {
				id: `qf-${columnId}-${Date.now()}`,
				column: columnId,
				operator: (filterType === "text" ? "contains" : "equals") as any,
				value: "",
				type: filterType as "text" | "number" | "date" | "boolean" | "select",
			}
			const newGroup = viewsHook.filterGroup
				? {
						...viewsHook.filterGroup,
						conditions: [...viewsHook.filterGroup.conditions, condition],
					}
				: {
						id: "root",
						operator: "AND" as const,
						conditions: [condition],
						groups: [],
					}
			viewsHook.handleFilterGroupChange(newGroup)
			if (!viewsHook.showInlineFilters) {
				viewsHook.setShowInlineFilters(true)
			}
		},
		[columns, viewsHook]
	)

	// Determine if we're doing server-side filtering
	const isServerSideFiltering = props.onSearchChange !== undefined

	// Filter data based on advanced filters
	const filteredData = React.useMemo(() => {
		if (!enableAdvancedFilters || !viewsHook.filterGroup || isServerSideFiltering) {
			return data
		}

		const filterFn = createDataFilterFn<TData>(viewsHook.filterGroup)

		return data.filter(filterFn)
	}, [data, enableAdvancedFilters, viewsHook.filterGroup, isServerSideFiltering])

	// Create table instance
	const table = useReactTable({
		data: filteredData,
		columns: tableColumns,
		getRowId,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			columnPinning: enableColumnPinning ? columnPinning : { left: [], right: [] },
			rowSelection,
			expanded: enableRowExpand || enableGrouping ? expanded : undefined,
			grouping: enableGrouping ? grouping : undefined,
			globalFilter,
			pagination: enablePagination ? paginationState : undefined,
		},
		enableGrouping,
		groupedColumnMode: false,
		autoResetExpanded: false,
		enableColumnPinning,
		enableRowSelection,
		onGroupingChange: enableGrouping
			? (updater) => {
					setGrouping((prev) => {
						const next = typeof updater === "function" ? updater(prev) : updater
						onGroupingChange?.(next)
						return next
					})
				}
			: undefined,
		getGroupedRowModel: enableGrouping ? getGroupedRowModel() : undefined,
		onExpandedChange:
			enableRowExpand || enableGrouping
				? (updater) => {
						setExpanded((prev) => {
							const next = typeof updater === "function" ? updater(prev) : updater
							if (expandMode === "single" && typeof next === "object") {
								const prevKeys =
									typeof prev === "object"
										? Object.keys(prev).filter((k) => (prev as Record<string, boolean>)[k])
										: []
								const nextKeys = Object.keys(next).filter(
									(k) => (next as Record<string, boolean>)[k]
								)
								const newlyExpanded = nextKeys.filter((k) => !prevKeys.includes(k))
								if (newlyExpanded.length > 0) {
									return { [newlyExpanded[0]]: true }
								}
							}
							return next
						})
					}
				: undefined,
		getExpandedRowModel: enableRowExpand || enableGrouping ? getExpandedRowModel() : undefined,
		getRowCanExpand: enableRowExpand ? () => true : undefined,
		onColumnPinningChange: enableColumnPinning
			? (updater) => {
					setColumnPinning(updater)
					if (onColumnPinningChange) {
						const newPinning = typeof updater === "function" ? updater(columnPinning) : updater
						onColumnPinningChange({
							left: newPinning.left ?? [],
							right: newPinning.right ?? [],
						})
					}
				}
			: undefined,
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
		onPaginationChange: (updater) => {
			setPaginationState(updater)
			if (onPaginationChange && enablePagination) {
				const newPagination = typeof updater === "function" ? updater(paginationState) : updater
				onPaginationChange(newPagination)
			}
		},
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: isServerSideFiltering ? undefined : getFilteredRowModel(),
		getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
		getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
		enableMultiSort,
		manualFiltering: isServerSideFiltering,
		manualPagination: finalPagination.pageCount !== undefined,
		pageCount: finalPagination.pageCount ?? -1,
	})

	// Sync external pageSize changes to internal state
	React.useEffect(() => {
		if (enablePagination && finalPagination.pageSize !== paginationState.pageSize) {
			setPaginationState((prev) => ({ ...prev, pageSize: finalPagination.pageSize }))
		}
	}, [finalPagination.pageSize, enablePagination, paginationState.pageSize])

	// ---------------------------------------------------------------------------
	// Cell navigation & edit history
	// ---------------------------------------------------------------------------

	const visibleRowIds = React.useMemo(() => {
		if (!enableCellEditing) return []
		return table.getRowModel().rows.map((r) => r.id)
	}, [enableCellEditing, table.getRowModel])

	const visibleColumnIds = React.useMemo(() => {
		if (!enableCellEditing) return []
		return table
			.getVisibleLeafColumns()
			.filter((col) => col.id !== "select" && col.id !== "actions" && col.id !== "expand")
			.map((col) => col.id)
	}, [table, enableCellEditing])

	const cellNav = useCellNavigation({
		enabled: enableCellEditing,
		rowIds: visibleRowIds,
		columnIds: visibleColumnIds,
	})

	const editHistory = useEditHistory(editHistorySize)

	const handleTableKeyDown = React.useCallback(
		(e: React.KeyboardEvent) => {
			// Undo / Redo (Ctrl+Z / Ctrl+Shift+Z / Ctrl+Y)
			if (enableCellEditing && (e.ctrlKey || e.metaKey)) {
				if (e.key === "z" && !e.shiftKey) {
					e.preventDefault()
					const edit = editHistory.undo()
					if (edit && onCellEdit) {
						onCellEdit(edit.rowId, edit.columnId, edit.previousValue, edit.newValue)
					}
					return
				}
				if ((e.key === "z" && e.shiftKey) || e.key === "y") {
					e.preventDefault()
					const edit = editHistory.redo()
					if (edit && onCellEdit) {
						onCellEdit(edit.rowId, edit.columnId, edit.newValue, edit.previousValue)
					}
					return
				}
			}

			// Delegate to cell navigation
			cellNav.handleKeyDown(e)
		},
		[enableCellEditing, editHistory, onCellEdit, cellNav]
	)

	// Wait for mount to prevent hydration mismatch
	if (!isMounted) {
		return (
			<div className="flex h-100 flex-col items-center justify-center space-y-2">
				{loadingComponent || (
					<>
						<div className="h-8 w-8 animate-spin rounded-full border-4 border-raised border-t-brand" />
						<p className="text-sm text-fg-muted">Loading...</p>
					</>
				)}
			</div>
		)
	}

	// Loading state
	if (isLoading) {
		return (
			<div className={cn(className)} data-slot="data-table">
				{loadingComponent || (
					<DataTableSkeleton
						columns={tableColumns.length}
						variant={finalVariant}
						density={finalDensity}
						showSelection={enableRowSelection}
						showActions={rowActions && rowActions.length > 0}
					/>
				)}
			</div>
		)
	}

	// Determine if we should show the full UI even with no data
	const showToolbarWithEmptyData =
		(views && views.length > 0) || enableGlobalSearch || enableAdvancedFilters

	// Empty state (only if we should hide toolbar)
	if (!isLoading && data.length === 0 && !showToolbarWithEmptyData) {
		return (
			<div className="flex h-100 flex-col items-center justify-center space-y-2">
				{emptyComponent || <p className="text-sm text-fg-muted">No data available</p>}
			</div>
		)
	}

	return (
		<div className={cn(className)} data-slot="data-table">
			{/* Filter Builder Dialog */}
			{enableAdvancedFilters && (
				<DataTableFilterBuilder
					open={viewsHook.isFilterBuilderOpen}
					onOpenChange={viewsHook.setIsFilterBuilderOpen}
					columns={columns as DataTableColumnDef<TData, TValue>[]}
					filterGroup={viewsHook.filterGroup}
					onApply={viewsHook.handleFilterGroupChange}
					locale={finalLocale}
				/>
			)}

			{/* Save View Dialog */}
			{enableCustomViews && (
				<DataTableSaveViewDialog
					open={viewsHook.showSaveViewDialog}
					onOpenChange={viewsHook.setShowSaveViewDialog}
					currentState={{
						filters: viewsHook.filterGroup,
						sorting,
						columnVisibility,
						columnPinning: enableColumnPinning ? columnPinning : { left: [], right: [] },
						grouping: enableGrouping ? grouping : undefined,
					}}
					existingViews={views || []}
					onSave={(viewData) => {
						viewsHook.handleSaveView(viewData)
						setSearchOpen(false)
						setSearchValue("")
					}}
					locale={finalLocale}
				/>
			)}

			{/* Rename View Dialog */}
			{enableCustomViews && (
				<DataTableRenameViewDialog
					open={viewsHook.showRenameViewDialog}
					onOpenChange={viewsHook.setShowRenameViewDialog}
					view={viewsHook.viewToRename}
					existingViews={views || []}
					onRename={viewsHook.handleSaveRename}
					locale={finalLocale}
				/>
			)}

			{/* Table */}
			<div>
				{/* Actions Bar */}
				{!hideToolbar && (
					<DataTableActionsBar
						views={views}
						activeView={viewsHook.activeView}
						onViewChange={viewsHook.handleViewChange}
						onViewOverwrite={viewsHook.handleOverwriteView}
						onViewDuplicate={viewsHook.handleDuplicateView}
						onViewRename={viewsHook.handleRenameView}
						onViewDelete={onViewDelete}
						onCreateView={viewsHook.handleCreateView}
						enableCustomViews={enableCustomViews}
						searchOpen={searchOpen}
						onSearchOpenChange={setSearchOpen}
						searchValue={searchValue}
						onSearchChange={setSearchValue}
						searchPlaceholder={searchPlaceholder}
						sorting={sorting}
						onSortingChange={setSorting}
						sortableColumns={sortableColumns}
						enableGrouping={enableGrouping}
						groupableColumns={groupableColumns}
						grouping={grouping}
						onGroupingChange={(g) => {
							setGrouping(g)
							onGroupingChange?.(g)
						}}
						filterCount={viewsHook.filterGroup ? countActiveFilters(viewsHook.filterGroup) : 0}
						onOpenFilterBuilder={() => viewsHook.setIsFilterBuilderOpen(true)}
						showInlineFilters={viewsHook.showInlineFilters}
						onToggleInlineFilters={() =>
							viewsHook.setShowInlineFilters(!viewsHook.showInlineFilters)
						}
						filterableColumns={filterableColumns}
						activeFilterValues={activeFilterValues}
						onToggleFilterValue={handleToggleFilterValue}
						onAddColumnFilter={handleAddColumnFilter}
						combineSearchAndFilters={combineSearchAndFilters}
						toolbarLayout={toolbarLayout}
						onSaveView={enableCustomViews ? () => viewsHook.setShowSaveViewDialog(true) : undefined}
						onViewEditingChange={(editing) => {
							if (editing) {
								viewsHook.setShowInlineFilters(true)
							} else {
								viewsHook.setShowInlineFilters(false)
							}
						}}
						onSaveViewInline={
							enableCustomViews
								? (name: string, description?: string) => {
										viewsHook.handleSaveView({
											name,
											description,
											isSystem: false,
											filters: viewsHook.filterGroup ?? {
												id: "root",
												operator: "AND",
												conditions: [],
												groups: [],
											},
											sorting,
											columnVisibility,
										})
									}
								: undefined
						}
						locale={finalLocale}
					/>
				)}

				{/* Inline Filters — classic layout: standalone bar */}
				{enableAdvancedFilters && viewsHook.showInlineFilters && toolbarLayout !== "stacked" && (
					<DataTableReUIFilters
						columns={columns as DataTableColumnDef<TData, TValue>[]}
						filterGroup={viewsHook.filterGroup}
						onFilterChange={viewsHook.handleFilterGroupChange}
						locale={finalLocale}
						variant="outline"
						size="sm"
					/>
				)}

				{/* Inline Filters — stacked layout: integrated row with filter icon + Clear/Save */}
				{enableAdvancedFilters && viewsHook.showInlineFilters && toolbarLayout === "stacked" && (
					<div className="flex items-center gap-3 border-b border-separator px-3 py-1.5">
						<ListFilter className="h-3.5 w-3.5 shrink-0 text-fg-muted" />
						<div className="flex-1 min-w-0">
							<DataTableReUIFilters
								columns={columns as DataTableColumnDef<TData, TValue>[]}
								filterGroup={viewsHook.filterGroup}
								onFilterChange={viewsHook.handleFilterGroupChange}
								locale={finalLocale}
								variant="outline"
								size="sm"
								bare
							/>
						</div>
						<div className="flex shrink-0 items-center gap-1">
							<button
								type="button"
								onClick={() => {
									viewsHook.handleFilterGroupChange(null)
									viewsHook.setShowInlineFilters(false)
								}}
								className="px-2 py-0.5 text-xs text-fg-muted hover:text-fg transition-colors"
							>
								Effacer
							</button>
							{enableCustomViews && (
								<Button
									variant="ghost"
									size="sm"
									onClick={() => viewsHook.setShowSaveViewDialog(true)}
									className="h-6 px-2 text-xs"
								>
									Sauvegarder
								</Button>
							)}
						</div>
					</div>
				)}

				<div
					className={cn(
						"relative grid w-full",
						finalVariant === "editable" && "overflow-hidden rounded-lg border border-container",
						enableCellEditing && "outline-none"
					)}
					tabIndex={enableCellEditing ? 0 : undefined}
					onKeyDown={enableCellEditing ? handleTableKeyDown : undefined}
				>
					<Table
						className={cn(dataTableVariants({ variant: finalVariant, density: finalDensity }))}
						wrapperClassName={finalVariant === "flat" ? "p-2" : undefined}
					>
						{!hideHeaders && (
							<TableHeader>
								{table.getHeaderGroups().map((headerGroup) => (
									<TableRow key={headerGroup.id}>
										{headerGroup.headers.map((header) => {
											return (
												<TableHead
													key={header.id}
													style={{
														width: header.getSize() !== 150 ? header.getSize() : undefined,
														...getPinningStyles(header.column, true),
													}}
													className={cn(
														header.column.getIsPinned() && "bg-surface",
														header.column.getIsPinned() === "left" &&
															header.column.getIsLastColumn("left") &&
															"shadow-[inset_-4px_0_4px_-4px_oklch(0_0_0/0.08)]",
														header.column.getIsPinned() === "right" &&
															header.column.getIsFirstColumn("right") &&
															"shadow-[inset_4px_0_4px_-4px_oklch(0_0_0/0.08)]"
													)}
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
						)}
						<TableBody ref={tableBodyRef}>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => {
									// Grouped row: render group header
									if (row.getIsGrouped()) {
										return (
											<React.Fragment key={row.id}>
												<TableRow
													data-group-header=""
													className={cn(
														"bg-surface hover:bg-surface-3/50",
														finalVariant === "flat" && "bg-transparent hover:bg-transparent"
													)}
													style={
														row.depth > 0
															? { position: "relative", left: `${row.depth * 1.5}rem` }
															: undefined
													}
												>
													<TableCell
														colSpan={row.getVisibleCells().length}
														className={cn("py-2", finalVariant === "flat" && "rounded-lg")}
														style={groupRowStyle?.(row)}
													>
														<div className="flex w-full items-center gap-2">
															{enableRowSelection && (
																<div
																	onClick={(e) => e.stopPropagation()}
																	onKeyDown={(e) => e.stopPropagation()}
																>
																	<Checkbox
																		checked={row.getIsAllSubRowsSelected()}
																		indeterminate={
																			row.getIsSomeSelected() && !row.getIsAllSubRowsSelected()
																		}
																		onCheckedChange={(value) => row.toggleSelected(!!value)}
																		aria-label={`Select group ${row.id}`}
																	/>
																</div>
															)}
															<button
																type="button"
																onClick={row.getToggleExpandedHandler()}
																className="flex flex-1 items-center gap-2 text-left font-medium"
															>
																<ChevronRight
																	className={cn(
																		"h-4 w-4 shrink-0 transition-transform duration-200",
																		row.getIsExpanded() && "rotate-90"
																	)}
																/>
																{/* Render group value — search ALL cells so hidden grouping columns still render */}
																{row.getAllCells().map((cell) => {
																	if (cell.getIsGrouped()) {
																		return (
																			<span key={cell.id} className="flex items-center gap-2">
																				{flexRender(cell.column.columnDef.cell, cell.getContext())}
																				<span className="rounded-full bg-surface-3/70 px-1.5 py-0.5 text-[11px] font-normal tabular-nums text-fg-muted">
																					{row.subRows.length}
																				</span>
																			</span>
																		)
																	}
																	return null
																})}
																{/* Render aggregations */}
																{groupAggregations && (
																	<span className="ml-auto flex items-center gap-4 text-body-sm font-normal text-fg-muted">
																		{Object.entries(groupAggregations).map(([colId, aggType]) => {
																			if (colId === "_count") return null
																			const aggValue = computeAggregation(
																				row.subRows,
																				colId,
																				aggType
																			)
																			if (aggValue === null) return null
																			return <span key={colId}>{aggValue}</span>
																		})}
																	</span>
																)}
															</button>
														</div>
													</TableCell>
												</TableRow>
											</React.Fragment>
										)
									}

									// Custom row rendering (flat/Linear-style)
									if (renderRow) {
										return (
											<React.Fragment key={row.id}>
												<TableRow
													data-state={row.getIsSelected() && "selected"}
													className={onRowClick ? "cursor-pointer" : ""}
													onClick={(e) => {
														const target = e.target as HTMLElement
														if (!target.closest('[role="checkbox"], [data-slot="dropdown-menu-trigger"], button, a') && onRowClick) {
															onRowClick(row.original)
														}
													}}
												>
													<TableCell colSpan={row.getVisibleCells().length} className="!p-0">
														<div className="flex items-center gap-2">
															{enableRowSelection && (
																<div
																	className="shrink-0"
																	onClick={(e) => e.stopPropagation()}
																	onKeyDown={(e) => e.stopPropagation()}
																>
																	<DataTableRowSelection row={row} type="cell" />
																</div>
															)}
															<div className="flex min-w-0 flex-1 items-center">
																{renderRow(row)}
															</div>
															{rowActions && rowActions.length > 0 && (
																<Bleed marginBlock="200">
																	<DataTableRowActions row={row} actions={rowActions} />
																</Bleed>
															)}
														</div>
													</TableCell>
												</TableRow>
											</React.Fragment>
										)
									}

									// Normal row rendering
									return (
										<React.Fragment key={row.id}>
											<TableRow
												data-state={row.getIsSelected() && "selected"}
												className={onRowClick ? "cursor-pointer hover:bg-surface-3/50" : ""}
												onClick={(e) => {
													const target = e.target as HTMLElement
													const isCheckbox = target.closest('[role="checkbox"]')
													const isActions = target.closest('[data-slot="dropdown-menu-trigger"]')
													const isButton = target.closest("button")
													const isLink = target.closest("a")

													if (!isCheckbox && !isActions && !isButton && !isLink && onRowClick) {
														onRowClick(row.original)
													}
												}}
											>
												{row.getVisibleCells().map((cell) => {
													const isCellActive =
														enableCellEditing &&
														cellNav.activeCell?.rowId === row.id &&
														cellNav.activeCell?.columnId === cell.column.id

													return (
														<TableCell
															key={cell.id}
															data-row={enableCellEditing ? row.id : undefined}
															data-col={enableCellEditing ? cell.column.id : undefined}
															style={getPinningStyles(cell.column)}
															onClick={
																enableCellEditing
																	? () => cellNav.focusCell(row.id, cell.column.id)
																	: undefined
															}
															className={cn(
																cell.column.getIsPinned() && "bg-surface",
																cell.column.getIsPinned() === "left" &&
																	cell.column.getIsLastColumn("left") &&
																	"shadow-[inset_-4px_0_4px_-4px_oklch(0_0_0/0.08)]",
																cell.column.getIsPinned() === "right" &&
																	cell.column.getIsFirstColumn("right") &&
																	"shadow-[inset_4px_0_4px_-4px_oklch(0_0_0/0.08)]",
																isCellActive && "ring-2 ring-inset ring-brand"
															)}
														>
															{flexRender(cell.column.columnDef.cell, cell.getContext())}
														</TableCell>
													)
												})}
											</TableRow>
											{enableRowExpand && row.getIsExpanded() && renderExpandedRow && (
												<TableRow data-state="expanded">
													<TableCell
														colSpan={row.getVisibleCells().length}
														className="bg-muted/30 p-4"
													>
														{renderExpandedRow(row)}
													</TableCell>
												</TableRow>
											)}
										</React.Fragment>
									)
								})
							) : (
								<TableRow>
									<TableCell colSpan={tableColumns.length} className="h-24 text-center">
										{emptyComponent || <p className="text-sm text-fg-muted">No results.</p>}
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>

					{/* Bulk Selection Bar */}
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
					<DataTablePagination
						table={table}
						pageSizeOptions={finalPagination.pageSizeOptions}
						locale={finalLocale}
					/>
				)}
			</div>
		</div>
	)
}
