'use client';

import type { Job } from '../../../../lib/talentflow-data';
import type { BulkAction, DataTableColumnDef, DataTableView, RowAction } from '../data-table.types';
import { DataTableColumnHeader } from '../data-table-column-header';
import {
  createTextColumn,
  createStatusColumn,
} from '../factories/column-builders';
import { createStatusViews } from '../factories/view-builders';
import { createCRUDActions, createBulkActions } from '../factories/action-builders';

export interface JobsPresetConfig {
  onView?: (job: Job) => void | Promise<void>;
  onEdit?: (job: Job) => void | Promise<void>;
  onBulkArchive?: (jobs: Job[]) => void | Promise<void>;
  onBulkDelete?: (jobs: Job[]) => void | Promise<void>;
}

export interface JobsPreset {
  columns: DataTableColumnDef<Job>[];
  views: DataTableView[];
  rowActions: RowAction<Job>[];
  bulkActions: BulkAction<Job>[];
}

export function createJobsPreset(config: JobsPresetConfig = {}): JobsPreset {
  const { onView, onEdit, onBulkArchive, onBulkDelete } = config;

  const columns: DataTableColumnDef<Job>[] = [
    {
      accessorKey: 'title',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Poste" />,
      cell: ({ row }) => (
        <span className="font-medium text-fg">{row.getValue('title')}</span>
      ),
      enableSorting: true,
      filterConfig: {
        type: 'text',
        placeholder: 'Rechercher un poste...',
        showInlineFilter: true,
        defaultInlineFilter: false,
        filterLabel: 'Poste',
      },
    } as DataTableColumnDef<Job>,
    createTextColumn<Job>({
      accessorKey: 'department',
      title: 'Département',
      showInlineFilter: true,
      defaultInlineFilter: false,
    }),
    createTextColumn<Job>({
      accessorKey: 'location',
      title: 'Lieu',
      showInlineFilter: false,
    }),
    {
      accessorKey: 'candidateCount',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Candidats" />,
      cell: ({ row }) => {
        const count = row.getValue('candidateCount') as number;
        return <span className="tabular-nums">{count}</span>;
      },
      enableSorting: true,
    } as DataTableColumnDef<Job>,
    createStatusColumn<Job>({
      accessorKey: 'status',
      title: 'Statut',
      statusMap: {
        open: { variant: 'success', label: 'Ouvert' },
        closed: { variant: 'secondary', label: 'Fermé' },
        draft: { variant: 'outline', label: 'Brouillon' },
      },
      filterOptions: [
        { label: 'Ouvert', value: 'open' },
        { label: 'Fermé', value: 'closed' },
        { label: 'Brouillon', value: 'draft' },
      ],
      showInlineFilter: true,
      defaultInlineFilter: true,
    }),
    createTextColumn<Job>({
      accessorKey: 'publishedAt',
      title: 'Publié le',
      showInlineFilter: false,
    }),
  ];

  const views = createStatusViews({
    column: 'status',
    statuses: [
      { id: 'open', name: 'Ouvertes', value: 'open' },
      { id: 'closed', name: 'Fermées', value: 'closed' },
      { id: 'draft', name: 'Brouillons', value: 'draft' },
    ],
    allViewName: 'Toutes',
  });

  const rowActions = createCRUDActions<Job>({
    onView,
    onEdit,
    labels: { view: 'Voir', edit: 'Modifier' },
  });

  const bulkActions = createBulkActions<Job>({
    onArchive: onBulkArchive,
    onDelete: onBulkDelete,
    archiveConfirmation: (count) => `Archiver ${count} offre(s) ?`,
    deleteConfirmation: (count) => `Supprimer ${count} offre(s) ?`,
    labels: {
      archive: 'Archiver la sélection',
      delete: 'Supprimer la sélection',
    },
  });

  return { columns, views, rowActions, bulkActions };
}
