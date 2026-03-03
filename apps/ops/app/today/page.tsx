"use client"

import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { StatsGrid } from "@blazz/ui/components/blocks/stats-grid"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { useQuery } from "convex/react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { Banknote, Clock, Plus } from "lucide-react"
import { useState } from "react"
import { EditTodoDialog } from "@/components/edit-todo-dialog"
import { useOpsTopBar } from "@/components/ops-frame"
import { QuickTimeEntryModal } from "@/components/quick-time-entry-modal"
import { TimeEntryForm } from "@/components/time-entry-form"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { formatCurrency, formatMinutes } from "@/lib/format"
import { computeHourlyRate } from "@/lib/rate"

export default function TodayPage() {
	const today = format(new Date(), "yyyy-MM-dd")

	const todayEntries = useQuery(api.timeEntries.list, { from: today, to: today })
	const activeProjects = useQuery(api.projects.listActive)
	const todos = useQuery(api.todos.list, {})
	const categories = useQuery(api.categories.list, {})
	const allTags = useQuery(api.todos.listAllTags, {})

	const isLoading = todayEntries === undefined || activeProjects === undefined

	const billableEntries = todayEntries?.filter((e) => e.billable) ?? []
	const totalMinutesToday = billableEntries.reduce((s, e) => s + e.minutes, 0)
	const totalAmountToday = billableEntries.reduce(
		(s, e) => s + (e.minutes / 60) * e.hourlyRate,
		0
	)

	const activeTodos = todos?.filter((t) => t.status !== "done") ?? []
	const projectList = activeProjects ?? []
	const categoryList = categories ?? []
	const allTagsList = allTags ?? []

	const [addOpen, setAddOpen] = useState(false)
	const [editingEntry, setEditingEntry] = useState<Doc<"timeEntries"> | null>(null)
	const [editingTodo, setEditingTodo] = useState<Doc<"todos"> | null>(null)
	const [quickModal, setQuickModal] = useState<{
		open: boolean
		projectId: Id<"projects"> | null
		projectName: string | null
		hourlyRate: number | null
	}>({ open: false, projectId: null, projectName: null, hourlyRate: null })

	useOpsTopBar([{ label: "Aujourd'hui" }])

	const dateTitle = format(new Date(), "EEEE d MMMM yyyy", { locale: fr }).replace(
		/^\w/,
		(c) => c.toUpperCase()
	)

	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title={dateTitle}
				description="Votre journée en un coup d'œil"
				actions={[{ label: "Nouvelle entrée", onClick: () => setAddOpen(true) }]}
			/>

			<StatsGrid
				columns={2}
				loading={isLoading}
				stats={[
					{
						label: "Heures aujourd'hui",
						value: formatMinutes(totalMinutesToday),
						icon: Clock,
					},
					{
						label: "Facturable aujourd'hui",
						value: formatCurrency(totalAmountToday),
						icon: Banknote,
					},
				]}
			/>

			{/* Projets actifs */}
			<div className="space-y-3">
				<h2 className="text-sm font-medium text-fg">Projets actifs</h2>
				{projectList.length === 0 ? (
					<p className="text-sm text-fg-muted">Aucun projet actif.</p>
				) : (
					<div className="space-y-1">
						{projectList.map((project) => (
							<div
								key={project._id}
								className="flex items-center justify-between py-2 border-b border-edge last:border-0"
							>
								<div>
									<p className="text-sm font-medium text-fg">{project.name}</p>
									<p className="text-xs text-fg-muted tabular-nums">
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

			{/* Entrées d'aujourd'hui */}
			<div className="space-y-3">
				<h2 className="text-sm font-medium text-fg">Entrées d'aujourd'hui</h2>
				{todayEntries === undefined ? null : todayEntries.length === 0 ? (
					<p className="text-sm text-fg-muted">Aucune entrée pour aujourd'hui.</p>
				) : (
					<div className="space-y-0">
						{todayEntries.map((entry) => {
							const project = projectList.find((p) => p._id === entry.projectId)
							return (
								<button
									key={entry._id}
									type="button"
									className="w-full flex items-center justify-between py-2.5 border-b border-edge last:border-0 hover:bg-raised/50 transition-colors text-left"
									onClick={() => setEditingEntry(entry)}
								>
									<div className="flex items-center gap-3">
										<span className="text-xs text-fg-muted w-28 shrink-0 truncate">
											{project?.name ?? "—"}
										</span>
										<span className="text-sm text-fg">{entry.description ?? "—"}</span>
									</div>
									<span className="text-sm font-mono text-fg-muted tabular-nums">
										{formatMinutes(entry.minutes)}
									</span>
								</button>
							)
						})}
					</div>
				)}
			</div>

			{/* Todos actifs */}
			<div className="space-y-3">
				<h2 className="text-sm font-medium text-fg">Todos actifs</h2>
				{todos === undefined ? null : activeTodos.length === 0 ? (
					<p className="text-sm text-fg-muted">Aucun todo actif.</p>
				) : (
					<div className="space-y-0">
						{activeTodos.map((todo) => (
							<button
								key={todo._id}
								type="button"
								className="w-full flex items-center justify-between py-2.5 border-b border-edge last:border-0 hover:bg-raised/50 transition-colors text-left"
								onClick={() => setEditingTodo(todo)}
							>
								<span className="text-sm text-fg">{todo.text}</span>
								<span className="text-xs text-fg-muted capitalize">{todo.status}</span>
							</button>
						))}
					</div>
				)}
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

			{/* Dialog édition todo */}
			{editingTodo && (
				<EditTodoDialog
					key={editingTodo._id}
					todo={editingTodo}
					open={true}
					onOpenChange={(v) => !v && setEditingTodo(null)}
					projects={projectList}
					categories={categoryList}
					allTags={allTagsList}
				/>
			)}
		</div>
	)
}
