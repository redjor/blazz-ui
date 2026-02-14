'use client';

import type * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import type { ColumnFilterConfig } from '../data-table-filter.types';
import type { DataTableColumnDef } from '../data-table.types';
import { DataTableColumnHeader } from '../data-table-column-header';

// ---------------------------------------------------------------------------
// Internal base column factory – shared structure for all public factories
// ---------------------------------------------------------------------------

interface BaseColumnConfig<TData> {
  accessorKey: string;
  title: string;
  enableSorting?: boolean;
  filterConfig?: ColumnFilterConfig;
  meta?: Record<string, unknown>;
  size?: number;
  cell: DataTableColumnDef<TData>['cell'];
}

function createBaseColumn<TData>(config: BaseColumnConfig<TData>): DataTableColumnDef<TData> {
  return {
    accessorKey: config.accessorKey,
    header: ({ column }) => <DataTableColumnHeader column={column} title={config.title} />,
    cell: config.cell,
    enableSorting: config.enableSorting ?? true,
    ...(config.filterConfig && { filterConfig: config.filterConfig }),
    ...(config.meta && { meta: config.meta }),
    ...(config.size !== undefined && { size: config.size }),
  } as DataTableColumnDef<TData>;
}

/**
 * Configuration for createTextColumn factory
 */
export interface TextColumnConfig<TData> {
  /** The accessor key for the column data */
  accessorKey: string;
  /** Display title for the column header */
  title: string;
  /** Placeholder for filter input */
  placeholder?: string;
  /** Show this filter in the inline filter system */
  showInlineFilter?: boolean;
  /** Show this filter by default (not in "Add filter" dropdown) */
  defaultInlineFilter?: boolean;
  /** Custom filter label (defaults to title) */
  filterLabel?: string;
  /** Enable sorting for this column */
  enableSorting?: boolean;
  /** Custom CSS classes for the cell */
  className?: string;
  /** Custom cell renderer (overrides default) */
  cellRenderer?: (value: string, row: TData) => React.ReactNode;
}

/**
 * Creates a text column with automatic filtering and sorting
 *
 * @example
 * ```typescript
 * createTextColumn<Product>({
 *   accessorKey: "name",
 *   title: "Product Name",
 *   placeholder: "Search by name...",
 *   showInlineFilter: true,
 * })
 * ```
 */
export function createTextColumn<TData>(
  config: TextColumnConfig<TData>
): DataTableColumnDef<TData> {
  const {
    accessorKey,
    title,
    placeholder,
    showInlineFilter = false,
    defaultInlineFilter = false,
    filterLabel,
    enableSorting = true,
    className,
    cellRenderer,
  } = config;

  return createBaseColumn<TData>({
    accessorKey,
    title,
    enableSorting,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey) as string;
      if (cellRenderer) {
        return cellRenderer(value, row.original);
      }
      return <span className={cn('text-body-md', className)}>{value}</span>;
    },
    filterConfig: {
      type: 'text',
      placeholder: placeholder || `Search by ${title.toLowerCase()}...`,
      showInlineFilter,
      defaultInlineFilter,
      filterLabel: filterLabel || title,
    },
  });
}

/**
 * Configuration for createStatusColumn factory
 */
export interface StatusColumnConfig<_TData> {
  /** The accessor key for the column data */
  accessorKey: string;
  /** Display title for the column header */
  title: string;
  /** Mapping of status values to Badge variants and custom styling */
  statusMap: Record<
    string,
    {
      variant: 'primary' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info';
      className?: string;
      label?: string;
    }
  >;
  /** Options for the filter dropdown */
  filterOptions?: Array<{ label: string; value: string }>;
  /** Show this filter in the inline filter system */
  showInlineFilter?: boolean;
  /** Show this filter by default (not in "Add filter" dropdown) */
  defaultInlineFilter?: boolean;
  /** Custom filter label (defaults to title) */
  filterLabel?: string;
  /** Enable sorting for this column */
  enableSorting?: boolean;
}

