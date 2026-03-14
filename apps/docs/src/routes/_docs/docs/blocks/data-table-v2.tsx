import { DataTable } from "@blazz/ui/components/blocks/data-table/data-table"
import {
	createEditableOrderLinesPreset,
	createOrderLinesPreset,
	type OrderLineRow,
} from "@blazz/ui/components/blocks/data-table/presets/order-lines"
import { createFileRoute } from "@tanstack/react-router"
import * as React from "react"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { orderLines } from "~/lib/order-lines-data"

const toc = [
	{ id: "read-only", title: "Read-only" },
	{ id: "editable", title: "Editable" },
]

export const Route = createFileRoute("/_docs/docs/blocks/data-table-v2")({
	component: DataTableV2Page,
})

function DataTableV2Page() {
	const readOnlyPreset = React.useMemo(() => createOrderLinesPreset(), [])

	const [editableData, setEditableData] = React.useState<OrderLineRow[]>(
		() => orderLines as OrderLineRow[]
	)

	const handleCellEdit = React.useCallback(
		(rowId: string, columnId: string, value: unknown, _previousValue: unknown) => {
			setEditableData((prev) =>
				prev.map((row) => {
					if (row.id !== rowId) return row
					const updated = { ...row, [columnId]: value }
					// Recalculate totals when quantity or unitPriceHT changes
					if (columnId === "quantity" || columnId === "unitPriceHT") {
						const qty = columnId === "quantity" ? (value as number) : updated.quantity
						const price =
							columnId === "unitPriceHT" ? (value as number) : updated.unitPriceHT
						updated.totalHT = Math.round(qty * price * 100) / 100
						updated.totalTTC =
							Math.round(updated.totalHT * (1 + updated.vatRate / 100) * 100) / 100
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
		<DocPage
			title="Data Table v2"
			subtitle="Linear-inspired stacked toolbar with advanced filtering, custom views, and inline cell editing."
			toc={toc}
		>
			<DocHero>
				<div className="w-full text-center">
					<h1 className="text-3xl font-bold text-fg">Data Table v2</h1>
					<p className="mt-2 text-fg-muted max-w-xl mx-auto">
						A Linear-inspired stacked toolbar layout with tabs for views, global search,
						advanced filters, and inline cell editing.
					</p>
				</div>
			</DocHero>

			<DocSection id="read-only" title="Read-only — Lignes de commande">
				<div className="rounded-lg border border-separator overflow-hidden">
					<DataTable
						data={orderLines as OrderLineRow[]}
						columns={readOnlyPreset.columns}
						views={readOnlyPreset.views}
						toolbarLayout="stacked"
						enableSorting
						enablePagination
						enableRowSelection
						enableGlobalSearch
						enableAdvancedFilters
						enableCustomViews
						searchPlaceholder="Rechercher un article, SKU, EAN..."
						locale="fr"
						variant="lined"
						pagination={{ pageSize: 10, pageSizeOptions: [10, 25, 50] }}
					/>
				</div>
			</DocSection>

			<DocSection id="editable" title="Editable — Lignes de commande">
				<p className="text-fg-muted mb-4">
					Les colonnes <strong>Qte</strong> et <strong>PU HT</strong> sont editables.
					Les totaux HT et TTC se recalculent automatiquement. Navigation au clavier
					entre les cellules.
				</p>
				<div className="rounded-lg border border-separator overflow-hidden">
					<DataTable
						data={editableData}
						columns={editablePreset.columns}
						toolbarLayout="stacked"
						enableSorting
						enablePagination
						enableGlobalSearch
						enableCellEditing
						onCellEdit={handleCellEdit}
						locale="fr"
						variant="editable"
						pagination={{ pageSize: 10, pageSizeOptions: [10, 25, 50] }}
					/>
				</div>
			</DocSection>
		</DocPage>
	)
}
