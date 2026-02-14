'use client';

import type { Deal } from '@/lib/sample-data';
import type { DataTableColumnDef } from '../data-table.types';
import { createTextColumn } from '../factories/column-builders';
import {
  createEditableTextColumn,
  createEditableNumberColumn,
  createEditableCurrencyColumn,
  createEditableSelectColumn,
} from '../factories/editable-column-builders';

export interface EditableDealsPresetConfig {
  onCellEdit: (rowId: string, columnId: string, value: unknown) => void;
}

export function createEditableDealsPreset(config: EditableDealsPresetConfig) {
  const { onCellEdit } = config;

  const columns: DataTableColumnDef<Deal>[] = [
    // title - editable
    createEditableTextColumn<Deal>({
      accessorKey: 'title',
      title: 'Titre',
      onCellEdit,
    }),
    // companyName - read-only
    createTextColumn<Deal>({
      accessorKey: 'companyName',
      title: 'Entreprise',
      showInlineFilter: false,
    }),
    // contactName - read-only
    createTextColumn<Deal>({
      accessorKey: 'contactName',
      title: 'Contact',
      showInlineFilter: false,
    }),
    // amount - editable
    createEditableCurrencyColumn<Deal>({
      accessorKey: 'amount',
      title: 'Montant',
      currency: 'EUR',
      locale: 'fr-FR',
      onCellEdit,
    }),
    // probability - editable
    createEditableNumberColumn<Deal>({
      accessorKey: 'probability',
      title: 'Probabilit\u00e9 (%)',
      min: 0,
      max: 100,
      onCellEdit,
    }),
    // stage - editable select
    createEditableSelectColumn<Deal>({
      accessorKey: 'stage',
      title: '\u00c9tape',
      options: [
        { label: 'Lead', value: 'lead' },
        { label: 'Qualifi\u00e9', value: 'qualified' },
        { label: 'Proposition', value: 'proposal' },
        { label: 'N\u00e9gociation', value: 'negotiation' },
        { label: 'Gagn\u00e9', value: 'closed_won' },
        { label: 'Perdu', value: 'closed_lost' },
      ],
      onCellEdit,
    }),
  ];

  return { columns };
}
