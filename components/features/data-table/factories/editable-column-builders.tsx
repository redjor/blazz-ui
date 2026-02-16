'use client';

import { useCallback, useRef, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { DataTableColumnDef } from '../data-table.types';
import { DataTableColumnHeader } from '../data-table-column-header';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface EditableCellConfig {
  onCellEdit: (rowId: string, columnId: string, value: unknown) => void;
}

export interface EditableTextColumnConfig<_TData> extends EditableCellConfig {
  accessorKey: string;
  title: string;
  placeholder?: string;
  className?: string;
  enableSorting?: boolean;
}

export interface EditableNumberColumnConfig<_TData> extends EditableCellConfig {
  accessorKey: string;
  title: string;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
  enableSorting?: boolean;
}

export interface EditableCurrencyColumnConfig<_TData> extends EditableCellConfig {
  accessorKey: string;
  title: string;
  currency?: string;
  locale?: string;
  className?: string;
  enableSorting?: boolean;
}

export interface EditableSelectColumnConfig<_TData> extends EditableCellConfig {
  accessorKey: string;
  title: string;
  options: Array<{ label: string; value: string }>;
  className?: string;
  enableSorting?: boolean;
}

export interface EditableDateColumnConfig<_TData> extends EditableCellConfig {
  accessorKey: string;
  title: string;
  className?: string;
  enableSorting?: boolean;
}

// ---------------------------------------------------------------------------
// Shared hook for editable cells (blur-to-save + Enter-to-blur pattern)
// ---------------------------------------------------------------------------

function useEditableCell<T>({
  value,
  rowId,
  columnId,
  onCellEdit,
  parse,
}: {
  value: T;
  rowId: string;
  columnId: string;
  onCellEdit: (rowId: string, columnId: string, value: unknown) => void;
  parse?: (raw: string) => T | undefined;
}) {
  const [localValue, setLocalValue] = useState(String(value ?? ''));

  const handleBlur = useCallback(() => {
    const parsed = parse ? parse(localValue) : localValue;
    if (parsed !== undefined && parsed !== value) {
      onCellEdit(rowId, columnId, parsed);
    }
  }, [localValue, value, rowId, columnId, onCellEdit, parse]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  }, []);

  return { localValue, setLocalValue, handleBlur, handleKeyDown };
}

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

/** Shared base for both idle button and editing input — identical box model = zero layout shift.
 *  Padding is on the content (not the td) so the edit ring fills the entire cell. */
export const cellShared =
  'w-full px-3 py-3 text-body-md text-fg rounded-none bg-transparent';

const idleCell = `${cellShared} cursor-text text-left hover:bg-raised/40`;

const editInput = `${cellShared} min-w-0 h-auto border-0 outline-none ring-2 ring-inset ring-p-border-focus`;

// ---------------------------------------------------------------------------
// Internal cell components
// ---------------------------------------------------------------------------

interface EditableTextCellProps {
  value: string;
  rowId: string;
  columnId: string;
  onCellEdit: (rowId: string, columnId: string, value: unknown) => void;
  placeholder?: string;
  className?: string;
}

function EditableTextCell({
  value,
  rowId,
  columnId,
  onCellEdit,
  placeholder,
  className,
}: EditableTextCellProps) {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { localValue, setLocalValue, handleBlur: hookBlur, handleKeyDown } = useEditableCell({
    value,
    rowId,
    columnId,
    onCellEdit,
  });

  const handleBlur = useCallback(() => {
    setEditing(false);
    hookBlur();
  }, [hookBlur]);

  if (!editing) {
    return (
      <button
        type="button"
        className={cn(idleCell, className)}
        onClick={() => {
          setLocalValue(String(value ?? ''));
          setEditing(true);
        }}
      >
        {value || <span className="text-fg-muted">{placeholder}</span>}
      </button>
    );
  }

  return (
    <input
      ref={inputRef}
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      placeholder={placeholder}
      autoFocus
      className={cn(editInput, className)}
    />
  );
}

// ---------------------------------------------------------------------------

interface EditableNumberCellProps {
  value: number;
  rowId: string;
  columnId: string;
  onCellEdit: (rowId: string, columnId: string, value: unknown) => void;
  min?: number;
  max?: number;
  step?: number;
  className?: string;
}

