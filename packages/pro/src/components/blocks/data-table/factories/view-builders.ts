import type { LucideIcon } from "lucide-react"
import type { DataTableView } from "../data-table.types"

/**
 * Configuration for a status-based view
 */
export interface StatusViewItem {
	/** Unique ID for this status view */
	id: string
	/** Display name for this status view */
	name: string
	/** Value to filter by (the actual status value in the data) */
	value: string
	/** Optional icon for this view */
	icon?: LucideIcon
}

/**
 * Configuration for createStatusViews factory
 */
export interface StatusViewsConfig {
	/** The column accessorKey to filter on */
	column: string
	/** Array of status configurations */
	statuses: StatusViewItem[]
	/** Name for the "All" view (defaults to "All") */
	allViewName?: string
	/** Icon for the "All" view */
	allViewIcon?: LucideIcon
}

/**
 * Creates a set of views based on status values.
 * Automatically generates an "All" view plus one view per status.
 *
 * @example
 * ```typescript
 * const views = createStatusViews({
 *   column: "status",
 *   statuses: [
 *     { id: "active", name: "Active", value: "actif" },
 *     { id: "draft", name: "Draft", value: "brouillon" },
 *     { id: "archived", name: "Archived", value: "archivé" },
 *   ],
 *   allViewName: "All Products",
 * })
 * // Returns: [All, Active, Draft, Archived] views
 * ```
 */
export function createStatusViews(config: StatusViewsConfig): DataTableView[] {
	const { column, statuses, allViewName = "All", allViewIcon } = config

	// Create the "All" view
	const allView: DataTableView = {
		id: "all",
		name: allViewName,
		icon: allViewIcon,
		isSystem: true,
		isDefault: true,
		filters: {
			id: "root",
			operator: "AND",
			conditions: [],
		},
	}

	// Create a view for each status
	const statusViews: DataTableView[] = statuses.map((status) => ({
		id: status.id,
		name: status.name,
		icon: status.icon,
		isSystem: true,
		isDefault: false,
		filters: {
			id: "root",
			operator: "AND",
			conditions: [
				{
					id: `${status.id}-filter`,
					column,
					operator: "equals",
					value: status.value,
					type: "select",
				},
			],
		},
	}))

	return [allView, ...statusViews]
}

/**
 * Configuration for createDateRangeViews factory
 */
export interface DateRangeViewsConfig {
	/** The column accessorKey to filter on */
	column: string
	/** Name for the "All" view (defaults to "All") */
	allViewName?: string
	/** Icon for the "All" view */
	allViewIcon?: LucideIcon
	/** Include "Today" view */
	includeToday?: boolean
	/** Include "Last 7 days" view */
	includeLast7Days?: boolean
	/** Include "Last 30 days" view */
	includeLast30Days?: boolean
	/** Include "Last 90 days" view */
	includeLast90Days?: boolean
	/** Include "This month" view */
	includeThisMonth?: boolean
	/** Include "This year" view */
	includeThisYear?: boolean
	/** Custom labels for date range views */
	labels?: {
		today?: string
		last7Days?: string
		last30Days?: string
		last90Days?: string
		thisMonth?: string
		thisYear?: string
	}
}

/**
 * Creates a set of views based on date ranges.
 * Automatically generates an "All" view plus date range views.
 *
 * @example
 * ```typescript
 * const views = createDateRangeViews({
 *   column: "createdAt",
 *   allViewName: "All Items",
 *   includeToday: true,
 *   includeLast7Days: true,
 *   includeLast30Days: true,
 * })
 * // Returns: [All, Today, Last 7 days, Last 30 days] views
 * ```
 */
