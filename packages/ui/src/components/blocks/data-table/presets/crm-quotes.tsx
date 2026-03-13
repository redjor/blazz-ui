"use client"

/**
 * CRM Quotes preset for DataTable
 *
 * Pre-configured columns, views, and actions for quote management.
 * Uses Forge CRM Quote type from sample-data.
 *
 * @module presets/crm-quotes
 */

import { Copy, Printer, Trash } from "lucide-react"
import Link from "next/link"
import type { Quote } from "../../../../lib/sample-data"
import type { BulkAction, DataTableColumnDef, DataTableView, RowAction } from "../data-table.types"
import {
	createBulkActions,
	createCRUDActions,
	createCustomRowAction,
} from "../factories/action-builders"
import { col } from "../factories/col"
import { createStatusViews } from "../factories/view-builders"

/**
 * Configuration options for Quotes preset
 */
export interface QuotesPresetConfig {
	onView?: (quote: Quote) => void | Promise<void>
	onDuplicate?: (quote: Quote) => void | Promise<void>
	onPrint?: (quote: Quote) => void | Promise<void>
	onDelete?: (quote: Quote) => void | Promise<void>
	onBulkDelete?: (quotes: Quote[]) => void | Promise<void>
}

/**
 * Return type for the Quotes preset
 */
export interface QuotesPreset {
	columns: DataTableColumnDef<Quote>[]
	views: DataTableView[]
	rowActions: RowAction<Quote>[]
	bulkActions: BulkAction<Quote>[]
}

/**
 * Creates a complete Quotes preset for the Forge CRM DataTable.
 *
 * @example
 * ```typescript
 * const { columns, views, rowActions } = createQuotesPreset({
 *   onView: (quote) => router.push(`/quotes/${quote.id}`),
 *   onDuplicate: async (quote) => await duplicateQuote(quote.id),
 *   onPrint: (quote) => window.print(),
 *   onDelete: async (quote) => await deleteQuote(quote.id),
 * });
 * ```
 */
export function createQuotesPreset(config: QuotesPresetConfig = {}): QuotesPreset {
	const { onView, onDuplicate, onPrint, onDelete, onBulkDelete } = config

	const columns: DataTableColumnDef<Quote>[] = [
		col.text<Quote>("reference", {
			title: "Référence",
			placeholder: "Rechercher par référence...",
			showInlineFilter: true,
			defaultInlineFilter: false,
			cellRenderer: (_value, row) => (
				<Link href={`/quotes/${row.id}`} className="font-medium text-fg hover:underline">
					{row.reference}
				</Link>
			),
		}),
		col.text<Quote>("dealTitle", {
			title: "Opportunité",
			showInlineFilter: false,
		}),
		col.text<Quote>("companyName", {
			title: "Entreprise",
			showInlineFilter: false,
		}),
		col.currency<Quote>("total", {
			title: "Total",
			currency: "EUR",
			locale: "fr-FR",
			showInlineFilter: true,
			defaultInlineFilter: false,
		}),
		col.status<Quote>("status", {
			title: "Statut",
			statusMap: {
				draft: { variant: "secondary", label: "Brouillon" },
				sent: { variant: "info", label: "Envoyé" },
				accepted: { variant: "success", label: "Accepté" },
				rejected: { variant: "critical", label: "Refusé" },
				expired: { variant: "outline", label: "Expiré" },
			},
			filterOptions: [
				{ label: "Brouillon", value: "draft" },
				{ label: "Envoyé", value: "sent" },
				{ label: "Accepté", value: "accepted" },
				{ label: "Refusé", value: "rejected" },
				{ label: "Expiré", value: "expired" },
			],
			showInlineFilter: true,
			defaultInlineFilter: true,
		}),
		col.date<Quote>("validUntil", {
			title: "Valide jusqu\u2019au",
			locale: "fr-FR",
			showInlineFilter: false,
		}),
	]

	const views = createStatusViews({
		column: "status",
		statuses: [
			{ id: "draft", name: "Brouillons", value: "draft" },
			{ id: "sent", name: "Envoyés", value: "sent" },
			{ id: "accepted", name: "Acceptés", value: "accepted" },
		],
		allViewName: "Tous",
	})

	const crudActions = createCRUDActions<Quote>({
		onView,
		labels: {
			view: "Voir",
		},
	})

	const customActions: RowAction<Quote>[] = []

	if (onDuplicate) {
		customActions.push(
			createCustomRowAction<Quote>({
				id: "duplicate",
				label: "Dupliquer",
				icon: Copy,
				handler: onDuplicate,
				separator: true,
			})
		)
	}

	if (onPrint) {
		customActions.push(
			createCustomRowAction<Quote>({
				id: "print",
				label: "Imprimer",
				icon: Printer,
				handler: onPrint,
			})
		)
	}

	if (onDelete) {
		customActions.push(
			createCustomRowAction<Quote>({
				id: "delete",
				label: "Supprimer",
				icon: Trash,
				handler: onDelete,
				separator: true,
				requireConfirmation: true,
				confirmationMessage: (quote) =>
					`Êtes-vous sûr de vouloir supprimer le devis "${quote.reference}" ?`,
			})
		)
	}

	const rowActions: RowAction<Quote>[] = [...crudActions, ...customActions]

	const bulkActions = createBulkActions<Quote>({
		onDelete: onBulkDelete,
		deleteConfirmation: (count) => `Êtes-vous sûr de vouloir supprimer ${count} devis ?`,
		labels: {
			delete: "Supprimer la sélection",
		},
	})

	return { columns, views, rowActions, bulkActions }
}
