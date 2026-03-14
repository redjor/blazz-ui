import { DataTable } from "@blazz/ui/components/blocks/data-table/data-table"
import type { BulkAction, RowAction } from "@blazz/ui/components/blocks/data-table/data-table.types"
import {
	createEditableOrderLinesPreset,
	createOrderLinesPreset,
	type OrderLineRow,
} from "@blazz/ui/components/blocks/data-table/presets/order-lines"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft, Copy, Eye, Trash2 } from "lucide-react"
import * as React from "react"
import { ThemeToggle } from "~/components/theme-toggle"
import { orderLines } from "~/lib/order-lines-data"

export const Route = createFileRoute("/sandbox-datatable")({
	component: SandboxDataTable,
})

function SandboxDataTable() {
	const readOnlyPreset = React.useMemo(() => createOrderLinesPreset(), [])

	const rowActions: RowAction<OrderLineRow>[] = React.useMemo(
		() => [
			{ id: "view", label: "Voir le detail", icon: Eye, handler: () => {} },
			{ id: "duplicate", label: "Dupliquer", icon: Copy, handler: () => {} },
			{
				id: "delete",
				label: "Supprimer",
				icon: Trash2,
				variant: "destructive",
				separator: true,
				handler: () => {},
			},
		],
		[]
	)

	const bulkActions: BulkAction<OrderLineRow>[] = React.useMemo(
		() => [
			{ id: "duplicate", label: "Dupliquer la selection", icon: Copy, handler: () => {} },
			{
				id: "delete",
				label: "Supprimer la selection",
				icon: Trash2,
				variant: "destructive",
				requireConfirmation: true,
				confirmationMessage: (count: number) => `Supprimer ${count} ligne(s) ?`,
				handler: () => {},
			},
		],
		[]
	)

	const [editableData, setEditableData] = React.useState<OrderLineRow[]>(
		() => orderLines as OrderLineRow[]
	)

	const handleCellEdit = React.useCallback(
		(rowId: string, columnId: string, value: unknown, _previousValue?: unknown) => {
			setEditableData((prev) =>
				prev.map((row) => {
					if (row.id !== rowId) return row
					const updated = { ...row, [columnId]: value }
					if (columnId === "quantity" || columnId === "unitPriceHT") {
						const qty = columnId === "quantity" ? (value as number) : updated.quantity
						const price = columnId === "unitPriceHT" ? (value as number) : updated.unitPriceHT
						updated.totalHT = Math.round(qty * price * 100) / 100
						updated.totalTTC = Math.round(updated.totalHT * (1 + updated.vatRate / 100) * 100) / 100
					}
					return updated
				})
			)
		},
		[]
	)

	const editablePreset = React.useMemo(
		() =>
			createEditableOrderLinesPreset({
				onCellEdit: handleCellEdit,
			}),
		[handleCellEdit]
	)

	return (
		<div className="flex h-screen flex-col bg-app">
			{/* Minimal top bar */}
			<header className="flex h-12 shrink-0 items-center justify-between border-b border-container px-4">
				<div className="flex items-center gap-3">
					<Link
						to="/docs/blocks/data-table"
						className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-fg transition-colors"
					>
						<ArrowLeft className="h-4 w-4" />
						Docs
					</Link>
					<span className="text-separator">/</span>
					<h1 className="text-sm font-semibold text-fg">Data Table — Sandbox</h1>
				</div>
				<ThemeToggle />
			</header>

			{/* Full-width content */}
			<div className="flex-1 overflow-y-auto">
				{/* Read-only table */}
				<section className="border-b border-container">
					<div className="flex items-center gap-3 px-6 py-3">
						<h2 className="text-sm font-semibold text-fg">Read-only — Lignes de commande</h2>
						<span className="rounded-full bg-surface-3 px-2 py-0.5 text-xs text-fg-muted">
							{orderLines.length} lignes
						</span>
					</div>
					<DataTable
						data={orderLines as OrderLineRow[]}
						columns={readOnlyPreset.columns}
						views={readOnlyPreset.views}
						getRowId={(row) => row.id}
						toolbarLayout="stacked"
						enableSorting
						enablePagination
						enableRowSelection
						enableGlobalSearch
						enableAdvancedFilters
						enableCustomViews
						rowActions={rowActions}
						bulkActions={bulkActions}
						searchPlaceholder="Rechercher un article, SKU, EAN..."
						locale="fr"
						variant="lined"
						density="compact"
						pagination={{ pageSize: 15, pageSizeOptions: [10, 15, 25, 50] }}
					/>
				</section>

				{/* Editable table */}
				<section>
					<div className="flex items-center gap-3 px-6 py-3">
						<h2 className="text-sm font-semibold text-fg">Editable — Lignes de commande</h2>
						<span className="rounded-full bg-surface-3 px-2 py-0.5 text-xs text-fg-muted">
							Qte &amp; PU HT editables
						</span>
					</div>
					<DataTable
						data={editableData}
						columns={editablePreset.columns}
						getRowId={(row) => row.id}
						toolbarLayout="stacked"
						enableSorting
						enablePagination
						enableGlobalSearch
						enableCellEditing
						onCellEdit={handleCellEdit}
						searchPlaceholder="Rechercher un article..."
						locale="fr"
						variant="editable"
						pagination={{ pageSize: 15, pageSizeOptions: [10, 15, 25, 50] }}
					/>
				</section>
			</div>
		</div>
	)
}
