import type {
  ColumnDef,
  Row,
  SortingState,
  VisibilityState,
  FilterFn,
  SortingFn,
} from "@tanstack/react-table"
import type { LucideIcon } from "lucide-react"

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
}

/**
 * Extended column definition for DataTable.
 * Extends TanStack Table's ColumnDef with additional filter configuration.
 *
 * @template TData - The row data type
 * @template TValue - The cell value type (default: unknown)
 *
 * @example
 * ```typescript
 * const columns: DataTableColumnDef<Product>[] = [
 *   {
 *     accessorKey: "name",
 *     header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
 *     filterConfig: {
 *       type: "text",
 *       placeholder: "Search products..."
 *     }
 *   },
 *   {
 *     accessorKey: "price",
 *     header: "Price",
 *     cell: ({ row }) => `$${row.getValue("price").toFixed(2)}`,
 *     filterConfig: {
 *       type: "number",
 *       min: 0
 *     }
 *   }
 * ]
 * ```
 */
export type DataTableColumnDef<TData, TValue = unknown> = ColumnDef<TData, TValue> & {
  /** Optional filter configuration for this column */
  filterConfig?: ColumnFilterConfig
}

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

/**
 * Action available for individual table rows.
 * Displayed in a dropdown menu at the end of each row.
 *
 * @template TData - The row data type
 *
 * @example
 * ```typescript
 * const rowActions: RowAction<Product>[] = [
 *   {
 *     id: "edit",
 *     label: "Edit",
 *     icon: Edit,
 *     handler: (row) => router.push(`/products/${row.original.id}/edit`)
 *   },
 *   {
 *     id: "delete",
 *     label: "Delete",
 *     variant: "destructive",
 *     icon: Trash,
 *     separator: true,
 *     requireConfirmation: true,
 *     confirmationMessage: (row) => `Delete "${row.original.name}"?`,
 *     handler: async (row) => {
 *       await deleteProduct(row.original.id)
 *     },
 *     hidden: (row) => row.original.status === "archived"
 *   }
 * ]
 * ```
 */
export interface RowAction<TData = any> {
  /** Unique identifier */
  id: string

  /** Display label */
  label: string

  /** Optional icon (Lucide icon component) */
  icon?: LucideIcon

  /** Visual style variant */
  variant?: "default" | "outline" | "ghost" | "destructive"

  /** Action handler - can be async */
  handler: (row: Row<TData>) => void | Promise<void>

  /** Function to conditionally hide action for specific rows */
  hidden?: (row: Row<TData>) => boolean

  /** Function to conditionally disable action for specific rows */
  disabled?: (row: Row<TData>) => boolean

  /** If true, shows confirmation dialog before executing */
  requireConfirmation?: boolean

  /** Confirmation message (can be function for dynamic message) */
  confirmationMessage?: string | ((row: Row<TData>) => string)

  /** If true, renders visual separator above this action */
  separator?: boolean

  /** Keyboard shortcut (display only, not functional) */
  shortcut?: string
}

/**
 * Action for multiple selected rows.
 * Displayed in toolbar when rows are selected.
 *
 * @template TData - The row data type
 *
 * @example
 * ```typescript
 * const bulkActions: BulkAction<Product>[] = [
 *   {
 *     id: "activate",
 *     label: "Activate Selected",
 *     icon: CheckCircle,
 *     handler: async (rows) => {
 *       const ids = rows.map(r => r.original.id)
 *       await bulkActivateProducts(ids)
 *     },
 *     disabled: (rows) => rows.every(r => r.original.status === "active")
 *   },
 *   {
 *     id: "delete",
 *     label: "Delete Selected",
 *     variant: "destructive",
 *     icon: Trash,
 *     requireConfirmation: true,
 *     confirmationMessage: (count) => `Delete ${count} product(s)?`,
 *     handler: async (rows) => {
 *       const ids = rows.map(r => r.original.id)
 *       await bulkDeleteProducts(ids)
 *     }
 *   }
 * ]
 * ```
 */
