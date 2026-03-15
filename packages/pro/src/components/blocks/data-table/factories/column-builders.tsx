"use client"

import type * as React from "react"
import { cn } from "@blazz/ui"
import { Badge } from "@blazz/ui/components/ui/badge"
import { type AvatarItem, CellAvatarGroup } from "../cells/cell-avatar-group"
import { CellBoolean } from "../cells/cell-boolean"
import { CellColorDot } from "../cells/cell-color-dot"
import { CellDate } from "../cells/cell-date"
import { CellDuration } from "../cells/cell-duration"
import { CellImage } from "../cells/cell-image"
import { CellKeyValue } from "../cells/cell-key-value"
import { CellLink } from "../cells/cell-link"
import { CellProgress } from "../cells/cell-progress"
import { CellRating } from "../cells/cell-rating"
import { CellRelativeDate } from "../cells/cell-relative-date"
import { CellSparkline } from "../cells/cell-sparkline"
import { CellTags } from "../cells/cell-tags"
import { CellTwoLines } from "../cells/cell-two-lines"
import { CellUser } from "../cells/cell-user"
import { CellValidation } from "../cells/cell-validation"
import type { DataTableColumnDef } from "../data-table.types"
import { DataTableColumnHeader } from "../data-table-column-header"
import type { ColumnFilterConfig } from "../data-table-filter.types"

// ---------------------------------------------------------------------------
// Internal base column factory – shared structure for all public factories
// ---------------------------------------------------------------------------

interface BaseColumnConfig<TData> {
	accessorKey: string
	title: string
	enableSorting?: boolean
	filterConfig?: ColumnFilterConfig
	meta?: Record<string, unknown>
	size?: number
	cell: DataTableColumnDef<TData>["cell"]
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
	} as DataTableColumnDef<TData>
}

/**
 * Configuration for createTextColumn factory
 */
export interface TextColumnConfig<TData> {
	/** The accessor key for the column data */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Placeholder for filter input */
	placeholder?: string
	/** Show this filter in the inline filter system */
	showInlineFilter?: boolean
	/** Show this filter by default (not in "Add filter" dropdown) */
	defaultInlineFilter?: boolean
	/** Custom filter label (defaults to title) */
	filterLabel?: string
	/** Enable sorting for this column */
	enableSorting?: boolean
	/** Custom CSS classes for the cell */
	className?: string
	/** Custom cell renderer (overrides default) */
	cellRenderer?: (value: string, row: TData) => React.ReactNode
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
	} = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		cell: ({ row }) => {
			const value = row.getValue(accessorKey) as string
			if (cellRenderer) {
				return cellRenderer(value, row.original)
			}
			return <span className={cn("text-body-md", className)}>{value}</span>
		},
		filterConfig: {
			type: "text",
			placeholder: placeholder || `Search by ${title.toLowerCase()}...`,
			showInlineFilter,
			defaultInlineFilter,
			filterLabel: filterLabel || title,
		},
	})
}

/**
 * Configuration for createStatusColumn factory
 */
export interface StatusColumnConfig<_TData> {
	/** The accessor key for the column data */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Mapping of status values to Badge variants and custom styling */
	statusMap: Record<
		string,
		{
			variant: "default" | "secondary" | "outline" | "critical" | "success" | "warning" | "info"
			className?: string
			label?: string
		}
	>
	/** Options for the filter dropdown */
	filterOptions?: Array<{ label: string; value: string }>
	/** Show this filter in the inline filter system */
	showInlineFilter?: boolean
	/** Show this filter by default (not in "Add filter" dropdown) */
	defaultInlineFilter?: boolean
	/** Custom filter label (defaults to title) */
	filterLabel?: string
	/** Enable sorting for this column */
	enableSorting?: boolean
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
	} = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		cell: ({ row }) => {
			const status = row.getValue(accessorKey) as string
			const statusConfig = statusMap[status]

			if (!statusConfig) {
				return <span className="text-body-md">{status}</span>
			}

			const displayLabel = statusConfig.label || status.charAt(0).toUpperCase() + status.slice(1)

			return (
				<Badge variant={statusConfig.variant} className={statusConfig.className}>
					{displayLabel}
				</Badge>
			)
		},
		...(filterOptions && {
			filterConfig: {
				type: "select" as const,
				options: filterOptions,
				showInlineFilter,
				defaultInlineFilter,
				filterLabel: filterLabel || title,
			},
		}),
	})
}

