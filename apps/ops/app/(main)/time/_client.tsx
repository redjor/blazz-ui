"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { ConfirmationDialog } from "@blazz/ui/components/ui/confirmation-dialog"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
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
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { TimeListView, type TimeEntry, type TimeEntryRaw } from "./_list-view"
import { DayEntriesDialog } from "@/components/day-entries-dialog"
import { MonthCalendar } from "@/components/month-calendar"
import { QuickTimeEntryModal } from "@/components/quick-time-entry-modal"
import { TimeEntryForm } from "@/components/time-entry-form"
import { WeekGrid } from "@/components/week-grid"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { computeHourlyRate } from "@/lib/rate"

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
	// Data Table (extracted to _list-view.tsx)
	// ---------------------------------------------------------------------------

	const weekLabel = useMemo(() => {
		const end = addDays(weekStart, 6)
		const sameMonth = weekStart.getMonth() === end.getMonth()
		const startStr = format(weekStart, sameMonth ? "d" : "d MMM", { locale: fr })
		const endStr = format(end, "d MMM yyyy", { locale: fr })
		return `${startStr} – ${endStr}`
	}, [weekStart])

	const topBarActions = useMemo(
		() => (
			<Button size="icon-sm" variant="ghost" onClick={() => setAddOpen(true)}>
				<Plus className="size-4" />
			</Button>
		),
		[]
	)

	useAppTopBar([{ label: "Suivi de temps" }], topBarActions)

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
					<TimeListView
						data={allEntries}
						paginationStatus={paginationStatus}
						loadMore={loadMore}
						projectMap={projectMap}
						projectOptions={projectOptions}
						onEdit={setEditing}
						setStatus={setStatus}
						remove={remove}
					/>
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
								tags: editing.tags,
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