export interface BulkAction<TData = any> {
  /** Unique identifier */
  id: string

  /** Display label */
  label: string

  /** Optional icon (Lucide icon component) */
  icon?: LucideIcon

  /** Visual style variant */
  variant?: "default" | "outline" | "destructive"

  /** Action handler - receives array of selected rows, can be async */
  handler: (selectedRows: Row<TData>[]) => void | Promise<void>

  /** Function to conditionally disable action based on selection */
  disabled?: (selectedRows: Row<TData>[]) => boolean

  /** If true, shows confirmation dialog before executing */
  requireConfirmation?: boolean

  /** Confirmation message (can be function with row count) */
  confirmationMessage?: string | ((count: number) => string)
}

/**
 * Pagination configuration for the DataTable.
 *
 * @example
 * ```typescript
 * const pagination: PaginationConfig = {
 *   pageSize: 25,
 *   pageSizeOptions: [10, 25, 50, 100]
 * }
 * ```
 */
export interface PaginationConfig {
  /** Number of rows per page */
  pageSize: number

  /** Available page size options in dropdown */
  pageSizeOptions?: number[]

  /** Show page number indicators (not yet implemented) */
  showPageNumbers?: boolean

  /** Show "Showing X-Y of Z" text */
  showPageInfo?: boolean
}

/**
 * Props for the DataTable component.
 *
 * @template TData - The row data type
 * @template TValue - The cell value type (default: unknown)
 *
 * @example
 * ```typescript
 * interface Product {
 *   id: string
 *   name: string
 *   price: number
 *   status: "active" | "inactive"
 * }
 *
 * <DataTable<Product>
 *   data={products}
 *   columns={columns}
 *   enableFiltering
 *   enablePagination
 *   views={views}
 *   activeView={activeView}
 *   onViewChange={setActiveView}
 * />
 * ```
 */
export interface DataTableProps<TData, TValue = unknown> {
  // Required
  data: TData[]
  columns: DataTableColumnDef<TData, TValue>[]

  // Row identification
  getRowId?: (row: TData) => string

  // Filtering
  enableFiltering?: boolean
  enableAdvancedFilters?: boolean
  filterableColumns?: string[]
  defaultFilterGroup?: FilterGroup
  onFilterGroupChange?: (filterGroup: FilterGroup | null) => void
  onFiltersChange?: (filters: FilterGroup) => void

  // Views
  views?: DataTableView[]
  activeView?: DataTableView | null
  defaultView?: string
  enableCustomViews?: boolean
  onViewChange?: (view: DataTableView) => void
  onViewSave?: (view: DataTableView) => void
  onViewDelete?: (viewId: string) => void
  onCreateView?: () => void

  // Sorting
  enableSorting?: boolean
  enableMultiSort?: boolean
  defaultSorting?: SortingState
  onSortingChange?: (sorting: SortingState) => void

  // Pagination
  enablePagination?: boolean
  pagination?: PaginationConfig
  onPaginationChange?: (pagination: {
    pageIndex: number
    pageSize: number
  }) => void

  // Selection
  enableRowSelection?: boolean
  enableSelectAll?: boolean
  onRowSelectionChange?: (selection: Record<string, boolean>) => void

  // Actions
  rowActions?: RowAction<TData>[]
  bulkActions?: BulkAction<TData>[]

  // Search
  enableGlobalSearch?: boolean
  searchPlaceholder?: string
  onSearchChange?: (search: string) => void

  // Styling
  variant?: "default" | "lined" | "striped"
  density?: "compact" | "default" | "comfortable"
  className?: string

  // Loading/Empty states
  isLoading?: boolean
  loadingComponent?: React.ReactNode
  emptyComponent?: React.ReactNode

  // Toolbar customization
  toolbarActions?: React.ReactNode
  hideToolbar?: boolean
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

export const booleanOperators: { value: FilterOperator; label: string; requiresValue: boolean }[] = [
  { value: "equals", label: "Is", requiresValue: true },
]

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
