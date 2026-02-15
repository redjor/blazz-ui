"use client"

import { useMemo, useCallback, useState } from "react"
import {
	DataTable,
	createSpreadsheetPreset,
	createTextColumn,
	createCurrencyColumn,
	createNumericColumn,
	createSelectColumn,
} from "@/components/features/data-table"
import type { Deal } from "@/lib/sample-data"
import { Badge } from "@/components/ui/badge"
import { Box } from "@/components/ui/box"
import { Page } from "@/components/ui/page"

const initialDeals: Deal[] = [
	{ id: "d1", title: "Migration cloud Acme", amount: 85000, stage: "negotiation", probability: 70, expectedCloseDate: "2025-03-15", source: "Inbound", companyId: "c1", companyName: "Acme Corp", contactName: "Marie Dupont", assignedTo: "Sophie Martin", createdAt: "2024-11-20" },
	{ id: "d2", title: "Licence SaaS TechVision", amount: 24000, stage: "proposal", probability: 50, expectedCloseDate: "2025-04-01", source: "Outbound", companyId: "c2", companyName: "TechVision SAS", contactName: "Sophie Bernard", assignedTo: "Sophie Martin", createdAt: "2025-01-10" },
	{ id: "d3", title: "ERP Industrie Dupont", amount: 320000, stage: "qualified", probability: 30, expectedCloseDate: "2025-06-30", source: "Salon", companyId: "c3", companyName: "Industrie Dupont", contactName: "Jean Lefebvre", assignedTo: "Marc Leroy", createdAt: "2024-12-05" },
	{ id: "d4", title: "Dashboard GreenEnergy", amount: 45000, stage: "lead", probability: 15, expectedCloseDate: "2025-05-15", source: "Référencement", companyId: "c4", companyName: "GreenEnergy", contactName: "Isabelle Moreau", assignedTo: "Sophie Martin", createdAt: "2025-02-01" },
	{ id: "d5", title: "Refonte site MédiaSud", amount: 18000, stage: "closed_won", probability: 100, expectedCloseDate: "2025-01-31", source: "Inbound", companyId: "c5", companyName: "MédiaSud", contactName: "Thomas Petit", assignedTo: "Sophie Martin", createdAt: "2024-10-15" },
	{ id: "d6", title: "Support annuel GlobalTech", amount: 36000, stage: "closed_won", probability: 100, expectedCloseDate: "2025-02-28", source: "Outbound", companyId: "c6", companyName: "GlobalTech", contactName: "Claire Durand", assignedTo: "Marc Leroy", createdAt: "2024-09-10" },
	{ id: "d7", title: "API FinanceConnect", amount: 72000, stage: "proposal", probability: 60, expectedCloseDate: "2025-05-01", source: "Partenaire", companyId: "c7", companyName: "FinanceConnect", contactName: "Pierre Martin", assignedTo: "Marc Leroy", createdAt: "2025-01-15" },
	{ id: "d8", title: "Audit sécurité CyberShield", amount: 28000, stage: "negotiation", probability: 80, expectedCloseDate: "2025-03-31", source: "LinkedIn", companyId: "c8", companyName: "CyberShield", contactName: "Laurent Mercier", assignedTo: "Sophie Martin", createdAt: "2024-12-20" },
	{ id: "d9", title: "Formation DevOps CloudNine", amount: 12000, stage: "lead", probability: 10, expectedCloseDate: "2025-07-15", source: "Inbound", companyId: "c9", companyName: "CloudNine", contactName: "Nathalie Roy", assignedTo: "Marc Leroy", createdAt: "2025-02-05" },
	{ id: "d10", title: "Plateforme data DataWave", amount: 156000, stage: "qualified", probability: 40, expectedCloseDate: "2025-08-30", source: "Salon", companyId: "c10", companyName: "DataWave", contactName: "François Blanc", assignedTo: "Sophie Martin", createdAt: "2025-01-28" },
]

const stageOptions = [
	{ label: "Lead", value: "lead" },
	{ label: "Qualifié", value: "qualified" },
	{ label: "Proposition", value: "proposal" },
	{ label: "Négociation", value: "negotiation" },
	{ label: "Gagné", value: "closed_won" },
	{ label: "Perdu", value: "closed_lost" },
]

const stageLabels: Record<string, { label: string; variant: "default" | "success" | "critical" | "warning" | "info" }> = {
	lead: { label: "Lead", variant: "default" },
	qualified: { label: "Qualifié", variant: "info" },
	proposal: { label: "Proposition", variant: "warning" },
	negotiation: { label: "Négociation", variant: "warning" },
	closed_won: { label: "Gagné", variant: "success" },
	closed_lost: { label: "Perdu", variant: "critical" },
}

