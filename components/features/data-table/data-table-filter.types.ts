/**
 * Filter operator types for comparing column values.
 *
 * - **Equality**: equals, notEquals
 * - **Text**: contains, notContains, startsWith, endsWith
 * - **Comparison**: greaterThan, greaterThanOrEqual, lessThan, lessThanOrEqual, between
 * - **List**: in, notIn
 * - **Empty**: isEmpty, isNotEmpty
 *
 * @example
 * ```typescript
 * const condition: FilterCondition = {
 *   id: "price-filter",
 *   column: "price",
 *   operator: "greaterThan",
 *   value: 100,
 *   type: "number"
 * }
 * ```
 */
export type FilterOperator =
	| "equals"
	| "notEquals"
	| "contains"
	| "notContains"
	| "startsWith"
	| "endsWith"
	| "greaterThan"
	| "greaterThanOrEqual"
	| "lessThan"
	| "lessThanOrEqual"
	| "between"
	| "in"
	| "notIn"
	| "isEmpty"
	| "isNotEmpty"

/**
 * Data types for filter conditions.
 * Determines which operators are available and how values are compared.
 *
 * - **text**: String comparisons (contains, equals, startsWith, etc.)
 * - **number**: Numeric comparisons (greaterThan, lessThan, between, etc.)
 * - **date**: Date comparisons (after, before, between, etc.)
 * - **boolean**: True/false comparisons
 * - **select**: Dropdown selection with predefined options
 */
export type FilterType = "text" | "number" | "date" | "boolean" | "select"

/**
 * A single filter condition for a column.
 *
 * @example
 * ```typescript
 * // Text filter
 * const nameFilter: FilterCondition = {
 *   id: "name-1",
 *   column: "name",
 *   operator: "contains",
 *   value: "widget",
 *   type: "text"
 * }
 *
 * // Number range filter
 * const priceFilter: FilterCondition = {
 *   id: "price-1",
 *   column: "price",
 *   operator: "between",
 *   value: 10,
 *   value2: 100,
 *   type: "number"
 * }
 *
 * // Select filter
 * const statusFilter: FilterCondition = {
 *   id: "status-1",
 *   column: "status",
 *   operator: "equals",
 *   value: "active",
 *   type: "select"
 * }
 * ```
 */
export interface FilterCondition {
	/** Unique identifier for this condition */
	id: string

	/** Column accessorKey to filter on */
	column: string

	/** Comparison operator */
	operator: FilterOperator

	/** Filter value */
	value: any

	/** Second value for "between" operator */
	value2?: any

	/** Data type determines available operators */
	type: FilterType
}

/**
 * A group of filter conditions combined with AND or OR logic.
 * Can contain nested groups for complex filter expressions.
 *
 * @example
 * ```typescript
 * // Simple AND group: status = 'active' AND price > 100
 * const simpleGroup: FilterGroup = {
 *   id: "root",
 *   operator: "AND",
 *   conditions: [
 *     { id: "1", column: "status", operator: "equals", value: "active", type: "select" },
 *     { id: "2", column: "price", operator: "greaterThan", value: 100, type: "number" }
 *   ]
 * }
 *
 * // Complex nested: (status = 'active' OR status = 'pending') AND price > 100
 * const complexGroup: FilterGroup = {
 *   id: "root",
 *   operator: "AND",
 *   conditions: [
 *     { id: "price-1", column: "price", operator: "greaterThan", value: 100, type: "number" }
 *   ],
 *   groups: [
 *     {
 *       id: "status-group",
 *       operator: "OR",
 *       conditions: [
 *         { id: "status-1", column: "status", operator: "equals", value: "active", type: "select" },
 *         { id: "status-2", column: "status", operator: "equals", value: "pending", type: "select" }
 *       ]
 *     }
 *   ]
 * }
 * ```
 */
export interface FilterGroup {
	/** Unique identifier for this group */
	id: string

	/** How to combine conditions/groups (AND requires all, OR requires at least one) */
	operator: "AND" | "OR"

	/** Filter conditions at this level */
	conditions: FilterCondition[]

	/** Nested filter groups for complex logic */
	groups?: FilterGroup[]
}

