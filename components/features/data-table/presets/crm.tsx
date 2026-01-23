"use client"

/**
 * CRM preset for DataTable
 *
 * Pre-configured columns, views, and actions for contact/customer management.
 * Designed for CRM systems, customer databases, and contact management.
 *
 * @module presets/crm
 */

import type { DataTableColumnDef, DataTableView, RowAction, BulkAction } from "../data-table.types"
import type { DataTableDefaultConfig } from "../config/data-table-config"
import {
	createTextColumn,
	createStatusColumn,
	createSelectColumn,
	createDateColumn,
} from "../factories/column-builders"
import { createStatusViews } from "../factories/view-builders"
import { createCRUDActions, createBulkActions } from "../factories/action-builders"

/**
 * Standard CRM contact interface
 */
export interface CRMContact {
	id: string
	name: string
	email: string
	phone?: string
	company?: string
	status: string
	lastContact?: string
	createdAt: string
	tags?: string[]
}

/**
 * Configuration options for CRM contact preset
 */
export interface CRMContactPresetConfig {
	/** Locale for formatting (default: "fr") */
	locale?: "fr" | "en" | "es" | "de" | "it" | "pt"
	/** Status values mapping */
	statusMap?: {
		[key: string]: {
			value: string
			label: string
			variant?: "default" | "secondary" | "outline" | "destructive"
			className?: string
		}
	}
	/** Company options */
	companies?: Array<{ label: string; value: string }>
	/** Additional columns to append */
	additionalColumns?: DataTableColumnDef<CRMContact>[]
	/** Callback when viewing a contact */
	onView?: (contact: CRMContact) => void | Promise<void>
	/** Callback when editing a contact */
	onEdit?: (contact: CRMContact) => void | Promise<void>
	/** Callback when deleting a contact */
	onDelete?: (contact: CRMContact) => void | Promise<void>
	/** Callback when archiving a contact */
	onArchive?: (contact: CRMContact) => void | Promise<void>
	/** Callback for bulk activate */
	onBulkActivate?: (contacts: CRMContact[]) => void | Promise<void>
	/** Callback for bulk archive */
	onBulkArchive?: (contacts: CRMContact[]) => void | Promise<void>
	/** Custom labels */
	labels?: {
		name?: string
		email?: string
		phone?: string
		company?: string
		status?: string
		lastContact?: string
		createdAt?: string
	}
}

/**
 * Return type for the CRM preset
 */
export interface CRMContactPreset {
	columns: DataTableColumnDef<CRMContact>[]
	views: DataTableView[]
	rowActions: RowAction<CRMContact>[]
	bulkActions: BulkAction<CRMContact>[]
	config: Partial<DataTableDefaultConfig>
}

/**
 * Creates a complete CRM contact preset
 *
 * @example
 * ```typescript
 * const preset = createCRMContactPreset({
 *   locale: "fr",
 *   onView: (contact) => router.push(`/contacts/${contact.id}`),
 *   onEdit: (contact) => router.push(`/contacts/${contact.id}/edit`),
 * })
 *
 * <DataTable
 *   data={contacts}
 *   columns={preset.columns}
 *   views={preset.views}
 *   rowActions={preset.rowActions}
 *   bulkActions={preset.bulkActions}
 * />
 * ```
 */