/**
 * Configuration for createNumericColumn factory
 */
export interface NumericColumnConfig<_TData> {
	/** The accessor key for the column data */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Custom formatter function for displaying the number */
	formatter?: (value: number) => string
	/** Minimum value for filter */
	min?: number
	/** Maximum value for filter */
	max?: number
	/** Show this filter in the inline filter system */
	showInlineFilter?: boolean
	/** Show this filter by default (not in "Add filter" dropdown) */
	defaultInlineFilter?: boolean
	/** Custom filter label (defaults to title) */
	filterLabel?: string
	/** Placeholder for filter input */
	placeholder?: string
	/** Enable sorting for this column */
	enableSorting?: boolean
	/** Alignment (defaults to right for numbers) */
	align?: "left" | "center" | "right"
	/** Custom CSS classes for the cell */
	className?: string
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
		align = "right",
		className,
	} = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		cell: ({ row }) => {
			const value = row.getValue(accessorKey) as number
			const formatted = formatter ? formatter(value) : value.toString()
			return <span className={cn("text-body-md", className)}>{formatted}</span>
		},
		filterConfig: {
			type: "number",
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
	})
}

/**
 * Configuration for createCurrencyColumn factory
 */
export interface CurrencyColumnConfig<_TData> {
	/** The accessor key for the column data */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Currency code (e.g., "EUR", "USD") */
	currency?: string
	/** Locale for formatting (e.g., "fr-FR", "en-US") */
	locale?: string
	/** Show this filter in the inline filter system */
	showInlineFilter?: boolean
	/** Show this filter by default (not in "Add filter" dropdown) */
	defaultInlineFilter?: boolean
	/** Custom filter label (defaults to title) */
	filterLabel?: string
	/** Placeholder for filter input */
	placeholder?: string
	/** Enable sorting for this column */
	enableSorting?: boolean
	/** Minimum value for filter */
	min?: number
	/** Maximum value for filter */
	max?: number
	/** Custom CSS classes for the cell */
	className?: string
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
		currency = "EUR",
		locale = "fr-FR",
		showInlineFilter = false,
		defaultInlineFilter = false,
		filterLabel,
		placeholder,
		enableSorting = true,
		min,
		max,
		className,
	} = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		cell: ({ row }) => {
			const value = row.getValue(accessorKey) as number
			const formatted = new Intl.NumberFormat(locale, {
				style: "currency",
				currency,
			}).format(value)
			return <span className={cn("text-body-md text-fg", className)}>{formatted}</span>
		},
		filterConfig: {
			type: "number",
			min,
			max,
			placeholder: placeholder || `Filter by ${title.toLowerCase()}...`,
			showInlineFilter,
			defaultInlineFilter,
			filterLabel: filterLabel || title,
		},
		meta: {
			align: "right",
		},
	})
}

/**
 * Configuration for createDateColumn factory
 */
export interface DateColumnConfig<_TData> {
	/** The accessor key for the column data */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Locale for date formatting */
	locale?: string
	/** Intl.DateTimeFormat options */
	format?: Intl.DateTimeFormatOptions
	/** Show this filter in the inline filter system */
	showInlineFilter?: boolean
	/** Show this filter by default (not in "Add filter" dropdown) */
	defaultInlineFilter?: boolean
	/** Custom filter label (defaults to title) */
	filterLabel?: string
	/** Placeholder for filter input */
	placeholder?: string
	/** Enable sorting for this column */
	enableSorting?: boolean
	/** Custom CSS classes for the cell */
	className?: string
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
		locale = "fr-FR",
		format,
		showInlineFilter = false,
		defaultInlineFilter = false,
		filterLabel,
		placeholder,
		enableSorting = true,
		className,
	} = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		cell: ({ row }) => {
			const value = row.getValue(accessorKey) as string | Date
			return <CellDate value={value} locale={locale} format={format} className={className} />
		},
		filterConfig: {
			type: "date",
			placeholder: placeholder || `Filter by ${title.toLowerCase()}...`,
			showInlineFilter,
			defaultInlineFilter,
			filterLabel: filterLabel || title,
		},
	})
}

