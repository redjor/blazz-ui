"use client"

/**
 * User Management preset for DataTable
 *
 * @module presets/users
 */

import { Avatar, AvatarFallback } from "@blazz/ui/components/ui/avatar"
import type { User } from "@/types/user-management"
import type { DataTableDefaultConfig } from "../config/data-table-config"
import type { BulkAction, DataTableColumnDef, DataTableView, RowAction } from "../data-table.types"
import { col } from "../factories/col"
import { createStatusViews } from "../factories/view-builders"

export interface UserManagementPresetConfig {
	onView?: (user: User) => void | Promise<void>
	onEdit?: (user: User) => void | Promise<void>
	onSuspend?: (user: User) => void | Promise<void>
	onDelete?: (user: User) => void | Promise<void>
	onBulkSuspend?: (users: User[]) => void | Promise<void>
	onBulkDelete?: (users: User[]) => void | Promise<void>
}

export interface UserManagementPreset {
	columns: DataTableColumnDef<User>[]
	views: DataTableView[]
	rowActions: RowAction<User>[]
	bulkActions: BulkAction<User>[]
	config: Partial<DataTableDefaultConfig>
}

export function createUserManagementPreset(
	options: UserManagementPresetConfig = {}
): UserManagementPreset {
	const { onView, onEdit, onSuspend, onDelete, onBulkSuspend, onBulkDelete } = options

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

	const columns: DataTableColumnDef<User>[] = [
		{
			accessorKey: "name",
			header: () => <span className="text-body-md font-medium">User</span>,
			cell: ({ row }) => {
				const user = row.original
				const initials =
					`${user.firstName?.charAt(0) || ""}${user.lastName?.charAt(0) || ""}`.toUpperCase()
				return (
					<div className="flex items-center gap-3">
						<Avatar size="default">
							<AvatarFallback>{initials}</AvatarFallback>
						</Avatar>
						<div className="flex flex-col">
							<span className="text-body-md font-medium">{user.name}</span>
							<span className="text-body-sm text-fg-muted">{user.email}</span>
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
		col.text<User>("username", {
			title: "Username",
			placeholder: "Search by username...",
			showInlineFilter: true,
			defaultInlineFilter: false,
			cellRenderer: (value) => <span className="text-body-md text-fg-muted">@{value}</span>,
		}),
		{
			accessorKey: "lastSignedIn",
			header: () => <span className="text-body-md font-medium">Last signed in</span>,
			cell: ({ row }) => {
				const lastSignedIn = row.original.lastSignedIn
				if (!lastSignedIn) {
					return <span className="text-body-md text-fg-muted">Never</span>
				}
				const date = new Date(lastSignedIn)
				const formatted = date.toLocaleDateString("en-US", {
					month: "short",
					day: "numeric",
					year: "numeric",
				})
				return <span className="text-body-md text-fg-muted">{formatted}</span>
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
		col.date<User>("createdAt", {
			title: "Joined",
			locale: "en-US",
			format: { month: "short", day: "numeric", year: "numeric" },
			showInlineFilter: true,
			defaultInlineFilter: false,
		}),
		col.status<User>("status", {
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

	const rowActions: RowAction<User>[] = []

	if (onView) {
		rowActions.push({
			id: "view",
			label: "View profile",
			handler: (row) => onView(row.original),
		})
	}

	if (onEdit) {
		rowActions.push({
			id: "edit",
			label: "Edit",
			handler: (row) => onEdit(row.original),
		})
	}

	if (onSuspend) {
		rowActions.push({
			id: "suspend",
			label: "Suspend",
			handler: (row) => onSuspend(row.original),
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
			handler: (row) => onDelete(row.original),
			variant: "destructive",
			requireConfirmation: true,
			confirmationMessage: (row) =>
				`Are you sure you want to delete ${row.original.name}? This action cannot be undone.`,
		})
	}

	const bulkActions: BulkAction<User>[] = []

	if (onBulkSuspend) {
		bulkActions.push({
			id: "bulk-suspend",
			label: "Suspend selected",
			handler: async (rows) => {
				const users = rows.map((r) => r.original)
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
				const users = rows.map((r) => r.original)
				await onBulkDelete(users)
			},
			variant: "destructive",
			requireConfirmation: true,
			confirmationMessage: (count) =>
				`Are you sure you want to delete ${count} user(s)? This action cannot be undone.`,
		})
	}

	const config: Partial<DataTableDefaultConfig> = {
		pagination: {
			defaultPageSize: 25,
			pageSizeOptions: [10, 25, 50, 100],
			showPageInfo: true,
		},
		ui: {
			defaultVariant: "lined",
			defaultDensity: "default",
		},
		i18n: {
			defaultLocale: "en",
		},
	}

	return { columns, views, rowActions, bulkActions, config }
}