export function createCRMContactPreset(
	options: CRMContactPresetConfig = {}
): CRMContactPreset {
	const {
		locale = "fr",
		statusMap,
		companies,
		additionalColumns = [],
		onView,
		onEdit,
		onDelete,
		onArchive,
		onBulkActivate,
		onBulkArchive,
		labels = {},
	} = options

	// Default status mapping
	const defaultStatusMap =
		statusMap ||
		(locale === "fr"
			? {
					actif: {
						value: "actif",
						label: "Actif",
						variant: "default" as const,
						className: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
					},
					inactif: {
						value: "inactif",
						label: "Inactif",
						variant: "secondary" as const,
						className: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200",
					},
					archivé: {
						value: "archivé",
						label: "Archivé",
						variant: "outline" as const,
						className: "bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200",
					},
				}
			: {
					active: {
						value: "active",
						label: "Active",
						variant: "default" as const,
						className: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
					},
					inactive: {
						value: "inactive",
						label: "Inactive",
						variant: "secondary" as const,
						className: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200",
					},
					archived: {
						value: "archived",
						label: "Archived",
						variant: "outline" as const,
						className: "bg-gray-100 text-gray-600 hover:bg-gray-100 border-gray-200",
					},
				})

	// Build status map
	const statusColumnMap: Record<
		string,
		{
			variant: "default" | "secondary" | "outline" | "destructive"
			className?: string
			label?: string
		}
	> = {}
	const statusFilterOptions: Array<{ label: string; value: string }> = []

	Object.entries(defaultStatusMap).forEach(([key, config]) => {
		statusColumnMap[config.value] = {
			variant: config.variant || "default",
			className: config.className,
			label: config.label,
		}
		statusFilterOptions.push({ label: config.label, value: config.value })
	})

	// Build columns
	const columns: DataTableColumnDef<CRMContact>[] = [
		createTextColumn<CRMContact>({
			accessorKey: "name",
			title: labels.name || (locale === "fr" ? "Nom" : "Name"),
			placeholder: locale === "fr" ? "Rechercher par nom..." : "Search by name...",
			showInlineFilter: true,
			defaultInlineFilter: false,
		}),
		createTextColumn<CRMContact>({
			accessorKey: "email",
			title: labels.email || "Email",
			placeholder: locale === "fr" ? "Rechercher par email..." : "Search by email...",
			showInlineFilter: true,
			defaultInlineFilter: false,
		}),
		createTextColumn<CRMContact>({
			accessorKey: "phone",
			title: labels.phone || (locale === "fr" ? "Téléphone" : "Phone"),
			placeholder:
				locale === "fr" ? "Rechercher par téléphone..." : "Search by phone...",
			showInlineFilter: false,
		}),
	]

	// Add company column if companies provided
	if (companies && companies.length > 0) {
		columns.push(
			createSelectColumn<CRMContact>({
				accessorKey: "company",
				title: labels.company || (locale === "fr" ? "Entreprise" : "Company"),
				options: companies,
				showInlineFilter: true,
				defaultInlineFilter: false,
			})
		)
	}

	// Add status column
	columns.push(
		createStatusColumn<CRMContact>({
			accessorKey: "status",
			title: labels.status || (locale === "fr" ? "Statut" : "Status"),
			statusMap: statusColumnMap,
			filterOptions: statusFilterOptions,
			showInlineFilter: true,
			defaultInlineFilter: true,
		})
	)

	// Add last contact date
	columns.push(
		createDateColumn<CRMContact>({
			accessorKey: "lastContact",
			title: labels.lastContact || (locale === "fr" ? "Dernier contact" : "Last Contact"),
			locale: locale === "fr" ? "fr-FR" : "en-US",
			showInlineFilter: false,
		}),
		createDateColumn<CRMContact>({
			accessorKey: "createdAt",
			title: labels.createdAt || (locale === "fr" ? "Créé le" : "Created at"),
			locale: locale === "fr" ? "fr-FR" : "en-US",
			showInlineFilter: true,
			defaultInlineFilter: false,
		})
	)

	// Append additional columns
	columns.push(...additionalColumns)

	// Build views
	const statusValues = Object.entries(defaultStatusMap).map(([key, config]) => ({
		id: key,
		name: config.label,
		value: config.value,
	}))

	const views = createStatusViews({
		column: "status",
		statuses: statusValues,
		allViewName: locale === "fr" ? "Tous" : "All",
	})

	// Build row actions
	const rowActions = createCRUDActions<CRMContact>({
		onView,
		onEdit,
		onDelete,
		onArchive,
		archiveConfirmation: (row) =>
			locale === "fr"
				? `Êtes-vous sûr de vouloir archiver ${row.original.name} ?`
				: `Are you sure you want to archive ${row.original.name}?`,
		deleteConfirmation: (row) =>
			locale === "fr"
				? `Êtes-vous sûr de vouloir supprimer ${row.original.name} ?`
				: `Are you sure you want to delete ${row.original.name}?`,
		hideArchive: (row) => row.original.status === (locale === "fr" ? "archivé" : "archived"),
		labels:
			locale === "fr"
				? {
						view: "Voir les détails",
						edit: "Modifier",
						archive: "Archiver",
						delete: "Supprimer",
					}
				: {
						view: "View Details",
						edit: "Edit",
						archive: "Archive",
						delete: "Delete",
					},
	})

	// Build bulk actions
	const bulkActions = createBulkActions<CRMContact>({
		onActivate: onBulkActivate,
		onArchive: onBulkArchive,
		archiveConfirmation: (count) =>
			locale === "fr"
				? `Êtes-vous sûr de vouloir archiver ${count} contact(s) ?`
				: `Are you sure you want to archive ${count} contact(s)?`,
		labels:
			locale === "fr"
				? {
						activate: "Activer la sélection",
						archive: "Archiver la sélection",
					}
				: {
						activate: "Activate Selected",
						archive: "Archive Selected",
					},
	})

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
			emptyStateMessage:
				locale === "fr" ? "Aucun contact trouvé" : "No contacts found",
			loadingMessage: locale === "fr" ? "Chargement..." : "Loading...",
		},
		i18n: {
			defaultLocale: locale,
			supportedLocales: ["fr", "en", "es", "de", "it", "pt"],
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
