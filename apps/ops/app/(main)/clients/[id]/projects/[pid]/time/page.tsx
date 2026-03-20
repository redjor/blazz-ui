"use client"

import type {
	BulkAction,
	DataTableColumnDef,
	DataTableView,
	RowAction,
} from "@blazz/pro/components/blocks/data-table"
import { DataTable } from "@blazz/pro/components/blocks/data-table"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
	Ban,
	CheckCircle2,
	CircleDashed,
	CircleDollarSign,
	CircleFadingArrowUp,
	FileText,
	Pencil,
	Plus,
	Receipt,
	Send,
	Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { use, useMemo, useState } from "react"
import { toast } from "sonner"
import { QuickTimeEntryModal } from "@/components/quick-time-entry-modal"
import { TimeEntryForm } from "@/components/time-entry-form"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { useFeatureFlags } from "@/lib/feature-flags-context"
import { formatMinutes } from "@/lib/format"
import {
	type EntryStatus,
	getAllowedTransitions,
	getEffectiveStatus,
} from "@/lib/time-entry-status"

export default function ProjectTimePage({ params }: { params: Promise<{ id: string; pid: string }> }) {
	const { isEnabled } = useFeatureFlags()
	const { id, pid } = use(params)
	const data = useQuery(api.projects.getWithStats, { id: pid as Id<"projects"> })
	const setStatus = useMutation(api.timeEntries.setStatus)
	const remove = useMutation(api.timeEntries.remove)
	const [editing, setEditing] = useState<Doc<"timeEntries"> | null>(null)
	const [quickEntryOpen, setQuickEntryOpen] = useState(false)
	const router = useRouter()

	// ---------------------------------------------------------------------------
	// DataTable config — time entries (hooks must be before early returns)
	// ---------------------------------------------------------------------------

	const statusConfig: Record<
		string,
		{ icon: typeof CircleDashed; iconClass: string; tint: string; label: string }
	> = {
		draft: {
			icon: CircleDashed,
			iconClass: "text-violet-500",
			tint: "oklch(0.65 0.15 300 / 0.08)",
			label: "À valider",
		},
		ready_to_invoice: {
			icon: CircleFadingArrowUp,
			iconClass: "text-amber-500",
			tint: "oklch(0.75 0.15 85 / 0.08)",
			label: "Prêt à facturer",
		},
		invoiced: {
			icon: CircleDollarSign,
			iconClass: "text-blue-500",
			tint: "oklch(0.65 0.15 250 / 0.08)",
			label: "Facturé",
		},
		paid: {
			icon: CheckCircle2,
			iconClass: "text-green-500",
			tint: "oklch(0.70 0.15 150 / 0.08)",
			label: "Payé",
		},
	}

	const entryColumns = useMemo<DataTableColumnDef<Doc<"timeEntries">>[]>(
		() => [
			{
				id: "status",
				accessorFn: (row) => getEffectiveStatus(row),
				header: "Statut",
				cell: ({ row }) => {
					if (!row.getIsGrouped()) return null
					const s = getEffectiveStatus(row.original)
					const cfg = s ? statusConfig[s] : null
					const Icon = cfg?.icon ?? Ban
					return (
						<span className="flex items-center gap-1.5 text-xs font-medium text-fg">
							<Icon className={`size-3.5 ${cfg?.iconClass ?? "text-fg-muted"}`} />
							{cfg ? cfg.label : "Non facturable"}
						</span>
					)
				},
				enableSorting: false,
				filterConfig: {
					type: "select",
					options: [
						{ label: "Non facturable", value: null },
						{ label: "À valider", value: "draft" },
						{ label: "Prêt à facturer", value: "ready_to_invoice" },
						{ label: "Facturé", value: "invoiced" },
						{ label: "Payé", value: "paid" },
					],
					showInlineFilter: true,
					defaultInlineFilter: true,
					filterLabel: "Statut",
				},
			},
			{
				accessorKey: "date",
				header: "Date",
				enableSorting: true,
				filterConfig: {
					type: "date",
					showInlineFilter: true,
					defaultInlineFilter: false,
					filterLabel: "Date",
				},
			},
			{
				accessorKey: "description",
				header: "Description",
				filterConfig: {
					type: "text",
					placeholder: "Rechercher…",
					showInlineFilter: true,
					defaultInlineFilter: false,
					filterLabel: "Description",
				},
			},
			{
				accessorKey: "minutes",
				header: "Durée",
				enableSorting: true,
			},
		],
		[]
	)

	const entryViews = useMemo<DataTableView[]>(
		() => [
			{
				id: "all",
				name: "Tout",
				isSystem: true,
				isDefault: true,
				filters: { id: "root", operator: "AND", conditions: [] },
				sorting: [{ id: "date", desc: true }],
			},
			{
				id: "draft",
				name: "À valider",
				isSystem: true,
				filters: {
					id: "draft-filter",
					operator: "AND",
					conditions: [
						{
							id: "draft-cond",
							column: "status",
							operator: "equals",
							value: "draft",
							type: "select",
						},
					],
				},
				sorting: [{ id: "date", desc: true }],
			},
			{
				id: "ready",
				name: "Prêt à facturer",
				isSystem: true,
				filters: {
					id: "ready-filter",
					operator: "AND",
					conditions: [
						{
							id: "ready-cond",
							column: "status",
							operator: "equals",
							value: "ready_to_invoice",
							type: "select",
						},
					],
				},
				sorting: [{ id: "date", desc: true }],
			},
			{
				id: "invoiced",
				name: "Facturé",
				isSystem: true,
				filters: {
					id: "invoiced-filter",
					operator: "AND",
					conditions: [
						{
							id: "invoiced-cond",
							column: "status",
							operator: "equals",
							value: "invoiced",
							type: "select",
						},
					],
				},
				sorting: [{ id: "date", desc: true }],
			},
			{
				id: "paid",
				name: "Payé",
				isSystem: true,
				filters: {
					id: "paid-filter",
					operator: "AND",
					conditions: [
						{
							id: "paid-cond",
							column: "status",
							operator: "equals",
							value: "paid",
							type: "select",
						},
					],
				},
				sorting: [{ id: "date", desc: true }],
			},
			{
				id: "non-billable",
				name: "Non facturable",
				isSystem: true,
				filters: {
					id: "non-billable-filter",
					operator: "AND",
					conditions: [
						{
							id: "non-billable-cond",
							column: "status",
							operator: "equals",
							value: null,
							type: "select",
						},
					],
				},
				sorting: [{ id: "date", desc: true }],
			},
		],
		[]
	)

	const entryRowActions = useMemo<RowAction<Doc<"timeEntries">>[]>(
		() => [
			{
				id: "edit",
				label: "Modifier",
				icon: Pencil,
				handler: (row) => setEditing(row.original),
			},
			{
				id: "mark-ready",
				label: "Prêt à facturer",
				hidden: (row) => getEffectiveStatus(row.original) !== "draft",
				handler: async (row) => {
					try {
						await setStatus({ ids: [row.original._id], status: "ready_to_invoice" })
						toast.success("Marqué prêt à facturer")
					} catch {
						toast.error("Erreur")
					}
				},
			},
			{
				id: "revert-to-draft",
				label: "Remettre à valider",
				hidden: (row) => !getAllowedTransitions(getEffectiveStatus(row.original)).includes("draft"),
				handler: async (row) => {
					try {
						await setStatus({ ids: [row.original._id], status: "draft" })
						toast.success("Remis à valider")
					} catch {
						toast.error("Erreur")
					}
				},
			},
			{
				id: "mark-invoiced",
				label: "Marquer facturé",
				hidden: (row) =>
					!getAllowedTransitions(getEffectiveStatus(row.original)).includes("invoiced"),
				handler: async (row) => {
					try {
						await setStatus({ ids: [row.original._id], status: "invoiced" })
						toast.success("Marqué facturé")
					} catch {
						toast.error("Erreur")
					}
				},
			},
			{
				id: "revert-to-ready",
				label: "Revenir à prêt à facturer",
				hidden: (row) => getEffectiveStatus(row.original) !== "invoiced",
				handler: async (row) => {
					try {
						await setStatus({ ids: [row.original._id], status: "ready_to_invoice" })
						toast.success("Revenu à prêt à facturer")
					} catch {
						toast.error("Erreur")
					}
				},
			},
			{
				id: "mark-paid",
				label: "Marquer payé",
				hidden: (row) => !getAllowedTransitions(getEffectiveStatus(row.original)).includes("paid"),
				handler: async (row) => {
					try {
						await setStatus({ ids: [row.original._id], status: "paid" })
						toast.success("Marqué payé")
					} catch {
						toast.error("Erreur")
					}
				},
			},
			{
				id: "delete",
				label: "Supprimer",
				icon: Trash2,
				variant: "destructive",
				separator: true,
				requireConfirmation: true,
				confirmationMessage: () => "Supprimer cette entrée ? Cette action est irréversible.",
				handler: async (row) => {
					try {
						await remove({ id: row.original._id })
						toast.success("Entrée supprimée")
					} catch {
						toast.error("Erreur lors de la suppression")
					}
				},
			},
		],
		[remove, setStatus]
	)

	const entryBulkActions = useMemo<BulkAction<Doc<"timeEntries">>[]>(
		() => [
			{
				id: "mark-ready",
				label: "Prêt à facturer",
				icon: Send,
				handler: async (rows) => {
					try {
						await setStatus({ ids: rows.map((r) => r.original._id), status: "ready_to_invoice" })
						toast.success(`${rows.length} entrée(s) marquée(s) prêt à facturer`)
					} catch {
						toast.error("Erreur")
					}
				},
			},
			{
				id: "mark-invoiced",
				label: "Facturé",
				icon: Receipt,
				handler: async (rows) => {
					try {
						await setStatus({ ids: rows.map((r) => r.original._id), status: "invoiced" })
						toast.success(`${rows.length} entrée(s) marquée(s) facturée(s)`)
					} catch {
						toast.error("Erreur")
					}
				},
			},
			{
				id: "mark-paid",
				label: "Payé",
				icon: CheckCircle2,
				handler: async (rows) => {
					try {
						await setStatus({ ids: rows.map((r) => r.original._id), status: "paid" })
						toast.success(`${rows.length} entrée(s) marquée(s) payée(s)`)
					} catch {
						toast.error("Erreur")
					}
				},
			},
			...(isEnabled("invoicing")
				? [
						{
							id: "create-invoice",
							label: "Facturer",
							icon: FileText,
							handler: async (_rows: Array<{ original: Doc<"timeEntries"> }>) => {
								if (!data) return
								router.push(`/invoices/new?clientId=${data.project.clientId}&projectId=${pid}`)
							},
						},
					]
				: []),
			{
				id: "delete",
				label: "Supprimer",
				icon: Trash2,
				variant: "destructive",
				requireConfirmation: true,
				confirmationMessage: (count) =>
					`Supprimer ${count} entrée(s) ? Cette action est irréversible.`,
				handler: async (rows) => {
					try {
						await Promise.all(rows.map((r) => remove({ id: r.original._id })))
						toast.success(`${rows.length} entrée(s) supprimée(s)`)
					} catch {
						toast.error("Erreur lors de la suppression")
					}
				},
			},
		],
		[remove, setStatus, router, pid, data]
	)

	// Loading state
	if (data === undefined) {
		return (
			<BlockStack gap="400" className="p-6">
				<InlineStack align="space-between" blockAlign="center">
					<Skeleton className="h-5 w-32" />
					<Skeleton className="h-8 w-28" />
				</InlineStack>
				<BlockStack gap="200">
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton key={i} className="h-10 rounded" />
					))}
				</BlockStack>
			</BlockStack>
		)
	}

	// Error / not found
	if (data === null) return null

	const { project, entries } = data

	return (
		<>
			<BlockStack gap="400" className="p-6 pb-0">
				<InlineStack align="space-between" blockAlign="center">
					<h2 className="text-sm font-medium text-fg">Entrées de temps</h2>
					<Button size="sm" variant="outline" onClick={() => setQuickEntryOpen(true)}>
						<Plus className="size-3.5 mr-1" />
						Nouvelle entrée
					</Button>
				</InlineStack>
			</BlockStack>
			<DataTable
				data={entries}
				columns={entryColumns}
				views={entryViews}
				rowActions={entryRowActions}
				bulkActions={entryBulkActions}
				toolbarLayout="stacked"
				enableSorting
				enableGlobalSearch
				enableAdvancedFilters
				enableCustomViews
				enableRowSelection
				enableGrouping
				defaultGrouping={["status"]}
				defaultExpanded
				groupRowStyle={(row) => {
					const s = row.getValue("status") as string | null
					const cfg = s ? statusConfig[s] : null
					return cfg ? { background: cfg.tint } : undefined
				}}
				groupAggregations={{
					minutes: (values) => {
						const total = (values as number[]).reduce((a, b) => a + b, 0)
						return <span className="font-mono text-xs tabular-nums">{formatMinutes(total)}</span>
					},
				}}
				enablePagination={false}
				searchPlaceholder="Rechercher une entrée…"
				locale="fr"
				variant="flat"
				defaultSorting={[{ id: "date", desc: true }]}
				getRowId={(row) => row._id}
				renderRow={(row) => {
					const entry = row.original
					const s = getEffectiveStatus(entry)
					const cfg = s ? statusConfig[s] : null
					const Icon = cfg?.icon ?? Ban
					const revenue = Math.round((entry.minutes / 60) * entry.hourlyRate)
					return (
						<>
							<div className="flex min-w-0 flex-1 items-center gap-3">
								<span
									className="text-fg-muted whitespace-nowrap"
									style={{ fontSize: 13, minWidth: 52 }}
								>
									{format(new Date(`${entry.date}T00:00:00`), "dd MMM", { locale: fr })}
								</span>
								<Icon className={`size-3.5 shrink-0 ${cfg?.iconClass ?? "text-fg-muted"}`} />
								<span className="font-mono text-xs tabular-nums text-fg whitespace-nowrap">
									{formatMinutes(entry.minutes)}
								</span>
								<span
									className={`truncate text-fg-muted ${!entry.description ? "italic" : ""}`}
									style={{ fontSize: 13 }}
								>
									{entry.description || "Pas de description"}
								</span>
							</div>
							<div className="flex shrink-0 items-center gap-3">
								{entry.billable && (
									<span className="font-mono text-xs tabular-nums text-fg whitespace-nowrap">
										{revenue.toLocaleString("fr-FR")} €
									</span>
								)}
							</div>
						</>
					)
				}}
			/>

			{/* Edit time entry dialog */}
			<Dialog open={!!editing} onOpenChange={(open) => !open && setEditing(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Modifier l'entrée</DialogTitle>
					</DialogHeader>
					{editing && (
						<TimeEntryForm
							defaultValues={{
								id: editing._id,
								projectId: editing.projectId,
								date: editing.date,
								minutes: editing.minutes,
								description: editing.description,
								billable: editing.billable,
								status: editing.status ?? "draft",
							}}
							onSuccess={() => setEditing(null)}
							onCancel={() => setEditing(null)}
						/>
					)}
				</DialogContent>
			</Dialog>

			{/* Quick time entry modal */}
			<QuickTimeEntryModal
				open={quickEntryOpen}
				onOpenChange={setQuickEntryOpen}
				projectId={project._id}
				projectName={project.name}
				hourlyRate={project.tjm / project.hoursPerDay}
				hoursPerDay={project.hoursPerDay}
				date={format(new Date(), "yyyy-MM-dd")}
			/>
		</>
	)
}
