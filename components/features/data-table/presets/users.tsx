"use client"

/**
 * User Management preset for DataTable
 *
 * Pre-configured columns, views, and actions for user management interface.
 * Inspired by Clerk's user management design.
 *
 * @module presets/users
 */

import type { DataTableColumnDef, DataTableView, RowAction, BulkAction } from "../data-table.types"
import type { DataTableDefaultConfig } from "../config/data-table-config"
import { createTextColumn, createStatusColumn, createDateColumn } from "../factories/column-builders"
import { createStatusViews } from "../factories/view-builders"
import type { User } from "@/types/user-management"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

/**
 * Configuration options for User Management preset
 */
export interface UserManagementPresetConfig {
	/** Callback when viewing a user */
	onView?: (user: User) => void | Promise<void>
	/** Callback when editing a user */
	onEdit?: (user: User) => void | Promise<void>
	/** Callback when suspending a user */
	onSuspend?: (user: User) => void | Promise<void>
	/** Callback when deleting a user */
	onDelete?: (user: User) => void | Promise<void>
	/** Callback for bulk suspend */
	onBulkSuspend?: (users: User[]) => void | Promise<void>
	/** Callback for bulk delete */
	onBulkDelete?: (users: User[]) => void | Promise<void>
}

/**
 * Return type for the User Management preset
 */
export interface UserManagementPreset {
	columns: DataTableColumnDef<User>[]
	views: DataTableView[]
	rowActions: RowAction<User>[]
	bulkActions: BulkAction<User>[]
	config: Partial<DataTableDefaultConfig>
}

/**
 * Creates a complete User Management preset
 *
 * @example
 * ```typescript
 * const preset = createUserManagementPreset({
 *   onView: (user) => router.push(`/users/${user.id}`),
 *   onEdit: (user) => router.push(`/users/${user.id}/edit`),
 * })
 *
 * <DataTable
 *   data={users}
 *   columns={preset.columns}
 *   views={preset.views}
 *   rowActions={preset.rowActions}
 *   bulkActions={preset.bulkActions}
 * />
 * ```
 */
export function createUserManagementPreset(
	options: UserManagementPresetConfig = {}
): UserManagementPreset {
	const { onView, onEdit, onSuspend, onDelete, onBulkSuspend, onBulkDelete } = options

	// Status mapping for badges
	const statusMap: Record<
		string,
		{
			variant: "default" | "secondary" | "outline" | "destructive"
			className?: string
			label?: string
		}
	> = {
		active: {
			variant: "default",
			className: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
			label: "Active",
		},
		inactive: {
			variant: "secondary",
			className: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200",
			label: "Inactive",
		},
		suspended: {
			variant: "destructive",
			className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
			label: "Suspended",
		},
		never_active: {
			variant: "outline",
			className: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
			label: "Never Active",
		},
	}

	// Build columns
	const columns: DataTableColumnDef<User>[] = [
		// User column (Avatar + Name + Email)
		{
			accessorKey: "name",
			header: ({ column }) => <span className="text-body-md font-medium">User</span>,
			cell: ({ row }) => {
				const user = row.original
				const initials = `${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()
				return (
					<div className="flex items-center gap-3">
						<Avatar size="default">
							<AvatarFallback>{initials}</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<span className="text-body-md font-medium">{user.name}</span>
							<span className="text-body-sm text-muted-foreground">{user.email}</span>
						</div>
					</div>
				)
			},
			enableSorting: true,
			filterConfig: {
				type: "text",
				placeholder: "Search by name or email...",
				showInlineFilter: true,
				defaultInlineFilter: true,
				filterLabel: "User",
			},
		},
		// Username column
		createTextColumn<User>({
			accessorKey: "username",
			title: "Username",
			placeholder: "Search by username...",
			showInlineFilter: true,
			defaultInlineFilter: false,
			cellRenderer: (value) => <span className="text-body-md text-muted-foreground">@{value}</span>,
		}),
		// Last signed in column
		{
			accessorKey: "lastSignedIn",
			header: ({ column }) => <span className="text-body-md font-medium">Last signed in</span>,
			cell: ({ row }) => {
				const lastSignedIn = row.original.lastSignedIn
				if (!lastSignedIn) {
					return <span className="text-body-md text-muted-foreground">Never</span>
				}
				const date = new Date(lastSignedIn)
				const formatted = date.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				})
				return <span className="text-body-md text-muted-foreground">{formatted}</span>
			},
			enableSorting: true,
			filterConfig: {
				type: "date",
				placeholder: "Filter by last sign in...",
				showInlineFilter: false,
				defaultInlineFilter: false,
				filterLabel: "Last signed in",
			},
		},
		// Joined column
		createDateColumn<User>({
			accessorKey: "createdAt",
			title: "Joined",
			locale: "en-US",
			format: {
				month: "short",
				day: "numeric",
				year: "numeric",
			},
			showInlineFilter: true,
			defaultInlineFilter: false,
		}),
		// Status column
		createStatusColumn<User>({
			accessorKey: "status",
			title: "Status",
			statusMap,
			filterOptions: [
				{ label: "Active", value: "active" },
				{ label: "Inactive", value: "inactive" },
				{ label: "Suspended", value: "suspended" },
				{ label: "Never Active", value: "never_active" },
			],
			showInlineFilter: true,
			defaultInlineFilter: true,
		}),
	]

	// Build views
	const views = createStatusViews({
		column: "status",
		statuses: [
			{ id: "active", name: "Active", value: "active" },
			{ id: "inactive", name: "Inactive", value: "inactive" },
			{ id: "suspended", name: "Suspended", value: "suspended" },
			{ id: "never_active", name: "Never Active", value: "never_active" },
		],
		allViewName: "All",
	})

	// Build row actions
	const rowActions: RowAction<User>[] = []

	if (onView) {
		rowActions.push({
			id: "view",
			label: "View profile",
			handler: onView,
		})
	}

	if (onEdit) {
		rowActions.push({
			id: "edit",
			label: "Edit",
			handler: onEdit,
		})
	}

	if (onSuspend) {
		rowActions.push({
			id: "suspend",
			label: "Suspend",
			handler: onSuspend,
			variant: "destructive",
			hidden: (row) => row.original.status === "suspended",
			requireConfirmation: true,
			confirmationMessage: (row) => `Are you sure you want to suspend ${row.original.name}?`,
		})
	}

	if (onDelete) {
		rowActions.push({
			id: "delete",
			label: "Delete",
			handler: onDelete,
			variant: "destructive",
			requireConfirmation: true,
			confirmationMessage: (row) => `Are you sure you want to delete ${row.original.name}? This action cannot be undone.`,
		})
	}

	// Build bulk actions
	const bulkActions: BulkAction<User>[] = []

	if (onBulkSuspend) {
		bulkActions.push({
			id: "bulk-suspend",
			label: "Suspend selected",
			handler: async (rows) => {
				const users = rows.map(r => r.original)
				await onBulkSuspend(users)
			},
			variant: "destructive",
			requireConfirmation: true,
			confirmationMessage: (count) => `Are you sure you want to suspend ${count} user(s)?`,
		})
	}

	if (onBulkDelete) {
		bulkActions.push({
			id: "bulk-delete",
			label: "Delete selected",
			handler: async (rows) => {
				const users = rows.map(r => r.original)
				await onBulkDelete(users)
			},
			variant: "destructive",
			requireConfirmation: true,
			confirmationMessage: (count) => `Are you sure you want to delete ${count} user(s)? This action cannot be undone.`,
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
			emptyStateMessage: "No users found",
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