const parseNumber = (raw: string): number | undefined => {
  const n = Number(raw);
  return Number.isNaN(n) ? undefined : n;
};

function EditableNumberCell({
  value,
  rowId,
  columnId,
  onCellEdit,
  min,
  max,
  step,
  className,
}: EditableNumberCellProps) {
  const [editing, setEditing] = useState(false);
  const { localValue, setLocalValue, handleBlur: hookBlur, handleKeyDown } = useEditableCell({
    value,
    rowId,
    columnId,
    onCellEdit,
    parse: parseNumber,
  });

  const handleBlur = useCallback(() => {
    setEditing(false);
    hookBlur();
  }, [hookBlur]);

  if (!editing) {
    return (
      <button
        type="button"
        className={cn(idleCell, 'text-right', className)}
        onClick={() => {
          setLocalValue(String(value ?? ''));
          setEditing(true);
        }}
      >
        {value != null ? String(value) : ''}
      </button>
    );
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      autoFocus
      className={cn(editInput, 'text-right', className)}
    />
  );
}

// ---------------------------------------------------------------------------

interface EditableCurrencyCellProps {
  value: number;
  rowId: string;
  columnId: string;
  onCellEdit: (rowId: string, columnId: string, value: unknown) => void;
  currency: string;
  locale: string;
  className?: string;
}

function EditableCurrencyCell({
  value,
  rowId,
  columnId,
  onCellEdit,
  currency,
  locale,
  className,
}: EditableCurrencyCellProps) {
  const [editing, setEditing] = useState(false);
  const { localValue, setLocalValue, handleBlur: hookBlur, handleKeyDown } = useEditableCell({
    value,
    rowId,
    columnId,
    onCellEdit,
    parse: parseNumber,
  });

  const formatted = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
  }).format(value);

  const handleBlur = useCallback(() => {
    setEditing(false);
    hookBlur();
  }, [hookBlur]);

  if (!editing) {
    return (
      <button
        type="button"
        className={cn(idleCell, 'text-right', className)}
        onClick={() => {
          setLocalValue(String(value ?? ''));
          setEditing(true);
        }}
      >
        {formatted}
      </button>
    );
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      value={localValue}
      onChange={(e) => setLocalValue(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      autoFocus
      className={cn(editInput, 'text-right', className)}
    />
  );
}

// ---------------------------------------------------------------------------

interface EditableSelectCellProps {
  value: string;
  rowId: string;
  columnId: string;
  onCellEdit: (rowId: string, columnId: string, value: unknown) => void;
  options: Array<{ label: string; value: string }>;
  className?: string;
}

function EditableSelectCell({
  value,
  rowId,
  columnId,
  onCellEdit,
  options,
  className,
}: EditableSelectCellProps) {
  const [editing, setEditing] = useState(false);
  const selectedOption = options.find((opt) => opt.value === value);

  const handleChange = useCallback(
    (newValue: string | null) => {
      if (newValue != null && newValue !== value) {
        onCellEdit(rowId, columnId, newValue);
      }
      setEditing(false);
    },
    [value, rowId, columnId, onCellEdit]
  );

  if (!editing) {
    return (
      <button
        type="button"
        className={cn(idleCell, className)}
        onClick={() => setEditing(true)}
      >
        {selectedOption?.label ?? value}
      </button>
    );
  }

  return (
    <Select
      value={value ?? ''}
      onValueChange={handleChange}
      open
      onOpenChange={(open) => {
        if (!open) setEditing(false);
      }}
    >
      <SelectTrigger
        className={cn(
          'h-8 border-0 rounded-none bg-transparent shadow-none ring-2 ring-inset ring-p-border-focus',
          className
        )}
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

// ---------------------------------------------------------------------------

interface EditableDateCellProps {
  value: string;
  rowId: string;
  columnId: string;
  onCellEdit: (rowId: string, columnId: string, value: unknown) => void;
  className?: string;
}

function EditableDateCell({
  value,
  rowId,
  columnId,
  onCellEdit,
  className,
}: EditableDateCellProps) {
  const [editing, setEditing] = useState(false);
  const dateStr = value ? new Date(value).toISOString().split('T')[0] : '';

  const formatted = value
    ? new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(value))
    : '';

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onCellEdit(rowId, columnId, e.target.value);
      setEditing(false);
    },
    [rowId, columnId, onCellEdit]
  );

  if (!editing) {
    return (
      <button
        type="button"
        className={cn(idleCell, className)}
        onClick={() => setEditing(true)}
      >
        {formatted}
      </button>
    );
  }

  return (
    <input
      type="date"
      defaultValue={dateStr}
      onChange={handleChange}
      onBlur={() => setEditing(false)}
      autoFocus
      className={cn(editInput, className)}
    />
  );
}

