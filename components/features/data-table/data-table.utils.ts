import type { Row } from "@tanstack/react-table"
import type {
	ColumnFilterConfig,
	FilterCondition,
	FilterGroup,
	FilterOperator,
} from "./data-table-filter.types"
import type { DataTableColumnDef } from "./data-table.types"

/**
 * Evaluate a single filter condition against a row
 */
export function evaluateCondition<TData>(row: Row<TData>, condition: FilterCondition): boolean {
	const value = row.getValue(condition.column)
	const filterValue = condition.value
	const filterValue2 = condition.value2

	// Handle empty checks first
	if (condition.operator === "isEmpty") {
		return value === null || value === undefined || value === ""
	}
	if (condition.operator === "isNotEmpty") {
		return value !== null && value !== undefined && value !== ""
	}

	// If value is empty and not checking for empty, return false
	if (value === null || value === undefined || value === "") {
		return false
	}

	const operator = condition.operator

	// Text operators
	if (condition.type === "text") {
		const strValue = String(value).toLowerCase()
		const strFilter = String(filterValue).toLowerCase()

		switch (operator) {
			case "equals":
				return strValue === strFilter
			case "notEquals":
				return strValue !== strFilter
			case "contains":
				return strValue.includes(strFilter)
			case "notContains":
				return !strValue.includes(strFilter)
			case "startsWith":
				return strValue.startsWith(strFilter)
			case "endsWith":
				return strValue.endsWith(strFilter)
			default:
				return false
		}
	}

	// Number operators
	if (condition.type === "number") {
		const numValue = Number(value)
		const numFilter = Number(filterValue)
		const numFilter2 = Number(filterValue2)

		if (Number.isNaN(numValue) || Number.isNaN(numFilter)) {
			return false
		}

		switch (operator) {
			case "equals":
				return numValue === numFilter
			case "notEquals":
				return numValue !== numFilter
			case "greaterThan":
				return numValue > numFilter
			case "greaterThanOrEqual":
				return numValue >= numFilter
			case "lessThan":
				return numValue < numFilter
			case "lessThanOrEqual":
				return numValue <= numFilter
			case "between":
				if (Number.isNaN(numFilter2)) return false
				return numValue >= numFilter && numValue <= numFilter2
			default:
				return false
		}
	}

	// Date operators
	if (condition.type === "date") {
		const dateValue = new Date(value as any)
		const dateFilter = new Date(filterValue)
		const dateFilter2 = filterValue2 ? new Date(filterValue2) : null

		if (Number.isNaN(dateValue.getTime()) || Number.isNaN(dateFilter.getTime())) {
			return false
		}

		switch (operator) {
			case "equals":
				return dateValue.toDateString() === dateFilter.toDateString()
			case "notEquals":
				return dateValue.toDateString() !== dateFilter.toDateString()
			case "greaterThan":
				return dateValue > dateFilter
			case "greaterThanOrEqual":
				return dateValue >= dateFilter
			case "lessThan":
				return dateValue < dateFilter
			case "lessThanOrEqual":
				return dateValue <= dateFilter
			case "between":
				if (!dateFilter2 || Number.isNaN(dateFilter2.getTime())) return false
				return dateValue >= dateFilter && dateValue <= dateFilter2
			default:
				return false
		}
	}

	// Boolean operators
	if (condition.type === "boolean") {
		const boolValue = Boolean(value)
		const boolFilter = Boolean(filterValue)

		return operator === "equals" ? boolValue === boolFilter : true
	}

	// Select operators (including multi-select with 'in' and 'notIn')
	if (condition.type === "select") {
		const strValue = String(value)

		switch (operator) {
			case "equals":
				return strValue === String(filterValue)
			case "notEquals":
				return strValue !== String(filterValue)
			case "in":
				return Array.isArray(filterValue) && filterValue.includes(strValue)
			case "notIn":
				return Array.isArray(filterValue) && !filterValue.includes(strValue)
			default:
				return false
		}
	}

	return false
}

/**
 * Evaluate a filter group (with AND/OR logic and nested groups) against a row
 */
export function evaluateFilterGroup<TData>(row: Row<TData>, group: FilterGroup): boolean {
	// Evaluate all conditions in this group
	const conditionResults = group.conditions.map((condition) => evaluateCondition(row, condition))

	// Recursively evaluate nested groups
	const nestedResults =
		group.groups?.map((nestedGroup) => evaluateFilterGroup(row, nestedGroup)) || []

	// Combine all results
	const allResults = [...conditionResults, ...nestedResults]

	// If no results, return true (no filters applied)
	if (allResults.length === 0) {
		return true
	}

	// Apply AND/OR logic
	return group.operator === "AND" ? allResults.every(Boolean) : allResults.some(Boolean)
}

/**
 * Create a filter function for Tanstack Table that evaluates a FilterGroup
 */
export function createFilterFn<TData>(filterGroup: FilterGroup | null) {
	return (row: Row<TData>) => {
		if (!filterGroup) return true
		return evaluateFilterGroup(row, filterGroup)
	}
}

