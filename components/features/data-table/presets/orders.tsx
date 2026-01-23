"use client"

/**
 * Order Management preset for DataTable
 *
 * Pre-configured columns, views, and actions for order management.
 * Designed for e-commerce orders, shipping systems, and order tracking.
 *
 * @module presets/orders
 */

import type { DataTableColumnDef, DataTableView, RowAction, BulkAction } from "../data-table.types"
import type { DataTableDefaultConfig } from "../config/data-table-config"
import {
	createTextColumn,
	createStatusColumn,
	createCurrencyColumn,
	createDateColumn,
} from "../factories/column-builders"
import { createStatusViews } from "../factories/view-builders"
import { createCRUDActions, createBulkActions } from "../factories/action-builders"

/**
 * Standard order interface
 */
export interface Order {
	id: string
	orderNumber: string
	customer: string
	customerEmail?: string
	total: number
	status: string
	paymentStatus?: string
	shippingMethod?: string
	createdAt: string
	shippedAt?: string
	deliveredAt?: string
}

/**
 * Configuration options for order management preset
 */
export interface OrderManagementPresetConfig {
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
	/** Payment status values mapping */
	paymentStatusMap?: {
		[key: string]: {
			value: string
			label: string
			variant?: "default" | "secondary" | "outline" | "destructive"
			className?: string
		}
	}
	/** Shipping method options */
	shippingMethods?: Array<{ label: string; value: string }>
	/** Additional columns to append */
	additionalColumns?: DataTableColumnDef<Order>[]
	/** Callback when viewing an order */
	onView?: (order: Order) => void | Promise<void>
	/** Callback when editing an order */
	onEdit?: (order: Order) => void | Promise<void>
	/** Callback when canceling an order */
	onCancel?: (order: Order) => void | Promise<void>
	/** Callback when refunding an order */
	onRefund?: (order: Order) => void | Promise<void>
	/** Callback for bulk cancel */
	onBulkCancel?: (orders: Order[]) => void | Promise<void>
	/** Callback for bulk refund */
	onBulkRefund?: (orders: Order[]) => void | Promise<void>
	/** Custom labels */
	labels?: {
		orderNumber?: string
		customer?: string
		total?: string
		status?: string
		paymentStatus?: string
		shippingMethod?: string
		createdAt?: string
		shippedAt?: string
		deliveredAt?: string
	}
}

/**
 * Return type for the order management preset
 */
export interface OrderManagementPreset {
	columns: DataTableColumnDef<Order>[]
	views: DataTableView[]
	rowActions: RowAction<Order>[]
	bulkActions: BulkAction<Order>[]
	config: Partial<DataTableDefaultConfig>
}

/**
 * Creates a complete order management preset
 *
 * @example
 * ```typescript
 * const preset = createOrderManagementPreset({
 *   locale: "fr",
 *   currency: "EUR",
 *   onView: (order) => router.push(`/orders/${order.id}`),
 *   onCancel: async (order) => await cancelOrder(order.id),
 * })
 *
 * <DataTable
 *   data={orders}
 *   columns={preset.columns}
 *   views={preset.views}
 *   rowActions={preset.rowActions}
 *   bulkActions={preset.bulkActions}
 * />
 * ```
 */