/**
 * Configuration for createSelectColumn factory
 */
export interface SelectColumnConfig<TData> {
	/** The accessor key for the column data */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Options for the select filter and display */
	options: Array<{ label: string; value: string }>
	/** Show this filter in the inline filter system */
	showInlineFilter?: boolean
	/** Show this filter by default (not in "Add filter" dropdown) */
	defaultInlineFilter?: boolean
	/** Custom filter label (defaults to title) */
	filterLabel?: string
	/** Enable sorting for this column */
	enableSorting?: boolean
	/** Custom CSS classes for the cell */
	className?: string
	/** Custom cell renderer (overrides default) */
	cellRenderer?: (value: string, row: TData) => React.ReactNode
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
	} = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		cell: ({ row }) => {
			const value = row.getValue(accessorKey) as string
			if (cellRenderer) {
				return cellRenderer(value, row.original)
			}
			return <span className={cn("text-body-md", className)}>{value}</span>
		},
		filterConfig: {
			type: "select",
			options,
			showInlineFilter,
			defaultInlineFilter,
			filterLabel: filterLabel || title,
		},
	})
}

/**
 * Configuration for createImageTextColumn factory
 */
export interface ImageTextColumnConfig<_TData> {
	/** The accessor key for the text data */
	accessorKey: string
	/** The accessor key for the image/emoji data */
	imageAccessor: string
	/** Display title for the column header */
	title: string
	/** Placeholder for filter input */
	placeholder?: string
	/** Show this filter in the inline filter system */
	showInlineFilter?: boolean
	/** Show this filter by default (not in "Add filter" dropdown) */
	defaultInlineFilter?: boolean
	/** Custom filter label (defaults to title) */
	filterLabel?: string
	/** Enable sorting for this column */
	enableSorting?: boolean
	/** Custom image container classes */
	imageClassName?: string
	/** Custom text classes */
	textClassName?: string
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
	} = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		cell: ({ row }) => {
			const text = row.getValue(accessorKey) as string
			const image = (row.original as any)[imageAccessor] as string

			return (
				<div className="flex items-center gap-3">
					<div
						className={cn(
							"flex h-10 w-10 items-center justify-center rounded-md border border-edge bg-surface-3/50 text-xl",
							imageClassName
						)}
					>
						{image}
					</div>
					<span className={cn("text-body-md", textClassName)}>{text}</span>
				</div>
			)
		},
		filterConfig: {
			type: "text",
			placeholder: placeholder || `Search by ${title.toLowerCase()}...`,
			showInlineFilter,
			defaultInlineFilter,
			filterLabel: filterLabel || title,
		},
	})
}

// ---------------------------------------------------------------------------
// Tags column
// ---------------------------------------------------------------------------

/**
 * Configuration for createTagsColumn factory
 */
export interface TagsColumnConfig<_TData> {
	/** The accessor key for the column data (array of strings) */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Map tag values to Badge variant names */
	colorMap?: Record<string, string>
	/** Maximum visible tags before overflow (default 3) */
	max?: number
	/** Display style: badge or colored dot */
	variant?: "badge" | "dot"
	/** Options for the select filter */
	filterOptions?: Array<{ label: string; value: string }>
	/** Enable sorting for this column */
	enableSorting?: boolean
	/** Column width */
	size?: number
	/** Custom cell renderer (overrides default) */
	cellRenderer?: (value: string[], row: _TData) => React.ReactNode
}

/**
 * Creates a tags column that renders an array of strings as inline badges.
 *
 * @example
 * ```typescript
 * createTagsColumn<Contact>({
 *   accessorKey: "tags",
 *   title: "Tags",
 *   colorMap: { vip: "success", new: "info" },
 *   max: 2,
 * })
 * ```
 */