export default function EditableTablePage() {
	const [deals, setDeals] = useState<Deal[]>(initialDeals)
	const [editLog, setEditLog] = useState<string[]>([])

	const handleCellEdit = useCallback((rowId: string, columnId: string, value: unknown) => {
		setDeals((prev) =>
			prev.map((deal) =>
				deal.id === rowId ? { ...deal, [columnId]: value } : deal
			)
		)
		setEditLog((prev) => [
			`${columnId} de "${deals.find((d) => d.id === rowId)?.title}" → ${value}`,
			...prev.slice(0, 9),
		])
	}, [deals])

	const preset = useMemo(
		() => createSpreadsheetPreset<Deal>({
			columns: [
				{ accessorKey: "title", title: "Titre", type: "text" },
				{ accessorKey: "companyName", title: "Entreprise", type: "text", editable: false },
				{ accessorKey: "contactName", title: "Contact", type: "text", editable: false },
				{ accessorKey: "amount", title: "Montant", type: "currency", currency: "EUR", locale: "fr-FR" },
				{ accessorKey: "probability", title: "Probabilité (%)", type: "number", min: 0, max: 100 },
				{ accessorKey: "stage", title: "Étape", type: "select", options: stageOptions },
			],
			onCellEdit: handleCellEdit,
		}),
		[handleCellEdit]
	)

	const readOnlyColumns = useMemo(() => [
		createTextColumn<Deal>({ accessorKey: "title", title: "Titre", showInlineFilter: false }),
		createTextColumn<Deal>({ accessorKey: "companyName", title: "Entreprise", showInlineFilter: false }),
		createTextColumn<Deal>({ accessorKey: "contactName", title: "Contact", showInlineFilter: false }),
		createCurrencyColumn<Deal>({ accessorKey: "amount", title: "Montant", currency: "EUR", locale: "fr-FR" }),
		createNumericColumn<Deal>({ accessorKey: "probability", title: "Probabilité (%)" }),
		createSelectColumn<Deal>({ accessorKey: "stage", title: "Étape", options: stageOptions, showInlineFilter: false }),
	], [])

	const totalPipeline = deals
		.filter((d) => !["closed_won", "closed_lost"].includes(d.stage))
		.reduce((sum, d) => sum + d.amount, 0)

	const weightedPipeline = deals
		.filter((d) => !["closed_won", "closed_lost"].includes(d.stage))
		.reduce((sum, d) => sum + d.amount * (d.probability / 100), 0)

	return (
		<Page
			title="Tableau éditable"
			subtitle="Modification inline des cellules avec persistance en temps réel. Cliquez sur une cellule pour éditer directement."
			fullWidth
		>
			<div className="space-y-6">
				{/* KPI Cards */}
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					<Box background="white" border="default" borderRadius="lg" padding="4">
						<p className="text-xs text-muted-foreground">Deals actifs</p>
						<p className="text-2xl font-semibold">{deals.filter((d) => !["closed_won", "closed_lost"].includes(d.stage)).length}</p>
					</Box>
					<Box background="white" border="default" borderRadius="lg" padding="4">
						<p className="text-xs text-muted-foreground">Pipeline total</p>
						<p className="text-2xl font-semibold">{new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(totalPipeline)}</p>
					</Box>
					<Box background="white" border="default" borderRadius="lg" padding="4">
						<p className="text-xs text-muted-foreground">Pipeline pondéré</p>
						<p className="text-2xl font-semibold">{new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(weightedPipeline)}</p>
					</Box>
					<Box background="white" border="default" borderRadius="lg" padding="4">
						<p className="text-xs text-muted-foreground">Taux moyen</p>
						<p className="text-2xl font-semibold">
							{Math.round(deals.reduce((sum, d) => sum + d.probability, 0) / deals.length)}%
						</p>
					</Box>
				</div>

				{/* Editable Table */}
				<Box background="white" border="default" borderRadius="lg" className="overflow-hidden">
					<DataTable
						data={deals}
						columns={preset.columns}
						getRowId={(row) => row.id}
						enableSorting
						enablePagination={false}
						locale="fr"
						variant="spreadsheet"
					/>
				</Box>

				{/* Read-only comparison table */}
				<div>
					<p className="mb-2 text-sm font-medium text-muted-foreground">Comparaison — Tableau standard (non éditable, variant par défaut)</p>
					<Box background="white" border="default" borderRadius="lg" className="overflow-hidden">
						<DataTable
							data={deals}
							columns={readOnlyColumns}
							getRowId={(row) => row.id}
							enableSorting
							enablePagination={false}
							locale="fr"
						/>
					</Box>
				</div>

				{/* Edit Log */}
				{editLog.length > 0 && (
					<Box background="muted" borderRadius="lg" padding="4">
						<p className="mb-2 text-xs font-medium text-muted-foreground">Modifications récentes</p>
						<div className="space-y-1">
							{editLog.map((entry, i) => (
								<p key={`${entry}-${i}`} className="text-xs text-muted-foreground">
									{entry}
								</p>
							))}
						</div>
					</Box>
				)}

				{/* Stage Legend */}
				<div className="flex flex-wrap gap-2">
					{Object.entries(stageLabels).map(([key, { label, variant }]) => (
						<Badge key={key} variant={variant}>{label}</Badge>
					))}
				</div>
			</div>
		</Page>
	)
}
