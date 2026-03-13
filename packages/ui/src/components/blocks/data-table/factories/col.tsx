"use client"

import { ChevronRight } from "lucide-react"

import { cn } from "../../../../lib/utils"
import type { DataTableColumnDef } from "../data-table.types"
import { DataTableRowSelection } from "../data-table-row-selection"

import {
	type AvatarGroupColumnConfig,
	type BooleanColumnConfig,
	type ColorDotColumnConfig,
	type CurrencyColumnConfig,
	createAvatarGroupColumn,
	createBooleanColumn,
	createColorDotColumn,
	createCurrencyColumn,
	createDateColumn,
	createDurationColumn,
	createImageColumn,
	createImageTextColumn,
	createKeyValueColumn,
	createLinkColumn,
	createNumericColumn,
	createProgressColumn,
	createRatingColumn,
	createRelativeDateColumn,
	createSelectColumn,
	createSparklineColumn,
	createStatusColumn,
	createTagsColumn,
	createTextColumn,
	createTwoLinesColumn,
	createUserColumn,
	createValidationColumn,
	type DateColumnConfig,
	type DurationColumnConfig,
	type ImageColumnConfig,
	type ImageTextColumnConfig,
	type KeyValueColumnConfig,
	type LinkColumnConfig,
	type NumericColumnConfig,
	type ProgressColumnConfig,
	type RatingColumnConfig,
	type RelativeDateColumnConfig,
	type SelectColumnConfig,
	type SparklineColumnConfig,
	type StatusColumnConfig,
	type TagsColumnConfig,
	type TextColumnConfig,
	type TwoLinesColumnConfig,
	type UserColumnConfig,
	type ValidationColumnConfig,
} from "./column-builders"

import {
	createEditableCurrencyColumn,
	createEditableDateColumn,
	createEditableNumberColumn,
	createEditableSelectColumn,
	createEditableTextColumn,
	type EditableCurrencyColumnConfig,
	type EditableDateColumnConfig,
	type EditableNumberColumnConfig,
	type EditableSelectColumnConfig,
	type EditableTextColumnConfig,
} from "./editable-column-builders"

// ---------------------------------------------------------------------------
// Utility: derive a human-readable title from a camelCase accessor key
// "companyName" → "Company Name", "id" → "Id", "createdAt" → "Created At"
// ---------------------------------------------------------------------------

function titleFromKey(key: string): string {
	return key
		.replace(/([a-z])([A-Z])/g, "$1 $2") // split camelCase
		.replace(/([A-Z]+)([A-Z][a-z])/g, "$1 $2") // split acronyms like "HTMLParser" → "HTML Parser"
		.replace(/^./, (c) => c.toUpperCase()) // capitalize first letter
}

// ---------------------------------------------------------------------------
// Shorthand option types: Omit accessorKey (passed as 1st arg) and make
// title optional (auto-derived when omitted).
// ---------------------------------------------------------------------------

type ColOpts<C> = Omit<C, "accessorKey"> & { title?: string }
type ColOptsOptionalTitle<C> = Omit<C, "accessorKey" | "title"> & { title?: string }

// ---------------------------------------------------------------------------
// col namespace
// ---------------------------------------------------------------------------

/**
 * Shorthand column builder namespace.
 *
 * Instead of:
 * ```ts
 * createTextColumn<Product>({ accessorKey: "name", title: "Name", showInlineFilter: true })
 * ```
 *
 * Write:
 * ```ts
 * col.text<Product>("name", { showInlineFilter: true })
 * ```
 *
 * The `title` is auto-derived from the key ("companyName" → "Company Name")
 * but can always be overridden via `opts.title`.
 */
