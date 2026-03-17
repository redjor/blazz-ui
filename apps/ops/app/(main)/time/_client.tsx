"use client"

import type {
	BulkAction,
	DataTableColumnDef,
	DataTableView,
	RowAction,
} from "@blazz/pro/components/blocks/data-table"
import { DataTable } from "@blazz/pro/components/blocks/data-table"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Button } from "@blazz/ui/components/ui/button"
import { ConfirmationDialog } from "@blazz/ui/components/ui/confirmation-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { Bleed } from "@blazz/ui/components/ui/bleed"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { useMutation, usePaginatedQuery, useQuery } from "convex/react"
import {
	addDays,
	addMonths,
	addWeeks,
	endOfMonth,
	format,
	startOfMonth,
	startOfWeek,
	subMonths,
	subWeeks,
} from "date-fns"
import { fr } from "date-fns/locale"
import {
	Ban,
	CheckCircle2,
	ChevronLeft,
	ChevronRight,
	CircleDollarSign,
	CircleDot,
	CircleDashed,
	CircleFadingArrowUp,
	Pencil,
	Send,
	Trash2,
	Receipt,
} from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { DayEntriesDialog } from "@/components/day-entries-dialog"
import { MonthCalendar } from "@/components/month-calendar"
import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { QuickTimeEntryModal } from "@/components/quick-time-entry-modal"
import { TimeEntryForm } from "@/components/time-entry-form"
import { WeekGrid } from "@/components/week-grid"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { formatMinutes } from "@/lib/format"
import { computeHourlyRate } from "@/lib/rate"
import { getAllowedTransitions, getEffectiveStatus } from "@/lib/time-entry-status"

type TimeEntryRaw = Doc<"timeEntries">
type TimeEntry = TimeEntryRaw & { dateRange: string }

type View = "list" | "week" | "totals"

function computeDateRange(date: string): string {
	const now = new Date()
	const ws = format(startOfWeek(now, { weekStartsOn: 1 }), "yyyy-MM-dd")
	const prevWs = format(startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }), "yyyy-MM-dd")
	const prevWe = format(
		addDays(startOfWeek(subWeeks(now, 1), { weekStartsOn: 1 }), 6),
		"yyyy-MM-dd"
	)
	const ms = format(startOfMonth(now), "yyyy-MM-dd")
	const prevMs = format(startOfMonth(subMonths(now, 1)), "yyyy-MM-dd")
	const prevMe = format(endOfMonth(subMonths(now, 1)), "yyyy-MM-dd")
	if (date >= ws) return "this_week"
	if (date >= prevWs && date <= prevWe) return "last_week"
	if (date >= ms) return "this_month"
	if (date >= prevMs && date <= prevMe) return "last_month"
	return "older"
}

function getWeekStart(date: Date): Date {
	return startOfWeek(date, { weekStartsOn: 1 })
}