export function createOrderManagementPreset(
	options: OrderManagementPresetConfig = {}
): OrderManagementPreset {
	const {
		locale = "fr",
		currency = "EUR",
		statusMap,
		paymentStatusMap,
		shippingMethods,
		additionalColumns = [],
		onView,
		onEdit,
		onCancel,
		onRefund,
		onBulkCancel,
		onBulkRefund,
		labels = {},
	} = options

	// Default order status mapping
	const defaultStatusMap =
		statusMap ||
		(locale === "fr"
			? {
					en_attente: {
						value: "en_attente",
						label: "En attente",
						variant: "secondary" as const,
						className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
					},
					en_cours: {
						value: "en_cours",
						label: "En cours",
						variant: "default" as const,
						className: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
					},
					expédiée: {
						value: "expédiée",
						label: "Expédiée",
						variant: "default" as const,
						className: "bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200",
					},
					livrée: {
						value: "livrée",
						label: "Livrée",
						variant: "default" as const,
						className: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
					},
					annulée: {
						value: "annulée",
						label: "Annulée",
						variant: "destructive" as const,
						className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
					},
				}
			: {
					pending: {
						value: "pending",
						label: "Pending",
						variant: "secondary" as const,
						className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
					},
					processing: {
						value: "processing",
						label: "Processing",
						variant: "default" as const,
						className: "bg-blue-100 text-blue-800 hover:bg-blue-100 border-blue-200",
					},
					shipped: {
						value: "shipped",
						label: "Shipped",
						variant: "default" as const,
						className: "bg-purple-100 text-purple-800 hover:bg-purple-100 border-purple-200",
					},
					delivered: {
						value: "delivered",
						label: "Delivered",
						variant: "default" as const,
						className: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
					},
					cancelled: {
						value: "cancelled",
						label: "Cancelled",
						variant: "destructive" as const,
						className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
					},
				})

	// Default payment status mapping
	const defaultPaymentStatusMap =
		paymentStatusMap ||
		(locale === "fr"
			? {
					en_attente: {
						value: "en_attente",
						label: "En attente",
						variant: "secondary" as const,
						className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
					},
					payée: {
						value: "payée",
						label: "Payée",
						variant: "default" as const,
						className: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
					},
					remboursée: {
						value: "remboursée",
						label: "Remboursée",
						variant: "outline" as const,
						className: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200",
					},
					échouée: {
						value: "échouée",
						label: "Échouée",
						variant: "destructive" as const,
						className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
					},
				}
			: {
					pending: {
						value: "pending",
						label: "Pending",
						variant: "secondary" as const,
						className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
					},
					paid: {
						value: "paid",
						label: "Paid",
						variant: "default" as const,
						className: "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
					},
					refunded: {
						value: "refunded",
						label: "Refunded",
						variant: "outline" as const,
						className: "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200",
					},
					failed: {
						value: "failed",
						label: "Failed",
						variant: "destructive" as const,
						className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
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

	// Build payment status map for column
	const paymentStatusColumnMap: Record<
		string,
		{
			variant: "default" | "secondary" | "outline" | "destructive"
			className?: string
			label?: string
		}
	> = {}
	const paymentStatusFilterOptions: Array<{ label: string; value: string }> = []

	Object.entries(defaultPaymentStatusMap).forEach(([key, config]) => {
		paymentStatusColumnMap[config.value] = {
			variant: config.variant || "default",
			className: config.className,
			label: config.label,
		}
		paymentStatusFilterOptions.push({ label: config.label, value: config.value })
	})

	// Build columns
	const columns: DataTableColumnDef<Order>[] = [
		createTextColumn<Order>({
			accessorKey: "orderNumber",
			title: labels.orderNumber || (locale === "fr" ? "N° Commande" : "Order Number"),
			placeholder:
				locale === "fr"
					? "Rechercher par numéro..."
					: "Search by order number...",
			showInlineFilter: true,
			defaultInlineFilter: false,
			className: "font-mono text-sm font-semibold text-foreground",
		}),
		createTextColumn<Order>({
			accessorKey: "customer",
			title: labels.customer || (locale === "fr" ? "Client" : "Customer"),
			placeholder: locale === "fr" ? "Rechercher par client..." : "Search by customer...",
			showInlineFilter: true,
			defaultInlineFilter: false,
		}),
		createStatusColumn<Order>({
			accessorKey: "status",
			title: labels.status || (locale === "fr" ? "Statut" : "Status"),
			statusMap: statusColumnMap,
			filterOptions: statusFilterOptions,
			showInlineFilter: true,
			defaultInlineFilter: true,
		}),
		createCurrencyColumn<Order>({
			accessorKey: "total",
			title: labels.total || (locale === "fr" ? "Montant" : "Total"),
			currency,
			locale: locale === "fr" ? "fr-FR" : "en-US",
			showInlineFilter: true,
			defaultInlineFilter: false,
			min: 0,
		}),
	]

	// Add payment status column if paymentStatus provided
	if (paymentStatusFilterOptions.length > 0) {
		columns.push(
			createStatusColumn<Order>({
				accessorKey: "paymentStatus",
				title: labels.paymentStatus || (locale === "fr" ? "Paiement" : "Payment"),
				statusMap: paymentStatusColumnMap,
				filterOptions: paymentStatusFilterOptions,
				showInlineFilter: true,
				defaultInlineFilter: false,
			})
		)
	}

	// Add dates
	columns.push(
		createDateColumn<Order>({
			accessorKey: "createdAt",
			title: labels.createdAt || (locale === "fr" ? "Créée le" : "Created at"),
			locale: locale === "fr" ? "fr-FR" : "en-US",
			showInlineFilter: true,
			defaultInlineFilter: false,
		}),
		createDateColumn<Order>({
			accessorKey: "shippedAt",
			title: labels.shippedAt || (locale === "fr" ? "Expédiée le" : "Shipped at"),
			locale: locale === "fr" ? "fr-FR" : "en-US",
			showInlineFilter: false,
		}),
		createDateColumn<Order>({
			accessorKey: "deliveredAt",
			title: labels.deliveredAt || (locale === "fr" ? "Livrée le" : "Delivered at"),
			locale: locale === "fr" ? "fr-FR" : "en-US",
			showInlineFilter: false,
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
	const rowActions = createCRUDActions<Order>({
		onView,
		onEdit,
		onDelete: onCancel,
		onArchive: onRefund,
		deleteConfirmation: (row) =>
			locale === "fr"
				? `Êtes-vous sûr de vouloir annuler la commande ${row.original.orderNumber} ?`
				: `Are you sure you want to cancel order ${row.original.orderNumber}?`,
		archiveConfirmation: (row) =>
			locale === "fr"
				? `Êtes-vous sûr de vouloir rembourser la commande ${row.original.orderNumber} ?`
				: `Are you sure you want to refund order ${row.original.orderNumber}?`,
		hideArchive: (row) =>
			row.original.status === (locale === "fr" ? "annulée" : "cancelled") ||
			row.original.status === (locale === "fr" ? "remboursée" : "refunded"),
		labels:
			locale === "fr"
				? {
						view: "Voir les détails",
						edit: "Modifier",
						delete: "Annuler",
						archive: "Rembourser",
					}
				: {
						view: "View Details",
						edit: "Edit",
						delete: "Cancel",
						archive: "Refund",
					},
	})

	// Build bulk actions
	const bulkActions = createBulkActions<Order>({
		onDelete: onBulkCancel,
		onArchive: onBulkRefund,
		deleteConfirmation: (count) =>
			locale === "fr"
				? `Êtes-vous sûr de vouloir annuler ${count} commande(s) ?`
				: `Are you sure you want to cancel ${count} order(s)?`,
		archiveConfirmation: (count) =>
			locale === "fr"
				? `Êtes-vous sûr de vouloir rembourser ${count} commande(s) ?`
				: `Are you sure you want to refund ${count} order(s)?`,
		labels:
			locale === "fr"
				? {
						delete: "Annuler la sélection",
						archive: "Rembourser la sélection",
					}
				: {
						delete: "Cancel Selected",
						archive: "Refund Selected",
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
				locale === "fr" ? "Aucune commande trouvée" : "No orders found",
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
