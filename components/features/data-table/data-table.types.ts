import type { ColumnDef, SortingState } from '@tanstack/react-table';

export * from './data-table-action.types';
// Re-export all types from domain-specific type files
export * from './data-table-filter.types';
export * from './data-table-view.types';

import type { BulkAction, RowAction } from './data-table-action.types';
// Import types needed for core definitions
import type { ColumnFilterConfig, FilterGroup } from './data-table-filter.types';
import type { DataTableView } from './data-table-view.types';

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
  filterConfig?: ColumnFilterConfig;
};

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
  /** Current page index (0-based) */
  pageIndex?: number;

  /** Number of rows per page */
  pageSize: number;

  /** Available page size options in dropdown */
  pageSizeOptions?: number[];

  /** Total number of pages (for server-side pagination) */
  pageCount?: number;

  /** Show page number indicators (not yet implemented) */
  showPageNumbers?: boolean;

  /** Show "Showing X-Y of Z" text */
  showPageInfo?: boolean;
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
  data: TData[];
  columns: DataTableColumnDef<TData, TValue>[];

  // Row identification
  getRowId?: (row: TData) => string;

  // Filtering
  enableAdvancedFilters?: boolean;
  defaultFilterGroup?: FilterGroup;
  onFilterGroupChange?: (filterGroup: FilterGroup | null) => void;

  // Views
  views?: DataTableView[];
  activeView?: DataTableView | null;
  enableCustomViews?: boolean;
  onViewChange?: (view: DataTableView) => void;
  onViewSave?: (view: DataTableView) => void;
  onViewUpdate?: (viewId: string, updates: Partial<DataTableView>) => void;
  onViewDelete?: (viewId: string) => void;
  onCreateView?: () => void;

  // Sorting
  enableSorting?: boolean;
  enableMultiSort?: boolean;
  defaultSorting?: SortingState;
  onSortingChange?: (sorting: SortingState) => void;

  // Column visibility
  defaultColumnVisibility?: Record<string, boolean>;

  // Column pinning
  /** Enable column pinning (sticky left/right columns) */
  enableColumnPinning?: boolean;
  /** Default pinned columns */
  defaultColumnPinning?: { left?: string[]; right?: string[] };
  /** Callback when pinning changes */
  onColumnPinningChange?: (pinning: { left: string[]; right: string[] }) => void;

  // Pagination
  enablePagination?: boolean;
  pagination?: PaginationConfig;
  onPaginationChange?: (pagination: { pageIndex: number; pageSize: number }) => void;

  // Selection
  enableRowSelection?: boolean;
  onRowSelectionChange?: (selection: Record<string, boolean>) => void;

  // Actions
  rowActions?: RowAction<TData>[];
  bulkActions?: BulkAction<TData>[];
  onRowClick?: (row: TData) => void;

  // Search
  enableGlobalSearch?: boolean;
  searchPlaceholder?: string;
  onSearchChange?: (search: string) => void;

  // Styling
  variant?: 'default' | 'lined' | 'striped' | 'editable' | 'spreadsheet';
  density?: 'compact' | 'default' | 'comfortable';
  className?: string;

  // Loading/Empty states
  isLoading?: boolean;
  loadingComponent?: React.ReactNode;
  emptyComponent?: React.ReactNode;

  // Toolbar customization
  hideToolbar?: boolean;
  hideHeaders?: boolean;

  /** When true, a single button toggles both search bar and inline filters together */
  combineSearchAndFilters?: boolean;

  // Internationalization
  locale?: 'fr' | 'en';
}
