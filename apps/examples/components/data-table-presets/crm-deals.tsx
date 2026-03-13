"use client"

/**
 * CRM Deals preset for DataTable
 *
 * Pre-configured columns, views, and actions for deal/pipeline management.
 * Uses Forge CRM Deal type from sample-data.
 *
 * @module presets/crm-deals
 */

import { ArrowRightLeft } from "lucide-react"
import Link from "next/link"
import type { Deal } from "@/lib/sample-data"
import type { BulkAction, DataTableColumnDef, DataTableView, RowAction } from "../data-table.types"
import {
	createBulkActions,
	createCRUDActions,
	createCustomRowAction,
} from "../factories/action-builders"
import { col } from "../factories/col"
import { createCustomView, createStatusViews } from "../factories/view-builders"

/**
 * Configuration options for Deals preset
 */
export interface DealsPresetConfig {
	onView?: (deal: Deal) => void | Promise<void>
	onEdit?: (deal: Deal) => void | Promise<void>
	onDelete?: (deal: Deal) => void | Promise<void>
	onChangeStage?: (deal: Deal) => void | Promise<void>
	onBulkArchive?: (deals: Deal[]) => void | Promise<void>
	onBulkDelete?: (deals: Deal[]) => void | Promise<void>
}

/**
 * Return type for the Deals preset
 */
export interface DealsPreset {
	columns: DataTableColumnDef<Deal>[]
	views: DataTableView[]
	rowActions: RowAction<Deal>[]
	bulkActions: BulkAction<Deal>[]
}

/**
 * Source options for select filter
 */
const sourceOptions = [
	{ label: "Website", value: "Website" },
	{ label: "Referral", value: "Referral" },
	{ label: "LinkedIn", value: "LinkedIn" },
	{ label: "Salon", value: "Salon" },
	{ label: "Cold Call", value: "Cold Call" },
	{ label: "Partenaire", value: "Partenaire" },
]

/**
 * Creates a complete Deals preset for the Forge CRM DataTable.
 *
 * @example
 * ```typescript
 * const { columns, views, rowActions, bulkActions } = createDealsPreset({
 *   onView: (deal) => router.push(`/deals/${deal.id}`),
 *   onEdit: (deal) => router.push(`/deals/${deal.id}/edit`),
 *   onChangeStage: (deal) => openStageModal(deal),
 *   onBulkArchive: async (deals) => await bulkArchive(deals.map(d => d.id)),
 * });
 * ```
 */
export function createDealsPreset(config: DealsPresetConfig = {}): DealsPreset {
	const { onView, onEdit, onDelete, onChangeStage, onBulkArchive, onBulkDelete } = config

	const columns: DataTableColumnDef<Deal>[] = [
		col.text<Deal>("title", {
			title: "Opportunité",
			placeholder: "Rechercher par titre...",
			showInlineFilter: true,
			defaultInlineFilter: false,
			cellRenderer: (_value, row) => (
				<Link href={`/deals/${row.id}`} className="font-medium text-fg hover:underline">
					{row.title}
				</Link>
			),
		}),
		col.text<Deal>("companyName", {
			title: "Entreprise",
			showInlineFilter: false,
		}),
		col.text<Deal>("contactName", {
			title: "Contact",
			showInlineFilter: false,
		}),
		col.currency<Deal>("amount", {
			title: "Montant",
			currency: "EUR",
			locale: "fr-FR",
			showInlineFilter: true,
			defaultInlineFilter: false,
		}),
		col.numeric<Deal>("probability", {
			title: "Probabilité",
			formatter: (value) => `${value}%`,
			align: "right",
			showInlineFilter: false,
		}),
		col.status<Deal>("stage", {
			title: "Étape",
			statusMap: {
				lead: { variant: "secondary", label: "Lead" },
				qualified: { variant: "info", label: "Qualifié" },
				proposal: { variant: "warning", label: "Proposition" },
				negotiation: { variant: "primary", label: "Négociation" },
				closed_won: { variant: "success", label: "Gagné" },
				closed_lost: { variant: "destructive", label: "Perdu" },
			},
			filterOptions: [
				{ label: "Lead", value: "lead" },
				{ label: "Qualifié", value: "qualified" },
				{ label: "Proposition", value: "proposal" },
				{ label: "Négociation", value: "negotiation" },
				{ label: "Gagné", value: "closed_won" },
				{ label: "Perdu", value: "closed_lost" },
			],
			showInlineFilter: true,
			defaultInlineFilter: true,
		}),
		col.select<Deal>("source", {
			title: "Source",
			options: sourceOptions,
			showInlineFilter: true,
			defaultInlineFilter: false,
		}),
		col.text<Deal>("assignedTo", {
			title: "Responsable",
			showInlineFilter: false,
		}),
		col.date<Deal>("expectedCloseDate", {
			title: "Clôture prévue",
			locale: "fr-FR",
			showInlineFilter: false,
		}),
	]

	const statusViews = createStatusViews({
		column: "stage",
		statuses: [
			{ id: "lead", name: "Lead", value: "lead" },
			{ id: "qualified", name: "Qualifié", value: "qualified" },
			{ id: "proposal", name: "Proposition", value: "proposal" },
			{ id: "negotiation", name: "Négociation", value: "negotiation" },
			{ id: "closed_won", name: "Gagnés", value: "closed_won" },
			{ id: "closed_lost", name: "Perdus", value: "closed_lost" },
		],
		allViewName: "Tous",
	})

	const enCoursView = createCustomView({
		id: "en-cours",
		name: "En cours",
		isSystem: true,
		conditions: [
			{ column: "stage", operator: "equals", value: "lead", type: "select" },
			{ column: "stage", operator: "equals", value: "qualified", type: "select" },
			{ column: "stage", operator: "equals", value: "proposal", type: "select" },
			{ column: "stage", operator: "equals", value: "negotiation", type: "select" },
		],
		operator: "OR",
	})

	// Build final views: Tous, En cours, then individual stage views (excluding "all" from statusViews)
	const [allView, ...individualViews] = statusViews
	const views: DataTableView[] = [allView, enCoursView, ...individualViews]

	const crudActions = createCRUDActions<Deal>({
		onView,
		onEdit,
		onDelete,
		deleteConfirmation: (row) =>
			`Êtes-vous sûr de vouloir supprimer l\u2019opportunité "${row.original.title}" ?`,
		labels: {
			view: "Voir",
			edit: "Modifier",
			delete: "Supprimer",
		},
	})

	const changeStageAction = onChangeStage
		? [
				createCustomRowAction<Deal>({
					id: "change-stage",
					label: "Changer étape",
					icon: ArrowRightLeft,
					handler: onChangeStage,
					separator: true,
				}),
			]
		: []

	const rowActions: RowAction<Deal>[] = [...crudActions, ...changeStageAction]

	const bulkActions = createBulkActions<Deal>({
		onArchive: onBulkArchive,
		onDelete: onBulkDelete,
		archiveConfirmation: (count) => `Êtes-vous sûr de vouloir archiver ${count} opportunité(s) ?`,
		deleteConfirmation: (count) => `Êtes-vous sûr de vouloir supprimer ${count} opportunité(s) ?`,
		labels: {
			archive: "Archiver la sélection",
			delete: "Supprimer la sélection",
		},
	})

	return { columns, views, rowActions, bulkActions }
}