/**
 * Creates a status/badge column with automatic styling and filtering
 *
 * @example
 * ```typescript
 * createStatusColumn<Product>({
 *   accessorKey: "status",
 *   title: "Status",
 *   statusMap: {
 *     active: { variant: "secondary", className: "bg-green-100 text-green-800" },
 *     draft: { variant: "secondary", className: "bg-blue-100 text-blue-800" },
 *     archived: { variant: "outline" },
 *   },
 *   filterOptions: [
 *     { label: "Active", value: "active" },
 *     { label: "Draft", value: "draft" },
 *     { label: "Archived", value: "archived" },
 *   ],
 *   showInlineFilter: true,
 * })
 * ```
 */
export function createStatusColumn<TData>(
  config: StatusColumnConfig<TData>
): DataTableColumnDef<TData> {
  const {
    accessorKey,
    title,
    statusMap,
    filterOptions,
    showInlineFilter = true,
    defaultInlineFilter = true,
    filterLabel,
    enableSorting = true,
  } = config;

  return createBaseColumn<TData>({
    accessorKey,
    title,
    enableSorting,
    cell: ({ row }) => {
      const status = row.getValue(accessorKey) as string;
      const statusConfig = statusMap[status];

      if (!statusConfig) {
        return <span className="text-body-md">{status}</span>;
      }

      const displayLabel = statusConfig.label || status.charAt(0).toUpperCase() + status.slice(1);

      return (
        <Badge variant={statusConfig.variant} className={statusConfig.className}>
          {displayLabel}
        </Badge>
      );
    },
    ...(filterOptions && {
      filterConfig: {
        type: 'select' as const,
        options: filterOptions,
        showInlineFilter,
        defaultInlineFilter,
        filterLabel: filterLabel || title,
      },
    }),
  });
}

/**
 * Configuration for createNumericColumn factory
 */
export interface NumericColumnConfig<_TData> {
  /** The accessor key for the column data */
  accessorKey: string;
  /** Display title for the column header */
  title: string;
  /** Custom formatter function for displaying the number */
  formatter?: (value: number) => string;
  /** Minimum value for filter */
  min?: number;
  /** Maximum value for filter */
  max?: number;
  /** Show this filter in the inline filter system */
  showInlineFilter?: boolean;
  /** Show this filter by default (not in "Add filter" dropdown) */
  defaultInlineFilter?: boolean;
  /** Custom filter label (defaults to title) */
  filterLabel?: string;
  /** Placeholder for filter input */
  placeholder?: string;
  /** Enable sorting for this column */
  enableSorting?: boolean;
  /** Alignment (defaults to right for numbers) */
  align?: 'left' | 'center' | 'right';
  /** Custom CSS classes for the cell */
  className?: string;
}

/**
 * Creates a numeric column with automatic formatting and filtering
 *
 * @example
 * ```typescript
 * createNumericColumn<Product>({
 *   accessorKey: "stock",
 *   title: "Stock",
 *   formatter: (value) => value.toString(),
 *   min: 0,
 *   showInlineFilter: true,
 * })
 * ```
 */
export function createNumericColumn<TData>(
  config: NumericColumnConfig<TData>
): DataTableColumnDef<TData> {
  const {
    accessorKey,
    title,
    formatter,
    min,
    max,
    showInlineFilter = false,
    defaultInlineFilter = false,
    filterLabel,
    placeholder,
    enableSorting = true,
    align = 'right',
    className,
  } = config;

  return createBaseColumn<TData>({
    accessorKey,
    title,
    enableSorting,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey) as number;
      const formatted = formatter ? formatter(value) : value.toString();
      return <span className={cn('text-body-md', className)}>{formatted}</span>;
    },
    filterConfig: {
      type: 'number',
      min,
      max,
      placeholder: placeholder || `Filter by ${title.toLowerCase()}...`,
      showInlineFilter,
      defaultInlineFilter,
      filterLabel: filterLabel || title,
    },
    meta: {
      align,
    },
  });
}

/**
 * Configuration for createCurrencyColumn factory
 */
