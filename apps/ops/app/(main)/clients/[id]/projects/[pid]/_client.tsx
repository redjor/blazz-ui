"use client"

import type {
	BulkAction,
	DataTableColumnDef,
	DataTableView,
	RowAction,
} from "@blazz/pro/components/blocks/data-table"
import { DataTable } from "@blazz/pro/components/blocks/data-table"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Bleed } from "@blazz/ui/components/ui/bleed"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { InlineGrid } from "@blazz/ui/components/ui/inline-grid"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
	Ban,
	CheckCircle2,
	CircleDot,
	FileEdit,
	FileText,
	Pencil,
	Plus,
	Receipt,
	Send,
	Trash2,
} from "lucide-react"
import { use, useMemo, useState } from "react"
import { toast } from "sonner"
import { BudgetSection } from "@/components/budget-section"
import { ContractForm } from "@/components/contract-form"
import { ContractSection } from "@/components/contract-section"
import { InvoicePreviewDialog } from "@/components/invoice-preview-dialog"
import { InvoiceSection } from "@/components/invoice-section"
import { useOpsTopBar } from "@/components/ops-frame"
import { ProjectForm } from "@/components/project-form"
import { QuickTimeEntryModal } from "@/components/quick-time-entry-modal"
import { TimeEntryForm } from "@/components/time-entry-form"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { computeBudgetMetrics } from "@/lib/budget"
import { computeContractMetrics } from "@/lib/contracts"
import { formatMinutes } from "@/lib/format"
import {
	type EntryStatus,
	getAllowedTransitions,
	getEffectiveStatus,
} from "@/lib/time-entry-status"

interface Props {
	params: Promise<{ id: string; pid: string }>
}

