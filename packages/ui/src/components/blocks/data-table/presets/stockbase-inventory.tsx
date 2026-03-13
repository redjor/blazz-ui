"use client"

import type { InventoryItem } from "../../../../lib/stockbase-data"
import type { BulkAction, DataTableColumnDef, DataTableView, RowAction } from "../data-table.types"
import { DataTableColumnHeader } from "../data-table-column-header"
import { createBulkActions, createCRUDActions } from "../factories/action-builders"
import { col } from "../factories/col"
import { createStatusViews } from "../factories/view-builders"

export interface InventoryPresetConfig {
	onView?: (item: InventoryItem) => void | Promise<void>
	onEdit?: (item: InventoryItem) => void | Promise<void>
	onRestock?: (item: InventoryItem) => void | Promise<void>
	onBulkExport?: (items: InventoryItem[]) => void | Promise<void>
	onBulkAdjust?: (items: InventoryItem[]) => void | Promise<void>
}

export interface InventoryPreset {
	columns: DataTableColumnDef<InventoryItem>[]
	views: DataTableView[]
	rowActions: RowAction<InventoryItem>[]
	bulkActions: BulkAction<InventoryItem>[]
}

const categoryOptions = [
	{ label: "Electronique", value: "Electronique" },
	{ label: "Mobilier", value: "Mobilier" },
	{ label: "Fournitures", value: "Fournitures" },
	{ label: "Equipement", value: "Equipement" },
	{ label: "Logistique", value: "Logistique" },
]

const locationOptions = [
	{ label: "Entrepot A", value: "Entrepot A" },
	{ label: "Entrepot B", value: "Entrepot B" },
	{ label: "Entrepot C", value: "Entrepot C" },
]

export function createInventoryPreset(config: InventoryPresetConfig = {}): InventoryPreset {
	const { onView, onEdit, onRestock, onBulkExport, onBulkAdjust } = config

	const columns: DataTableColumnDef<InventoryItem>[] = [
		{
			accessorKey: "name",
			header: ({ column }) => <DataTableColumnHeader column={column} title="Article" />,
			cell: ({ row }) => (
				<div className="flex flex-col gap-0.5">
					<span className="font-medium text-fg">{row.original.name}</span>
					<span className="text-xs text-fg-muted font-mono">{row.original.sku}</span>
				</div>
			),
			enableSorting: true,
			filterConfig: {
				type: "text",
				placeholder: "Rechercher par nom...",
				showInlineFilter: true,
				defaultInlineFilter: false,
				filterLabel: "Article",
			},
		} as DataTableColumnDef<InventoryItem>,
		col.select<InventoryItem>("category", {
			title: "Categorie",
			options: categoryOptions,
			showInlineFilter: true,
			defaultInlineFilter: false,
		}),
		col.select<InventoryItem>("location", {
			title: "Emplacement",
			options: locationOptions,
			showInlineFilter: true,
			defaultInlineFilter: false,
		}),
		col.numeric<InventoryItem>("quantity", {
			title: "Quantite",
			showInlineFilter: true,
			defaultInlineFilter: false,
		}),
		col.numeric<InventoryItem>("minQuantity", {
			title: "Seuil min.",
		}),
		col.currency<InventoryItem>("unitPrice", {
			title: "Prix unitaire",
			currency: "EUR",
			locale: "fr-FR",
		}),
		col.status<InventoryItem>("status", {
			title: "Statut",
			statusMap: {
				in_stock: { variant: "success", label: "En stock" },
				low_stock: { variant: "warning", label: "Stock faible" },
				out_of_stock: { variant: "critical", label: "Rupture" },
				discontinued: { variant: "secondary", label: "Arrete" },
			},
			filterOptions: [
				{ label: "En stock", value: "in_stock" },
				{ label: "Stock faible", value: "low_stock" },
				{ label: "Rupture", value: "out_of_stock" },
				{ label: "Arrete", value: "discontinued" },
			],
			showInlineFilter: true,
			defaultInlineFilter: true,
		}),
	]

	const views = createStatusViews({
		column: "status",
		statuses: [
			{ id: "in_stock", name: "En stock", value: "in_stock" },
			{ id: "low_stock", name: "Stock faible", value: "low_stock" },
			{ id: "out_of_stock", name: "Rupture", value: "out_of_stock" },
		],
		allViewName: "Tous",
	})

	const rowActions = createCRUDActions<InventoryItem>({
		onView,
		onEdit,
		labels: { view: "Voir", edit: "Modifier" },
	})

	if (onRestock) {
		rowActions.push({
			id: "restock",
			label: "Reapprovisionner",
			icon: undefined,
			variant: "ghost",
			separator: rowActions.length > 0,
			handler: (row) => onRestock(row.original),
		})
	}

	const bulkActions = createBulkActions<InventoryItem>({
		customActions: [
			...(onBulkExport
				? [
						{
							id: "export",
							label: "Exporter la selection",
							handler: onBulkExport,
						},
					]
				: []),
			...(onBulkAdjust
				? [
						{
							id: "adjust",
							label: "Ajuster le stock",
							handler: onBulkAdjust,
						},
					]
				: []),
		],
	})

	return { columns, views, rowActions, bulkActions }
}