export function createTagsColumn<TData>(
	config: TagsColumnConfig<TData>
): DataTableColumnDef<TData> {
	const {
		accessorKey,
		title,
		colorMap,
		max,
		variant,
		filterOptions,
		enableSorting = false,
		size,
		cellRenderer,
	} = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		size,
		cell: ({ row }) => {
			const value = row.getValue(accessorKey) as string[]
			if (cellRenderer) return cellRenderer(value, row.original)
			return <CellTags items={value ?? []} colorMap={colorMap} max={max} variant={variant} />
		},
		...(filterOptions && {
			filterConfig: {
				type: "select" as const,
				options: filterOptions,
			},
		}),
	})
}

// ---------------------------------------------------------------------------
// Validation column
// ---------------------------------------------------------------------------

/**
 * Configuration for createValidationColumn factory
 */
export interface ValidationColumnConfig<TData> {
	/** The accessor key for the column data */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Validation rules evaluated per row — first non-null match wins */
	rules: Array<
		(row: TData) => { level: "success" | "warning" | "error" | "info"; message: string } | null
	>
	/** Enable sorting for this column */
	enableSorting?: boolean
	/** Column width */
	size?: number
}

/**
 * Creates a computed validation column that shows an icon + tooltip based on rules.
 *
 * @example
 * ```typescript
 * createValidationColumn<Deal>({
 *   accessorKey: "validation",
 *   title: "Status",
 *   rules: [
 *     (row) => row.amount === 0 ? { level: "error", message: "Amount is zero" } : null,
 *     (row) => row.amount < 100 ? { level: "warning", message: "Low value deal" } : null,
 *   ],
 * })
 * ```
 */
export function createValidationColumn<TData>(
	config: ValidationColumnConfig<TData>
): DataTableColumnDef<TData> {
	const { accessorKey, title, rules, enableSorting = false, size } = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		size,
		cell: ({ row }) => {
			for (const rule of rules) {
				const result = rule(row.original)
				if (result) {
					return <CellValidation level={result.level} message={result.message} />
				}
			}
			return <CellValidation level="success" message="Valid" />
		},
	})
}

// ---------------------------------------------------------------------------
// Progress column
// ---------------------------------------------------------------------------

/**
 * Configuration for createProgressColumn factory
 */
export interface ProgressColumnConfig<_TData> {
	/** The accessor key for the column data (number 0-100) */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Show percentage label to the right */
	showLabel?: boolean
	/** Thresholds that change the bar colour */
	colorThresholds?: { warn: number; danger: number }
	/** Enable sorting for this column */
	enableSorting?: boolean
	/** Column width */
	size?: number
	/** Custom cell renderer (overrides default) */
	cellRenderer?: (value: number, row: _TData) => React.ReactNode
}

/**
 * Creates a progress bar column for 0-100 percentage values.
 *
 * @example
 * ```typescript
 * createProgressColumn<Task>({
 *   accessorKey: "completion",
 *   title: "Progress",
 *   showLabel: true,
 *   colorThresholds: { warn: 50, danger: 25 },
 * })
 * ```
 */
export function createProgressColumn<TData>(
	config: ProgressColumnConfig<TData>
): DataTableColumnDef<TData> {
	const {
		accessorKey,
		title,
		showLabel,
		colorThresholds,
		enableSorting = true,
		size,
		cellRenderer,
	} = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		size,
		cell: ({ row }) => {
			const value = row.getValue(accessorKey) as number
			if (cellRenderer) return cellRenderer(value, row.original)
			return <CellProgress value={value} showLabel={showLabel} colorThresholds={colorThresholds} />
		},
		filterConfig: {
			type: "number",
			min: 0,
			max: 100,
		},
	})
}

// ---------------------------------------------------------------------------
// Rating column
// ---------------------------------------------------------------------------

/**
 * Configuration for createRatingColumn factory
 */
export interface RatingColumnConfig<_TData> {
	/** The accessor key for the column data */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Maximum rating (default 5) */
	max?: number
	/** Display style: star icons or small dots */
	variant?: "star" | "dot"
	/** Enable sorting for this column */
	enableSorting?: boolean
	/** Column width */
	size?: number
	/** Custom cell renderer (overrides default) */
	cellRenderer?: (value: number, row: _TData) => React.ReactNode
}

/**
 * Creates a rating column displaying filled/empty stars or dots.
 *
 * @example
 * ```typescript
 * createRatingColumn<Product>({
 *   accessorKey: "rating",
 *   title: "Rating",
 *   max: 5,
 *   variant: "star",
 * })
 * ```
 */
