'use client';

import type { DataTableColumnDef } from '../data-table.types';
import { DataTableColumnHeader } from '../data-table-column-header';
import { DataTableRowSelection } from '../data-table-row-selection';

import {
  createTextColumn,
  createStatusColumn,
  createNumericColumn,
  createCurrencyColumn,
  createDateColumn,
  createSelectColumn,
  createImageTextColumn,
  type TextColumnConfig,
  type StatusColumnConfig,
  type NumericColumnConfig,
  type CurrencyColumnConfig,
  type DateColumnConfig,
  type SelectColumnConfig,
  type ImageTextColumnConfig,
} from './column-builders';

import {
  createEditableTextColumn,
  createEditableNumberColumn,
  createEditableCurrencyColumn,
  createEditableSelectColumn,
  createEditableDateColumn,
  type EditableTextColumnConfig,
  type EditableNumberColumnConfig,
  type EditableCurrencyColumnConfig,
  type EditableSelectColumnConfig,
  type EditableDateColumnConfig,
} from './editable-column-builders';

// ---------------------------------------------------------------------------
// Utility: derive a human-readable title from a camelCase accessor key
// "companyName" → "Company Name", "id" → "Id", "createdAt" → "Created At"
// ---------------------------------------------------------------------------

function titleFromKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2') // split camelCase
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2') // split acronyms like "HTMLParser" → "HTML Parser"
    .replace(/^./, (c) => c.toUpperCase()); // capitalize first letter
}

// ---------------------------------------------------------------------------
// Shorthand option types: Omit accessorKey (passed as 1st arg) and make
// title optional (auto-derived when omitted).
// ---------------------------------------------------------------------------

type ColOpts<C> = Omit<C, 'accessorKey'> & { title?: string };
type ColOptsOptionalTitle<C> = Omit<C, 'accessorKey' | 'title'> & { title?: string };

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
    opts?: ColOptsOptionalTitle<TextColumnConfig<TData>>,
  ): DataTableColumnDef<TData> {
    return createTextColumn<TData>({
      ...opts,
      accessorKey: key,
      title: opts?.title ?? titleFromKey(key),
    });
  },

  /** Status badge column — requires `statusMap` */
  status<TData>(
    key: string,
    opts: ColOpts<StatusColumnConfig<TData>>,
  ): DataTableColumnDef<TData> {
    return createStatusColumn<TData>({
      ...opts,
      accessorKey: key,
      title: opts.title ?? titleFromKey(key),
    });
  },

  /** Numeric column with optional number filter */
  numeric<TData>(
    key: string,
    opts?: ColOptsOptionalTitle<NumericColumnConfig<TData>>,
  ): DataTableColumnDef<TData> {
    return createNumericColumn<TData>({
      ...opts,
      accessorKey: key,
      title: opts?.title ?? titleFromKey(key),
    });
  },

  /** Currency column with locale-aware formatting */
  currency<TData>(
    key: string,
    opts?: ColOptsOptionalTitle<CurrencyColumnConfig<TData>>,
  ): DataTableColumnDef<TData> {
    return createCurrencyColumn<TData>({
      ...opts,
      accessorKey: key,
      title: opts?.title ?? titleFromKey(key),
    });
  },

  /** Date column with locale-aware formatting */
  date<TData>(
    key: string,
    opts?: ColOptsOptionalTitle<DateColumnConfig<TData>>,
  ): DataTableColumnDef<TData> {
    return createDateColumn<TData>({
      ...opts,
      accessorKey: key,
      title: opts?.title ?? titleFromKey(key),
    });
  },

  /** Select/dropdown column — requires `options` */
  select<TData>(
    key: string,
    opts: ColOpts<SelectColumnConfig<TData>>,
  ): DataTableColumnDef<TData> {
    return createSelectColumn<TData>({
      ...opts,
      accessorKey: key,
      title: opts.title ?? titleFromKey(key),
    });
  },

  /** Image + text column — requires `imageAccessor` */
  imageText<TData>(
    key: string,
    opts: ColOpts<ImageTextColumnConfig<TData>>,
  ): DataTableColumnDef<TData> {
    return createImageTextColumn<TData>({
      ...opts,
      accessorKey: key,
      title: opts.title ?? titleFromKey(key),
    });
  },

  // -------------------------------------------------------------------------
  // Editable column builders
  // -------------------------------------------------------------------------

  /** Editable text column — requires `onCellEdit` */
  editableText<TData>(
    key: string,
    opts: ColOpts<EditableTextColumnConfig<TData>>,
  ): DataTableColumnDef<TData> {
    return createEditableTextColumn<TData>({
      ...opts,
      accessorKey: key,
      title: opts.title ?? titleFromKey(key),
    });
  },

  /** Editable number column — requires `onCellEdit` */
  editableNumber<TData>(
    key: string,
    opts: ColOpts<EditableNumberColumnConfig<TData>>,
  ): DataTableColumnDef<TData> {
    return createEditableNumberColumn<TData>({
      ...opts,
      accessorKey: key,
      title: opts.title ?? titleFromKey(key),
    });
  },

  /** Editable currency column — requires `onCellEdit` */
  editableCurrency<TData>(
    key: string,
    opts: ColOpts<EditableCurrencyColumnConfig<TData>>,
  ): DataTableColumnDef<TData> {
    return createEditableCurrencyColumn<TData>({
      ...opts,
      accessorKey: key,
      title: opts.title ?? titleFromKey(key),
    });
  },

  /** Editable select column — requires `onCellEdit` and `options` */
  editableSelect<TData>(
    key: string,
    opts: ColOpts<EditableSelectColumnConfig<TData>>,
  ): DataTableColumnDef<TData> {
    return createEditableSelectColumn<TData>({
      ...opts,
      accessorKey: key,
      title: opts.title ?? titleFromKey(key),
    });
  },

  /** Editable date column — requires `onCellEdit` */
  editableDate<TData>(
    key: string,
    opts: ColOpts<EditableDateColumnConfig<TData>>,
  ): DataTableColumnDef<TData> {
    return createEditableDateColumn<TData>({
      ...opts,
      accessorKey: key,
      title: opts.title ?? titleFromKey(key),
    });
  },

  // -------------------------------------------------------------------------
  // Special columns
  // -------------------------------------------------------------------------

  /** Row selection checkbox column (header = select-all, cell = per-row toggle) */
  selection<TData>(): DataTableColumnDef<TData> {
    return {
      id: 'select',
      header: ({ table }) => (
        <DataTableRowSelection table={table} type="header" />
      ),
      cell: ({ row }) => (
        <DataTableRowSelection row={row} type="cell" />
      ),
      enableSorting: false,
      enableHiding: false,
      size: 40,
    } as DataTableColumnDef<TData>;
  },
} as const;
