import { useState, useCallback } from "react"
import type { SortingState, VisibilityState, RowSelectionState, PaginationState } from "@tanstack/react-table"
import type { FilterGroup } from "../data-table-filter.types"
import type { DataTableView } from "../data-table-view.types"

interface UseDataTableStateOptions {
	defaultSorting?: SortingState
	defaultView?: DataTableView
	defaultPageSize?: number
}

/**
 * useDataTableState - Centralized state management for DataTable
 *
 * Manages all stateful aspects of the DataTable in a single hook,
 * making it easier to test and maintain. Includes:
 * - Sorting state
 * - Filtering (advanced + global)
 * - Column visibility
 * - Row selection
 * - Active view
 * - Pagination
 *
 * @param options - State initialization options
 * @param options.defaultSorting - Initial sorting configuration
 * @param options.defaultView - Initial active view
 * @param options.defaultPageSize - Initial page size (default: 10)
 *
 * @returns Object containing all state values and their setters
 *
 * @example
 * ```tsx
 * const tableState = useDataTableState({
 *   defaultSorting: [{ id: 'name', desc: false }],
 *   defaultView: allProductsView,
 *   defaultPageSize: 25
 * })
 *
 * // Use in DataTable
 * <DataTable
 *   data={products}
 *   columns={columns}
 *   sorting={tableState.sorting}
 *   onSortingChange={tableState.setSorting}
 *   ...
 * />
 * ```
 */
export function useDataTableState({
	defaultSorting = [],
	defaultView,
	defaultPageSize = 10,
}: UseDataTableStateOptions = {}) {
	// Sorting state
	const [sorting, setSorting] = useState<SortingState>(defaultSorting)

	// Filtering state
	const [filterGroup, setFilterGroup] = useState<FilterGroup | null>(
		defaultView?.filters || null
	)
	const [globalFilter, setGlobalFilter] = useState("")

	// Visibility state
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
		defaultView?.columnVisibility || {}
	)

	// Selection state
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})

	// View state
	const [activeView, setActiveView] = useState<DataTableView | null>(defaultView || null)

	// Pagination state
	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: defaultPageSize,
	})

	/**
	 * Reset all state to defaults
	 * Useful when switching views or clearing all filters
	 */
	const resetState = useCallback(() => {
		setSorting(defaultSorting)
		setFilterGroup(defaultView?.filters || null)
		setGlobalFilter("")
		setRowSelection({})
		setColumnVisibility(defaultView?.columnVisibility || {})
		setPagination({ pageIndex: 0, pageSize: defaultPageSize })
	}, [defaultSorting, defaultView, defaultPageSize])

	/**
	 * Apply a view's configuration to the table
	 * Updates filters, sorting, and column visibility based on the view
	 */
	const applyView = useCallback((view: DataTableView) => {
		setActiveView(view)
		setFilterGroup(view.filters)
		if (view.sorting) setSorting(view.sorting)
		if (view.columnVisibility) setColumnVisibility(view.columnVisibility)
		setPagination((prev) => ({ ...prev, pageIndex: 0 }))
	}, [])

	return {
		// Sorting
		sorting,
		setSorting,

		// Filtering
		filterGroup,
		setFilterGroup,
		globalFilter,
		setGlobalFilter,

		// Visibility
		columnVisibility,
		setColumnVisibility,

		// Selection
		rowSelection,
		setRowSelection,

		// Views
		activeView,
		setActiveView,
		applyView,

		// Pagination
		pagination,
		setPagination,

		// Utilities
		resetState,
	}
}