export function createRatingColumn<TData>(
	config: RatingColumnConfig<TData>
): DataTableColumnDef<TData> {
	const { accessorKey, title, max = 5, variant, enableSorting = true, size, cellRenderer } = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		size,
		cell: ({ row }) => {
			const value = row.getValue(accessorKey) as number
			if (cellRenderer) return cellRenderer(value, row.original)
			return <CellRating value={value} max={max} variant={variant} />
		},
		filterConfig: {
			type: "number",
			min: 0,
			max,
		},
	})
}

// ---------------------------------------------------------------------------
// Link column
// ---------------------------------------------------------------------------

/**
 * Configuration for createLinkColumn factory
 */
export interface LinkColumnConfig<_TData> {
	/** The accessor key for the column data */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Type of link */
	type?: "url" | "email" | "tel"
	/** Show an icon next to the link */
	showIcon?: boolean
	/** Maximum width in pixels */
	maxWidth?: number
	/** Enable sorting for this column */
	enableSorting?: boolean
	/** Column width */
	size?: number
	/** Custom cell renderer (overrides default) */
	cellRenderer?: (value: string, row: _TData) => React.ReactNode
}

/**
 * Creates a clickable link column for URLs, emails, or phone numbers.
 *
 * @example
 * ```typescript
 * createLinkColumn<Contact>({
 *   accessorKey: "email",
 *   title: "Email",
 *   type: "email",
 * })
 * ```
 */
export function createLinkColumn<TData>(
	config: LinkColumnConfig<TData>
): DataTableColumnDef<TData> {
	const {
		accessorKey,
		title,
		type,
		showIcon,
		maxWidth,
		enableSorting = true,
		size,
		cellRenderer,
	} = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		size,
		cell: ({ row }) => {
			const value = row.getValue(accessorKey) as string
			if (cellRenderer) return cellRenderer(value, row.original)
			return <CellLink value={value} type={type} showIcon={showIcon} maxWidth={maxWidth} />
		},
		filterConfig: {
			type: "text",
		},
	})
}

// ---------------------------------------------------------------------------
// Boolean column
// ---------------------------------------------------------------------------

/**
 * Configuration for createBooleanColumn factory
 */
export interface BooleanColumnConfig<_TData> {
	/** The accessor key for the column data */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Display style */
	variant?: "checkbox" | "badge" | "icon"
	/** Custom labels for true/false states */
	labels?: { true: string; false: string }
	/** Enable sorting for this column */
	enableSorting?: boolean
	/** Column width */
	size?: number
	/** Custom cell renderer (overrides default) */
	cellRenderer?: (value: boolean, row: _TData) => React.ReactNode
}

/**
 * Creates a boolean column displayed as checkbox, badge, or icon.
 *
 * @example
 * ```typescript
 * createBooleanColumn<Contact>({
 *   accessorKey: "isActive",
 *   title: "Active",
 *   variant: "badge",
 *   labels: { true: "Active", false: "Inactive" },
 * })
 * ```
 */
export function createBooleanColumn<TData>(
	config: BooleanColumnConfig<TData>
): DataTableColumnDef<TData> {
	const { accessorKey, title, variant, labels, enableSorting = true, size, cellRenderer } = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		size,
		cell: ({ row }) => {
			const value = row.getValue(accessorKey) as boolean
			if (cellRenderer) return cellRenderer(value, row.original)
			return <CellBoolean value={value} variant={variant} labels={labels} />
		},
		filterConfig: {
			type: "boolean",
		},
	})
}

// ---------------------------------------------------------------------------
// Avatar Group column
// ---------------------------------------------------------------------------

/**
 * Configuration for createAvatarGroupColumn factory
 */
export interface AvatarGroupColumnConfig<_TData> {
	/** The accessor key for the column data (array of { name, avatar? }) */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Maximum visible avatars before overflow (default 4) */
	max?: number
	/** Avatar size */
	avatarSize?: "sm" | "md"
	/** Enable sorting for this column */
	enableSorting?: boolean
	/** Column width */
	size?: number
	/** Custom cell renderer (overrides default) */
	cellRenderer?: (value: AvatarItem[], row: _TData) => React.ReactNode
}

