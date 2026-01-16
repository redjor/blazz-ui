import { useMemo } from "react"
import type { Row } from "@tanstack/react-table"
import type { FilterGroup } from "../data-table-filter.types"
import { createFilterFn } from "../data-table.utils"

interface UseDataTableFilteringOptions<TData> {
	data: TData[]
	filterGroup: FilterGroup | null
	globalFilter?: string
}

/**
 * useDataTableFiltering - Custom hook for managing DataTable filtering logic
 *
 * Handles both advanced filter groups and global search filtering.
 * Provides memoized filter functions for optimal performance.
 *
 * @template TData - The row data type
 *
 * @param options - Filtering configuration options
 * @param options.data - The full dataset to filter
 * @param options.filterGroup - Advanced filter group configuration
 * @param options.globalFilter - Global search string
 *
 * @returns Object containing the filter function and filtered data
 *
 * @example
 * ```tsx
 * const { filterFn, filteredData } = useDataTableFiltering({
 *   data: products,
 *   filterGroup: activeFilterGroup,
 *   globalFilter: searchQuery
 * })
 * ```
 */
export function useDataTableFiltering<TData>({
	data,
	filterGroup,
	globalFilter,
}: UseDataTableFilteringOptions<TData>) {
	// Custom filter function that applies advanced filters
	// Memoized to prevent unnecessary recalculations
	const filterFn = useMemo(() => createFilterFn(filterGroup), [filterGroup])

	// Apply global filter if provided
	// Global filter searches across all string fields in the data
	const filteredData = useMemo(() => {
		if (!globalFilter) return data

		return data.filter((item) => {
			const searchableFields = Object.values(item as object)
			return searchableFields.some((value) =>
				String(value).toLowerCase().includes(globalFilter.toLowerCase())
			)
		})
	}, [data, globalFilter])

	return {
		filterFn,
		filteredData,
	}
}
