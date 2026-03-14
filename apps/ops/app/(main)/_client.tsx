"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { StatsGrid } from "@blazz/ui/components/blocks/stats-grid"
import { useQuery } from "convex/react"
import { endOfMonth, format, startOfMonth } from "date-fns"
import { fr } from "date-fns/locale"
import { Banknote, Clock, FolderOpen } from "lucide-react"
import { api } from "@/convex/_generated/api"
import { formatCurrency, formatMinutes } from "@/lib/format"

export default function DashboardPageClient() {
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
		<BlockStack gap="600" className="p-6">
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
				<BlockStack gap="300">
					<h2 className="text-sm font-medium text-fg">Projets actifs</h2>
					<BlockStack gap="100">
						{activeProjects?.map((project) => (
							<InlineStack
								key={project._id}
								blockAlign="center"
								align="space-between"
								className="py-2 border-b border-edge last:border-0"
							>
								<p className="text-sm font-medium text-fg">{project.name}</p>
								<p className="text-xs text-fg-muted font-mono">
									{project.tjm}€/j · {project.hoursPerDay}h/j
								</p>
							</InlineStack>
						))}
					</BlockStack>
				</BlockStack>
			)}

			{/* Recent entries */}
			{(recentEntries?.length ?? 0) > 0 && (
				<BlockStack gap="300">
					<h2 className="text-sm font-medium text-fg">Entrées récentes</h2>
					<BlockStack gap="0">
						{recentEntries?.map((entry) => (
							<InlineStack
								key={entry._id}
								blockAlign="center"
								align="space-between"
								className="py-2.5 border-b border-edge last:border-0"
							>
								<InlineStack gap="300" blockAlign="center">
									<span className="text-xs text-fg-muted w-20 shrink-0 font-mono">
										{format(new Date(`${entry.date}T00:00:00`), "dd MMM", { locale: fr })}
									</span>
									<span className="text-sm text-fg">{entry.description ?? "—"}</span>
								</InlineStack>
								<span className="text-sm font-mono text-fg-muted tabular-nums">
									{formatMinutes(entry.minutes)}
								</span>
							</InlineStack>
						))}
					</BlockStack>
				</BlockStack>
			)}

			{!isLoading && monthEntries?.length === 0 && activeProjects?.length === 0 && (
				<p className="text-fg-muted text-sm">
					Pas encore de données. Créez un client et des projets pour commencer.
				</p>
			)}
		</BlockStack>
	)
}