/**
 * Creates an avatar group column displaying overlapping circular avatars.
 *
 * @example
 * ```typescript
 * createAvatarGroupColumn<Project>({
 *   accessorKey: "members",
 *   title: "Team",
 *   max: 3,
 *   avatarSize: "sm",
 * })
 * ```
 */
export function createAvatarGroupColumn<TData>(
	config: AvatarGroupColumnConfig<TData>
): DataTableColumnDef<TData> {
	const { accessorKey, title, max, avatarSize, enableSorting = false, size, cellRenderer } = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		size,
		cell: ({ row }) => {
			const value = row.getValue(accessorKey) as AvatarItem[]
			if (cellRenderer) return cellRenderer(value, row.original)
			return <CellAvatarGroup items={value ?? []} max={max} size={avatarSize} />
		},
	})
}

// ---------------------------------------------------------------------------
// Relative Date column
// ---------------------------------------------------------------------------

/**
 * Configuration for createRelativeDateColumn factory
 */
export interface RelativeDateColumnConfig<_TData> {
	/** The accessor key for the column data (date string or Date) */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Locale for formatting (default 'fr-FR') */
	locale?: string
	/** Enable sorting for this column */
	enableSorting?: boolean
	/** Column width */
	size?: number
}

/**
 * Creates a relative-date column that renders "3h ago", "In 2 days", etc.
 * Tooltip shows the exact date.
 *
 * @example
 * ```typescript
 * createRelativeDateColumn<Activity>({
 *   accessorKey: "updatedAt",
 *   title: "Last Update",
 *   locale: "fr-FR",
 * })
 * ```
 */
export function createRelativeDateColumn<TData>(
	config: RelativeDateColumnConfig<TData>
): DataTableColumnDef<TData> {
	const { accessorKey, title, locale = "fr-FR", enableSorting = true, size } = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		size,
		cell: ({ row }) => {
			const value = row.getValue(accessorKey) as string | Date
			return <CellRelativeDate value={value} locale={locale} />
		},
		filterConfig: {
			type: "date",
		},
	})
}

// ---------------------------------------------------------------------------
// User column
// ---------------------------------------------------------------------------

/**
 * Configuration for createUserColumn factory
 */
export interface UserColumnConfig<TData> {
	/** The accessor key for the name (or the full object if no accessor) */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Custom accessor to extract { name, avatar?, subtitle? } from a row */
	accessor?: (row: TData) => { name: string; avatar?: string; subtitle?: string }
	/** Key in row.original for avatar URL (simple mode) */
	avatarKey?: string
	/** Key in row.original for subtitle text (simple mode) */
	subtitleKey?: string
	/** Avatar size */
	size?: "sm" | "md"
	/** Enable sorting for this column */
	enableSorting?: boolean
	/** Column width */
	columnSize?: number
}

/**
 * Creates a user column with avatar + name + optional subtitle.
 *
 * @example
 * ```typescript
 * createUserColumn<Contact>({
 *   accessorKey: "name",
 *   title: "Contact",
 *   avatarKey: "avatar",
 *   subtitleKey: "email",
 * })
 * ```
 */
export function createUserColumn<TData>(
	config: UserColumnConfig<TData>
): DataTableColumnDef<TData> {
	const {
		accessorKey,
		title,
		accessor,
		avatarKey,
		subtitleKey,
		size = "sm",
		enableSorting = true,
		columnSize,
	} = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		size: columnSize,
		cell: ({ row }) => {
			if (accessor) {
				const data = accessor(row.original)
				return (
					<CellUser name={data.name} avatar={data.avatar} subtitle={data.subtitle} size={size} />
				)
			}
			const name = row.getValue(accessorKey) as string
			const avatar = avatarKey
				? ((row.original as Record<string, unknown>)[avatarKey] as string)
				: undefined
			const subtitle = subtitleKey
				? ((row.original as Record<string, unknown>)[subtitleKey] as string)
				: undefined
			return <CellUser name={name} avatar={avatar} subtitle={subtitle} size={size} />
		},
		filterConfig: {
			type: "text",
		},
	})
}

// ---------------------------------------------------------------------------
// Duration column
// ---------------------------------------------------------------------------