export interface CurrencyColumnConfig<_TData> {
  /** The accessor key for the column data */
  accessorKey: string;
  /** Display title for the column header */
  title: string;
  /** Currency code (e.g., "EUR", "USD") */
  currency?: string;
  /** Locale for formatting (e.g., "fr-FR", "en-US") */
  locale?: string;
  /** Show this filter in the inline filter system */
  showInlineFilter?: boolean;
  /** Show this filter by default (not in "Add filter" dropdown) */
  defaultInlineFilter?: boolean;
  /** Custom filter label (defaults to title) */
  filterLabel?: string;
  /** Placeholder for filter input */
  placeholder?: string;
  /** Enable sorting for this column */
  enableSorting?: boolean;
  /** Minimum value for filter */
  min?: number;
  /** Maximum value for filter */
  max?: number;
  /** Custom CSS classes for the cell */
  className?: string;
}

/**
 * Creates a currency column with automatic formatting and filtering
 *
 * @example
 * ```typescript
 * createCurrencyColumn<Product>({
 *   accessorKey: "price",
 *   title: "Price",
 *   currency: "EUR",
 *   locale: "fr-FR",
 *   showInlineFilter: true,
 * })
 * ```
 */
export function createCurrencyColumn<TData>(
  config: CurrencyColumnConfig<TData>
): DataTableColumnDef<TData> {
  const {
    accessorKey,
    title,
    currency = 'EUR',
    locale = 'fr-FR',
    showInlineFilter = false,
    defaultInlineFilter = false,
    filterLabel,
    placeholder,
    enableSorting = true,
    min,
    max,
    className,
  } = config;

  return createBaseColumn<TData>({
    accessorKey,
    title,
    enableSorting,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey) as number;
      const formatted = new Intl.NumberFormat(locale, {
        style: 'currency',
        currency,
      }).format(value);
      return <span className={cn('text-body-md text-foreground', className)}>{formatted}</span>;
    },
    filterConfig: {
      type: 'number',
      min,
      max,
      placeholder: placeholder || `Filter by ${title.toLowerCase()}...`,
      showInlineFilter,
      defaultInlineFilter,
      filterLabel: filterLabel || title,
    },
    meta: {
      align: 'right',
    },
  });
}

/**
 * Configuration for createDateColumn factory
 */
export interface DateColumnConfig<_TData> {
  /** The accessor key for the column data */
  accessorKey: string;
  /** Display title for the column header */
  title: string;
  /** Locale for date formatting */
  locale?: string;
  /** Intl.DateTimeFormat options */
  format?: Intl.DateTimeFormatOptions;
  /** Show this filter in the inline filter system */
  showInlineFilter?: boolean;
  /** Show this filter by default (not in "Add filter" dropdown) */
  defaultInlineFilter?: boolean;
  /** Custom filter label (defaults to title) */
  filterLabel?: string;
  /** Placeholder for filter input */
  placeholder?: string;
  /** Enable sorting for this column */
  enableSorting?: boolean;
  /** Custom CSS classes for the cell */
  className?: string;
}

/**
 * Creates a date column with automatic formatting and filtering
 *
 * @example
 * ```typescript
 * createDateColumn<Product>({
 *   accessorKey: "createdAt",
 *   title: "Created At",
 *   locale: "fr-FR",
 *   showInlineFilter: true,
 * })
 * ```
 */
export function createDateColumn<TData>(
  config: DateColumnConfig<TData>
): DataTableColumnDef<TData> {
  const {
    accessorKey,
    title,
    locale = 'fr-FR',
    format,
    showInlineFilter = false,
    defaultInlineFilter = false,
    filterLabel,
    placeholder,
    enableSorting = true,
    className,
  } = config;

  return createBaseColumn<TData>({
    accessorKey,
    title,
    enableSorting,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey) as string;
      const date = new Date(value);
      const formatted = date.toLocaleDateString(locale, format);
      return (
        <span className={cn('text-body-md text-muted-foreground', className)}>{formatted}</span>
      );
    },
    filterConfig: {
      type: 'date',
      placeholder: placeholder || `Filter by ${title.toLowerCase()}...`,
      showInlineFilter,
      defaultInlineFilter,
      filterLabel: filterLabel || title,
    },
  });
}

/**
 * Configuration for createSelectColumn factory
 */