export const col = {
	// -------------------------------------------------------------------------
	// Read-only column builders
	// -------------------------------------------------------------------------

	/** Plain text column with optional text filter */
	text<TData>(
		key: string,
		opts?: ColOptsOptionalTitle<TextColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createTextColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts?.title ?? titleFromKey(key),
		})
	},

	/** Status badge column — requires `statusMap` */
	status<TData>(key: string, opts: ColOpts<StatusColumnConfig<TData>>): DataTableColumnDef<TData> {
		return createStatusColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts.title ?? titleFromKey(key),
		})
	},

	/** Numeric column with optional number filter */
	numeric<TData>(
		key: string,
		opts?: ColOptsOptionalTitle<NumericColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createNumericColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts?.title ?? titleFromKey(key),
		})
	},

	/** Currency column with locale-aware formatting */
	currency<TData>(
		key: string,
		opts?: ColOptsOptionalTitle<CurrencyColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createCurrencyColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts?.title ?? titleFromKey(key),
		})
	},

	/** Date column with locale-aware formatting */
	date<TData>(
		key: string,
		opts?: ColOptsOptionalTitle<DateColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createDateColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts?.title ?? titleFromKey(key),
		})
	},

	/** Select/dropdown column — requires `options` */
	select<TData>(key: string, opts: ColOpts<SelectColumnConfig<TData>>): DataTableColumnDef<TData> {
		return createSelectColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts.title ?? titleFromKey(key),
		})
	},

	/** Image + text column — requires `imageAccessor` */
	imageText<TData>(
		key: string,
		opts: ColOpts<ImageTextColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createImageTextColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts.title ?? titleFromKey(key),
		})
	},

	/** Tags column — renders array of strings as inline badges */
	tags<TData>(
		key: string,
		opts?: ColOptsOptionalTitle<TagsColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createTagsColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts?.title ?? titleFromKey(key),
		})
	},

	/** Validation column — computed icon + tooltip from rules */
	validation<TData>(
		key: string,
		opts: ColOpts<ValidationColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createValidationColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts.title ?? titleFromKey(key),
		})
	},

	/** Progress bar column (0-100) */
	progress<TData>(
		key: string,
		opts?: ColOptsOptionalTitle<ProgressColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createProgressColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts?.title ?? titleFromKey(key),
		})
	},

	/** Rating column — stars or dots */
	rating<TData>(
		key: string,
		opts?: ColOptsOptionalTitle<RatingColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createRatingColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts?.title ?? titleFromKey(key),
		})
	},

	/** Clickable link column (URL, email, or phone) */
	link<TData>(
		key: string,
		opts?: ColOptsOptionalTitle<LinkColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createLinkColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts?.title ?? titleFromKey(key),
		})
	},

	/** Boolean column — checkbox, badge, or icon */
	boolean<TData>(
		key: string,
		opts?: ColOptsOptionalTitle<BooleanColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createBooleanColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts?.title ?? titleFromKey(key),
		})
	},

	/** Avatar group column — overlapping circular avatars */
	avatarGroup<TData>(
		key: string,
		opts?: ColOptsOptionalTitle<AvatarGroupColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createAvatarGroupColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts?.title ?? titleFromKey(key),
		})
	},

	/** Relative date column — "3h ago", "In 2 days" with exact-date tooltip */
	relativeDate<TData>(
		key: string,
		opts?: ColOptsOptionalTitle<RelativeDateColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createRelativeDateColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts?.title ?? titleFromKey(key),
		})
	},

	/** User column — avatar + name + optional subtitle */
	user<TData>(
		key: string,
		opts?: ColOptsOptionalTitle<UserColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createUserColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts?.title ?? titleFromKey(key),
		})
	},

	/** Duration column — human-readable durations (2h 30m, 45s) */
	duration<TData>(
		key: string,
		opts?: ColOptsOptionalTitle<DurationColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createDurationColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts?.title ?? titleFromKey(key),
		})
	},

	/** Color dot column — colored dot + label */
	colorDot<TData>(
		key: string,
		opts?: ColOptsOptionalTitle<ColorDotColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createColorDotColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts?.title ?? titleFromKey(key),
		})
	},

	/** Image thumbnail column */
	image<TData>(
		key: string,
		opts?: ColOptsOptionalTitle<ImageColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createImageColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts?.title ?? titleFromKey(key),
		})
	},

	/** Sparkline column — inline SVG chart (line or bar) */
	sparkline<TData>(
		key: string,
		opts?: ColOptsOptionalTitle<SparklineColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createSparklineColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts?.title ?? titleFromKey(key),
		})
	},

	/** Two-line column — primary text + muted subtitle */
	twoLines<TData>(
		key: string,
		opts?: ColOptsOptionalTitle<TwoLinesColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createTwoLinesColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts?.title ?? titleFromKey(key),
		})
	},

	/** Key-value column — "label: value" inline */
	keyValue<TData>(
		key: string,
		opts?: ColOptsOptionalTitle<KeyValueColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createKeyValueColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts?.title ?? titleFromKey(key),
		})
	},

	// -------------------------------------------------------------------------
	// Editable column builders
	// -------------------------------------------------------------------------

	/** Editable text column — requires `onCellEdit` */
	editableText<TData>(
		key: string,
		opts: ColOpts<EditableTextColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createEditableTextColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts.title ?? titleFromKey(key),
		})
	},

	/** Editable number column — requires `onCellEdit` */
	editableNumber<TData>(
		key: string,
		opts: ColOpts<EditableNumberColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createEditableNumberColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts.title ?? titleFromKey(key),
		})
	},

	/** Editable currency column — requires `onCellEdit` */
	editableCurrency<TData>(
		key: string,
		opts: ColOpts<EditableCurrencyColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createEditableCurrencyColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts.title ?? titleFromKey(key),
		})
	},

	/** Editable select column — requires `onCellEdit` and `options` */
	editableSelect<TData>(
		key: string,
		opts: ColOpts<EditableSelectColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createEditableSelectColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts.title ?? titleFromKey(key),
		})
	},

	/** Editable date column — requires `onCellEdit` */
	editableDate<TData>(
		key: string,
		opts: ColOpts<EditableDateColumnConfig<TData>>
	): DataTableColumnDef<TData> {
		return createEditableDateColumn<TData>({
			...opts,
			accessorKey: key,
			title: opts.title ?? titleFromKey(key),
		})
	},

	// -------------------------------------------------------------------------
	// Special columns
	// -------------------------------------------------------------------------

	/** Row selection checkbox column (header = select-all, cell = per-row toggle) */
	selection<TData>(): DataTableColumnDef<TData> {
		return {
			id: "select",
			header: ({ table }) => <DataTableRowSelection table={table} type="header" />,
			cell: ({ row }) => <DataTableRowSelection row={row} type="cell" />,
			enableSorting: false,
			enableHiding: false,
			size: 40,
		} as DataTableColumnDef<TData>
	},

	/** Row expand chevron column — toggles the expanded row detail panel */
	expand<TData>(): DataTableColumnDef<TData> {
		return {
			id: "expand",
			header: () => null,
			cell: ({ row }) => (
				<button
					type="button"
					onClick={(e) => {
						e.stopPropagation()
						row.toggleExpanded()
					}}
					className="flex items-center justify-center p-1 text-fg-muted hover:text-fg"
				>
					<ChevronRight
						className={cn(
							"h-4 w-4 transition-transform duration-200",
							row.getIsExpanded() && "rotate-90"
						)}
					/>
				</button>
			),
			enableSorting: false,
			enableHiding: false,
			size: 32,
		} as DataTableColumnDef<TData>
	},
} as const
