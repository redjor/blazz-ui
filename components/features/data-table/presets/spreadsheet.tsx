'use client';

import { cn } from '@/lib/utils';
import type { DataTableColumnDef } from '../data-table.types';
import { DataTableColumnHeader } from '../data-table-column-header';
import {
  cellShared,
  createEditableTextColumn,
  createEditableNumberColumn,
  createEditableCurrencyColumn,
  createEditableSelectColumn,
  createEditableDateColumn,
} from '../factories/editable-column-builders';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SpreadsheetColumnDef {
  accessorKey: string;
  title: string;
  type: 'text' | 'number' | 'currency' | 'select' | 'date';
  /** Whether the cell is editable (default: true) */
  editable?: boolean;
  /** Options for 'select' type columns */
  options?: Array<{ label: string; value: string }>;
  /** Currency code for 'currency' type (default: 'EUR') */
  currency?: string;
  /** Locale for 'currency' type (default: 'fr-FR') */
  locale?: string;
  /** Min value for 'number' type */
  min?: number;
  /** Max value for 'number' type */
  max?: number;
  /** Step value for 'number' type */
  step?: number;
  /** Placeholder for 'text' type */
  placeholder?: string;
  /** Enable column sorting (default: true) */
  enableSorting?: boolean;
}

export interface SpreadsheetPresetConfig<_TData> {
  columns: SpreadsheetColumnDef[];
  onCellEdit: (rowId: string, columnId: string, value: unknown) => void;
}

// ---------------------------------------------------------------------------
// Factory
// ---------------------------------------------------------------------------

/**
 * Creates a generic spreadsheet preset from a declarative column definition.
 *
 * Use with `variant="spreadsheet"` and `density="compact"` on DataTable.
 */
export function createSpreadsheetPreset<TData>(
  config: SpreadsheetPresetConfig<TData>
): { columns: DataTableColumnDef<TData>[] } {
  const { columns: colDefs, onCellEdit } = config;

  const columns = colDefs.map((col): DataTableColumnDef<TData> => {
    const editable = col.editable !== false;

    if (!editable) {
      const align = col.type === 'number' || col.type === 'currency' ? 'text-right' : 'text-left';
      return {
        accessorKey: col.accessorKey,
        header: ({ column }) => <DataTableColumnHeader column={column} title={col.title} />,
        cell: ({ row }) => {
          const value = row.getValue(col.accessorKey) as string;
          return (
            <span className={cn(cellShared, align, 'cursor-default')}>
              {value}
            </span>
          );
        },
        enableSorting: col.enableSorting ?? true,
      } as DataTableColumnDef<TData>;
    }

    switch (col.type) {
      case 'text':
        return createEditableTextColumn<TData>({
          accessorKey: col.accessorKey,
          title: col.title,
          placeholder: col.placeholder,
          enableSorting: col.enableSorting,
          onCellEdit,
        });

      case 'number':
        return createEditableNumberColumn<TData>({
          accessorKey: col.accessorKey,
          title: col.title,
          min: col.min,
          max: col.max,
          step: col.step,
          enableSorting: col.enableSorting,
          onCellEdit,
        });

      case 'currency':
        return createEditableCurrencyColumn<TData>({
          accessorKey: col.accessorKey,
          title: col.title,
          currency: col.currency,
          locale: col.locale,
          enableSorting: col.enableSorting,
          onCellEdit,
        });

      case 'select':
        return createEditableSelectColumn<TData>({
          accessorKey: col.accessorKey,
          title: col.title,
          options: col.options ?? [],
          enableSorting: col.enableSorting,
          onCellEdit,
        });

      case 'date':
        return createEditableDateColumn<TData>({
          accessorKey: col.accessorKey,
          title: col.title,
          enableSorting: col.enableSorting,
          onCellEdit,
        });
    }
  });

  return { columns };
}