export default function ProjectDetailPageClient({ params }: Props) {
	const { id, pid } = use(params)
	const data = useQuery(api.projects.getWithStats, { id: pid as Id<"projects"> })
	const client = useQuery(api.clients.get, { id: id as Id<"clients"> })
	const [editOpen, setEditOpen] = useState(false)
	const [quickEntryOpen, setQuickEntryOpen] = useState(false)
	const [contractOpen, setContractOpen] = useState(false)
	const [editingContract, setEditingContract] = useState<Doc<"contracts"> | null>(null)
	const activeContract = useQuery(api.contracts.getActiveByProject, {
		projectId: pid as Id<"projects">,
	})
	const allContracts = useQuery(api.contracts.listByProject, {
		projectId: pid as Id<"projects">,
	})
	const completeContract = useMutation(api.contracts.complete)
	const setStatus = useMutation(api.timeEntries.setStatus)
	const remove = useMutation(api.timeEntries.remove)
	const [editing, setEditing] = useState<Doc<"timeEntries"> | null>(null)
	const [invoiceEntries, setInvoiceEntries] = useState<Doc<"timeEntries">[]>([])
	const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false)

	useOpsTopBar(
		data != null
			? [
					{ label: "Clients", href: "/clients" },
					{ label: client?.name ?? "...", href: `/clients/${id}` },
					{ label: data.project.name },
				]
			: null
	)

	// ---------------------------------------------------------------------------
	// DataTable config — time entries (hooks must be before early returns)
	// ---------------------------------------------------------------------------

	const statusConfig: Record<
		string,
		{ icon: typeof FileEdit; iconClass: string; tint: string; label: string }
	> = {
		draft: {
			icon: FileEdit,
			iconClass: "text-violet-500",
			tint: "oklch(0.65 0.15 300 / 0.08)",
			label: "Brouillon",
		},
		ready_to_invoice: {
			icon: Send,
			iconClass: "text-amber-500",
			tint: "oklch(0.75 0.15 85 / 0.08)",
			label: "Prêt à facturer",
		},
		invoiced: {
			icon: CircleDot,
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
						{ label: "Brouillon", value: "draft" },
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
				name: "Brouillons",
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
				label: "Revenir en brouillon",
				hidden: (row) => !getAllowedTransitions(getEffectiveStatus(row.original)).includes("draft"),
				handler: async (row) => {
					try {
						await setStatus({ ids: [row.original._id], status: "draft" })
						toast.success("Remis en brouillon")
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
			{
				id: "create-invoice",
				label: "Facturer",
				icon: FileText,
				handler: async (rows) => {
					const readyEntries = rows
						.map((r) => r.original)
						.filter((e) => e.billable && (e.status === "ready_to_invoice" || (!e.status && !e.invoicedAt)))
					if (readyEntries.length === 0) {
						toast.error("Aucune entrée prête à facturer dans la sélection")
						return
					}
					setInvoiceEntries(readyEntries)
					setInvoiceDialogOpen(true)
				},
			},
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
		[remove, setStatus]
	)

	// Loading state
	if (data === undefined) {
		return (
			<BlockStack gap="600" className="p-6">
				<BlockStack gap="200">
					<Skeleton className="h-4 w-32" />
					<Skeleton className="h-6 w-56" />
				</BlockStack>
				<InlineGrid columns={4} gap="400">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-20 rounded-lg" />
					))}
				</InlineGrid>
				<Skeleton className="h-48 rounded-lg" />
				<BlockStack gap="200">
					{Array.from({ length: 5 }).map((_, i) => (
						<Skeleton key={i} className="h-10 rounded" />
					))}
				</BlockStack>
			</BlockStack>
		)
	}

	// Error / not found
	if (data === null) {
		return <div className="p-6 text-fg-muted text-sm">Projet introuvable.</div>
	}

	const { project, entries, stats } = data

	const budgetMetrics = computeBudgetMetrics({
		budgetAmount: project.budgetAmount,
		tjm: project.tjm,
		hoursPerDay: project.hoursPerDay,
		billableMinutes: stats.billableMinutes,
		billableRevenue: stats.billableRevenue,
	})

	const contractMetrics =
		activeContract && activeContract.type === "tma" && activeContract.daysPerMonth
			? computeContractMetrics({
					daysPerMonth: activeContract.daysPerMonth,
					carryOver: activeContract.carryOver,
					prestationStartDate: activeContract.prestationStartDate,
					startDate: activeContract.startDate,
					endDate: activeContract.endDate,
					hoursPerDay: project.hoursPerDay,
					entries: entries.map((e) => ({
						date: e.date,
						minutes: e.minutes,
						billable: e.billable,
					})),
				})
			: null

	const statusDot: Record<string, string> = {
		active: "bg-green-500",
		paused: "bg-amber-500",
		closed: "bg-fg-muted",
	}
	const statusLabel: Record<string, string> = {
		active: "Actif",
		paused: "En pause",
		closed: "Clôturé",
	}

	return (
		<>
			<BlockStack gap="800" className="p-6">
				<BlockStack gap="150">
					<PageHeader
						title={project.name}
						actions={[
							{
								label: "Modifier",
								variant: "outline",
								onClick: () => setEditOpen(true),
							},
						]}
					/>
					<InlineStack as="span" gap="150" blockAlign="center" className="text-xs text-fg-muted">
						<span className={`inline-block size-1.5 rounded-full ${statusDot[project.status]}`} />
						{statusLabel[project.status]}
					</InlineStack>
				</BlockStack>

				{/* KPI cards */}
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
					<Card>
						<CardContent className="p-4">
							<p className="text-xs text-fg-muted mb-1">CA total</p>
							<p className="text-xl font-semibold font-pixel">
								{stats.totalRevenue.toLocaleString("fr-FR")} €
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<p className="text-xs text-fg-muted mb-1">Facturé</p>
							<p className="text-xl font-semibold font-pixel text-green-600 dark:text-green-400">
								{stats.invoicedRevenue.toLocaleString("fr-FR")} €
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<p className="text-xs text-fg-muted mb-1">À facturer</p>
							<p className="text-xl font-semibold font-pixel text-amber-600 dark:text-amber-400">
								{stats.pendingRevenue.toLocaleString("fr-FR")} €
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<p className="text-xs text-fg-muted mb-1">Heures</p>
							<p className="text-xl font-semibold font-pixel">
								{formatMinutes(stats.totalMinutes)}
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Budget section */}
				{budgetMetrics && (
					<BudgetSection
						metrics={budgetMetrics}
						tjm={project.tjm}
						weeklyBurnDown={data.weeklyBurnDown ?? null}
					/>
				)}

				{/* Contract section */}
				{activeContract && (
					<ContractSection
						contract={activeContract}
						metrics={contractMetrics}
						onEdit={() => setEditingContract(activeContract)}
						onComplete={async () => {
							try {
								await completeContract({ id: activeContract._id })
								toast.success("Contrat clôturé")
							} catch (e) {
								toast.error(e instanceof Error ? e.message : "Erreur")
							}
						}}
					/>
				)}

				{/* Contract management */}
				<InlineStack align="space-between" blockAlign="center">
					<h2 className="text-sm font-medium text-fg">Contrats</h2>
					<Button size="sm" variant="outline" onClick={() => setContractOpen(true)}>
						Nouveau contrat
					</Button>
				</InlineStack>

				{/* Past contracts list */}
				{allContracts && allContracts.filter((c) => c.status !== "active").length > 0 && (
					<BlockStack gap="100">
						{allContracts
							.filter((c) => c.status !== "active")
							.map((c) => (
								<InlineStack
									key={c._id}
									align="space-between"
									blockAlign="center"
									className="py-2 border-b border-edge last:border-0 text-xs text-fg-muted"
								>
									<span className="font-mono">
										{c.startDate} → {c.endDate}
									</span>
									<span>
										{c.type === "tma"
											? `${c.daysPerMonth}j/mois`
											: c.type === "regie"
												? "Régie"
												: "Forfait"}{" "}
										· {c.status === "completed" ? "Terminé" : "Annulé"}
									</span>
								</InlineStack>
							))}
					</BlockStack>
				)}

				{/* Invoices section */}
				<InlineStack align="space-between" blockAlign="center">
					<h2 className="text-sm font-medium text-fg">Factures</h2>
					{(() => {
						const readyEntries = entries.filter(
							(e) => e.billable && e.status !== "invoiced" && e.status !== "paid" && !e.invoicedAt
						)
						return readyEntries.length > 0 ? (
							<Button
								size="sm"
								variant="outline"
								onClick={() => {
									setInvoiceEntries(readyEntries)
									setInvoiceDialogOpen(true)
								}}
							>
								<FileText className="size-3.5 mr-1" />
								Facturer ({readyEntries.length} entrée{readyEntries.length > 1 ? "s" : ""})
							</Button>
						) : null
					})()}
				</InlineStack>
				<InvoiceSection projectId={pid as Id<"projects">} />

				{/* Time entries DataTable */}
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
								<span className="truncate text-fg" style={{ fontSize: 13 }}>
									{entry.description || "—"}
								</span>
							</div>
							<div className="flex shrink-0 items-center gap-3">
								<span className="font-mono text-xs tabular-nums text-fg-muted whitespace-nowrap">
									{formatMinutes(entry.minutes)}
								</span>
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

			{/* Edit project dialog */}
			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Modifier le projet</DialogTitle>
					</DialogHeader>
					<ProjectForm
						clientId={project.clientId}
						defaultValues={{ ...project, id: project._id }}
						onSuccess={() => setEditOpen(false)}
						onCancel={() => setEditOpen(false)}
					/>
				</DialogContent>
			</Dialog>

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

			{/* New contract dialog */}
			<Dialog open={contractOpen} onOpenChange={setContractOpen}>
				<DialogContent size="lg" className="max-h-[85vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Nouveau contrat</DialogTitle>
					</DialogHeader>
					<ContractForm
						projectId={pid as Id<"projects">}
						onSuccess={() => setContractOpen(false)}
						onCancel={() => setContractOpen(false)}
					/>
				</DialogContent>
			</Dialog>

			{/* Edit contract dialog */}
			<Dialog open={!!editingContract} onOpenChange={(open) => !open && setEditingContract(null)}>
				<DialogContent size="lg" className="max-h-[85vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Modifier le contrat</DialogTitle>
					</DialogHeader>
					{editingContract && (
						<ContractForm
							projectId={pid as Id<"projects">}
							defaultValues={{
								id: editingContract._id,
								type: editingContract.type,
								daysPerMonth: editingContract.daysPerMonth,
								carryOver: editingContract.carryOver,
								prestationStartDate: editingContract.prestationStartDate,
								startDate: editingContract.startDate,
								endDate: editingContract.endDate,
								status: editingContract.status,
								notes: editingContract.notes,
							}}
							onSuccess={() => setEditingContract(null)}
							onCancel={() => setEditingContract(null)}
						/>
					)}
				</DialogContent>
			</Dialog>

			{/* Invoice preview dialog */}
			<InvoicePreviewDialog
				open={invoiceDialogOpen}
				onOpenChange={setInvoiceDialogOpen}
				projectId={pid as Id<"projects">}
				projectName={project.name}
				clientId={project.clientId}
				qontoClientId={client?.qontoClientId}
				entries={invoiceEntries}
				contractType={activeContract?.type}
			/>
		</>
	)
}
