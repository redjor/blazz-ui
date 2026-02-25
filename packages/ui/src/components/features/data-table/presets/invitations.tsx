'use client';

/**
 * Invitations preset for DataTable
 *
 * @module presets/invitations
 */

import type { DataTableColumnDef, DataTableView, RowAction, BulkAction } from '../data-table.types';
import type { DataTableDefaultConfig } from '../config/data-table-config';
import { col } from '../factories/col';
import { createStatusViews } from '../factories/view-builders';
import type { Invitation } from '../../../../types/user-management';

export interface InvitationPresetConfig {
  onResend?: (invitation: Invitation) => void | Promise<void>;
  onRevoke?: (invitation: Invitation) => void | Promise<void>;
  onBulkRevoke?: (invitations: Invitation[]) => void | Promise<void>;
}

export interface InvitationPreset {
  columns: DataTableColumnDef<Invitation>[];
  views: DataTableView[];
  rowActions: RowAction<Invitation>[];
  bulkActions: BulkAction<Invitation>[];
  config: Partial<DataTableDefaultConfig>;
}

export function createInvitationPreset(
  options: InvitationPresetConfig = {},
): InvitationPreset {
  const { onResend, onRevoke, onBulkRevoke } = options;

  const statusMap: Record<
    string,
    {
      variant: 'default' | 'secondary' | 'outline' | 'destructive';
      className?: string;
      label?: string;
    }
  > = {
    pending: {
      variant: 'default',
      className: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200',
      label: 'Pending',
    },
    accepted: {
      variant: 'default',
      className: 'bg-green-100 text-green-800 hover:bg-green-100 border-green-200',
      label: 'Accepted',
    },
    expired: {
      variant: 'secondary',
      className: 'bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200',
      label: 'Expired',
    },
    revoked: {
      variant: 'destructive',
      className: 'bg-red-100 text-red-800 hover:bg-red-100 border-red-200',
      label: 'Revoked',
    },
  };

  const columns: DataTableColumnDef<Invitation>[] = [
    col.text<Invitation>('email', {
      title: 'Email',
      placeholder: 'Search by email...',
      showInlineFilter: true,
      defaultInlineFilter: true,
    }),
    col.status<Invitation>('status', {
      title: 'Status',
      statusMap,
      filterOptions: [
        { label: 'Pending', value: 'pending' },
        { label: 'Accepted', value: 'accepted' },
        { label: 'Expired', value: 'expired' },
        { label: 'Revoked', value: 'revoked' },
      ],
      showInlineFilter: true,
      defaultInlineFilter: true,
    }),
    col.date<Invitation>('invitedAt', {
      title: 'Invited Date',
      locale: 'en-US',
      format: { month: 'short', day: 'numeric', year: 'numeric' },
      showInlineFilter: true,
      defaultInlineFilter: false,
    }),
    col.date<Invitation>('expiresAt', {
      title: 'Expiry Date',
      locale: 'en-US',
      format: { month: 'short', day: 'numeric', year: 'numeric' },
      showInlineFilter: false,
      defaultInlineFilter: false,
    }),
    col.text<Invitation>('invitedBy', {
      title: 'Invited By',
      placeholder: 'Search by inviter...',
      showInlineFilter: false,
      defaultInlineFilter: false,
    }),
  ];

  const views = createStatusViews({
    column: 'status',
    statuses: [
      { id: 'pending', name: 'Pending', value: 'pending' },
      { id: 'accepted', name: 'Accepted', value: 'accepted' },
      { id: 'expired', name: 'Expired', value: 'expired' },
      { id: 'revoked', name: 'Revoked', value: 'revoked' },
    ],
    allViewName: 'All',
  });

  const rowActions: RowAction<Invitation>[] = [];

  if (onResend) {
    rowActions.push({
      id: 'resend',
      label: 'Resend',
      handler: (row) => onResend(row.original),
      hidden: (row) => row.original.status !== 'pending' && row.original.status !== 'expired',
    });
  }

  if (onRevoke) {
    rowActions.push({
      id: 'revoke',
      label: 'Revoke',
      handler: (row) => onRevoke(row.original),
      variant: 'destructive',
      hidden: (row) => row.original.status !== 'pending',
      requireConfirmation: true,
      confirmationMessage: (row) =>
        `Are you sure you want to revoke the invitation for ${row.original.email}?`,
    });
  }

  const bulkActions: BulkAction<Invitation>[] = [];

  if (onBulkRevoke) {
    bulkActions.push({
      id: 'bulk-revoke',
      label: 'Revoke selected',
      handler: async (rows) => {
        const invitations = rows.map((r) => r.original);
        await onBulkRevoke(invitations);
      },
      variant: 'destructive',
      requireConfirmation: true,
      confirmationMessage: (count) =>
        `Are you sure you want to revoke ${count} invitation(s)?`,
    });
  }

  const config: Partial<DataTableDefaultConfig> = {
    pagination: {
      defaultPageSize: 25,
      pageSizeOptions: [10, 25, 50, 100],
      showPageInfo: true,
    },
    ui: {
      defaultVariant: 'lined',
      defaultDensity: 'default',
    },
    i18n: {
      defaultLocale: 'en',
    },
  };

  return { columns, views, rowActions, bulkActions, config };
}