/**
 * Configuration for column filtering behavior.
 * Defines how a column can be filtered in the filter builder.
 *
 * @example
 * ```typescript
 * // Text column
 * {
 *   accessorKey: "name",
 *   header: "Product Name",
 *   filterConfig: {
 *     type: "text",
 *     operators: ["contains", "equals", "startsWith"],
 *     placeholder: "Search by name..."
 *   }
 * }
 *
 * // Number column
 * {
 *   accessorKey: "price",
 *   header: "Price",
 *   filterConfig: {
 *     type: "number",
 *     min: 0,
 *     max: 10000,
 *     step: 0.01
 *   }
 * }
 *
 * // Select column
 * {
 *   accessorKey: "category",
 *   header: "Category",
 *   filterConfig: {
 *     type: "select",
 *     options: [
 *       { label: "Electronics", value: "electronics" },
 *       { label: "Clothing", value: "clothing" }
 *     ]
 *   }
 * }
 * ```
 */
export interface ColumnFilterConfig {
	/** Data type of the column - determines available operators */
	type: FilterType

	/** Allowed filter operators (if not specified, all operators for type are available) */
	operators?: FilterOperator[]

	/** Options for select type (required for type: "select") */
	options?: { label: string; value: any }[]

	/** Minimum value for number inputs */
	min?: number

	/** Maximum value for number inputs */
	max?: number

	/** Step increment for number inputs */
	step?: number

	/** Placeholder text for filter inputs */
	placeholder?: string

	/** @deprecated Use showInlineFilter and defaultInlineFilter instead */
	showQuickFilter?: boolean

	/** Whether this filter is available in the inline filter system */
	showInlineFilter?: boolean

	/** Whether this filter is displayed by default (vs "Ajouter un filtre") */
	defaultInlineFilter?: boolean

	/** Custom label for the filter dropdown (defaults to column header) */
	filterLabel?: string
}

// Operator definitions for each filter type
export const textOperators: { value: FilterOperator; label: string; requiresValue: boolean }[] = [
	{ value: "contains", label: "Contains", requiresValue: true },
	{ value: "notContains", label: "Does not contain", requiresValue: true },
	{ value: "equals", label: "Is equal to", requiresValue: true },
	{ value: "notEquals", label: "Is not equal to", requiresValue: true },
	{ value: "startsWith", label: "Starts with", requiresValue: true },
	{ value: "endsWith", label: "Ends with", requiresValue: true },
	{ value: "isEmpty", label: "Is empty", requiresValue: false },
	{ value: "isNotEmpty", label: "Is not empty", requiresValue: false },
]

export const numberOperators: { value: FilterOperator; label: string; requiresValue: boolean }[] = [
	{ value: "equals", label: "Equals", requiresValue: true },
	{ value: "notEquals", label: "Not equals", requiresValue: true },
	{ value: "greaterThan", label: "Greater than", requiresValue: true },
	{ value: "greaterThanOrEqual", label: "Greater than or equal", requiresValue: true },
	{ value: "lessThan", label: "Less than", requiresValue: true },
	{ value: "lessThanOrEqual", label: "Less than or equal", requiresValue: true },
	{ value: "between", label: "Between", requiresValue: true },
	{ value: "isEmpty", label: "Is empty", requiresValue: false },
	{ value: "isNotEmpty", label: "Is not empty", requiresValue: false },
]

export const selectOperators: { value: FilterOperator; label: string; requiresValue: boolean }[] = [
	{ value: "equals", label: "Is", requiresValue: true },
	{ value: "notEquals", label: "Is not", requiresValue: true },
	{ value: "in", label: "Is one of", requiresValue: true },
	{ value: "notIn", label: "Is not one of", requiresValue: true },
]

export const booleanOperators: { value: FilterOperator; label: string; requiresValue: boolean }[] =
	[{ value: "equals", label: "Is", requiresValue: true }]

export const dateOperators: { value: FilterOperator; label: string; requiresValue: boolean }[] = [
	{ value: "equals", label: "Is", requiresValue: true },
	{ value: "notEquals", label: "Is not", requiresValue: true },
	{ value: "greaterThan", label: "Is after", requiresValue: true },
	{ value: "greaterThanOrEqual", label: "Is on or after", requiresValue: true },
	{ value: "lessThan", label: "Is before", requiresValue: true },
	{ value: "lessThanOrEqual", label: "Is on or before", requiresValue: true },
	{ value: "between", label: "Is between", requiresValue: true },
	{ value: "isEmpty", label: "Is empty", requiresValue: false },
	{ value: "isNotEmpty", label: "Is not empty", requiresValue: false },
]
