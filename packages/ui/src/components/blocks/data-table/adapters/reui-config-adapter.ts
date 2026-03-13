/**
 * Adapter for converting DataTable column definitions to ReUI FilterFieldConfig
 *
 * This adapter transforms column configurations from the DataTable format
 * to the format expected by the ReUI Filters component.
 */

import type { FilterFieldConfig, FilterOperator as ReuiFilterOperator } from "../../../ui/filters"
import type { DataTableColumnDef } from "../data-table.types"
import type { FilterOperator, FilterType } from "../data-table-filter.types"
import { mapOperatorToReui } from "./reui-filters-adapter"

/**
 * Map FilterType to ReUI field type
 */
function mapTypeToReui(type: FilterType): FilterFieldConfig["type"] {
	const mapping: Record<FilterType, FilterFieldConfig["type"]> = {
		text: "text",
		number: "number",
		date: "date",
		boolean: "boolean",
		select: "select", // Will be changed to multiselect if needed
	}

	return mapping[type] || "text"
}

/**
 * Get default operator for a filter type
 */
export function getDefaultOperator(type: FilterType): string {
	const defaults: Record<FilterType, string> = {
		text: "contains",
		number: "equals", // ReUI uses "equals" for number, not "is"
		date: "equals", // ReUI uses "equals" for date, not "is"
		boolean: "is",
		select: "is_any_of",
	}

	return defaults[type] || "is"
}

/**
 * Get available operators for a filter type
 */
export function getOperatorsForType(
	type: FilterType,
	customOperators?: FilterOperator[]
): ReuiFilterOperator[] {
	// Default operators by type
	const defaultOperators: Record<FilterType, FilterOperator[]> = {
		text: [
			"contains",
			"notContains",
			"equals",
			"notEquals",
			"startsWith",
			"endsWith",
			"isEmpty",
			"isNotEmpty",
		],
		number: ["equals", "notEquals", "greaterThan", "lessThan", "between", "isEmpty", "isNotEmpty"],
		date: ["equals", "notEquals", "greaterThan", "lessThan", "between", "isEmpty", "isNotEmpty"],
		boolean: ["equals"],
		select: ["in", "notIn", "isEmpty", "isNotEmpty"],
	}

	// Use custom operators if provided, otherwise use defaults
	const operators = customOperators || defaultOperators[type] || []

	// Convert to ReUI format - IMPORTANT: pass type for context-specific mapping
	return operators.map((op) => {
		const reuiOp = mapOperatorToReui(op, type)

		// Determine if operator supports multiple values
		const supportsMultiple = [
			"is_any_of",
			"is_not_any_of",
			"includes_all",
			"excludes_all",
			"between",
		].includes(reuiOp)

		return {
			value: reuiOp,
			label: formatOperatorLabel(reuiOp),
			supportsMultiple,
		}
	})
}

/**
 * Format operator label for display
 */
function formatOperatorLabel(operator: string): string {
	// Convert snake_case to Title Case
	return operator
		.split("_")
		.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
		.join(" ")
}

/**
 * Get column key (accessorKey or id)
 */
function getColumnKey(column: DataTableColumnDef<any, any>): string | undefined {
	if ("accessorKey" in column && column.accessorKey) {
		return String(column.accessorKey)
	}
	return column.id
}

/**
 * Get column label (from header or filterLabel)
 */
function getColumnLabel(column: DataTableColumnDef<any, any>): string {
	// Use custom filter label if provided
	if (column.filterConfig?.filterLabel) {
		return column.filterConfig.filterLabel
	}

	// Extract from header if it's a string
	if (typeof column.header === "string") {
		return column.header
	}

	// Fallback to column key
	const key = getColumnKey(column)
	if (key) {
		// Convert camelCase/snake_case to Title Case
		return key
			.replace(/([A-Z])/g, " $1")
			.replace(/_/g, " ")
			.trim()
			.split(" ")
			.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
			.join(" ")
	}

	return "Unknown"
}

/**
 * Convert a single DataTable column to ReUI FilterFieldConfig
 */
export function columnToFilterFieldConfig<TData>(
	column: DataTableColumnDef<TData, any>
): FilterFieldConfig | null {
	const filterConfig = column.filterConfig

	// Skip columns without filter config or not enabled for inline filters
	if (!filterConfig || !filterConfig.showInlineFilter) {
		return null
	}

	const key = getColumnKey(column)
	if (!key) {
		return null
	}

	const label = getColumnLabel(column)
	const reuiType = mapTypeToReui(filterConfig.type)

	// Determine if should be multiselect
	const isMultiselect =
		filterConfig.type === "select" &&
		(filterConfig.operators?.some((op: FilterOperator) => op === "in" || op === "notIn") ?? true)

	const config: FilterFieldConfig = {
		key,
		label,
		type: isMultiselect ? "multiselect" : reuiType,
		placeholder: filterConfig.placeholder,
		className: filterConfig.placeholder ? undefined : "w-48", // Default width
		searchable:
			filterConfig.type === "select" && filterConfig.options && filterConfig.options.length > 5,
		defaultOperator: getDefaultOperator(filterConfig.type),
	}

	// Don't pass operators - let ReUI Filters use its own with i18n
	// Only pass operators if custom ones are specified in filterConfig
	if (filterConfig.operators) {
		const operators = getOperatorsForType(filterConfig.type, filterConfig.operators)
		if (operators.length > 0) {
			config.operators = operators
		}
	}

	// Add options for select type
	if (filterConfig.type === "select" && filterConfig.options) {
		config.options = filterConfig.options.map((opt: { label: string; value: any }) => ({
			value: opt.value,
			label: opt.label,
		}))
	}

	// Add number-specific config
	if (filterConfig.type === "number") {
		if (filterConfig.min !== undefined) config.min = filterConfig.min
		if (filterConfig.max !== undefined) config.max = filterConfig.max
		if (filterConfig.step !== undefined) config.step = filterConfig.step
	}

	return config
}

/**
 * Convert all DataTable columns to ReUI FilterFieldConfig array
 */
export function columnsToFilterFields<TData>(
	columns: DataTableColumnDef<TData, any>[]
): FilterFieldConfig[] {
	return columns
		.map((column) => columnToFilterFieldConfig(column))
		.filter((config): config is FilterFieldConfig => config !== null)
}

/**
 * Separate fields into default (always visible) and additional (in dropdown)
 */
export function separateFilterFields<TData>(columns: DataTableColumnDef<TData, any>[]): {
	defaultFields: FilterFieldConfig[]
	additionalFields: FilterFieldConfig[]
} {
	const allFields = columnsToFilterFields(columns)

	const defaultFields = allFields.filter((field) => {
		const column = columns.find((col) => getColumnKey(col) === field.key)
		return column?.filterConfig?.defaultInlineFilter === true
	})

	const additionalFields = allFields.filter((field) => {
		const column = columns.find((col) => getColumnKey(col) === field.key)
		return column?.filterConfig?.defaultInlineFilter !== true
	})

	return { defaultFields, additionalFields }
}
