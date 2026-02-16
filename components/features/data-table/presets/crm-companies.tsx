'use client';

/**
 * CRM Companies preset for DataTable
 *
 * Pre-configured columns, views, and actions for company management.
 * Uses Forge CRM Company type from sample-data.
 *
 * @module presets/crm-companies
 */

import Link from 'next/link';
import type { Company } from '@/lib/sample-data';
import type { BulkAction, DataTableColumnDef, DataTableView, RowAction } from '../data-table.types';
import {
  createTextColumn,
  createStatusColumn,
  createSelectColumn,
  createCurrencyColumn,
  createDateColumn,
} from '../factories/column-builders';
import { createStatusViews } from '../factories/view-builders';
import { createCRUDActions, createBulkActions } from '../factories/action-builders';

/**
 * Configuration options for Companies preset
 */
export interface CompaniesPresetConfig {
  onView?: (company: Company) => void | Promise<void>;
  onEdit?: (company: Company) => void | Promise<void>;
  onArchive?: (company: Company) => void | Promise<void>;
  onDelete?: (company: Company) => void | Promise<void>;
  onBulkArchive?: (companies: Company[]) => void | Promise<void>;
  onBulkDelete?: (companies: Company[]) => void | Promise<void>;
}

/**
 * Return type for the Companies preset
 */
export interface CompaniesPreset {
  columns: DataTableColumnDef<Company>[];
  views: DataTableView[];
  rowActions: RowAction<Company>[];
  bulkActions: BulkAction<Company>[];
}

/**
 * Industry options for select filter
 */
const industryOptions = [
  { label: 'Technologie', value: 'Technologie' },
  { label: 'Finance', value: 'Finance' },
  { label: 'Sant\u00e9', value: 'Sant\u00e9' },
  { label: 'Industrie', value: 'Industrie' },
  { label: 'Services', value: 'Services' },
  { label: 'Commerce', value: 'Commerce' },
  { label: '\u00c9ducation', value: '\u00c9ducation' },
];

/**
 * Creates a complete Companies preset for the Forge CRM DataTable.
 *
 * @example
 * ```typescript
 * const { columns, views, rowActions, bulkActions } = createCompaniesPreset({
 *   onView: (company) => router.push(`/companies/${company.id}`),
 *   onEdit: (company) => router.push(`/companies/${company.id}/edit`),
 *   onArchive: async (company) => await archiveCompany(company.id),
 *   onDelete: async (company) => await deleteCompany(company.id),
 *   onBulkArchive: async (companies) => await bulkArchive(companies.map(c => c.id)),
 * });
 * ```
 */
export function createCompaniesPreset(config: CompaniesPresetConfig = {}): CompaniesPreset {
  const { onView, onEdit, onArchive, onDelete, onBulkArchive, onBulkDelete } = config;

  const columns: DataTableColumnDef<Company>[] = [
    createTextColumn<Company>({
      accessorKey: 'name',
      title: 'Entreprise',
      placeholder: 'Rechercher par nom...',
      showInlineFilter: true,
      defaultInlineFilter: false,
      cellRenderer: (_value, row) => (
        <Link
          href={`/companies/${row.id}`}
          className="font-medium text-fg hover:underline"
        >
          {row.name}
        </Link>
      ),
    }),
    createSelectColumn<Company>({
      accessorKey: 'industry',
      title: 'Secteur',
      options: industryOptions,
      showInlineFilter: true,
      defaultInlineFilter: false,
    }),
    createTextColumn<Company>({
      accessorKey: 'city',
      title: 'Ville',
      showInlineFilter: false,
    }),
    createCurrencyColumn<Company>({
      accessorKey: 'revenue',
      title: 'Chiffre d\u2019affaires',
      currency: 'EUR',
      locale: 'fr-FR',
      showInlineFilter: true,
      defaultInlineFilter: false,
    }),
    createStatusColumn<Company>({
      accessorKey: 'status',
      title: 'Statut',
      statusMap: {
        prospect: { variant: 'warning', label: 'Prospect' },
        active: { variant: 'success', label: 'Actif' },
        inactive: { variant: 'secondary', label: 'Inactif' },
        churned: { variant: 'destructive', label: 'Perdu' },
      },
      filterOptions: [
        { label: 'Prospect', value: 'prospect' },
        { label: 'Actif', value: 'active' },
        { label: 'Inactif', value: 'inactive' },
        { label: 'Perdu', value: 'churned' },
      ],
      showInlineFilter: true,
      defaultInlineFilter: true,
    }),
    createTextColumn<Company>({
      accessorKey: 'assignedTo',
      title: 'Responsable',
      showInlineFilter: false,
    }),
    createDateColumn<Company>({
      accessorKey: 'createdAt',
      title: 'Cr\u00e9\u00e9 le',
      locale: 'fr-FR',
      showInlineFilter: false,
    }),
  ];

  const views = createStatusViews({
    column: 'status',
    statuses: [
      { id: 'active', name: 'Actifs', value: 'active' },
      { id: 'prospect', name: 'Prospects', value: 'prospect' },
      { id: 'inactive', name: 'Inactifs', value: 'inactive' },
    ],
    allViewName: 'Tous',
  });

  const rowActions = createCRUDActions<Company>({
    onView,
    onEdit,
    onArchive,
    onDelete,
    archiveConfirmation: (row) =>
      `\u00cates-vous s\u00fbr de vouloir archiver ${row.original.name} ?`,
    deleteConfirmation: (row) =>
      `\u00cates-vous s\u00fbr de vouloir supprimer ${row.original.name} ?`,
    labels: {
      view: 'Voir',
      edit: 'Modifier',
      archive: 'Archiver',
      delete: 'Supprimer',
    },
  });

  const bulkActions = createBulkActions<Company>({
    onArchive: onBulkArchive,
    onDelete: onBulkDelete,
    archiveConfirmation: (count) =>
      `\u00cates-vous s\u00fbr de vouloir archiver ${count} entreprise(s) ?`,
    deleteConfirmation: (count) =>
      `\u00cates-vous s\u00fbr de vouloir supprimer ${count} entreprise(s) ?`,
    labels: {
      archive: 'Archiver la s\u00e9lection',
      delete: 'Supprimer la s\u00e9lection',
    },
  });

  return { columns, views, rowActions, bulkActions };
}
