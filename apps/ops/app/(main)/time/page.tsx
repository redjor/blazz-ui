"use client"

import type { DataTableColumnDef, RowAction } from "@blazz/ui/components/blocks/data-table"
import { DataTable } from "@blazz/ui/components/blocks/data-table"
import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { Button } from "@blazz/ui/components/ui/button"
import { ConfirmationDialog } from "@blazz/ui/components/ui/confirmation-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { Input } from "@blazz/ui/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { useMutation, usePaginatedQuery, useQuery } from "convex/react"
import { addDays, addWeeks, format, startOfWeek, subWeeks } from "date-fns"
import { fr } from "date-fns/locale"
import { ChevronLeft, ChevronRight, Pencil, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { EntryStatusBadge } from "@/components/entry-status-badge"
import { useOpsTopBar } from "@/components/ops-frame"
import { QuickTimeEntryModal } from "@/components/quick-time-entry-modal"
import { TimeEntryForm } from "@/components/time-entry-form"
import { WeekGrid } from "@/components/week-grid"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { formatCurrency, formatMinutes } from "@/lib/format"
import { computeHourlyRate } from "@/lib/rate"
import { getAllowedTransitions, getEffectiveStatus } from "@/lib/time-entry-status"

type TimeEntry = Doc<"timeEntries">

type View = "list" | "week"

function getWeekStart(date: Date): Date {
	return startOfWeek(date, { weekStartsOn: 1 })
}

export default function TimePage() {
	const [view, setView] = useState<View>("week")
	const [weekStart, setWeekStart] = useState<Date>(() => getWeekStart(new Date()))

	const weekFrom = format(weekStart, "yyyy-MM-dd")
	const weekTo = format(addDays(weekStart, 6), "yyyy-MM-dd")
	const weekEntries = useQuery(
		api.timeEntries.list,
		view === "week" ? { from: weekFrom, to: weekTo } : "skip"
	)
	const activeProjects = useQuery(api.projects.listActive)
	const allProjects = useQuery(api.projects.listAll)

	// Filter state for list view
	const [filterProjectId, setFilterProjectId] = useState<Id<"projects"> | undefined>(undefined)
	const [filterStatus, setFilterStatus] = useState<
		"draft" | "ready_to_invoice" | "invoiced" | "paid" | undefined
	>(undefined)
	const [filterBillable, setFilterBillable] = useState<boolean | undefined>(undefined)
	const [filterFrom, setFilterFrom] = useState<string | undefined>(undefined)
	const [filterTo, setFilterTo] = useState<string | undefined>(undefined)

	const {
		results: allEntries,
		status: paginationStatus,
		loadMore,
	} = usePaginatedQuery(
		api.timeEntries.listPaginated,
		view === "list"
			? {
					projectId: filterProjectId,
					status: filterStatus,
					billable: filterBillable,
					from: filterFrom,
					to: filterTo,
				}
			: "skip",
		{ initialNumItems: 25 }
	)

	const remove = useMutation(api.timeEntries.remove)
	const setStatus = useMutation(api.timeEntries.setStatus)

	const [editing, setEditing] = useState<TimeEntry | null>(null)
	const [addOpen, setAddOpen] = useState(false)

	const [quickModal, setQuickModal] = useState<{
		open: boolean
		projectId: Id<"projects"> | null
		projectName: string | null
		hourlyRate: number | null
		date: string | null
	}>({ open: false, projectId: null, projectName: null, hourlyRate: null, date: null })

	const [deleteConfirm, setDeleteConfirm] = useState<{
		open: boolean
		entryId: Id<"timeEntries"> | null
	}>({ open: false, entryId: null })

	const columns = useMemo<DataTableColumnDef<TimeEntry>[]>(
		() => [
			{
				accessorKey: "date",
				header: "Date",
				cell: ({ row }) =>
					format(new Date(`${row.original.date}T00:00:00`), "dd MMM yyyy", { locale: fr }),
				enableSorting: true,
			},
			{
				accessorKey: "description",
				header: "Description",
				cell: ({ row }) => row.original.description ?? "—",
			},
			{
				accessorKey: "minutes",
				header: "Durée",
				cell: ({ row }) => <span className="font-mono">{formatMinutes(row.original.minutes)}</span>,
				enableSorting: true,
			},
			{
				accessorKey: "hourlyRate",
				header: "Taux",
				cell: ({ row }) => <span className="tabular-nums">{Math.round(row.original.hourlyRate)}€/h</span>,
				enableSorting: true,
			},
			{
				id: "amount",
				header: "Montant",
				cell: ({ row }) => {
					const amount = (row.original.minutes / 60) * row.original.hourlyRate
					return <span className="tabular-nums">{formatCurrency(amount)}</span>
				},
			},
			{
				id: "status",
				header: "Statut",
				cell: ({ row }) => <EntryStatusBadge status={getEffectiveStatus(row.original)} />,
			},
		],
		[]
	)

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
				hidden: (row) => !getAllowedTransitions(getEffectiveStatus(row.original)).includes("invoiced"),
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

	const weekLabel = useMemo(() => {
		const end = addDays(weekStart, 6)
		const sameMonth = weekStart.getMonth() === end.getMonth()
		const startStr = format(weekStart, sameMonth ? "d" : "d MMM", { locale: fr })
		const endStr = format(end, "d MMM yyyy", { locale: fr })
		return `${startStr} – ${endStr}`
	}, [weekStart])

	function resetFilters() {
		setFilterProjectId(undefined)
		setFilterStatus(undefined)
		setFilterBillable(undefined)
		setFilterFrom(undefined)
		setFilterTo(undefined)
	}
	const hasActiveFilters =
		filterProjectId !== undefined ||
		filterStatus !== undefined ||
		filterBillable !== undefined ||
		filterFrom !== undefined ||
		filterTo !== undefined

	useOpsTopBar([{ label: "Suivi de temps" }])

	return (
		<>
		<div className="p-6 space-y-6">
				<PageHeader
					title="Saisie des heures"
					actions={[{ label: "Nouvelle entrée", onClick: () => setAddOpen(true) }]}
				/>

				<div className="flex items-center gap-3">
					{/* Toggle Semaine/Liste */}
					<div className="flex items-center gap-1 rounded-lg border border-edge p-0.5 bg-raised">
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
							variant={view === "list" ? "default" : "ghost"}
							onClick={() => setView("list")}
							className="h-7 px-3 text-xs"
						>
							Liste
						</Button>
					</div>

					{/* Navigation semaine (seulement en vue semaine) */}
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
				</div>

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
							onCellClick={(projectId, date, existingEntry) => {
								if (existingEntry) {
									setEditing(existingEntry)
									return
								}
								const project = activeProjects?.find((p) => p._id === projectId)
								if (!project) return
								setQuickModal({
									open: true,
									projectId,
									projectName: project.name,
									hourlyRate: computeHourlyRate(project.tjm, project.hoursPerDay),
									date,
								})
							}}
							onCellDelete={(entryId) => {
								setDeleteConfirm({ open: true, entryId })
							}}
						/>
					</div>
				)}

				{view === "list" && (
					<div className="space-y-3">
						{/* Filter bar */}
						<div className="flex flex-wrap items-center gap-2">
							{/* Project filter */}
							<Select
								value={filterProjectId ?? ""}
								onValueChange={(val) =>
									setFilterProjectId(val === "" ? undefined : (val as Id<"projects">))
								}
								items={[
									{ value: "", label: "Tous les projets" },
									...(allProjects ?? []).map((p) => ({ value: p._id, label: p.name })),
								]}
							>
								<SelectTrigger className="h-8 w-[180px] text-xs">
									<SelectValue placeholder="Tous les projets" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="">Tous les projets</SelectItem>
									{(allProjects ?? []).map((p) => (
										<SelectItem key={p._id} value={p._id}>
											{p.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>

							{/* Status filter */}
							<Select
								value={filterStatus ?? ""}
								onValueChange={(val) =>
									setFilterStatus(
										val === ""
											? undefined
											: (val as "draft" | "ready_to_invoice" | "invoiced" | "paid")
									)
								}
								items={[
									{ value: "", label: "Tous les statuts" },
									{ value: "draft", label: "Brouillon" },
									{ value: "ready_to_invoice", label: "Prêt à facturer" },
									{ value: "invoiced", label: "Facturé" },
									{ value: "paid", label: "Payé" },
								]}
							>
								<SelectTrigger className="h-8 w-[180px] text-xs">
									<SelectValue placeholder="Tous les statuts" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="">Tous les statuts</SelectItem>
									<SelectItem value="draft">Brouillon</SelectItem>
									<SelectItem value="ready_to_invoice">Prêt à facturer</SelectItem>
									<SelectItem value="invoiced">Facturé</SelectItem>
									<SelectItem value="paid">Payé</SelectItem>
								</SelectContent>
							</Select>

							{/* Billable filter */}
							<Select
								value={filterBillable === undefined ? "" : filterBillable ? "true" : "false"}
								onValueChange={(val) =>
									setFilterBillable(val === "" ? undefined : val === "true")
								}
								items={[
									{ value: "", label: "Facturable / Non" },
									{ value: "true", label: "Facturable" },
									{ value: "false", label: "Non facturable" },
								]}
							>
								<SelectTrigger className="h-8 w-[160px] text-xs">
									<SelectValue placeholder="Facturable / Non" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="">Facturable / Non</SelectItem>
									<SelectItem value="true">Facturable</SelectItem>
									<SelectItem value="false">Non facturable</SelectItem>
								</SelectContent>
							</Select>

							{/* Date range */}
							<Input
								type="date"
								className="h-8 w-[140px] text-xs"
								value={filterFrom ?? ""}
								onChange={(e) => setFilterFrom(e.target.value === "" ? undefined : e.target.value)}
							/>
							<Input
								type="date"
								className="h-8 w-[140px] text-xs"
								value={filterTo ?? ""}
								onChange={(e) => setFilterTo(e.target.value === "" ? undefined : e.target.value)}
							/>

							{/* Reset */}
							{hasActiveFilters && (
								<Button
									type="button"
									variant="ghost"
									size="sm"
									className="h-8 px-2 text-xs text-muted-fg"
									onClick={resetFilters}
								>
									Réinitialiser
								</Button>
							)}
						</div>

						{/* DataTable */}
						<DataTable
							data={allEntries ?? []}
							columns={columns}
							rowActions={rowActions}
							isLoading={paginationStatus === "LoadingFirstPage"}
							enableSorting
							enableGlobalSearch
							enablePagination={false}
							searchPlaceholder="Rechercher…"
							locale="fr"
							defaultSorting={[{ id: "date", desc: true }]}
						/>

						{/* Load more footer */}
						{paginationStatus !== "LoadingFirstPage" && (
							<div className="flex items-center justify-between pt-1 text-sm text-muted-fg">
								<span>
									{(allEntries ?? []).length} entrée{(allEntries ?? []).length !== 1 ? "s" : ""} affichée{(allEntries ?? []).length !== 1 ? "s" : ""}
								</span>
								{paginationStatus === "CanLoadMore" && (
									<Button
										type="button"
										variant="outline"
										size="sm"
										className="h-7 px-3 text-xs"
										onClick={() => loadMore(25)}
									>
										Charger 25 de plus
									</Button>
								)}
								{paginationStatus === "Exhausted" && (
									<span className="text-xs">Toutes les entrées affichées</span>
								)}
								{paginationStatus === "LoadingMore" && (
									<span className="text-xs text-muted-fg">Chargement…</span>
								)}
							</div>
						)}
					</div>
				)}
			</div>

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
		</>
	)
}
