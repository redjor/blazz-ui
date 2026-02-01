"use client"

/**
 * Invitations preset for DataTable
 *
 * Pre-configured columns, views, and actions for invitation management.
 *
 * @module presets/invitations
 */

import type { DataTableColumnDef, DataTableView, RowAction, BulkAction } from "../data-table.types"
import type { DataTableDefaultConfig } from "../config/data-table-config"
import { createTextColumn, createStatusColumn, createDateColumn } from "../factories/column-builders"
import { createStatusViews } from "../factories/view-builders"
import type { Invitation } from "@/types/user-management"

/**
 * Configuration options for Invitations preset
 */
export interface InvitationPresetConfig {
	/** Callback when resending an invitation */
	onResend?: (invitation: Invitation) => void | Promise<void>
	/** Callback when revoking an invitation */
	onRevoke?: (invitation: Invitation) => void | Promise<void>
	/** Callback for bulk revoke */
	onBulkRevoke?: (invitations: Invitation[]) => void | Promise<void>
}

/**
 * Return type for the Invitations preset
 */
export interface InvitationPreset {
	columns: DataTableColumnDef<Invitation>[]
	views: DataTableView[]
	rowActions: RowAction<Invitation>[]
	bulkActions: BulkAction<Invitation>[]
	config: Partial<DataTableDefaultConfig>
}

/**
 * Creates a complete Invitations preset
 *
 * @example
 * ```typescript
 * const preset = createInvitationPreset({
 *   onResend: (invitation) => handleResend(invitation),
 *   onRevoke: (invitation) => handleRevoke(invitation),
 * })
 *
 * <DataTable
 *   data={invitations}
 *   columns={preset.columns}
 *   views={preset.views}
 *   rowActions={preset.rowActions}
 *   bulkActions={preset.bulkActions}
 * />
 * ```
 */
export function createInvitationPreset(
	options: InvitationPresetConfig = {}
): InvitationPreset {
	const { onResend, onRevoke, onBulkRevoke } = options

	// Status mapping for badges
	const statusMap: Record<
		string,
		{
			variant: "default" | "secondary" | "outline" | "destructive"
			className?: string
			label?: string
		}
	> = {
		pending: {
			variant: "default",
			className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
			label: "Pending",
		},
		accepted: {
			variant: "default",
			className: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
			label: "Accepted",
		},
		expired: {
			variant: "secondary",
			className: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200",
			label: "Expired",
		},
		revoked: {
			variant: "destructive",
			className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
			label: "Revoked",
		},
	}

	// Build columns
	const columns: DataTableColumnDef<Invitation>[] = [
		// Email column
		createTextColumn<Invitation>({
			accessorKey: "email",
			title: "Email",
			placeholder: "Search by email...",
			showInlineFilter: true,
			defaultInlineFilter: true,
		}),
		// Status column
		createStatusColumn<Invitation>({
			accessorKey: "status",
			title: "Status",
			statusMap,
			filterOptions: [
				{ label: "Pending", value: "pending" },
				{ label: "Accepted", value: "accepted" },
				{ label: "Expired", value: "expired" },
				{ label: "Revoked", value: "revoked" },
			],
			showInlineFilter: true,
			defaultInlineFilter: true,
		}),
		// Invited Date column
		createDateColumn<Invitation>({
			accessorKey: "invitedAt",
			title: "Invited Date",
			locale: "en-US",
			format: {
				month: "short",
				day: "numeric",
				year: "numeric",
			},
			showInlineFilter: true,
			defaultInlineFilter: false,
		}),
		// Expiry Date column
		createDateColumn<Invitation>({
			accessorKey: "expiresAt",
			title: "Expiry Date",
			locale: "en-US",
			format: {
				month: "short",
				day: "numeric",
				year: "numeric",
			},
			showInlineFilter: false,
			defaultInlineFilter: false,
		}),
		// Invited By column
		createTextColumn<Invitation>({
			accessorKey: "invitedBy",
			title: "Invited By",
			placeholder: "Search by inviter...",
			showInlineFilter: false,
			defaultInlineFilter: false,
		}),
	]

	// Build views
	const views = createStatusViews({
		column: "status",
		statuses: [
			{ id: "pending", name: "Pending", value: "pending" },
			{ id: "accepted", name: "Accepted", value: "accepted" },
			{ id: "expired", name: "Expired", value: "expired" },
			{ id: "revoked", name: "Revoked", value: "revoked" },
		],
		allViewName: "All",
	})

	// Build row actions
	const rowActions: RowAction<Invitation>[] = []

	if (onResend) {
		rowActions.push({
			id: "resend",
			label: "Resend",
			handler: onResend,
			hidden: (row) => row.original.status !== "pending" && row.original.status !== "expired",
		})
	}

	if (onRevoke) {
		rowActions.push({
			id: "revoke",
			label: "Revoke",
			handler: onRevoke,
			variant: "destructive",
			hidden: (row) => row.original.status !== "pending",
			requireConfirmation: true,
			confirmationMessage: (row) => `Are you sure you want to revoke the invitation for ${row.original.email}?`,
		})
	}

	// Build bulk actions
	const bulkActions: BulkAction<Invitation>[] = []

	if (onBulkRevoke) {
		bulkActions.push({
			id: "bulk-revoke",
			label: "Revoke selected",
			handler: async (rows) => {
				const invitations = rows.map(r => r.original)
				await onBulkRevoke(invitations)
			},
			variant: "destructive",
			requireConfirmation: true,
			confirmationMessage: (count) => `Are you sure you want to revoke ${count} invitation(s)?`,
		})
	}

	// Configuration
	const config: Partial<DataTableDefaultConfig> = {
		pagination: {
			defaultPageSize: 25,
			pageSizeOptions: [10, 25, 50, 100],
			showPageInfo: true,
		},
		ui: {
			defaultVariant: "lined",
			defaultDensity: "default",
			emptyStateMessage: "No invitations found",
			loadingMessage: "Loading...",
		},
		i18n: {
			defaultLocale: "en",
			supportedLocales: ["en", "fr"],
		},
	}

	return {
		columns,
		views,
		rowActions,
		bulkActions,
		config,
	}
}
