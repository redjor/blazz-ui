"use client"

import type { Candidate } from "../../../../lib/talentflow-data"
import { Badge } from "../../../ui/badge"
import type { BulkAction, DataTableColumnDef, DataTableView, RowAction } from "../data-table.types"
import { DataTableColumnHeader } from "../data-table-column-header"
import { createBulkActions, createCRUDActions } from "../factories/action-builders"
import { createStatusColumn, createTextColumn } from "../factories/column-builders"
import { createStatusViews } from "../factories/view-builders"

export interface CandidatesPresetConfig {
	onView?: (candidate: Candidate) => void | Promise<void>
	onBulkArchive?: (candidates: Candidate[]) => void | Promise<void>
	onBulkDelete?: (candidates: Candidate[]) => void | Promise<void>
}

export interface CandidatesPreset {
	columns: DataTableColumnDef<Candidate>[]
	views: DataTableView[]
	rowActions: RowAction<Candidate>[]
	bulkActions: BulkAction<Candidate>[]
}

export function createCandidatesPreset(config: CandidatesPresetConfig = {}): CandidatesPreset {
	const { onView, onBulkArchive, onBulkDelete } = config

	const columns: DataTableColumnDef<Candidate>[] = [
		{
			accessorKey: "lastName",
			header: ({ column }) => <DataTableColumnHeader column={column} title="Nom" />,
			cell: ({ row }) => (
				<span className="font-medium text-fg">
					{row.original.firstName} {row.original.lastName}
				</span>
			),
			enableSorting: true,
			filterConfig: {
				type: "text",
				placeholder: "Rechercher par nom...",
				showInlineFilter: true,
				defaultInlineFilter: false,
				filterLabel: "Nom",
			},
		} as DataTableColumnDef<Candidate>,
		createTextColumn<Candidate>({
			accessorKey: "position",
			title: "Poste visé",
			showInlineFilter: true,
			defaultInlineFilter: false,
		}),
		createStatusColumn<Candidate>({
			accessorKey: "stage",
			title: "Étape",
			statusMap: {
				new: { variant: "secondary", label: "Nouveau" },
				screening: { variant: "info", label: "Screening" },
				interview: { variant: "info", label: "Entretien" },
				technical: { variant: "warning", label: "Technique" },
				offer: { variant: "success", label: "Offre" },
				hired: { variant: "success", label: "Embauché" },
				rejected: { variant: "critical", label: "Refusé" },
			},
			filterOptions: [
				{ label: "Nouveau", value: "new" },
				{ label: "Screening", value: "screening" },
				{ label: "Entretien", value: "interview" },
				{ label: "Technique", value: "technical" },
				{ label: "Offre", value: "offer" },
				{ label: "Embauché", value: "hired" },
				{ label: "Refusé", value: "rejected" },
			],
			showInlineFilter: true,
			defaultInlineFilter: true,
		}),
		createTextColumn<Candidate>({
			accessorKey: "source",
			title: "Source",
			showInlineFilter: false,
		}),
		{
			accessorKey: "score",
			header: ({ column }) => <DataTableColumnHeader column={column} title="Score" />,
			cell: ({ row }) => {
				const score = row.getValue("score") as number
				const variant = score >= 80 ? "success" : score >= 60 ? "warning" : "critical"
				return <Badge variant={variant}>{score}%</Badge>
			},
			enableSorting: true,
		} as DataTableColumnDef<Candidate>,
		createTextColumn<Candidate>({
			accessorKey: "appliedAt",
			title: "Date",
			showInlineFilter: false,
		}),
	]

	const views = createStatusViews({
		column: "stage",
		statuses: [
			{ id: "new", name: "Nouveaux", value: "new" },
			{ id: "interview", name: "En entretien", value: "interview" },
			{ id: "offer", name: "Offre envoyée", value: "offer" },
			{ id: "hired", name: "Embauchés", value: "hired" },
		],
		allViewName: "Tous",
	})

	const rowActions = createCRUDActions<Candidate>({
		onView,
		labels: { view: "Voir le profil" },
	})

	const bulkActions = createBulkActions<Candidate>({
		onArchive: onBulkArchive,
		onDelete: onBulkDelete,
		archiveConfirmation: (count) => `Archiver ${count} candidat(s) ?`,
		deleteConfirmation: (count) => `Supprimer ${count} candidat(s) ?`,
		labels: {
			archive: "Archiver la sélection",
			delete: "Supprimer la sélection",
		},
	})

	return { columns, views, rowActions, bulkActions }
}
