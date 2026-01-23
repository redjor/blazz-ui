"use client"

import * as React from "react"
import type { FilterGroup } from "../data-table-filter.types"
import type { DataTableColumnDef } from "../data-table.types"
import {
	createInlineFilterCondition,
	getColumnKey,
	getCurrentFilterValue,
} from "../data-table.utils"

export interface UseInlineFilterStateOptions<TData> {
	columns: DataTableColumnDef<TData, any>[]
	filterGroup: FilterGroup | null
	onFilterChange: (filterGroup: FilterGroup | null) => void
}

export interface UseInlineFilterStateReturn<TData> {
	/** Columns with defaultInlineFilter: true */
	defaultFilters: DataTableColumnDef<TData, any>[]

	/** Columns with defaultInlineFilter: false that are not currently active */
	additionalFilters: DataTableColumnDef<TData, any>[]

	/** Set of column keys for active additional filters */
	activeAdditionalFilters: Set<string>

	/** Current filter values extracted from filterGroup */
	currentFilterValues: Record<string, any>

	/** Add an additional filter to the active list */
	handleAddFilter: (column: DataTableColumnDef<TData, any>) => void

	/** Update filter value for a column */
	handleFilterChange: (column: DataTableColumnDef<TData, any>, value: any) => void

	/** Clear filter for a column */
	handleClearFilter: (column: DataTableColumnDef<TData, any>) => void
}

/**
 * Hook to manage inline filter state
 *
 * Separates filters into default (always visible) and additional (in "Ajouter un filtre" dropdown).
 * Tracks which additional filters are currently active and syncs with the FilterGroup.
 *
 * @example
 * ```tsx
 * const {
 *   defaultFilters,
 *   additionalFilters,
 *   currentFilterValues,
 *   handleAddFilter,
 *   handleFilterChange,
 *   handleClearFilter
 * } = useInlineFilterState({ columns, filterGroup, onFilterChange })
 * ```
 */
export function useInlineFilterState<TData>({
	columns,
	filterGroup,
	onFilterChange,
}: UseInlineFilterStateOptions<TData>): UseInlineFilterStateReturn<TData> {
	// Track which additional filters are currently active
	const [activeAdditionalFilters, setActiveAdditionalFilters] = React.useState<Set<string>>(
		new Set()
	)

	// Normalize filter config (handle deprecated showQuickFilter)
	const normalizeFilterConfig = React.useCallback(
		(column: DataTableColumnDef<TData, any>) => {
			if (!column.filterConfig) return null

			const config = column.filterConfig

			// If using old API, convert automatically
			if (config.showQuickFilter !== undefined && config.showInlineFilter === undefined) {
				return {
					...config,
					showInlineFilter: config.showQuickFilter,
					defaultInlineFilter: config.showQuickFilter,
				}
			}

			return config
		},
		[]
	)

	// Extract columns with inline filter enabled
	const inlineFilterColumns = React.useMemo(
		() =>
			columns.filter((col) => {
				const config = normalizeFilterConfig(col)
				return config?.showInlineFilter === true && getColumnKey(col) !== undefined
			}),
		[columns, normalizeFilterConfig]
	)

	// Separate into default and additional filters
	const defaultFilters = React.useMemo(
		() =>
			inlineFilterColumns.filter((col) => {
				const config = normalizeFilterConfig(col)
				return config?.defaultInlineFilter === true
			}),
		[inlineFilterColumns, normalizeFilterConfig]
	)

	const allAdditionalFilters = React.useMemo(
		() =>
			inlineFilterColumns.filter((col) => {
				const config = normalizeFilterConfig(col)
				return config?.defaultInlineFilter !== true
			}),
		[inlineFilterColumns, normalizeFilterConfig]
	)

	// Filter out active additional filters from dropdown
	const additionalFilters = React.useMemo(
		() => allAdditionalFilters.filter((col) => !activeAdditionalFilters.has(getColumnKey(col)!)),
		[allAdditionalFilters, activeAdditionalFilters]
	)

	// Extract current filter values from filterGroup
	const currentFilterValues = React.useMemo(() => {
		if (!filterGroup) return {}

		const values: Record<string, any> = {}
		filterGroup.conditions.forEach((condition) => {
			values[condition.column] = condition.value
		})
		return values
	}, [filterGroup])

	// Sync active additional filters with filterGroup
	React.useEffect(() => {
		if (!filterGroup) {
			setActiveAdditionalFilters(new Set())
			return
		}

		const additionalFiltersSet = new Set<string>()

		filterGroup.conditions.forEach((condition) => {
			const column = columns.find((col) => getColumnKey(col) === condition.column)

			// If filter is not a default filter, add to active additional
			if (column) {
				const config = normalizeFilterConfig(column)
				if (config?.showInlineFilter && config?.defaultInlineFilter !== true) {
					additionalFiltersSet.add(condition.column)
				}
			}
		})

		setActiveAdditionalFilters(additionalFiltersSet)
	}, [filterGroup, columns, normalizeFilterConfig])

	// Add an additional filter to the active list
	const handleAddFilter = React.useCallback(
		(column: DataTableColumnDef<TData, any>) => {
			const columnKey = getColumnKey(column)
			if (!columnKey) return

			setActiveAdditionalFilters((prev) => {
				const next = new Set(prev)
				next.add(columnKey)
				return next
			})
		},
		[]
	)

	// Update filter value for a column
	const handleFilterChange = React.useCallback(
		(column: DataTableColumnDef<TData, any>, value: any) => {
			const columnKey = getColumnKey(column)
			if (!columnKey) return

			// Remove existing condition for this column
			const existingConditions =
				filterGroup?.conditions.filter((c) => c.column !== columnKey) || []

			// Create new condition
			const newCondition = createInlineFilterCondition(column, value)

			// Build new filter group
			const newFilterGroup: FilterGroup = {
				id: filterGroup?.id || "root",
				operator: "AND", // Inline filters always use AND
				conditions: [...existingConditions, newCondition],
			}

			onFilterChange(newFilterGroup)
		},
		[filterGroup, onFilterChange]
	)

	// Clear filter for a column
	const handleClearFilter = React.useCallback(
		(column: DataTableColumnDef<TData, any>) => {
			const columnKey = getColumnKey(column)
			if (!columnKey) return

			if (!filterGroup) return

			const newConditions = filterGroup.conditions.filter((c) => c.column !== columnKey)

			if (newConditions.length > 0) {
				onFilterChange({
					...filterGroup,
					conditions: newConditions,
				})
			} else {
				onFilterChange(null) // Clear all if no conditions left
			}

			// Remove from active additional filters if applicable
			const config = normalizeFilterConfig(column)
			if (config?.defaultInlineFilter !== true) {
				setActiveAdditionalFilters((prev) => {
					const next = new Set(prev)
					next.delete(columnKey)
					return next
				})
			}
		},
		[filterGroup, onFilterChange, normalizeFilterConfig]
	)

	return {
		defaultFilters,
		additionalFilters,
		activeAdditionalFilters,
		currentFilterValues,
		handleAddFilter,
		handleFilterChange,
		handleClearFilter,
	}
}
