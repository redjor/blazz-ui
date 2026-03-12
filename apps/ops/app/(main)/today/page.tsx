"use client"

import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { StatsGrid } from "@blazz/ui/components/blocks/stats-grid"
import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardHeader, CardTitle } from "@blazz/ui/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { useQuery } from "convex/react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Banknote, Clock, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { CurrentSessionCard } from "@/components/current-session-card"
import { DayTimelineCard, type TimelineItem } from "@/components/day-timeline-card"
import { EnergyCheckCard, type EnergyLevel } from "@/components/energy-check-card"
import { useOpsTopBar } from "@/components/ops-frame"
import { QuickTimeEntryModal } from "@/components/quick-time-entry-modal"
import { TimeEntryForm } from "@/components/time-entry-form"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { formatCurrency, formatMinutes } from "@/lib/format"
import { computeHourlyRate } from "@/lib/rate"

export default function TodayPage() {
	const router = useRouter()
	const today = format(new Date(), "yyyy-MM-dd")

	const todayEntries = useQuery(api.timeEntries.list, { from: today, to: today })
	const activeProjects = useQuery(api.projects.listActive)
	const todos = useQuery(api.todos.list, {})

	const isLoading =
		todayEntries === undefined || activeProjects === undefined || todos === undefined

	const billableEntries = todayEntries?.filter((e) => e.billable) ?? []
	const totalMinutesToday = billableEntries.reduce((s, e) => s + e.minutes, 0)
	const totalAmountToday = billableEntries.reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0)

	const activeTodos = todos?.filter((t) => t.status !== "done") ?? []
	const projectList = activeProjects ?? []

	const [addOpen, setAddOpen] = useState(false)
	const [editingEntry, setEditingEntry] = useState<Doc<"timeEntries"> | null>(null)
	const [energy, setEnergy] = useState<EnergyLevel | null>("medium")
	const [quickModal, setQuickModal] = useState<{
		open: boolean
		projectId: Id<"projects"> | null
		projectName: string | null
		hourlyRate: number | null
	}>({ open: false, projectId: null, projectName: null, hourlyRate: null })

	useOpsTopBar([{ label: "Aujourd'hui" }])

	const dateTitle = format(new Date(), "EEEE d MMMM yyyy", { locale: fr }).replace(/^\w/, (c) =>
		c.toUpperCase()
	)
	const timelineItems: TimelineItem[] = (todayEntries ?? []).map((entry, index) => {
		const project = projectList.find((p) => p._id === entry.projectId)
		const kind = entry.billable ? "focus" : "admin"

		return {
			id: entry._id,
			start: `${9 + index}:00`,
			end: `${9 + index}:${entry.minutes >= 30 ? "30" : "00"}`,
			minutes: entry.minutes,
			label: entry.description || project?.name || "Bloc sans titre",
			description: entry.description,
			kind,
			projectName: project?.name,
		}
	})
	const uncategorizedMinutes = Math.max(0, 8 * 60 - totalMinutesToday)
	const currentSession =
		timelineItems.length > 0
			? {
					label: timelineItems[timelineItems.length - 1].label,
					projectName: timelineItems[timelineItems.length - 1].projectName,
					startLabel: timelineItems[timelineItems.length - 1].start ?? "Maintenant",
					elapsedLabel: formatMinutes(timelineItems[timelineItems.length - 1].minutes),
					kind: timelineItems[timelineItems.length - 1].kind === "focus" ? "focus" : "admin",
				}
			: null

	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title={dateTitle}
				description="Votre journée en un coup d'œil"
				actions={[{ label: "Nouvelle entrée", onClick: () => setAddOpen(true) }]}
			/>

			<StatsGrid
				columns={3}
				loading={isLoading}
				stats={[
					{
						label: "Temps conscient",
						value: formatMinutes(totalMinutesToday),
						icon: Clock,
					},
					{
						label: "Facturable",
						value: formatCurrency(totalAmountToday),
						icon: Banknote,
					},
					{
						label: "Zone floue",
						value: formatMinutes(uncategorizedMinutes),
						icon: Clock,
					},
				]}
			/>

			<div className="grid gap-6 xl:grid-cols-[minmax(0,1.5fr)_380px]">
				<DayTimelineCard
					title="Timeline du jour"
					items={timelineItems}
					onAddClick={() => setAddOpen(true)}
					onItemClick={(id) => {
						const entry = todayEntries?.find((item) => item._id === id)
						if (entry) setEditingEntry(entry)
					}}
				/>

				<div className="space-y-4">
					<CurrentSessionCard
						session={currentSession}
						onStart={() => setAddOpen(true)}
						onPause={() => setAddOpen(true)}
						onStop={() => setAddOpen(true)}
						onSwitch={() => setAddOpen(true)}
					/>
					<EnergyCheckCard value={energy} onChange={setEnergy} />

					<Card>
						<CardHeader className="border-b border-separator">
							<CardTitle>Projets actifs</CardTitle>
						</CardHeader>
						<div>
							{projectList.length === 0 ? (
								<p className="px-6 py-4 text-sm text-fg-muted">Aucun projet actif.</p>
							) : (
								<div className="space-y-0">
									{projectList.map((project) => (
										<div
											key={project._id}
											className="flex items-center justify-between border-b border-edge px-6 py-3 last:border-0"
										>
											<div>
												<p className="text-sm font-medium text-fg">{project.name}</p>
												<p className="text-xs text-fg-muted font-mono">
													{project.tjm}€/j · {project.hoursPerDay}h/j
												</p>
											</div>
											<Button
												type="button"
												variant="outline"
												size="sm"
												className="h-7 px-3 text-xs gap-1.5"
												onClick={() =>
													setQuickModal({
														open: true,
														projectId: project._id,
														projectName: project.name,
														hourlyRate: computeHourlyRate(project.tjm, project.hoursPerDay),
													})
												}
											>
												<Plus className="size-3" />
												Log
											</Button>
										</div>
									))}
								</div>
							)}
						</div>
					</Card>
				</div>
			</div>

			<div className="grid gap-6 lg:grid-cols-2">
				<Card>
					<CardHeader className="border-b border-separator">
						<CardTitle>Entrées d'aujourd'hui</CardTitle>
					</CardHeader>
					<div>
						{todayEntries === undefined ? (
							<p className="px-6 py-4 text-sm text-fg-muted">Chargement…</p>
						) : todayEntries.length === 0 ? (
							<p className="px-6 py-4 text-sm text-fg-muted">Aucune entrée pour aujourd'hui.</p>
						) : (
							<div className="space-y-0">
								{todayEntries.map((entry) => {
									const project = projectList.find((p) => p._id === entry.projectId)
									return (
										<button
											key={entry._id}
											type="button"
											className="flex w-full items-center justify-between border-b border-edge px-6 py-3 text-left transition-colors hover:bg-raised/50 last:border-0"
											onClick={() => setEditingEntry(entry)}
										>
											<div className="flex items-center gap-3">
												<span className="w-28 shrink-0 truncate text-xs text-fg-muted">
													{project?.name ?? "—"}
												</span>
												<span className="text-sm text-fg">{entry.description ?? "—"}</span>
											</div>
											<span className="font-mono text-sm text-fg-muted tabular-nums">
												{formatMinutes(entry.minutes)}
											</span>
										</button>
									)
								})}
							</div>
						)}
					</div>
				</Card>

				<Card>
					<CardHeader className="border-b border-separator">
						<CardTitle>Todos actifs</CardTitle>
					</CardHeader>
					<div>
						{todos === undefined ? (
							<p className="px-6 py-4 text-sm text-fg-muted">Chargement…</p>
						) : activeTodos.length === 0 ? (
							<p className="px-6 py-4 text-sm text-fg-muted">Aucun todo actif.</p>
						) : (
							<div className="space-y-0">
								{activeTodos.map((todo) => (
									<button
										key={todo._id}
										type="button"
										className="flex w-full items-center justify-between border-b border-edge px-6 py-3 text-left transition-colors hover:bg-raised/50 last:border-0"
										onClick={() => router.push(`/todos/${todo._id}`)}
									>
										<span className="text-sm text-fg">{todo.text}</span>
										<span className="text-xs text-fg-muted capitalize">{todo.status}</span>
									</button>
								))}
							</div>
						)}
					</div>
				</Card>
			</div>

			{/* Dialog nouvelle entrée */}
			<Dialog open={addOpen} onOpenChange={setAddOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Nouvelle entrée</DialogTitle>
					</DialogHeader>
					<TimeEntryForm onSuccess={() => setAddOpen(false)} onCancel={() => setAddOpen(false)} />
				</DialogContent>
			</Dialog>

			{/* Dialog édition entrée */}
			<Dialog open={!!editingEntry} onOpenChange={(open) => !open && setEditingEntry(null)}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Modifier l'entrée</DialogTitle>
					</DialogHeader>
					{editingEntry && (
						<TimeEntryForm
							defaultValues={{
								id: editingEntry._id,
								projectId: editingEntry.projectId,
								date: editingEntry.date,
								minutes: editingEntry.minutes,
								description: editingEntry.description,
								billable: editingEntry.billable,
								status: editingEntry.status,
							}}
							onSuccess={() => setEditingEntry(null)}
							onCancel={() => setEditingEntry(null)}
						/>
					)}
				</DialogContent>
			</Dialog>

			{/* Quick log modal */}
			<QuickTimeEntryModal
				open={quickModal.open}
				onOpenChange={(open) => setQuickModal((s) => ({ ...s, open }))}
				projectId={quickModal.projectId}
				projectName={quickModal.projectName}
				hourlyRate={quickModal.hourlyRate}
				date={today}
			/>

		</div>
	)
}
