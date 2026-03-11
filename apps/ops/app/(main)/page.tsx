"use client"

import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { StatsGrid } from "@blazz/ui/components/blocks/stats-grid"
import { useQuery } from "convex/react"
import { endOfMonth, format, startOfMonth } from "date-fns"
import { fr } from "date-fns/locale"
import { Banknote, Clock, FolderOpen } from "lucide-react"
import { api } from "@/convex/_generated/api"
import { formatCurrency, formatMinutes } from "@/lib/format"

export default function DashboardPage() {
	const now = new Date()
	const from = format(startOfMonth(now), "yyyy-MM-dd")
	const to = format(endOfMonth(now), "yyyy-MM-dd")

	const monthEntries = useQuery(api.timeEntries.list, { from, to })
	const activeProjects = useQuery(api.projects.listActive)
	const recentEntries = useQuery(api.timeEntries.recent, { limit: 10 })

	const isLoading = monthEntries === undefined

	const totalMinutes =
		monthEntries?.filter((e) => e.billable).reduce((s, e) => s + e.minutes, 0) ?? 0
	const totalAmount =
		monthEntries
			?.filter((e) => e.billable)
			.reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0) ?? 0
	const activeCount = activeProjects?.length ?? 0

	return (
		<div className="p-6 space-y-6">
				<PageHeader
					title={format(now, "MMMM yyyy", { locale: fr }).replace(/^\w/, (c) => c.toUpperCase())}
					description="Vue d'ensemble du mois en cours"
				/>

				<StatsGrid
					columns={3}
					loading={isLoading}
					stats={[
						{
							label: "Heures ce mois",
							value: formatMinutes(totalMinutes),
							icon: Clock,
						},
						{
							label: "Facturable ce mois",
							value: formatCurrency(totalAmount),
							icon: Banknote,
						},
						{
							label: "Projets actifs",
							value: activeCount,
							icon: FolderOpen,
						},
					]}
				/>

				{/* Active projects */}
				{(activeProjects?.length ?? 0) > 0 && (
					<div className="space-y-3">
						<h2 className="text-sm font-medium text-fg">Projets actifs</h2>
						<div className="space-y-1">
							{activeProjects?.map((project) => (
								<div
									key={project._id}
									className="flex items-center justify-between py-2 border-b border-edge last:border-0"
								>
									<p className="text-sm font-medium text-fg">{project.name}</p>
									<p className="text-xs text-fg-muted font-mono">
										{project.tjm}€/j · {project.hoursPerDay}h/j
									</p>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Recent entries */}
				{(recentEntries?.length ?? 0) > 0 && (
					<div className="space-y-3">
						<h2 className="text-sm font-medium text-fg">Entrées récentes</h2>
						<div className="space-y-0">
							{recentEntries?.map((entry) => (
								<div
									key={entry._id}
									className="flex items-center justify-between py-2.5 border-b border-edge last:border-0"
								>
									<div className="flex items-center gap-3">
										<span className="text-xs text-fg-muted w-20 shrink-0 font-mono">
											{format(new Date(entry.date + "T00:00:00"), "dd MMM", { locale: fr })}
										</span>
										<span className="text-sm text-fg">{entry.description ?? "—"}</span>
									</div>
									<span className="text-sm font-mono text-fg-muted tabular-nums">
										{formatMinutes(entry.minutes)}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				{!isLoading && monthEntries?.length === 0 && activeProjects?.length === 0 && (
					<p className="text-fg-muted text-sm">
						Pas encore de données. Créez un client et des projets pour commencer.
					</p>
				)}
			</div>
	)
}
