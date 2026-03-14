"use client"

/**
 * Order Lines preset for DataTable
 *
 * Pre-configured columns and views for order line items management.
 * Provides both read-only and editable variants.
 *
 * @module presets/order-lines
 */

import type { DataTableColumnDef, DataTableView } from "../data-table.types"
import { DataTableColumnHeader } from "../data-table-column-header"
import { col } from "../factories/col"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface OrderLineRow {
	id: string
	articleName: string
	articleRef: string
	articleVariant?: string
	sku: string
	ean: string
	type: string
	quantity: number
	unitPriceHT: number
	vatRate: number
	totalHT: number
	totalTTC: number
	inStock?: boolean
}

// ---------------------------------------------------------------------------
// Views
// ---------------------------------------------------------------------------

const orderLinesViews: DataTableView[] = [
	{
		id: "all",
		name: "Toutes",
		isSystem: true,
		isDefault: true,
		filters: { id: "root", operator: "AND", conditions: [], groups: [] },
	},
	{
		id: "in-stock",
		name: "En stock",
		isSystem: true,
		filters: {
			id: "in-stock-filter",
			operator: "AND",
			conditions: [
				{ id: "in-stock-cond", column: "inStock", operator: "equals", value: true, type: "boolean" },
			],
			groups: [],
		},
	},
	{
		id: "out-of-stock",
		name: "Rupture",
		isSystem: true,
		filters: {
			id: "out-of-stock-filter",
			operator: "AND",
			conditions: [
				{
					id: "out-of-stock-cond",
					column: "inStock",
					operator: "equals",
					value: false,
					type: "boolean",
				},
			],
			groups: [],
		},
	},
	{
		id: "vat-5-5",
		name: "TVA 5.5%",
		isSystem: true,
		filters: {
			id: "vat-5-5-filter",
			operator: "AND",
			conditions: [
				{ id: "vat-5-5-cond", column: "vatRate", operator: "equals", value: 5.5, type: "number" },
			],
			groups: [],
		},
	},
	{
		id: "vat-20",
		name: "TVA 20%",
		isSystem: true,
		filters: {
			id: "vat-20-filter",
			operator: "AND",
			conditions: [
				{ id: "vat-20-cond", column: "vatRate", operator: "equals", value: 20, type: "number" },
			],
			groups: [],
		},
	},
]

// ---------------------------------------------------------------------------
// Read-only columns factory
// ---------------------------------------------------------------------------

function readOnlyColumns(): DataTableColumnDef<OrderLineRow>[] {
	return [
		{
			accessorKey: "articleName",
			header: ({ column }) => <DataTableColumnHeader column={column} title="Article" />,
			cell: ({ row }) => {
				const name = row.original.articleName
				const variant = row.original.articleVariant
				const ref = row.original.articleRef
				return (
					<div className="flex flex-col gap-0.5">
						<span className="font-medium text-fg">
							{name}
							{variant ? ` [${variant}]` : ""}
						</span>
						<span className="text-xs text-fg-muted font-mono">{ref}</span>
					</div>
				)
			},
			enableSorting: true,
			filterConfig: {
				type: "text",
				placeholder: "Rechercher un article...",
				showInlineFilter: true,
				defaultInlineFilter: false,
				filterLabel: "Article",
			},
		} as DataTableColumnDef<OrderLineRow>,
		col.text<OrderLineRow>("sku", { title: "SKU" }),
		col.text<OrderLineRow>("ean", { title: "EAN", enableSorting: false }),
		col.text<OrderLineRow>("type", { title: "Type" }),
		col.numeric<OrderLineRow>("quantity", { title: "Qté", align: "right" }),
		col.currency<OrderLineRow>("unitPriceHT", {
			title: "PU HT",
			currency: "EUR",
			locale: "fr-FR",
		}),
		col.numeric<OrderLineRow>("vatRate", {
			title: "TVA %",
			formatter: (v) => `${v}%`,
		}),
		col.currency<OrderLineRow>("totalHT", {
			title: "Total HT",
			currency: "EUR",
			locale: "fr-FR",
		}),
		col.currency<OrderLineRow>("totalTTC", {
			title: "Total TTC",
			currency: "EUR",
			locale: "fr-FR",
		}),
	]
}

// ---------------------------------------------------------------------------
// createOrderLinesPreset — read-only
// ---------------------------------------------------------------------------

export interface OrderLinesPreset {
	columns: DataTableColumnDef<OrderLineRow>[]
	views: DataTableView[]
}

/**
 * Creates a read-only Order Lines preset for DataTable.
 *
 * @example
 * ```typescript
 * const { columns, views } = createOrderLinesPreset()
 * ```
 */
export function createOrderLinesPreset(): OrderLinesPreset {
	return {
		columns: readOnlyColumns(),
		views: orderLinesViews,
	}
}

// ---------------------------------------------------------------------------
// createEditableOrderLinesPreset — editable quantity + unit price
// ---------------------------------------------------------------------------

export interface EditableOrderLinesPresetConfig {
	onCellEdit: (rowId: string, columnId: string, value: unknown) => void
}

export interface EditableOrderLinesPreset {
	columns: DataTableColumnDef<OrderLineRow>[]
}

/**
 * Creates an editable Order Lines preset for DataTable.
 * Replaces `quantity` and `unitPriceHT` columns with editable versions.
 *
 * @example
 * ```typescript
 * const { columns } = createEditableOrderLinesPreset({
 *   onCellEdit: (rowId, columnId, value) => updateOrderLine(rowId, columnId, value),
 * })
 * ```
 */
export function createEditableOrderLinesPreset(
	config: EditableOrderLinesPresetConfig
): EditableOrderLinesPreset {
	const { onCellEdit } = config
	const columns = readOnlyColumns()

	// Replace quantity with editable number
	const qtyIndex = columns.findIndex(
		(c) => "accessorKey" in c && c.accessorKey === "quantity"
	)
	if (qtyIndex !== -1) {
		columns.splice(
			qtyIndex,
			1,
			col.editableNumber<OrderLineRow>("quantity", {
				title: "Qté",
				onCellEdit,
				className: "text-right",
			})
		)
	}

	// Replace unitPriceHT with editable currency
	const priceIndex = columns.findIndex(
		(c) => "accessorKey" in c && c.accessorKey === "unitPriceHT"
	)
	if (priceIndex !== -1) {
		columns.splice(
			priceIndex,
			1,
			col.editableCurrency<OrderLineRow>("unitPriceHT", {
				title: "PU HT",
				currency: "EUR",
				locale: "fr-FR",
				onCellEdit,
			})
		)
	}

	return { columns }
}
