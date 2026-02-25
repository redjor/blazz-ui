'use client';

import { Badge } from '../../../ui/badge';
import type { StockMovement } from '../../../../lib/stockbase-data';
import type { DataTableColumnDef, DataTableView, RowAction } from '../data-table.types';
import { DataTableColumnHeader } from '../data-table-column-header';
import { col } from '../factories/col';
import { createStatusViews } from '../factories/view-builders';
import { createCRUDActions } from '../factories/action-builders';

export interface MovementsPresetConfig {
  onView?: (movement: StockMovement) => void | Promise<void>;
}

export interface MovementsPreset {
  columns: DataTableColumnDef<StockMovement>[];
  views: DataTableView[];
  rowActions: RowAction<StockMovement>[];
}

const movementTypeMap: Record<string, { variant: 'success' | 'destructive' | 'info' | 'warning'; label: string }> = {
  entry: { variant: 'success', label: 'Entree' },
  exit: { variant: 'destructive', label: 'Sortie' },
  transfer: { variant: 'info', label: 'Transfert' },
  adjustment: { variant: 'warning', label: 'Ajustement' },
};

export function createMovementsPreset(config: MovementsPresetConfig = {}): MovementsPreset {
  const { onView } = config;

  const columns: DataTableColumnDef<StockMovement>[] = [
    col.text<StockMovement>('date', {
      title: 'Date',
    }),
    {
      accessorKey: 'itemName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Article" />,
      cell: ({ row }) => (
        <div className="flex flex-col gap-0.5">
          <span className="font-medium text-fg">{row.original.itemName}</span>
          <span className="text-xs text-fg-muted font-mono">{row.original.sku}</span>
        </div>
      ),
      enableSorting: true,
      filterConfig: {
        type: 'text',
        placeholder: 'Rechercher par article...',
        showInlineFilter: true,
        defaultInlineFilter: false,
        filterLabel: 'Article',
      },
    } as DataTableColumnDef<StockMovement>,
    {
      accessorKey: 'type',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Type" />,
      cell: ({ row }) => {
        const type = row.getValue('type') as string;
        const mapping = movementTypeMap[type];
        if (!mapping) return type;
        return <Badge variant={mapping.variant}>{mapping.label}</Badge>;
      },
      enableSorting: true,
      filterConfig: {
        type: 'select',
        options: [
          { label: 'Entree', value: 'entry' },
          { label: 'Sortie', value: 'exit' },
          { label: 'Transfert', value: 'transfer' },
          { label: 'Ajustement', value: 'adjustment' },
        ],
        showInlineFilter: true,
        defaultInlineFilter: true,
        filterLabel: 'Type',
      },
    } as DataTableColumnDef<StockMovement>,
    {
      accessorKey: 'quantity',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Quantite" />,
      cell: ({ row }) => {
        const qty = row.getValue('quantity') as number;
        const isPositive = qty > 0;
        return (
          <span className={isPositive ? 'text-green-600 dark:text-green-400 font-medium tabular-nums' : 'text-red-600 dark:text-red-400 font-medium tabular-nums'}>
            {isPositive ? `+${qty}` : qty}
          </span>
        );
      },
      enableSorting: true,
    } as DataTableColumnDef<StockMovement>,
    col.text<StockMovement>('fromLocation', {
      title: 'Depuis',
    }),
    col.text<StockMovement>('toLocation', {
      title: 'Vers',
    }),
    col.text<StockMovement>('performedBy', {
      title: 'Par',
    }),
  ];

  const views = createStatusViews({
    column: 'type',
    statuses: [
      { id: 'entry', name: 'Entrees', value: 'entry' },
      { id: 'exit', name: 'Sorties', value: 'exit' },
      { id: 'transfer', name: 'Transferts', value: 'transfer' },
    ],
    allViewName: 'Tous',
  });

  const rowActions = createCRUDActions<StockMovement>({
    onView,
    labels: { view: 'Voir le detail' },
  });

  return { columns, views, rowActions };
}
