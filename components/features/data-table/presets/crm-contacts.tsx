'use client';

/**
 * CRM Contacts preset for DataTable
 *
 * Pre-configured columns, views, and actions for contact management.
 * Uses Forge CRM Contact type from sample-data.
 *
 * @module presets/crm-contacts
 */

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import type { Contact } from '@/lib/sample-data';
import type { BulkAction, DataTableColumnDef, DataTableView, RowAction } from '../data-table.types';
import { DataTableColumnHeader } from '../data-table-column-header';
import {
  createTextColumn,
  createStatusColumn,
} from '../factories/column-builders';
import { createStatusViews } from '../factories/view-builders';
import { createCRUDActions, createBulkActions } from '../factories/action-builders';

/**
 * Configuration options for Contacts preset
 */
export interface ContactsPresetConfig {
  onView?: (contact: Contact) => void | Promise<void>;
  onEdit?: (contact: Contact) => void | Promise<void>;
  onArchive?: (contact: Contact) => void | Promise<void>;
  onBulkArchive?: (contacts: Contact[]) => void | Promise<void>;
  onBulkDelete?: (contacts: Contact[]) => void | Promise<void>;
}

/**
 * Return type for the Contacts preset
 */
export interface ContactsPreset {
  columns: DataTableColumnDef<Contact>[];
  views: DataTableView[];
  rowActions: RowAction<Contact>[];
  bulkActions: BulkAction<Contact>[];
}

/**
 * Creates a complete Contacts preset for the Forge CRM DataTable.
 *
 * @example
 * ```typescript
 * const { columns, views, rowActions } = createContactsPreset({
 *   onView: (contact) => router.push(`/contacts/${contact.id}`),
 *   onEdit: (contact) => router.push(`/contacts/${contact.id}/edit`),
 *   onArchive: async (contact) => await archiveContact(contact.id),
 * });
 * ```
 */
export function createContactsPreset(config: ContactsPresetConfig = {}): ContactsPreset {
  const { onView, onEdit, onArchive, onBulkArchive, onBulkDelete } = config;

  const columns: DataTableColumnDef<Contact>[] = [
    {
      accessorKey: 'lastName',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
      cell: ({ row }) => {
        const firstName = row.original.firstName;
        const lastName = row.original.lastName;
        return (
          <Link
            href={`/contacts/${row.original.id}`}
            className="font-medium text-fg hover:underline"
          >
            {firstName} {lastName}
          </Link>
        );
      },
      enableSorting: true,
      filterConfig: {
        type: 'text',
        placeholder: 'Rechercher par nom...',
        showInlineFilter: true,
        defaultInlineFilter: false,
        filterLabel: 'Nom',
      },
    } as DataTableColumnDef<Contact>,
    createTextColumn<Contact>({
      accessorKey: 'email',
      title: 'Email',
      placeholder: 'Rechercher par email...',
      showInlineFilter: true,
      defaultInlineFilter: false,
    }),
    createTextColumn<Contact>({
      accessorKey: 'jobTitle',
      title: 'Poste',
      showInlineFilter: false,
    }),
    createTextColumn<Contact>({
      accessorKey: 'companyName',
      title: 'Entreprise',
      showInlineFilter: true,
      defaultInlineFilter: false,
      cellRenderer: (_value, row) => (
        <Link
          href={`/companies/${row.companyId}`}
          className="text-fg hover:underline"
        >
          {row.companyName}
        </Link>
      ),
    }),
    createTextColumn<Contact>({
      accessorKey: 'phone',
      title: 'T\u00e9l\u00e9phone',
      showInlineFilter: false,
    }),
    {
      accessorKey: 'isPrimary',
      header: ({ column }) => <DataTableColumnHeader column={column} title="Principal" />,
      cell: ({ row }) => {
        const isPrimary = row.getValue('isPrimary') as boolean;
        if (!isPrimary) return null;
        return <Badge variant="info">Principal</Badge>;
      },
      enableSorting: true,
    } as DataTableColumnDef<Contact>,
    createStatusColumn<Contact>({
      accessorKey: 'status',
      title: 'Statut',
      statusMap: {
        active: { variant: 'success', label: 'Actif' },
        inactive: { variant: 'secondary', label: 'Inactif' },
        archived: { variant: 'outline', label: 'Archiv\u00e9' },
      },
      filterOptions: [
        { label: 'Actif', value: 'active' },
        { label: 'Inactif', value: 'inactive' },
        { label: 'Archiv\u00e9', value: 'archived' },
      ],
      showInlineFilter: true,
      defaultInlineFilter: true,
    }),
  ];

  const views = createStatusViews({
    column: 'status',
    statuses: [
      { id: 'active', name: 'Actifs', value: 'active' },
      { id: 'inactive', name: 'Inactifs', value: 'inactive' },
      { id: 'archived', name: 'Archiv\u00e9s', value: 'archived' },
    ],
    allViewName: 'Tous',
  });

  const rowActions = createCRUDActions<Contact>({
    onView,
    onEdit,
    onArchive,
    archiveConfirmation: (row) =>
      `\u00cates-vous s\u00fbr de vouloir archiver ${row.original.firstName} ${row.original.lastName} ?`,
    hideArchive: (row) => row.original.status === 'archived',
    labels: {
      view: 'Voir',
      edit: 'Modifier',
      archive: 'Archiver',
    },
  });

  const bulkActions = createBulkActions<Contact>({
    onArchive: onBulkArchive,
    onDelete: onBulkDelete,
    archiveConfirmation: (count) =>
      `Êtes-vous sûr de vouloir archiver ${count} contact(s) ?`,
    deleteConfirmation: (count) =>
      `Êtes-vous sûr de vouloir supprimer ${count} contact(s) ?`,
    labels: {
      archive: 'Archiver la sélection',
      delete: 'Supprimer la sélection',
    },
  });

  return { columns, views, rowActions, bulkActions };
}