/**
 * Configuration for createDurationColumn factory
 */
export interface DurationColumnConfig<_TData> {
	/** The accessor key for the column data (number) */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Unit of the input value (default 'minutes') */
	unit?: "seconds" | "minutes" | "hours"
	/** Enable sorting for this column */
	enableSorting?: boolean
	/** Column width */
	size?: number
}

/**
 * Creates a duration column that formats numbers into human-readable durations.
 *
 * @example
 * ```typescript
 * createDurationColumn<Task>({
 *   accessorKey: "timeSpent",
 *   title: "Time Spent",
 *   unit: "minutes",
 * })
 * ```
 */
export function createDurationColumn<TData>(
	config: DurationColumnConfig<TData>
): DataTableColumnDef<TData> {
	const { accessorKey, title, unit = "minutes", enableSorting = true, size } = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		size,
		cell: ({ row }) => {
			const value = row.getValue(accessorKey) as number
			return <CellDuration value={value} unit={unit} />
		},
		filterConfig: {
			type: "number",
		},
	})
}

// ---------------------------------------------------------------------------
// Color Dot column
// ---------------------------------------------------------------------------

/**
 * Configuration for createColorDotColumn factory
 */
export interface ColorDotColumnConfig<_TData> {
	/** The accessor key for the column data */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Map value → Tailwind bg class */
	colorMap?: Record<string, string>
	/** Options for the select filter */
	filterOptions?: Array<{ label: string; value: string }>
	/** Enable sorting for this column */
	enableSorting?: boolean
	/** Column width */
	size?: number
}

/**
 * Creates a color-dot column showing a colored dot + label.
 *
 * @example
 * ```typescript
 * createColorDotColumn<Lead>({
 *   accessorKey: "priority",
 *   title: "Priority",
 *   colorMap: { high: "bg-red-500", medium: "bg-yellow-500", low: "bg-green-500" },
 *   filterOptions: [
 *     { label: "High", value: "high" },
 *     { label: "Medium", value: "medium" },
 *     { label: "Low", value: "low" },
 *   ],
 * })
 * ```
 */
export function createColorDotColumn<TData>(
	config: ColorDotColumnConfig<TData>
): DataTableColumnDef<TData> {
	const { accessorKey, title, colorMap, filterOptions, enableSorting = true, size } = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		size,
		cell: ({ row }) => {
			const value = row.getValue(accessorKey) as string
			return <CellColorDot value={value} colorMap={colorMap} />
		},
		...(filterOptions && {
			filterConfig: {
				type: "select" as const,
				options: filterOptions,
			},
		}),
	})
}

// ---------------------------------------------------------------------------
// Image column
// ---------------------------------------------------------------------------

/**
 * Configuration for createImageColumn factory
 */
export interface ImageColumnConfig<_TData> {
	/** The accessor key for the image src */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Image size in pixels (default 40) */
	size?: number
	/** Border radius style */
	rounded?: "sm" | "md" | "full"
	/** Key in row.original for alt text */
	altKey?: string
	/** Column width */
	columnSize?: number
}

/**
 * Creates an image thumbnail column.
 *
 * @example
 * ```typescript
 * createImageColumn<Product>({
 *   accessorKey: "thumbnail",
 *   title: "Image",
 *   size: 48,
 *   rounded: "md",
 *   altKey: "name",
 * })
 * ```
 */
export function createImageColumn<TData>(
	config: ImageColumnConfig<TData>
): DataTableColumnDef<TData> {
	const { accessorKey, title, size: imgSize = 40, rounded, altKey, columnSize } = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting: false,
		size: columnSize,
		cell: ({ row }) => {
			const src = row.getValue(accessorKey) as string
			const alt = altKey ? ((row.original as Record<string, unknown>)[altKey] as string) : undefined
			return <CellImage src={src} alt={alt} size={imgSize} rounded={rounded} />
		},
	})
}

// ---------------------------------------------------------------------------
// Sparkline column
// ---------------------------------------------------------------------------

/**
 * Configuration for createSparklineColumn factory
 */
