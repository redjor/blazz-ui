'use client';

/**
 * CRM Deals preset for DataTable
 *
 * Pre-configured columns, views, and actions for deal/pipeline management.
 * Uses Forge CRM Deal type from sample-data.
 *
 * @module presets/crm-deals
 */

import Link from 'next/link';
import { ArrowRightLeft } from 'lucide-react';
import type { Deal } from '@/lib/sample-data';
import type { BulkAction, DataTableColumnDef, DataTableView, RowAction } from '../data-table.types';
import {
  createTextColumn,
  createStatusColumn,
  createCurrencyColumn,
  createNumericColumn,
  createSelectColumn,
  createDateColumn,
} from '../factories/column-builders';
import { createStatusViews } from '../factories/view-builders';
import { createCustomView } from '../factories/view-builders';
import { createCRUDActions, createCustomRowAction, createBulkActions } from '../factories/action-builders';

/**
 * Configuration options for Deals preset
 */
export interface DealsPresetConfig {
  onView?: (deal: Deal) => void | Promise<void>;
  onEdit?: (deal: Deal) => void | Promise<void>;
  onDelete?: (deal: Deal) => void | Promise<void>;
  onChangeStage?: (deal: Deal) => void | Promise<void>;
  onBulkArchive?: (deals: Deal[]) => void | Promise<void>;
  onBulkDelete?: (deals: Deal[]) => void | Promise<void>;
}

/**
 * Return type for the Deals preset
 */
export interface DealsPreset {
  columns: DataTableColumnDef<Deal>[];
  views: DataTableView[];
  rowActions: RowAction<Deal>[];
  bulkActions: BulkAction<Deal>[];
}

/**
 * Source options for select filter
 */
const sourceOptions = [
  { label: 'Website', value: 'Website' },
  { label: 'Referral', value: 'Referral' },
  { label: 'LinkedIn', value: 'LinkedIn' },
  { label: 'Salon', value: 'Salon' },
  { label: 'Cold Call', value: 'Cold Call' },
  { label: 'Partenaire', value: 'Partenaire' },
];

/**
 * Creates a complete Deals preset for the Forge CRM DataTable.
 *
 * @example
 * ```typescript
 * const { columns, views, rowActions, bulkActions } = createDealsPreset({
 *   onView: (deal) => router.push(`/deals/${deal.id}`),
 *   onEdit: (deal) => router.push(`/deals/${deal.id}/edit`),
 *   onChangeStage: (deal) => openStageModal(deal),
 *   onBulkArchive: async (deals) => await bulkArchive(deals.map(d => d.id)),
 * });
 * ```
 */
