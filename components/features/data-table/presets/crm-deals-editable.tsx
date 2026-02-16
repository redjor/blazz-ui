'use client';

import type { Deal } from '@/lib/sample-data';
import type { DataTableColumnDef } from '../data-table.types';
import { col } from '../factories/col';

export interface EditableDealsPresetConfig {
  onCellEdit: (rowId: string, columnId: string, value: unknown) => void;
}

export function createEditableDealsPreset(config: EditableDealsPresetConfig) {
  const { onCellEdit } = config;

  const columns: DataTableColumnDef<Deal>[] = [
    // title - editable
    col.editableText<Deal>('title', {
      title: 'Titre',
      onCellEdit,
    }),
    // companyName - read-only
    col.text<Deal>('companyName', {
      title: 'Entreprise',
      showInlineFilter: false,
    }),
    // contactName - read-only
    col.text<Deal>('contactName', {
      title: 'Contact',
      showInlineFilter: false,
    }),
    // amount - editable
    col.editableCurrency<Deal>('amount', {
      title: 'Montant',
      currency: 'EUR',
      locale: 'fr-FR',
      onCellEdit,
    }),
    // probability - editable
    col.editableNumber<Deal>('probability', {
      title: 'Probabilité (%)',
      min: 0,
      max: 100,
      onCellEdit,
    }),
    // stage - editable select
    col.editableSelect<Deal>('stage', {
      title: 'Étape',
      options: [
        { label: 'Lead', value: 'lead' },
        { label: 'Qualifié', value: 'qualified' },
        { label: 'Proposition', value: 'proposal' },
        { label: 'Négociation', value: 'negotiation' },
        { label: 'Gagné', value: 'closed_won' },
        { label: 'Perdu', value: 'closed_lost' },
      ],
      onCellEdit,
    }),
  ];

  return { columns };
}
