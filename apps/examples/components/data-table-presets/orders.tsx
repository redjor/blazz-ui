"use client"

/**
 * Order Management preset for DataTable
 *
 * Pre-configured columns, views, and actions for order management.
 *
 * @module presets/orders
 */

import type { DataTableDefaultConfig } from "@blazz/pro/components/blocks/data-table"
import type { BulkAction, DataTableColumnDef, DataTableView, RowAction } from "@blazz/pro/components/blocks/data-table"
import { createBulkActions, createCRUDActions } from "@blazz/pro/components/blocks/data-table"
import { col } from "@blazz/pro/components/blocks/data-table"
import { createStatusViews } from "@blazz/pro/components/blocks/data-table"

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

export interface OrderManagementPresetConfig {
	locale?: "fr" | "en"
	currency?: string
	statusMap?: {
		[key: string]: {
			value: string
			label: string
			variant?: "default" | "secondary" | "outline" | "destructive"
			className?: string
		}
	}
	paymentStatusMap?: {
		[key: string]: {
			value: string
			label: string
			variant?: "default" | "secondary" | "outline" | "destructive"
			className?: string
		}
	}
	shippingMethods?: Array<{ label: string; value: string }>
	additionalColumns?: DataTableColumnDef<Order>[]
	onView?: (order: Order) => void | Promise<void>
	onEdit?: (order: Order) => void | Promise<void>
	onCancel?: (order: Order) => void | Promise<void>
	onRefund?: (order: Order) => void | Promise<void>
	onBulkCancel?: (orders: Order[]) => void | Promise<void>
	onBulkRefund?: (orders: Order[]) => void | Promise<void>
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

export interface OrderManagementPreset {
	columns: DataTableColumnDef<Order>[]
	views: DataTableView[]
	rowActions: RowAction<Order>[]
	bulkActions: BulkAction<Order>[]
	config: Partial<DataTableDefaultConfig>
}

export function createOrderManagementPreset(
	options: OrderManagementPresetConfig = {}
): OrderManagementPreset {
	const {
		locale = "fr",
		currency = "EUR",
		statusMap,
		paymentStatusMap,
		additionalColumns = [],
		onView,
		onEdit,
		onCancel,
		onRefund,
		onBulkCancel,
		onBulkRefund,
		labels = {},
	} = options

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

	const statusColumnMap: Record<
		string,
		{
			variant: "default" | "secondary" | "outline" | "destructive"
			className?: string
			label?: string
		}
	> = {}
	const statusFilterOptions: Array<{ label: string; value: string }> = []

	Object.entries(defaultStatusMap).forEach(([_key, config]) => {
		statusColumnMap[config.value] = {
			variant: config.variant || "default",
			className: config.className,
			label: config.label,
		}
		statusFilterOptions.push({ label: config.label, value: config.value })
	})

	const paymentStatusColumnMap: Record<
		string,
		{
			variant: "default" | "secondary" | "outline" | "destructive"
			className?: string
			label?: string
		}
	> = {}
	const paymentStatusFilterOptions: Array<{ label: string; value: string }> = []

	Object.entries(defaultPaymentStatusMap).forEach(([_key, config]) => {
		paymentStatusColumnMap[config.value] = {
			variant: config.variant || "default",
			className: config.className,
			label: config.label,
		}
		paymentStatusFilterOptions.push({ label: config.label, value: config.value })
	})

	const columns: DataTableColumnDef<Order>[] = [
		col.text<Order>("orderNumber", {
			title: labels.orderNumber || (locale === "fr" ? "N° Commande" : "Order Number"),
			placeholder: locale === "fr" ? "Rechercher par numéro..." : "Search by order number...",
			showInlineFilter: true,
			defaultInlineFilter: false,
			className: "font-mono text-sm font-semibold text-fg",
		}),
		col.text<Order>("customer", {
			title: labels.customer || (locale === "fr" ? "Client" : "Customer"),
			placeholder: locale === "fr" ? "Rechercher par client..." : "Search by customer...",
			showInlineFilter: true,
			defaultInlineFilter: false,
		}),
		col.status<Order>("status", {
			title: labels.status || (locale === "fr" ? "Statut" : "Status"),
			statusMap: statusColumnMap,
			filterOptions: statusFilterOptions,
			showInlineFilter: true,
			defaultInlineFilter: true,
		}),
		col.currency<Order>("total", {
			title: labels.total || (locale === "fr" ? "Montant" : "Total"),
			currency,
			locale: locale === "fr" ? "fr-FR" : "en-US",
			showInlineFilter: true,
			defaultInlineFilter: false,
			min: 0,
		}),
	]

	if (paymentStatusFilterOptions.length > 0) {
		columns.push(
			col.status<Order>("paymentStatus", {
				title: labels.paymentStatus || (locale === "fr" ? "Paiement" : "Payment"),
				statusMap: paymentStatusColumnMap,
				filterOptions: paymentStatusFilterOptions,
				showInlineFilter: true,
				defaultInlineFilter: false,
			})
		)
	}

	columns.push(
		col.date<Order>("createdAt", {
			title: labels.createdAt || (locale === "fr" ? "Créée le" : "Created at"),
			locale: locale === "fr" ? "fr-FR" : "en-US",
			showInlineFilter: true,
			defaultInlineFilter: false,
		}),
		col.date<Order>("shippedAt", {
			title: labels.shippedAt || (locale === "fr" ? "Expédiée le" : "Shipped at"),
			locale: locale === "fr" ? "fr-FR" : "en-US",
			showInlineFilter: false,
		}),
		col.date<Order>("deliveredAt", {
			title: labels.deliveredAt || (locale === "fr" ? "Livrée le" : "Delivered at"),
			locale: locale === "fr" ? "fr-FR" : "en-US",
			showInlineFilter: false,
		})
	)

	columns.push(...additionalColumns)

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
				? { view: "Voir les détails", edit: "Modifier", delete: "Annuler", archive: "Rembourser" }
				: { view: "View Details", edit: "Edit", delete: "Cancel", archive: "Refund" },
	})

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
				? { delete: "Annuler la sélection", archive: "Rembourser la sélection" }
				: { delete: "Cancel Selected", archive: "Refund Selected" },
	})

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
			defaultLocale: locale,
		},
	}

	return { columns, views, rowActions, bulkActions, config }
}