export function createDateRangeViews(config: DateRangeViewsConfig): DataTableView[] {
	const {
		column,
		allViewName = "All",
		allViewIcon,
		includeToday = false,
		includeLast7Days = false,
		includeLast30Days = false,
		includeLast90Days = false,
		includeThisMonth = false,
		includeThisYear = false,
		labels = {},
	} = config

	const views: DataTableView[] = []

	// All view
	views.push({
		id: "all",
		name: allViewName,
		icon: allViewIcon,
		isSystem: true,
		isDefault: true,
		filters: {
			id: "root",
			operator: "AND",
			conditions: [],
		},
	})

	const now = new Date()

	// Today
	if (includeToday) {
		const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
		views.push({
			id: "today",
			name: labels.today || "Today",
			isSystem: true,
			isDefault: false,
			filters: {
				id: "root",
				operator: "AND",
				conditions: [
					{
						id: "today-filter",
						column,
						operator: "greaterThanOrEqual",
						value: startOfToday.toISOString(),
						type: "date",
					},
				],
			},
		})
	}

	// Last 7 days
	if (includeLast7Days) {
		const sevenDaysAgo = new Date(now)
		sevenDaysAgo.setDate(now.getDate() - 7)
		views.push({
			id: "last-7-days",
			name: labels.last7Days || "Last 7 days",
			isSystem: true,
			isDefault: false,
			filters: {
				id: "root",
				operator: "AND",
				conditions: [
					{
						id: "last-7-days-filter",
						column,
						operator: "greaterThanOrEqual",
						value: sevenDaysAgo.toISOString(),
						type: "date",
					},
				],
			},
		})
	}

	// Last 30 days
	if (includeLast30Days) {
		const thirtyDaysAgo = new Date(now)
		thirtyDaysAgo.setDate(now.getDate() - 30)
		views.push({
			id: "last-30-days",
			name: labels.last30Days || "Last 30 days",
			isSystem: true,
			isDefault: false,
			filters: {
				id: "root",
				operator: "AND",
				conditions: [
					{
						id: "last-30-days-filter",
						column,
						operator: "greaterThanOrEqual",
						value: thirtyDaysAgo.toISOString(),
						type: "date",
					},
				],
			},
		})
	}

	// Last 90 days
	if (includeLast90Days) {
		const ninetyDaysAgo = new Date(now)
		ninetyDaysAgo.setDate(now.getDate() - 90)
		views.push({
			id: "last-90-days",
			name: labels.last90Days || "Last 90 days",
			isSystem: true,
			isDefault: false,
			filters: {
				id: "root",
				operator: "AND",
				conditions: [
					{
						id: "last-90-days-filter",
						column,
						operator: "greaterThanOrEqual",
						value: ninetyDaysAgo.toISOString(),
						type: "date",
					},
				],
			},
		})
	}

	// This month
	if (includeThisMonth) {
		const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
		views.push({
			id: "this-month",
			name: labels.thisMonth || "This month",
			isSystem: true,
			isDefault: false,
			filters: {
				id: "root",
				operator: "AND",
				conditions: [
					{
						id: "this-month-filter",
						column,
						operator: "greaterThanOrEqual",
						value: startOfMonth.toISOString(),
						type: "date",
					},
				],
			},
		})
	}

	// This year
	if (includeThisYear) {
		const startOfYear = new Date(now.getFullYear(), 0, 1)
		views.push({
			id: "this-year",
			name: labels.thisYear || "This year",
			isSystem: true,
			isDefault: false,
			filters: {
				id: "root",
				operator: "AND",
				conditions: [
					{
						id: "this-year-filter",
						column,
						operator: "greaterThanOrEqual",
						value: startOfYear.toISOString(),
						type: "date",
					},
				],
			},
		})
	}

	return views
}

/**
 * Configuration for a custom view (advanced usage)
 */
export interface CustomViewConfig {
	/** Unique ID for this view */
	id: string
	/** Display name */
	name: string
	/** Optional description */
	description?: string
	/** Optional icon */
	icon?: LucideIcon
	/** Whether this is a system view (cannot be deleted) */
	isSystem?: boolean
	/** Whether this is the default view */
	isDefault?: boolean
	/** Filter configuration - provide conditions directly */
	conditions: Array<{
		column: string
		operator: "equals" | "notEquals" | "contains" | "greaterThan" | "lessThan" | "between"
		value: any
		value2?: any
		type: "text" | "number" | "date" | "boolean" | "select"
	}>
	/** Combine conditions with AND or OR */
	operator?: "AND" | "OR"
}

/**
 * Creates a custom view with manual filter configuration.
 * For advanced usage when createStatusViews or createDateRangeViews don't fit.
 *
 * @example
 * ```typescript
 * const view = createCustomView({
 *   id: "expensive-active",
 *   name: "Expensive & Active",
 *   conditions: [
 *     { column: "price", operator: "greaterThan", value: 1000, type: "number" },
 *     { column: "status", operator: "equals", value: "active", type: "select" },
 *   ],
 *   operator: "AND",
 * })
 * ```
 */
export function createCustomView(config: CustomViewConfig): DataTableView {
	const {
		id,
		name,
		description,
		icon,
		isSystem = false,
		isDefault = false,
		conditions,
		operator = "AND",
	} = config

	return {
		id,
		name,
		description,
		icon,
		isSystem,
		isDefault,
		filters: {
			id: "root",
			operator,
			conditions: conditions.map((cond, index) => ({
				id: `${id}-condition-${index}`,
				column: cond.column,
				operator: cond.operator,
				value: cond.value,
				value2: cond.value2,
				type: cond.type,
			})),
		},
	}
}
