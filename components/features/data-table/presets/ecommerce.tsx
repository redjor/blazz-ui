"use client"

/**
 * E-commerce preset for DataTable
 *
 * Pre-configured columns, views, and actions for product management.
 * Designed for online stores, inventory systems, and product catalogs.
 *
 * @module presets/ecommerce
 */

import type { DataTableColumnDef, DataTableView, RowAction, BulkAction } from "../data-table.types"
import type { DataTableDefaultConfig } from "../config/data-table-config"
import {
	createImageTextColumn,
	createStatusColumn,
	createCurrencyColumn,
	createSelectColumn,
	createTextColumn,
	createDateColumn,
	createNumericColumn,
} from "../factories/column-builders"
import { createStatusViews } from "../factories/view-builders"
import { createCRUDActions, createBulkActions } from "../factories/action-builders"

/**
 * Standard e-commerce product interface
 * Extend this interface to add custom fields
 */
export interface EcommerceProduct {
	id: string
	name: string
	image?: string
	sku: string
	price: number
	stock?: number | string
	stockCount?: number
	status: string
	category: string
	vendor?: string
	channels?: number
	catalogues?: number
	createdAt: string
}

/**
 * Configuration options for e-commerce product preset
 */
export interface EcommerceProductPresetConfig {
	/** Locale for formatting (default: "fr") */
	locale?: "fr" | "en" | "es" | "de" | "it" | "pt"
	/** Currency code (default: "EUR") */
	currency?: string
	/** Status values mapping */
	statusMap?: {
		[key: string]: {
			value: string
			label: string
			variant?: "default" | "secondary" | "outline" | "destructive"
			className?: string
		}
	}
	/** Category options */
	categories?: Array<{ label: string; value: string }>
	/** Vendor options */
	vendors?: Array<{ label: string; value: string }>
	/** Additional columns to append */
	additionalColumns?: DataTableColumnDef<EcommerceProduct>[]
	/** Callback when viewing a product */
	onView?: (product: EcommerceProduct) => void | Promise<void>
	/** Callback when editing a product */
	onEdit?: (product: EcommerceProduct) => void | Promise<void>
	/** Callback when deleting a product */
	onDelete?: (product: EcommerceProduct) => void | Promise<void>
	/** Callback when archiving a product */
	onArchive?: (product: EcommerceProduct) => void | Promise<void>
	/** Callback for bulk activate */
	onBulkActivate?: (products: EcommerceProduct[]) => void | Promise<void>
	/** Callback for bulk archive */
	onBulkArchive?: (products: EcommerceProduct[]) => void | Promise<void>
	/** Callback for bulk delete */
	onBulkDelete?: (products: EcommerceProduct[]) => void | Promise<void>
	/** Custom labels */
	labels?: {
		product?: string
		status?: string
		price?: string
		sku?: string
		stock?: string
		category?: string
		vendor?: string
		createdAt?: string
		channels?: string
		catalogues?: string
	}
}

/**
 * Return type for the e-commerce preset
 */
export interface EcommerceProductPreset {
	columns: DataTableColumnDef<EcommerceProduct>[]
	views: DataTableView[]
	rowActions: RowAction<EcommerceProduct>[]
	bulkActions: BulkAction<EcommerceProduct>[]
	config: Partial<DataTableDefaultConfig>
}

/**
 * Creates a complete e-commerce product preset
 *
 * Includes pre-configured columns for product name, image, status, price,
 * SKU, stock, category, vendor, and creation date. Also provides status-based
 * views and standard CRUD actions.
 *
 * @example
 * ```typescript
 * const preset = createEcommerceProductPreset({
 *   locale: "fr",
 *   currency: "EUR",
 *   onView: (product) => router.push(`/products/${product.id}`),
 *   onEdit: (product) => router.push(`/products/${product.id}/edit`),
 *   onArchive: async (product) => await archiveProduct(product.id),
 * })
 *
 * <DataTable
 *   data={products}
 *   columns={preset.columns}
 *   views={preset.views}
 *   rowActions={preset.rowActions}
 *   bulkActions={preset.bulkActions}
 * />
 * ```
 */