/**
 * Check if a filter group is empty (no conditions and no nested groups)
 */
export function isFilterGroupEmpty(group: FilterGroup | null): boolean {
	if (!group) return true
	if (group.conditions.length > 0) return false
	if (group.groups && group.groups.length > 0) {
		return group.groups.every(isFilterGroupEmpty)
	}
	return true
}

/**
 * Count the number of active filters in a filter group
 */
export function countActiveFilters(group: FilterGroup | null): number {
	if (!group) return 0

	let count = group.conditions.length

	if (group.groups) {
		count += group.groups.reduce((sum, nestedGroup) => sum + countActiveFilters(nestedGroup), 0)
	}

	return count
}

/**
 * Generate a readable description of a filter group for display
 */
export function describeFilterGroup(group: FilterGroup, depth = 0): string {
	const _indent = "  ".repeat(depth)
	let description = ""

	if (group.conditions.length > 0) {
		const conditionDescriptions = group.conditions.map((condition) => {
			const operator = condition.operator
			const value = condition.value
			const value2 = condition.value2

			if (operator === "between" && value2) {
				return `${condition.column} ${operator} ${value} and ${value2}`
			}
			if (operator === "isEmpty" || operator === "isNotEmpty") {
				return `${condition.column} ${operator}`
			}
			return `${condition.column} ${operator} ${value}`
		})

		description += conditionDescriptions.join(` ${group.operator} `)
	}

	if (group.groups && group.groups.length > 0) {
		const nestedDescriptions = group.groups.map((nestedGroup) =>
			describeFilterGroup(nestedGroup, depth + 1)
		)
		const joined = nestedDescriptions.join(` ${group.operator} `)

		if (description) {
			description += ` ${group.operator} (${joined})`
		} else {
			description = joined
		}
	}

	return description
}

/**
 * Get the accessor key from a column definition
 */
export function getColumnKey<TData>(column: DataTableColumnDef<TData, any>): string | undefined {
	return "accessorKey" in column ? (column.accessorKey as string) : undefined
}

/**
 * Format a filter value for display in a badge
 */
export function formatFilterValue(value: any, config: ColumnFilterConfig): string {
	// Handle array values (multi-select)
	if (Array.isArray(value)) {
		if (value.length === 0) return ""

		// For select type with options, show labels
		if (config.type === "select" && config.options) {
			const labels = value
				.map((v) => {
					const option = config.options!.find((opt) => opt.value === v)
					return option?.label || String(v)
				})
				.filter(Boolean)

			if (labels.length > 2) {
				return `${labels.slice(0, 2).join(", ")} +${labels.length - 2}`
			}
			return labels.join(", ")
		}

		// For other types, just join the values
		if (value.length > 2) {
			return `${value.slice(0, 2).join(", ")} +${value.length - 2}`
		}
		return value.join(", ")
	}

	// Handle single select value
	if (config.type === "select" && config.options) {
		const option = config.options.find((opt) => opt.value === value)
		return option?.label || String(value)
	}

	// Handle date
	if (config.type === "date" && value instanceof Date) {
		return value.toLocaleDateString()
	}

	// Default: convert to string
	return String(value)
}

/**
 * Get the filter label from column configuration or header
 */
export function getFilterLabel<TData>(column: DataTableColumnDef<TData, any>): string {
	// Use custom filter label if provided
	if (column.filterConfig?.filterLabel) {
		return column.filterConfig.filterLabel
	}

	// Use column header if it's a string
	if (typeof column.header === "string") {
		return column.header
	}

	// Fallback to column key
	const columnKey = getColumnKey(column)
	if (columnKey) {
		// Capitalize first letter
		return columnKey.charAt(0).toUpperCase() + columnKey.slice(1)
	}

	return "Filter"
}

/**
 * Extract the current filter value for a specific column from a filter group
 */
export function getCurrentFilterValue(
	filterGroup: FilterGroup | null,
	columnKey: string
): any {
	if (!filterGroup) return undefined

	const condition = filterGroup.conditions.find((c) => c.column === columnKey)
	return condition?.value
}

/**
 * Create a FilterCondition with implicit operator based on filter type
 */
export function createInlineFilterCondition<TData>(
	column: DataTableColumnDef<TData, any>,
	value: any
): FilterCondition {
	const columnKey = getColumnKey(column)
	if (!columnKey) {
		throw new Error("Column must have an accessorKey")
	}

	const filterType = column.filterConfig?.type
	if (!filterType) {
		throw new Error("Column must have a filterConfig with type")
	}

	// Determine operator based on type and value
	let operator: FilterOperator
	if (filterType === "select" && Array.isArray(value) && value.length > 1) {
		operator = "in"
	} else if (filterType === "text") {
		operator = "contains"
	} else {
		operator = "equals"
	}

	return {
		id: `inline-filter-${columnKey}-${Date.now()}`,
		column: columnKey,
		operator,
		value,
		type: filterType,
	}
}
