'use client';

import type { LinearIssue } from '../../../../lib/linear-data';
import type { BulkAction, DataTableColumnDef, DataTableView, RowAction } from '../data-table.types';
import { DataTableColumnHeader } from '../data-table-column-header';
import { col } from '../factories/col';
import { createStatusViews } from '../factories/view-builders';
import { createCRUDActions, createBulkActions } from '../factories/action-builders';

export interface LinearIssuesPresetConfig {
  onView?: (issue: LinearIssue) => void | Promise<void>;
  onEdit?: (issue: LinearIssue) => void | Promise<void>;
  onDelete?: (issue: LinearIssue) => void | Promise<void>;
  onBulkDelete?: (issues: LinearIssue[]) => void | Promise<void>;
}

export interface LinearIssuesPreset {
  columns: DataTableColumnDef<LinearIssue>[];
  views: DataTableView[];
  rowActions: RowAction<LinearIssue>[];
  bulkActions: BulkAction<LinearIssue>[];
}

/* ─── Color Maps ─── */

const priorityColorMap: Record<string, string> = {
  urgent: 'bg-red-500',
  high: 'bg-orange-500',
  medium: 'bg-yellow-500',
  low: 'bg-blue-400',
  none: 'bg-zinc-400',
};

const statusColorMap: Record<string, string> = {
  backlog: 'bg-zinc-400',
  todo: 'bg-zinc-500',
  in_progress: 'bg-yellow-500',
  done: 'bg-green-500',
  cancelled: 'bg-red-400',
};

const labelColorMap: Record<string, string> = {
  backend: 'bg-violet-500',
  frontend: 'bg-sky-500',
  bug: 'bg-red-500',
  migration: 'bg-amber-500',
  Articles: 'bg-emerald-500',
  Clients: 'bg-indigo-500',
  Facturation: 'bg-pink-500',
  notifications: 'bg-teal-500',
  composants: 'bg-cyan-500',
  performance: 'bg-orange-500',
  paiement: 'bg-rose-500',
  'sécurité': 'bg-red-600',
  testing: 'bg-lime-500',
  infra: 'bg-slate-500',
  devops: 'bg-blue-500',
  documentation: 'bg-gray-400',
  cleanup: 'bg-zinc-400',
};

export function createLinearIssuesPreset(config: LinearIssuesPresetConfig = {}): LinearIssuesPreset {
  const { onView, onEdit, onDelete, onBulkDelete } = config;

  const columns: DataTableColumnDef<LinearIssue>[] = [
    // Priority — narrow colored dot only (no label)
    {
      accessorKey: 'priority',
      header: () => null,
      cell: ({ row }) => {
        const value = row.getValue('priority') as string;
        const dotClass = priorityColorMap[value] ?? 'bg-zinc-400';
        return (
          <div className="flex items-center justify-center">
            <span className={`h-3 w-1 shrink-0 rounded-sm ${dotClass}`} />
          </div>
        );
      },
      enableSorting: true,
      enableHiding: false,
      size: 28,
    } as DataTableColumnDef<LinearIssue>,

    // Identifier — monospace style
    {
      accessorKey: 'identifier',
      header: ({ column }) => <DataTableColumnHeader column={column} title="ID" />,
      cell: ({ row }) => (
        <span className="font-mono text-xs text-fg-muted">{row.getValue('identifier')}</span>
      ),
      enableSorting: true,
      size: 90,
    } as DataTableColumnDef<LinearIssue>,

    // Status — small colored circle
    {
      accessorKey: 'status',
      header: () => null,
      cell: ({ row }) => {
        const value = row.getValue('status') as string;
        const dotClass = statusColorMap[value] ?? 'bg-zinc-400';
        return (
          <div className="flex items-center justify-center">
            <span className={`h-3 w-3 shrink-0 rounded-full border border-white/20 ${dotClass}`} />
          </div>
        );
      },
      enableSorting: false,
      size: 32,
    } as DataTableColumnDef<LinearIssue>,

    // Title — main wide column
    col.text<LinearIssue>('title', { title: 'Titre' }),

    // Labels — colored dot badges
    col.tags<LinearIssue>('labels', {
      title: 'Labels',
      variant: 'dot',
      colorMap: labelColorMap,
      max: 3,
      size: 200,
    }),

    // Project
    col.text<LinearIssue>('project', { title: 'Projet', size: 200 }),

    // Assignee — avatar only (small)
    col.user<LinearIssue>('assigneeName', {
      title: 'Assigné',
      avatarKey: 'assigneeAvatar',
      size: 'sm',
      columnSize: 50,
    }),

    // Date — short format "3 fév."
    col.date<LinearIssue>('createdAt', {
      title: 'Créé',
      locale: 'fr-FR',
      format: { month: 'short', day: 'numeric' },
    }),
  ];

  const views = createStatusViews({
    column: 'status',
    statuses: [
      { id: 'backlog', name: 'Backlog', value: 'backlog' },
      { id: 'todo', name: 'Todo', value: 'todo' },
      { id: 'in_progress', name: 'En cours', value: 'in_progress' },
      { id: 'done', name: 'Terminé', value: 'done' },
      { id: 'cancelled', name: 'Annulé', value: 'cancelled' },
    ],
    allViewName: 'Tous',
  });

  const rowActions = createCRUDActions<LinearIssue>({
    onView,
    onEdit,
    onDelete,
    labels: { view: 'Voir', edit: 'Modifier', delete: 'Supprimer' },
  });

  const bulkActions = createBulkActions<LinearIssue>({
    onDelete: onBulkDelete,
    deleteConfirmation: (count) => `Supprimer ${count} issue(s) ?`,
    labels: { delete: 'Supprimer la sélection' },
  });

  return { columns, views, rowActions, bulkActions };
}
