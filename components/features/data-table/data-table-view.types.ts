import type { SortingState, VisibilityState } from "@tanstack/react-table"
import type { LucideIcon } from "lucide-react"
import type { FilterGroup } from "./data-table-filter.types"

/**
 * A saved view configuration for the DataTable.
 * Views combine filters, sorting, column visibility, and other settings into a reusable preset.
 *
 * @example
 * ```typescript
 * // System view (cannot be deleted)
 * const allProducts: DataTableView = {
 *   id: "all",
 *   name: "All Products",
 *   isSystem: true,
 *   isDefault: true,
 *   filters: { id: "root", operator: "AND", conditions: [] }
 * }
 *
 * // Custom view with filters and sorting
 * const activeExpensive: DataTableView = {
 *   id: "active-expensive",
 *   name: "Active & Expensive",
 *   icon: TrendingUp,
 *   isSystem: false,
 *   filters: {
 *     id: "root",
 *     operator: "AND",
 *     conditions: [
 *       { id: "1", column: "status", operator: "equals", value: "active", type: "select" },
 *       { id: "2", column: "price", operator: "greaterThan", value: 100, type: "number" }
 *     ]
 *   },
 *   sorting: [{ id: "price", desc: true }]
 * }
 * ```
 */
export interface DataTableView {
	/** Unique identifier */
	id: string

	/** Display name */
	name: string

	/** Optional description */
	description?: string

	/** Optional icon (Lucide icon component) */
	icon?: LucideIcon

	/** If true, view cannot be deleted by user */
	isSystem: boolean

	/** If true, this view is selected by default on first load */
	isDefault?: boolean

	/** Filter configuration for this view */
	filters: FilterGroup

	/** Sort configuration (optional) */
	sorting?: SortingState

	/** Column visibility state (optional) */
	columnVisibility?: VisibilityState

	/** Column order (optional) */
	columnOrder?: string[]

	/** Pinned columns (optional) */
	pinnedColumns?: {
		/** Columns pinned to left */
		left?: string[]
		/** Columns pinned to right */
		right?: string[]
	}

	/** Timestamp when view was created */
	createdAt?: Date

	/** Timestamp when view was last updated */
	updatedAt?: Date

	/** User ID who created the view */
	createdBy?: string
}