// ---------------------------------------------------------------------------
// Factory functions
// ---------------------------------------------------------------------------

/**
 * Creates an editable text column.
 * Displays plain text when idle; shows an Input on click.
 */
export function createEditableTextColumn<TData>(
  config: EditableTextColumnConfig<TData>
): DataTableColumnDef<TData> {
  const { accessorKey, title, placeholder, className, enableSorting = true, onCellEdit } = config;

  return {
    accessorKey,
    header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey) as string;
      const rowId = row.id;

      return (
        <EditableTextCell
          value={value}
          rowId={rowId}
          columnId={accessorKey}
          onCellEdit={onCellEdit}
          placeholder={placeholder}
          className={className}
        />
      );
    },
    enableSorting,
  } as DataTableColumnDef<TData>;
}

/**
 * Creates an editable number column.
 * Displays the number as plain text when idle; shows an Input on click.
 */
export function createEditableNumberColumn<TData>(
  config: EditableNumberColumnConfig<TData>
): DataTableColumnDef<TData> {
  const {
    accessorKey,
    title,
    min,
    max,
    step,
    className,
    enableSorting = true,
    onCellEdit,
  } = config;

  return {
    accessorKey,
    header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey) as number;
      const rowId = row.id;

      return (
        <EditableNumberCell
          value={value}
          rowId={rowId}
          columnId={accessorKey}
          onCellEdit={onCellEdit}
          min={min}
          max={max}
          step={step}
          className={className}
        />
      );
    },
    enableSorting,
    meta: {
      align: 'right',
    },
  } as DataTableColumnDef<TData>;
}

/**
 * Creates an editable currency column.
 * Displays formatted currency when idle; shows a raw number input when editing.
 */
export function createEditableCurrencyColumn<TData>(
  config: EditableCurrencyColumnConfig<TData>
): DataTableColumnDef<TData> {
  const {
    accessorKey,
    title,
    currency = 'EUR',
    locale = 'fr-FR',
    className,
    enableSorting = true,
    onCellEdit,
  } = config;

  return {
    accessorKey,
    header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey) as number;
      const rowId = row.id;

      return (
        <EditableCurrencyCell
          value={value}
          rowId={rowId}
          columnId={accessorKey}
          onCellEdit={onCellEdit}
          currency={currency}
          locale={locale}
          className={className}
        />
      );
    },
    enableSorting,
    meta: {
      align: 'right',
    },
  } as DataTableColumnDef<TData>;
}

/**
 * Creates an editable select column.
 * Displays the selected option label when idle; opens a Select on click.
 */
export function createEditableSelectColumn<TData>(
  config: EditableSelectColumnConfig<TData>
): DataTableColumnDef<TData> {
  const { accessorKey, title, options, className, enableSorting = true, onCellEdit } = config;

  return {
    accessorKey,
    header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey) as string;
      const rowId = row.id;

      return (
        <EditableSelectCell
          value={value}
          rowId={rowId}
          columnId={accessorKey}
          onCellEdit={onCellEdit}
          options={options}
          className={className}
        />
      );
    },
    enableSorting,
  } as DataTableColumnDef<TData>;
}

/**
 * Creates an editable date column.
 * Displays a formatted date when idle; shows an Input[type=date] on click.
 */
export function createEditableDateColumn<TData>(
  config: EditableDateColumnConfig<TData>
): DataTableColumnDef<TData> {
  const { accessorKey, title, className, enableSorting = true, onCellEdit } = config;

  return {
    accessorKey,
    header: ({ column }) => <DataTableColumnHeader column={column} title={title} />,
    cell: ({ row }) => {
      const value = row.getValue(accessorKey) as string;
      const rowId = row.id;

      return (
        <EditableDateCell
          value={value}
          rowId={rowId}
          columnId={accessorKey}
          onCellEdit={onCellEdit}
          className={className}
        />
      );
    },
    enableSorting,
  } as DataTableColumnDef<TData>;
}