export function createDealsPreset(config: DealsPresetConfig = {}): DealsPreset {
  const { onView, onEdit, onDelete, onChangeStage, onBulkArchive, onBulkDelete } = config;

  const columns: DataTableColumnDef<Deal>[] = [
    createTextColumn<Deal>({
      accessorKey: 'title',
      title: 'Opportunit\u00e9',
      placeholder: 'Rechercher par titre...',
      showInlineFilter: true,
      defaultInlineFilter: false,
      cellRenderer: (_value, row) => (
        <Link
          href={`/deals/${row.id}`}
          className="font-medium text-foreground hover:underline"
        >
          {row.title}
        </Link>
      ),
    }),
    createTextColumn<Deal>({
      accessorKey: 'companyName',
      title: 'Entreprise',
      showInlineFilter: false,
    }),
    createTextColumn<Deal>({
      accessorKey: 'contactName',
      title: 'Contact',
      showInlineFilter: false,
    }),
    createCurrencyColumn<Deal>({
      accessorKey: 'amount',
      title: 'Montant',
      currency: 'EUR',
      locale: 'fr-FR',
      showInlineFilter: true,
      defaultInlineFilter: false,
    }),
    createNumericColumn<Deal>({
      accessorKey: 'probability',
      title: 'Probabilit\u00e9',
      formatter: (value) => `${value}%`,
      align: 'right',
      showInlineFilter: false,
    }),
    createStatusColumn<Deal>({
      accessorKey: 'stage',
      title: '\u00c9tape',
      statusMap: {
        lead: { variant: 'secondary', label: 'Lead' },
        qualified: { variant: 'info', label: 'Qualifi\u00e9' },
        proposal: { variant: 'warning', label: 'Proposition' },
        negotiation: { variant: 'primary', label: 'N\u00e9gociation' },
        closed_won: { variant: 'success', label: 'Gagn\u00e9' },
        closed_lost: { variant: 'destructive', label: 'Perdu' },
      },
      filterOptions: [
        { label: 'Lead', value: 'lead' },
        { label: 'Qualifi\u00e9', value: 'qualified' },
        { label: 'Proposition', value: 'proposal' },
        { label: 'N\u00e9gociation', value: 'negotiation' },
        { label: 'Gagn\u00e9', value: 'closed_won' },
        { label: 'Perdu', value: 'closed_lost' },
      ],
      showInlineFilter: true,
      defaultInlineFilter: true,
    }),
    createSelectColumn<Deal>({
      accessorKey: 'source',
      title: 'Source',
      options: sourceOptions,
      showInlineFilter: true,
      defaultInlineFilter: false,
    }),
    createTextColumn<Deal>({
      accessorKey: 'assignedTo',
      title: 'Responsable',
      showInlineFilter: false,
    }),
    createDateColumn<Deal>({
      accessorKey: 'expectedCloseDate',
      title: 'Cl\u00f4ture pr\u00e9vue',
      locale: 'fr-FR',
      showInlineFilter: false,
    }),
  ];

  const statusViews = createStatusViews({
    column: 'stage',
    statuses: [
      { id: 'lead', name: 'Lead', value: 'lead' },
      { id: 'qualified', name: 'Qualifi\u00e9', value: 'qualified' },
      { id: 'proposal', name: 'Proposition', value: 'proposal' },
      { id: 'negotiation', name: 'N\u00e9gociation', value: 'negotiation' },
      { id: 'closed_won', name: 'Gagn\u00e9s', value: 'closed_won' },
      { id: 'closed_lost', name: 'Perdus', value: 'closed_lost' },
    ],
    allViewName: 'Tous',
  });

  const enCoursView = createCustomView({
    id: 'en-cours',
    name: 'En cours',
    isSystem: true,
    conditions: [
      { column: 'stage', operator: 'equals', value: 'lead', type: 'select' },
      { column: 'stage', operator: 'equals', value: 'qualified', type: 'select' },
      { column: 'stage', operator: 'equals', value: 'proposal', type: 'select' },
      { column: 'stage', operator: 'equals', value: 'negotiation', type: 'select' },
    ],
    operator: 'OR',
  });

  // Build final views: Tous, En cours, then individual stage views (excluding "all" from statusViews)
  const [allView, ...individualViews] = statusViews;
  const views: DataTableView[] = [allView, enCoursView, ...individualViews];

  const crudActions = createCRUDActions<Deal>({
    onView,
    onEdit,
    onDelete,
    deleteConfirmation: (row) =>
      `\u00cates-vous s\u00fbr de vouloir supprimer l\u2019opportunit\u00e9 "${row.original.title}" ?`,
    labels: {
      view: 'Voir',
      edit: 'Modifier',
      delete: 'Supprimer',
    },
  });

  const changeStageAction = onChangeStage
    ? [
        createCustomRowAction<Deal>({
          id: 'change-stage',
          label: 'Changer \u00e9tape',
          icon: ArrowRightLeft,
          handler: onChangeStage,
          separator: true,
        }),
      ]
    : [];

  const rowActions: RowAction<Deal>[] = [...crudActions, ...changeStageAction];

  const bulkActions = createBulkActions<Deal>({
    onArchive: onBulkArchive,
    onDelete: onBulkDelete,
    archiveConfirmation: (count) =>
      `\u00cates-vous s\u00fbr de vouloir archiver ${count} opportunit\u00e9(s) ?`,
    deleteConfirmation: (count) =>
      `\u00cates-vous s\u00fbr de vouloir supprimer ${count} opportunit\u00e9(s) ?`,
    labels: {
      archive: 'Archiver la s\u00e9lection',
      delete: 'Supprimer la s\u00e9lection',
    },
  });

  return { columns, views, rowActions, bulkActions };
}
