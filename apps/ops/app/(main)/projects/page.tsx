"use client"

import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import Link from "next/link"
import { useState } from "react"
import { useOpsTopBar } from "@/components/ops-frame"
import { api } from "@/convex/_generated/api"

type StatusFilter = "active" | "all"

const STATUS_FILTERS: Array<{ key: StatusFilter; label: string }> = [
	{ key: "active", label: "Actifs" },
	{ key: "all", label: "Tous" },
]

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

export default function ProjectsPage() {
	const projects = useQuery(api.projects.listAllWithBudget)
	const clients = useQuery(api.clients.list)
	const [filter, setFilter] = useState<StatusFilter>("active")

	useOpsTopBar([{ label: "Projets" }])

	const clientMap = new Map(clients?.map((c) => [c._id, c.name]))

	const filtered = projects
		?.filter((p) => (filter === "active" ? p.status === "active" : true))
		.sort((a, b) => a.name.localeCompare(b.name))

	if (projects === undefined) {
		return (
			<div className="p-6 space-y-6">
				<Skeleton className="h-8 w-40" />
				<div className="space-y-3">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className="h-14 rounded-lg" />
					))}
				</div>
			</div>
		)
	}

	return (
		<div className="p-6 space-y-6">
			<div className="flex items-center justify-between">
				<PageHeader title="Projets" />
				<div className="flex items-center gap-1.5">
					{STATUS_FILTERS.map(({ key, label }) => (
						<button
							key={key}
							type="button"
							onClick={() => setFilter(key)}
							className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
								filter === key
									? "bg-brand text-white"
									: "bg-surface border border-edge text-fg-muted hover:text-fg"
							}`}
						>
							{label}
						</button>
					))}
				</div>
			</div>

			{filtered?.length === 0 ? (
				<p className="text-sm text-fg-muted py-4">Aucun projet trouvé.</p>
			) : (
				<div>
					{filtered?.map((project) => (
						<div
							key={project._id}
							className="flex items-center justify-between py-3 border-b border-edge last:border-0"
						>
							<Link
								href={`/clients/${project.clientId}/projects/${project._id}`}
								className="flex-1 min-w-0 hover:opacity-75 transition-opacity"
							>
								<span className="block text-sm font-medium text-fg">
									{project.name}
								</span>
								<span className="block text-xs text-fg-muted mt-0.5 tabular-nums">
									{clientMap.get(project.clientId) ?? "…"} · {project.tjm}€/j
								</span>
							</Link>
							<div className="flex items-center gap-4 shrink-0 ml-4">
								{/* Budget progress or days billed */}
								<span className="text-xs tabular-nums text-fg-muted text-right min-w-[120px]">
									{project.budgetAmount && project.budgetPercent !== null ? (
										<>
											<span className={
												project.budgetPercent >= 90
													? "text-red-600 dark:text-red-400 font-medium"
													: project.budgetPercent >= 70
														? "text-amber-600 dark:text-amber-400 font-medium"
														: "text-fg"
											}>
												{project.billableRevenue.toLocaleString("fr-FR")}€
											</span>
											{" / "}
											{project.budgetAmount.toLocaleString("fr-FR")}€
											<span className="text-fg-muted ml-1">({project.budgetPercent}%)</span>
										</>
									) : (
										<>{project.daysConsumed}j facturés</>
									)}
								</span>
								{project.hasActiveContract && project.contractType === "tma" && (
									<span className="text-xs font-medium text-brand">
										TMA {project.contractDaysPerMonth}j/mois
									</span>
								)}
								{/* Budget health dot */}
								{project.budgetPercent !== null && (
									<span
										className={`inline-block size-2 rounded-full ${
											project.budgetPercent >= 90
												? "bg-red-500"
												: project.budgetPercent >= 70
													? "bg-amber-500"
													: "bg-green-500"
										}`}
									/>
								)}
								<span className="flex items-center gap-1.5 text-xs text-fg-muted">
									<span
										className={`inline-block size-1.5 rounded-full ${statusDot[project.status]}`}
									/>
									{statusLabel[project.status]}
								</span>
							</div>
						</div>
					))}
				</div>
			)}
		</div>
	)
}