export interface SparklineColumnConfig<_TData> {
	/** The accessor key for the column data (number[]) */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Chart type */
	type?: "line" | "bar"
	/** Stroke/fill color */
	color?: string
	/** SVG height (default 24) */
	height?: number
	/** SVG width (default 80) */
	width?: number
	/** Column width */
	size?: number
}

/**
 * Creates a sparkline column rendering inline SVG charts.
 *
 * @example
 * ```typescript
 * createSparklineColumn<Product>({
 *   accessorKey: "salesTrend",
 *   title: "Trend",
 *   type: "line",
 * })
 * ```
 */
export function createSparklineColumn<TData>(
	config: SparklineColumnConfig<TData>
): DataTableColumnDef<TData> {
	const { accessorKey, title, type: chartType, color, height, width, size } = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting: false,
		size,
		cell: ({ row }) => {
			const values = row.getValue(accessorKey) as number[]
			return (
				<CellSparkline
					values={values}
					type={chartType}
					color={color}
					height={height}
					width={width}
				/>
			)
		},
	})
}

// ---------------------------------------------------------------------------
// Two Lines column
// ---------------------------------------------------------------------------

/**
 * Configuration for createTwoLinesColumn factory
 */
export interface TwoLinesColumnConfig<TData> {
	/** The accessor key for the main text */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Custom accessor to extract { main, sub } from a row */
	accessor?: (row: TData) => { main: string; sub: string }
	/** Key in row.original for the sub line (simple mode) */
	subKey?: string
	/** Enable sorting for this column */
	enableSorting?: boolean
	/** Column width */
	size?: number
}

/**
 * Creates a two-line column with primary and secondary text.
 *
 * @example
 * ```typescript
 * createTwoLinesColumn<Contact>({
 *   accessorKey: "name",
 *   title: "Contact",
 *   subKey: "company",
 * })
 * ```
 */
export function createTwoLinesColumn<TData>(
	config: TwoLinesColumnConfig<TData>
): DataTableColumnDef<TData> {
	const { accessorKey, title, accessor, subKey, enableSorting = true, size } = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		size,
		cell: ({ row }) => {
			if (accessor) {
				const data = accessor(row.original)
				return <CellTwoLines main={data.main} sub={data.sub} />
			}
			const main = row.getValue(accessorKey) as string
			const sub = subKey ? ((row.original as Record<string, unknown>)[subKey] as string) : ""
			return <CellTwoLines main={main} sub={sub} />
		},
		filterConfig: {
			type: "text",
		},
	})
}

// ---------------------------------------------------------------------------
// Key Value column
// ---------------------------------------------------------------------------

/**
 * Configuration for createKeyValueColumn factory
 */
export interface KeyValueColumnConfig<TData> {
	/** The accessor key for the value (or the full object if using accessor) */
	accessorKey: string
	/** Display title for the column header */
	title: string
	/** Custom accessor to extract { label, value } from a row */
	accessor?: (row: TData) => { label: string; value: string }
	/** Key in row.original for the label (simple mode) */
	labelKey?: string
	/** Key in row.original for the value (simple mode, defaults to accessorKey) */
	valueKey?: string
	/** Enable sorting for this column */
	enableSorting?: boolean
	/** Column width */
	size?: number
}

/**
 * Creates a key-value column displaying "label: value" inline.
 *
 * @example
 * ```typescript
 * createKeyValueColumn<Setting>({
 *   accessorKey: "value",
 *   title: "Setting",
 *   labelKey: "key",
 * })
 * ```
 */
export function createKeyValueColumn<TData>(
	config: KeyValueColumnConfig<TData>
): DataTableColumnDef<TData> {
	const { accessorKey, title, accessor, labelKey, valueKey, enableSorting = true, size } = config

	return createBaseColumn<TData>({
		accessorKey,
		title,
		enableSorting,
		size,
		cell: ({ row }) => {
			if (accessor) {
				const data = accessor(row.original)
				return <CellKeyValue label={data.label} value={data.value} />
			}
			const label = labelKey ? ((row.original as Record<string, unknown>)[labelKey] as string) : ""
			const value = valueKey
				? ((row.original as Record<string, unknown>)[valueKey] as string)
				: (row.getValue(accessorKey) as string)
			return <CellKeyValue label={label} value={value} />
		},
		filterConfig: {
			type: "text",
		},
	})
}