export default function TimePageClient() {
	const [view, setView] = useState<View>("week")
	const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(new Date()))

	const weekFrom = format(weekStart, "yyyy-MM-dd")
	const weekTo = format(addDays(weekStart, 6), "yyyy-MM-dd")
	const weekEntries = useQuery(
		api.timeEntries.list,
		view === "week" ? { from: weekFrom, to: weekTo } : "skip"
	)
	const activeProjects = useQuery(api.projects.listActive)

	// Month calendar state
	const [currentMonth, setCurrentMonth] = useState<Date>(() => startOfMonth(new Date()))
	const monthFrom = format(currentMonth, "yyyy-MM-dd")
	const monthTo = format(endOfMonth(currentMonth), "yyyy-MM-dd")
	const monthEntries = useQuery(
		api.timeEntries.list,
		view === "totals" ? { from: monthFrom, to: monthTo } : "skip"
	)
	const allProjects = useQuery(api.projects.listAll)

	const {
		results: rawEntries,
		status: paginationStatus,
		loadMore,
	} = usePaginatedQuery(api.timeEntries.listPaginated, view === "list" ? {} : "skip", {
		initialNumItems: 100,
	})

	const allEntries = useMemo<TimeEntry[]>(
		() => (rawEntries ?? []).map((e) => ({ ...e, dateRange: computeDateRange(e.date) })),
		[rawEntries]
	)

	const remove = useMutation(api.timeEntries.remove)
	const setStatus = useMutation(api.timeEntries.setStatus)

	const [editing, setEditing] = useState<TimeEntryRaw | null>(null)
	const [addOpen, setAddOpen] = useState(false)

	const [quickModal, setQuickModal] = useState<{
		open: boolean
		projectId: Id<"projects"> | null
		projectName: string | null
		hourlyRate: number | null
		hoursPerDay: number | null
		date: string | null
	}>({
		open: false,
		projectId: null,
		projectName: null,
		hourlyRate: null,
		hoursPerDay: null,
		date: null,
	})

	const [deleteConfirm, setDeleteConfirm] = useState<{
		open: boolean
		entryId: Id<"timeEntries"> | null
	}>({ open: false, entryId: null })

	const [dayDetail, setDayDetail] = useState<{
		open: boolean
		projectId: Id<"projects"> | null
		projectName: string
		date: string
	}>({ open: false, projectId: null, projectName: "", date: "" })

	// Derive day entries from live Convex data so the dialog stays in sync
	const dayDetailEntries = useMemo(() => {
		if (!dayDetail.open || !dayDetail.projectId || !weekEntries) return []
		return weekEntries.filter(
			(e) => e.projectId === dayDetail.projectId && e.date === dayDetail.date
		)
	}, [dayDetail.open, dayDetail.projectId, dayDetail.date, weekEntries])

	const projectMap = useMemo(
		() => new Map((allProjects ?? []).map((p) => [p._id, p.name])),
		[allProjects]
	)

	// Derive project options for filters
	const projectOptions = useMemo(
		() => (allProjects ?? []).map((p) => ({ label: p.name, value: p._id })),
		[allProjects]
	)

	// ---------------------------------------------------------------------------
	// Data Table V2 — flat layout columns
	// ---------------------------------------------------------------------------

	const statusConfig: Record<
		string,
		{ dot: string; icon: typeof CircleDashed; iconClass: string; tint: string; label: string }
	> = {
		draft: {
			dot: "bg-violet-500",
			icon: CircleDashed,
			iconClass: "text-violet-500",
			tint: "oklch(0.65 0.15 300 / 0.08)",
			label: "À valider",
		},
		ready_to_invoice: {
			dot: "bg-amber-500",
			icon: CircleFadingArrowUp,
			iconClass: "text-amber-500",
			tint: "oklch(0.75 0.15 85 / 0.08)",
			label: "Prêt à facturer",
		},
		invoiced: {
			dot: "bg-blue-500",
			icon: CircleDollarSign,
			iconClass: "text-blue-500",
			tint: "oklch(0.65 0.15 250 / 0.08)",
			label: "Facturé",
		},
		paid: {
			dot: "bg-green-500",
			icon: CheckCircle2,
			iconClass: "text-green-500",
			tint: "oklch(0.70 0.15 150 / 0.08)",
			label: "Payé",
		},
	}

	const columns = useMemo<DataTableColumnDef<TimeEntry>[]>(
		() => [
			{
				id: "status",
				accessorFn: (row) => getEffectiveStatus(row),
				header: "Statut",
				cell: ({ row }) => {
					// Only used for group header rendering
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
				accessorKey: "dateRange",
				header: "Période",
				filterConfig: {
					type: "select",
					options: [
						{ label: "Cette semaine", value: "this_week" },
						{ label: "Semaine dernière", value: "last_week" },
						{ label: "Ce mois", value: "this_month" },
						{ label: "Mois dernier", value: "last_month" },
					],
					showInlineFilter: true,
					defaultInlineFilter: true,
					filterLabel: "Période",
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
			{
				id: "project",
				accessorFn: (row) => projectMap.get(row.projectId) ?? "",
				header: "Projet",
				enableSorting: true,
				filterConfig: {
					type: "select",
					options: projectOptions,
					showInlineFilter: true,
					defaultInlineFilter: true,
					filterLabel: "Projet",
				},
			},
		],
		[projectMap, projectOptions]
	)

	const views = useMemo<DataTableView[]>(
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

	// ---------------------------------------------------------------------------
	// Row actions
	// ---------------------------------------------------------------------------

	const rowActions = useMemo<RowAction<TimeEntry>[]>(
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

	const bulkActions = useMemo<BulkAction<TimeEntry>[]>(
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

	const weekLabel = useMemo(() => {
		const end = addDays(weekStart, 6)
		const sameMonth = weekStart.getMonth() === end.getMonth()
		const startStr = format(weekStart, sameMonth ? "d" : "d MMM", { locale: fr })
		const endStr = format(end, "d MMM yyyy", { locale: fr })
		return `${startStr} – ${endStr}`
	}, [weekStart])

	useAppTopBar([{ label: "Suivi de temps" }])

	return (
		<>
			<BlockStack gap="600" className="p-6">
				<PageHeader
					title="Saisie des heures"
					actions={[{ label: "Nouvelle entrée", onClick: () => setAddOpen(true) }]}
				/>

				<InlineStack gap="300" blockAlign="center">
					{/* Toggle Semaine/Mois/Liste */}
					<InlineStack
						gap="100"
						blockAlign="center"
						className="rounded-lg border border-edge p-0.5 bg-surface-3"
					>
						<Button
							type="button"
							size="sm"
							variant={view === "week" ? "default" : "ghost"}
							onClick={() => setView("week")}
							className="h-7 px-3 text-xs"
						>
							Semaine
						</Button>
						<Button
							type="button"
							size="sm"
							variant={view === "totals" ? "default" : "ghost"}
							onClick={() => setView("totals")}
							className="h-7 px-3 text-xs"
						>
							Mois
						</Button>
						<Button
							type="button"
							size="sm"
							variant={view === "list" ? "default" : "ghost"}
							onClick={() => setView("list")}
							className="h-7 px-3 text-xs"
						>
							Liste
						</Button>
					</InlineStack>

					{/* Navigation semaine */}
					{view === "week" && (
						<>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="size-8"
								onClick={() => setWeekStart((w) => subWeeks(w, 1))}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<span className="text-sm font-medium text-fg min-w-[160px] text-center capitalize">
								{weekLabel}
							</span>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="size-8"
								onClick={() => setWeekStart((w) => addWeeks(w, 1))}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="text-xs h-7 px-2"
								onClick={() => setWeekStart(getWeekStart(new Date()))}
							>
								Aujourd'hui
							</Button>
						</>
					)}

					{/* Navigation mois */}
					{view === "totals" && (
						<>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="size-8"
								onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
							>
								<ChevronLeft className="h-4 w-4" />
							</Button>
							<span className="text-sm font-medium text-fg min-w-[160px] text-center capitalize">
								{format(currentMonth, "MMMM yyyy", { locale: fr })}
							</span>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="size-8"
								onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
							>
								<ChevronRight className="h-4 w-4" />
							</Button>
							<Button
								type="button"
								variant="ghost"
								size="sm"
								className="text-xs h-7 px-2"
								onClick={() => setCurrentMonth(startOfMonth(new Date()))}
							>
								Ce mois
							</Button>
						</>
					)}
				</InlineStack>

				{view === "week" && (
					<div
						className={
							weekEntries === undefined || activeProjects === undefined
								? "opacity-50 pointer-events-none"
								: ""
						}
					>
						<WeekGrid
							weekStart={weekStart}
							entries={weekEntries ?? []}
							projects={activeProjects ?? []}
							onCellClick={(projectId, date, dayEntries) => {
								const project = activeProjects?.find((p) => p._id === projectId)
								if (!project) return
								if (dayEntries.length > 0) {
									setDayDetail({
										open: true,
										projectId,
										projectName: project.name,
										date,
									})
									return
								}
								setQuickModal({
									open: true,
									projectId,
									projectName: project.name,
									hourlyRate: computeHourlyRate(project.tjm, project.hoursPerDay),
									hoursPerDay: project.hoursPerDay,
									date,
								})
							}}
							onCellDelete={(entryId) => {
								setDeleteConfirm({ open: true, entryId })
							}}
						/>
					</div>
				)}

				{view === "totals" && (
					<div className={monthEntries === undefined ? "opacity-50 pointer-events-none" : ""}>
						<MonthCalendar month={currentMonth} entries={monthEntries ?? []} />
					</div>
				)}

				{view === "list" && (
					<>
						<Bleed marginInline="600">
							<DataTable
								data={allEntries}
								columns={columns}
								views={views}
								rowActions={rowActions}
								bulkActions={bulkActions}
								isLoading={paginationStatus === "LoadingFirstPage"}
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
										return (
											<span className="font-mono text-xs tabular-nums">{formatMinutes(total)}</span>
										)
									},
								}}
								enablePagination={false}
								searchPlaceholder="Rechercher une entrée…"
								locale="fr"
								variant="flat"
								storageKey="ops-time-entries"
								defaultSorting={[{ id: "date", desc: true }]}
								renderRow={(row) => {
									const entry = row.original
									const s = getEffectiveStatus(entry)
									const cfg = s ? statusConfig[s] : null
									return (
										<>
											<div className="flex min-w-0 flex-1 items-center gap-3">
												<span className="text-fg-muted whitespace-nowrap" style={{ fontSize: 13, minWidth: 52 }}>
													{format(new Date(`${entry.date}T00:00:00`), "dd MMM", { locale: fr })}
												</span>
												{(() => {
													const Icon = cfg?.icon ?? Ban
													return (
														<Icon
															className={`size-3.5 shrink-0 ${cfg?.iconClass ?? "text-fg-muted"}`}
														/>
													)
												})()}
												<span className="font-mono text-xs tabular-nums text-fg whitespace-nowrap">
													{formatMinutes(entry.minutes)}
												</span>
												<span className={`truncate text-fg-muted ${!entry.description ? "italic" : ""}`} style={{ fontSize: 13 }}>
													{entry.description || "Pas de description"}
												</span>
											</div>
											<div className="flex shrink-0 items-center gap-3">
												<span className="inline-flex items-center rounded-full bg-surface-3/70 px-2 py-0.5 text-[11px] text-fg-muted whitespace-nowrap">
													{projectMap.get(entry.projectId) ?? "—"}
												</span>
											</div>
										</>
									)
								}}
							/>
						</Bleed>
						{paginationStatus === "CanLoadMore" && (
							<InlineStack align="center" className="pt-1">
								<Button
									type="button"
									variant="outline"
									size="sm"
									className="h-7 px-3 text-xs"
									onClick={() => loadMore(100)}
								>
									Charger plus d'entrées
								</Button>
							</InlineStack>
						)}
					</>
				)}
			</BlockStack>

			<Dialog open={addOpen} onOpenChange={setAddOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Nouvelle entrée</DialogTitle>
					</DialogHeader>
					<TimeEntryForm onSuccess={() => setAddOpen(false)} onCancel={() => setAddOpen(false)} />
				</DialogContent>
			</Dialog>

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
								status: editing.status,
							}}
							onSuccess={() => setEditing(null)}
							onCancel={() => setEditing(null)}
						/>
					)}
				</DialogContent>
			</Dialog>

			<QuickTimeEntryModal
				open={quickModal.open}
				onOpenChange={(open) => setQuickModal((s) => ({ ...s, open }))}
				projectId={quickModal.projectId}
				projectName={quickModal.projectName}
				hourlyRate={quickModal.hourlyRate}
				hoursPerDay={quickModal.hoursPerDay}
				date={quickModal.date}
			/>

			<ConfirmationDialog
				open={deleteConfirm.open}
				onOpenChange={(open) => setDeleteConfirm((s) => ({ ...s, open }))}
				title="Supprimer l'entrée ?"
				description="Cette action est irréversible."
				confirmLabel="Supprimer"
				cancelLabel="Annuler"
				variant="destructive"
				onConfirm={async () => {
					if (!deleteConfirm.entryId) return
					try {
						await remove({ id: deleteConfirm.entryId })
						toast.success("Entrée supprimée")
					} catch {
						toast.error("Erreur lors de la suppression")
					}
				}}
			/>

			<DayEntriesDialog
				open={dayDetail.open}
				onOpenChange={(open) => setDayDetail((s) => ({ ...s, open }))}
				projectName={dayDetail.projectName}
				date={dayDetail.date}
				entries={dayDetailEntries}
				onEdit={(entry) => setEditing(entry)}
				onDelete={(entryId) => setDeleteConfirm({ open: true, entryId })}
				onAdd={() => {
					if (!dayDetail.projectId) return
					const project = activeProjects?.find((p) => p._id === dayDetail.projectId)
					if (!project) return
					setQuickModal({
						open: true,
						projectId: dayDetail.projectId,
						projectName: project.name,
						hourlyRate: computeHourlyRate(project.tjm, project.hoursPerDay),
						hoursPerDay: project.hoursPerDay,
						date: dayDetail.date,
					})
				}}
			/>
		</>
	)
}