export function createEcommerceProductPreset(
	options: EcommerceProductPresetConfig = {}
): EcommerceProductPreset {
	const {
		locale = "fr",
		currency = "EUR",
		statusMap,
		categories,
		vendors,
		additionalColumns = [],
		onView,
		onEdit,
		onDelete,
		onArchive,
		onBulkActivate,
		onBulkArchive,
		onBulkDelete,
		labels = {},
	} = options

	// Default status mapping (French)
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
					brouillon: {
						value: "brouillon",
						label: "Brouillon",
						variant: "secondary" as const,
						className: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
					},
					archivé: {
						value: "archivé",
						label: "Archivé",
						variant: "outline" as const,
						className: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200",
					},
					cartes_cadeaux: {
						value: "cartes_cadeaux",
						label: "Cartes Cadeaux",
						variant: "secondary" as const,
						className: "bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200",
					},
				}
			: {
					active: {
						value: "active",
						label: "Active",
						variant: "default" as const,
						className: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
					},
					draft: {
						value: "draft",
						label: "Draft",
						variant: "secondary" as const,
						className: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
					},
					archived: {
						value: "archived",
						label: "Archived",
						variant: "outline" as const,
						className: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200",
					},
					gift_cards: {
						value: "gift_cards",
						label: "Gift Cards",
						variant: "secondary" as const,
						className: "bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200",
					},
				})

	// Build status map for column
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
	const columns: DataTableColumnDef<EcommerceProduct>[] = [
		createImageTextColumn<EcommerceProduct>({
			accessorKey: "name",
			imageAccessor: "image",
			title: labels.product || (locale === "fr" ? "Produit" : "Product"),
			placeholder:
				locale === "fr" ? "Rechercher par nom..." : "Search by name...",
			showInlineFilter: false,
		}),
		createStatusColumn<EcommerceProduct>({
			accessorKey: "status",
			title: labels.status || (locale === "fr" ? "Statut" : "Status"),
			statusMap: statusColumnMap,
			filterOptions: statusFilterOptions,
			showInlineFilter: true,
			defaultInlineFilter: true,
		}),
		createCurrencyColumn<EcommerceProduct>({
			accessorKey: "price",
			title: labels.price || (locale === "fr" ? "Prix" : "Price"),
			currency,
			locale: locale === "fr" ? "fr-FR" : "en-US",
			showInlineFilter: true,
			defaultInlineFilter: false,
			min: 0,
		}),
	]

	// Add vendor column if vendors provided
	if (vendors && vendors.length > 0) {
		columns.push(
			createSelectColumn<EcommerceProduct>({
				accessorKey: "vendor",
				title: labels.vendor || (locale === "fr" ? "Fournisseur" : "Vendor"),
				options: vendors,
				showInlineFilter: true,
				defaultInlineFilter: false,
			})
		)
	}

	// Add SKU column
	columns.push(
		createTextColumn<EcommerceProduct>({
			accessorKey: "sku",
			title: labels.sku || "SKU",
			placeholder: locale === "fr" ? "Rechercher par SKU..." : "Search by SKU...",
			showInlineFilter: true,
			defaultInlineFilter: false,
			className: "font-mono text-sm text-muted-foreground",
		})
	)

	// Add stock column (custom rendering for red text when 0)
	columns.push({
		accessorKey: "stock",
		header: labels.stock || "Stock",
		cell: ({ row }) => {
			const stock = row.getValue("stock") as string
			const stockCount = row.original.stockCount ?? 0
			return (
				<span
					className={
						stockCount === 0
							? "text-body-md text-red-600"
							: "text-body-md text-foreground"
					}
				>
					{stock}
				</span>
			)
		},
		enableSorting: false,
	})

	// Add category column if categories provided
	if (categories && categories.length > 0) {
		columns.push(
			createSelectColumn<EcommerceProduct>({
				accessorKey: "category",
				title: labels.category || (locale === "fr" ? "Catégorie" : "Category"),
				options: categories,
				showInlineFilter: true,
				defaultInlineFilter: false,
			})
		)
	}

	// Add creation date
	columns.push(
		createDateColumn<EcommerceProduct>({
			accessorKey: "createdAt",
			title: labels.createdAt || (locale === "fr" ? "Créé le" : "Created at"),
			locale: locale === "fr" ? "fr-FR" : "en-US",
			showInlineFilter: true,
			defaultInlineFilter: false,
		})
	)

	// Add channels and catalogues if present
	if (additionalColumns.length === 0) {
		// Add default additional numeric columns
		columns.push(
			createNumericColumn<EcommerceProduct>({
				accessorKey: "channels",
				title: labels.channels || (locale === "fr" ? "Canaux" : "Channels"),
				showInlineFilter: true,
				defaultInlineFilter: false,
				align: "center",
				min: 0,
			}),
			createNumericColumn<EcommerceProduct>({
				accessorKey: "catalogues",
				title: labels.catalogues || (locale === "fr" ? "Catalogues" : "Catalogs"),
				showInlineFilter: true,
				defaultInlineFilter: false,
				align: "center",
				min: 0,
			})
		)
	}

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
	const rowActions = createCRUDActions<EcommerceProduct>({
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
	const bulkActions = createBulkActions<EcommerceProduct>({
		onActivate: onBulkActivate,
		onArchive: onBulkArchive,
		onDelete: onBulkDelete,
		archiveConfirmation: (count) =>
			locale === "fr"
				? `Êtes-vous sûr de vouloir archiver ${count} produit(s) ?`
				: `Are you sure you want to archive ${count} product(s)?`,
		deleteConfirmation: (count) =>
			locale === "fr"
				? `Êtes-vous sûr de vouloir supprimer ${count} produit(s) ?`
				: `Are you sure you want to delete ${count} product(s)?`,
		labels:
			locale === "fr"
				? {
						activate: "Activer la sélection",
						archive: "Archiver la sélection",
						delete: "Supprimer la sélection",
					}
				: {
						activate: "Activate Selected",
						archive: "Archive Selected",
						delete: "Delete Selected",
					},
	})

	// Configuration
	const config: Partial<DataTableDefaultConfig> = {
		pagination: {
			defaultPageSize: 15,
			pageSizeOptions: [10, 15, 25, 50],
			showPageInfo: true,
		},
		ui: {
			defaultVariant: "lined",
			defaultDensity: "default",
			emptyStateMessage:
				locale === "fr" ? "Aucun produit trouvé" : "No products found",
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
