"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { Plus } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { ProjectForm } from "@/components/project-form"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

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

export default function ProjectsPageClient() {
	const projects = useQuery(api.projects.listAllWithBudget)
	const clients = useQuery(api.clients.list)
	const [filter, setFilter] = useState<StatusFilter>("active")
	const [open, setOpen] = useState(false)
	const [selectedClientId, setSelectedClientId] = useState<Id<"clients"> | "">("")

	const topBarActions = useMemo(
		() => (
			<Button size="icon-sm" variant="ghost" onClick={() => setOpen(true)}>
				<Plus className="size-4" />
			</Button>
		),
		[]
	)

	useAppTopBar([{ label: "Projets" }], topBarActions)

	const clientMap = new Map(clients?.map((c) => [c._id, c.name]))

	const clientItems = useMemo(() => (clients ?? []).map((c) => ({ value: c._id, label: c.name })), [clients])

	const filtered = projects?.filter((p) => (filter === "active" ? p.status === "active" : true)).sort((a, b) => a.name.localeCompare(b.name))

	if (projects === undefined) {
		return (
			<BlockStack gap="600" className="p-6">
				<Skeleton className="h-8 w-40" />
				<BlockStack gap="300">
					{Array.from({ length: 6 }).map((_, i) => (
						<Skeleton key={i} className="h-14 rounded-lg" />
					))}
				</BlockStack>
			</BlockStack>
		)
	}

	return (
		<BlockStack gap="600" className="p-6">
			<Dialog
				open={open}
				onOpenChange={(v) => {
					setOpen(v)
					if (!v) setSelectedClientId("")
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Nouveau projet</DialogTitle>
					</DialogHeader>
					{!selectedClientId ? (
						<div className="space-y-3">
							<p className="text-sm text-fg-muted">Sélectionnez un client</p>
							<Select value="" onValueChange={(v) => setSelectedClientId(v as Id<"clients">)} items={clientItems}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Choisir un client…" />
								</SelectTrigger>
								<SelectContent>
									{clientItems.map((c) => (
										<SelectItem key={c.value} value={c.value} label={c.label}>
											{c.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
					) : (
						<ProjectForm
							clientId={selectedClientId}
							onSuccess={() => {
								setOpen(false)
								setSelectedClientId("")
							}}
							onCancel={() => {
								setOpen(false)
								setSelectedClientId("")
							}}
						/>
					)}
				</DialogContent>
			</Dialog>

			<InlineStack align="space-between" blockAlign="center">
				<PageHeader title="Projets" />
				<InlineStack gap="150" blockAlign="center">
					{STATUS_FILTERS.map(({ key, label }) => (
						<button
							key={key}
							type="button"
							onClick={() => setFilter(key)}
							className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${filter === key ? "bg-brand text-white" : "bg-card border border-edge text-fg-muted hover:text-fg"}`}
						>
							{label}
						</button>
					))}
				</InlineStack>
			</InlineStack>

			{filtered?.length === 0 ? (
				<p className="text-sm text-fg-muted py-4">Aucun projet trouvé.</p>
			) : (
				<div>
					{filtered?.map((project) => (
						<InlineStack key={project._id} align="space-between" blockAlign="center" className="py-3 border-b border-edge last:border-0">
							<Link href={`/projects/${project._id}`} className="flex-1 min-w-0 hover:opacity-75 transition-opacity">
								<span className="block text-sm font-medium text-fg">{project.name}</span>
								<span className="block text-xs text-fg-muted mt-0.5 tabular-nums">
									{clientMap.get(project.clientId) ?? "…"} · {project.tjm}€/j
								</span>
							</Link>
							<InlineStack gap="400" blockAlign="center" className="shrink-0 ml-4">
								{/* Budget progress or days billed */}
								<span className="text-xs tabular-nums text-fg-muted text-right min-w-[120px]">
									{project.budgetAmount && project.budgetPercent !== null ? (
										<>
											<span
												className={
													project.budgetPercent >= 90 ? "text-red-600 dark:text-red-400 font-medium" : project.budgetPercent >= 70 ? "text-amber-600 dark:text-amber-400 font-medium" : "text-fg"
												}
											>
												{project.billableRevenue.toLocaleString("fr-FR")}€
											</span>
											{" / "}
											{project.budgetAmount.toLocaleString("fr-FR")}€<span className="text-fg-muted ml-1">({project.budgetPercent}%)</span>
										</>
									) : (
										<>{project.daysConsumed}j facturés</>
									)}
								</span>
								{project.hasActiveContract && project.contractType === "tma" && <span className="text-xs font-medium text-brand">TMA {project.contractDaysPerMonth}j/mois</span>}
								{project.hasActiveContract && project.contractType === "regie" && <span className="text-xs font-medium text-brand">Régie</span>}
								{/* Budget health dot */}
								{project.budgetPercent !== null && (
									<span className={`inline-block size-2 rounded-full ${project.budgetPercent >= 90 ? "bg-red-500" : project.budgetPercent >= 70 ? "bg-amber-500" : "bg-green-500"}`} />
								)}
								<InlineStack gap="150" blockAlign="center" className="text-xs text-fg-muted">
									<span className={`inline-block size-1.5 rounded-full ${statusDot[project.status]}`} />
									{statusLabel[project.status]}
								</InlineStack>
							</InlineStack>
						</InlineStack>
					))}
				</div>
			)}
		</BlockStack>
	)
}
