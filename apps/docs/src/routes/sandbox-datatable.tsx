import { DataTable } from "@blazz/ui/components/blocks/data-table/data-table"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@blazz/ui/components/ui/table"
import type {
	BulkAction,
	DataTableColumnDef,
	RowAction,
} from "@blazz/ui/components/blocks/data-table/data-table.types"
import { DataTableColumnHeader } from "@blazz/ui/components/blocks/data-table/data-table-column-header"
import { col } from "@blazz/ui/components/blocks/data-table/factories/col"
import {
	createOrderLinesPreset,
	type OrderLineRow,
} from "@blazz/ui/components/blocks/data-table/presets/order-lines"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowLeft, ArrowLeftRight, Copy, Eye, Scissors, Trash2 } from "lucide-react"
import * as React from "react"
import { ThemeToggle } from "~/components/theme-toggle"
import { orderLines } from "~/lib/order-lines-data"

// ---------------------------------------------------------------------------
// Preparation line type + mock data
// ---------------------------------------------------------------------------

interface PrepLine {
	id: string
	articleName: string
	articleRef: string
	qteCmde: number
	qtePrep: number | null
	lotNumber: string
	dlc: string
	status: "en_attente" | "en_cours" | "prepare" | "anomalie"
}

const prepLines: PrepLine[] = [
	{
		id: "p1",
		articleName: "Tomates Rondes",
		articleRef: "FLE-101",
		qteCmde: 80,
		qtePrep: null,
		lotNumber: "",
		dlc: "",
		status: "en_attente",
	},
	{
		id: "p2",
		articleName: "Polo Pro",
		articleRef: "TXT-102",
		qteCmde: 45,
		qtePrep: null,
		lotNumber: "",
		dlc: "",
		status: "en_attente",
	},
	{
		id: "p3",
		articleName: "Pepsi Cannette 33cl",
		articleRef: "BOI-102",
		qteCmde: 30,
		qtePrep: null,
		lotNumber: "",
		dlc: "",
		status: "en_attente",
	},
	{
		id: "p4",
		articleName: "T-Shirt Classic",
		articleRef: "TXT-101",
		qteCmde: 20,
		qtePrep: null,
		lotNumber: "",
		dlc: "",
		status: "en_attente",
	},
	{
		id: "p5",
		articleName: "Coca-Cola 33cl",
		articleRef: "BOI-101",
		qteCmde: 120,
		qtePrep: 120,
		lotNumber: "L2026-0312",
		dlc: "2026-09-15",
		status: "prepare",
	},
	{
		id: "p6",
		articleName: "Beurre President 250g",
		articleRef: "ALI-155",
		qteCmde: 60,
		qtePrep: 58,
		lotNumber: "L2026-0287",
		dlc: "2026-04-20",
		status: "anomalie",
	},
	{
		id: "p7",
		articleName: "Evian 1.5L",
		articleRef: "BOI-205",
		qteCmde: 200,
		qtePrep: null,
		lotNumber: "",
		dlc: "",
		status: "en_cours",
	},
	{
		id: "p8",
		articleName: "Pain de mie Harry's",
		articleRef: "ALI-042",
		qteCmde: 35,
		qtePrep: 35,
		lotNumber: "L2026-0301",
		dlc: "2026-03-28",
		status: "prepare",
	},
]

// ---------------------------------------------------------------------------
// Preparation columns
// ---------------------------------------------------------------------------

function createPrepColumns(
	onCellEdit: (rowId: string, columnId: string, value: unknown) => void
): DataTableColumnDef<PrepLine>[] {
	return [
		{
			accessorKey: "articleName",
			header: ({ column }) => <DataTableColumnHeader column={column} title="Article" />,
			cell: ({ row }) => (
				<div className="flex flex-col gap-0.5">
					<span className="font-medium text-fg">{row.original.articleName}</span>
					<span className="text-xs text-fg-muted font-mono">{row.original.articleRef}</span>
				</div>
			),
			enableSorting: true,
		} as DataTableColumnDef<PrepLine>,
		col.numeric<PrepLine>("qteCmde", { title: "Qte CMD", align: "right" }),
		col.editableNumber<PrepLine>("qtePrep", {
			title: "Qte Prep",
			onCellEdit,
			className: "text-right",
		}),
		col.editableText<PrepLine>("lotNumber", {
			title: "N° Lot",
			onCellEdit,
			placeholder: "—",
		}),
		col.editableDate<PrepLine>("dlc", {
			title: "DLC",
			onCellEdit,
		}),
		col.editableSelect<PrepLine>("status", {
			title: "Statut",
			onCellEdit,
			options: [
				{ label: "En attente", value: "en_attente" },
				{ label: "En cours", value: "en_cours" },
				{ label: "Prepare", value: "prepare" },
				{ label: "Anomalie", value: "anomalie" },
			],
		}),
	]
}

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

	// Preparation table state
	const [prepData, setPrepData] = React.useState<PrepLine[]>(() => prepLines)

	const handlePrepCellEdit = React.useCallback(
		(rowId: string, columnId: string, value: unknown, _previousValue?: unknown) => {
			setPrepData((prev) =>
				prev.map((row) => (row.id === rowId ? { ...row, [columnId]: value } : row))
			)
		},
		[]
	)

	const prepColumns = React.useMemo(
		() => createPrepColumns(handlePrepCellEdit),
		[handlePrepCellEdit]
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

				{/* Static table */}
				<section className="border-b border-container">
					<div className="flex items-center gap-3 px-6 py-3">
						<h2 className="text-sm font-semibold text-fg">Table statique</h2>
						<span className="rounded-full bg-surface-3 px-2 py-0.5 text-xs text-fg-muted">
							Composant Table de base
						</span>
					</div>
					<div className="px-6 pb-6">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Article</TableHead>
									<TableHead className="text-right">Qte</TableHead>
									<TableHead className="text-right">PU HT</TableHead>
									<TableHead className="text-right">Total TTC</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{(orderLines as OrderLineRow[]).slice(0, 8).map((line) => (
									<TableRow key={line.id}>
										<TableCell className="font-medium">{line.articleName}</TableCell>
										<TableCell className="text-right">{line.quantity}</TableCell>
										<TableCell className="text-right">
											{line.unitPriceHT.toLocaleString("fr-FR", {
												style: "currency",
												currency: "EUR",
											})}
										</TableCell>
										<TableCell className="text-right">
											{line.totalTTC.toLocaleString("fr-FR", {
												style: "currency",
												currency: "EUR",
											})}
										</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</section>

				{/* Editable table — Preparation de commande */}
				<section>
					<div className="flex items-center gap-3 px-6 py-3">
						<h2 className="text-sm font-semibold text-fg">Preparation de commande</h2>
						<span className="rounded-full bg-surface-3 px-2 py-0.5 text-xs text-fg-muted">
							Qte Prep, N° Lot, DLC, Statut editables
						</span>
					</div>
					<DataTable
						data={prepData}
						columns={prepColumns}
						getRowId={(row) => row.id}
						toolbarLayout="stacked"
						enableSorting
						enablePagination
						enableCellEditing
						onCellEdit={handlePrepCellEdit}
						rowActions={[
							{ id: "split", label: "Eclater la ligne", icon: Scissors, handler: () => {} },
							{
								id: "swap",
								label: "Substituer l'article",
								icon: ArrowLeftRight,
								handler: () => {},
							},
						]}
						locale="fr"
						variant="editable"
						pagination={{ pageSize: 10 }}
					/>
				</section>
			</div>
		</div>
	)
}