export interface SelectColumnConfig<TData> {
  /** The accessor key for the column data */
  accessorKey: string;
  /** Display title for the column header */
  title: string;
  /** Options for the select filter and display */
  options: Array<{ label: string; value: string }>;
  /** Show this filter in the inline filter system */
  showInlineFilter?: boolean;
  /** Show this filter by default (not in "Add filter" dropdown) */
  defaultInlineFilter?: boolean;
  /** Custom filter label (defaults to title) */
  filterLabel?: string;
  /** Enable sorting for this column */
  enableSorting?: boolean;
  /** Custom CSS classes for the cell */
  className?: string;
  /** Custom cell renderer (overrides default) */
  cellRenderer?: (value: string, row: TData) => React.ReactNode;
}

/**
 * Creates a select/dropdown column with automatic filtering
 *
 * @example
 * ```typescript
 * createSelectColumn<Product>({
 *   accessorKey: "category",
 *   title: "Category",
 *   options: [
 *     { label: "Electronics", value: "electronics" },
 *     { label: "Clothing", value: "clothing" },
 *   ],
 *   showInlineFilter: true,
 * })
 * ```
 */
export function createSelectColumn<TData>(
  config: SelectColumnConfig<TData>
): DataTableColumnDef<TData> {
  const {
    accessorKey,
    title,
    options,
    showInlineFilter = true,
    defaultInlineFilter = false,
    filterLabel,
    enableSorting = true,
    className,
    cellRenderer,
  } = config;

  return createBaseColumn<TData>({
    accessorKey,
    title,
    enableSorting,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey) as string;
      if (cellRenderer) {
        return cellRenderer(value, row.original);
      }
      return <span className={cn('text-body-md', className)}>{value}</span>;
    },
    filterConfig: {
      type: 'select',
      options,
      showInlineFilter,
      defaultInlineFilter,
      filterLabel: filterLabel || title,
    },
  });
}

/**
 * Configuration for createImageTextColumn factory
 */
export interface ImageTextColumnConfig<_TData> {
  /** The accessor key for the text data */
  accessorKey: string;
  /** The accessor key for the image/emoji data */
  imageAccessor: string;
  /** Display title for the column header */
  title: string;
  /** Placeholder for filter input */
  placeholder?: string;
  /** Show this filter in the inline filter system */
  showInlineFilter?: boolean;
  /** Show this filter by default (not in "Add filter" dropdown) */
  defaultInlineFilter?: boolean;
  /** Custom filter label (defaults to title) */
  filterLabel?: string;
  /** Enable sorting for this column */
  enableSorting?: boolean;
  /** Custom image container classes */
  imageClassName?: string;
  /** Custom text classes */
  textClassName?: string;
}

/**
 * Creates a column with image/emoji + text combination
 *
 * @example
 * ```typescript
 * createImageTextColumn<Product>({
 *   accessorKey: "name",
 *   imageAccessor: "image",
 *   title: "Product",
 *   placeholder: "Search by name...",
 *   showInlineFilter: true,
 * })
 * ```
 */
export function createImageTextColumn<TData>(
  config: ImageTextColumnConfig<TData>
): DataTableColumnDef<TData> {
  const {
    accessorKey,
    imageAccessor,
    title,
    placeholder,
    showInlineFilter = false,
    defaultInlineFilter = false,
    filterLabel,
    enableSorting = true,
    imageClassName,
    textClassName,
  } = config;

  return createBaseColumn<TData>({
    accessorKey,
    title,
    enableSorting,
    cell: ({ row }) => {
      const text = row.getValue(accessorKey) as string;
      const image = (row.original as any)[imageAccessor] as string;

      return (
        <div className="flex items-center gap-3">
          <div
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-md border border-border bg-muted/50 text-xl',
              imageClassName
            )}
          >
            {image}
          </div>
          <span className={cn('text-body-md', textClassName)}>{text}</span>
        </div>
      );
    },
    filterConfig: {
      type: 'text',
      placeholder: placeholder || `Search by ${title.toLowerCase()}...`,
      showInlineFilter,
      defaultInlineFilter,
      filterLabel: filterLabel || title,
    },
  });
}
