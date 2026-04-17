"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button, buttonVariants } from "@blazz/ui/components/ui/button"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { ArrowRight, MessageSquare, Plus, Settings } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { BudgetMeter } from "@/app/(main)/mission-control/_components/budget-meter"
import { AgentAvatar } from "@/app/(main)/missions/_components/agent-avatar"
import { MissionForm } from "@/app/(main)/missions/_components/mission-form"
import { api } from "@/convex/_generated/api"

type AgentStatus = "idle" | "busy" | "paused" | "error" | "disabled"

const STATUS_DOT: Record<AgentStatus, string> = {
	busy: "bg-emerald-500 animate-pulse",
	idle: "bg-fg-muted/40",
	paused: "bg-caution",
	error: "bg-critical",
	disabled: "bg-fg-muted/20",
}

const STATUS_LABEL: Record<AgentStatus, string> = {
	busy: "En mission",
	idle: "Au repos",
	paused: "En pause",
	error: "Erreur",
	disabled: "Désactivé",
}

const MISSION_STATUS_LABEL: Record<string, string> = {
	planning: "Planification",
	todo: "À faire",
	in_progress: "En cours",
	review: "À valider",
	done: "Terminée",
	rejected: "Rejetée",
	aborted: "Annulée",
}

const MEMORY_CATEGORY_LABEL: Record<string, string> = {
	fact: "Fait",
	preference: "Préférence",
	episode: "Épisode",
	pattern: "Pattern",
	rule: "Règle",
}

function SectionHeader({ title, href }: { title: string; href?: string }) {
	return (
		<InlineStack align="space-between" blockAlign="center">
			<span className="text-xs font-medium text-fg-muted uppercase tracking-wider">{title}</span>
			{href && (
				<Link href={href} className="text-xs text-brand hover:underline">
					Voir tout →
				</Link>
			)}
		</InlineStack>
	)
}

function StatBlock({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
	return (
		<Card>
			<CardContent className="pt-4">
				<BlockStack gap="100">
					<span className="text-xs text-fg-muted">{label}</span>
					<span className="text-xl font-semibold tabular-nums tracking-tight">{value}</span>
					{hint && <span className="text-xs text-fg-muted">{hint}</span>}
				</BlockStack>
			</CardContent>
		</Card>
	)
}

export function AgentOverviewClient({ slug }: { slug: string }) {
	const agent = useQuery(api.agents.getBySlug, { slug })
	const missions = useQuery(api.missions.listByAgent, agent ? { agentId: agent._id } : "skip")
	const memories = useQuery(api.agentMemory.list, agent ? { agentId: agent._id } : "skip")
	const [formOpen, setFormOpen] = useState(false)

	useAppTopBar(agent != null ? [{ label: "Mission Control", href: "/mission-control" }, { label: agent.name }] : null)

	const stats = useMemo(() => {
		if (!missions) return null
		const total = missions.length
		const thisMonth = missions.filter((m) => {
			const d = new Date(m._creationTime)
			const now = new Date()
			return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
		}).length
		const completed = missions.filter((m) => m.status === "done").length
		const inProgress = missions.filter((m) => m.status === "in_progress" || m.status === "review").length
		const totalCost = missions.reduce((s, m) => s + (m.costUsd ?? 0), 0)
		return { total, thisMonth, completed, inProgress, totalCost }
	}, [missions])

	const recentMissions = useMemo(() => {
		if (!missions) return []
		return [...missions].sort((a, b) => b._creationTime - a._creationTime).slice(0, 5)
	}, [missions])

	if (agent === undefined) {
		return (
			<BlockStack gap="600" className="p-6">
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-32 w-full" />
				<Skeleton className="h-64 w-full" />
			</BlockStack>
		)
	}

	if (agent === null) {
		return (
			<BlockStack gap="400" className="p-6 items-center justify-center">
				<p className="text-lg font-medium text-fg">Agent introuvable</p>
				<p className="text-sm text-fg-muted">L&apos;agent "{slug}" n&apos;existe pas.</p>
				<Link href="/mission-control" className={buttonVariants({ variant: "secondary", size: "sm" })}>
					Retour Mission Control
				</Link>
			</BlockStack>
		)
	}

	const status = (agent.status ?? "idle") as AgentStatus

	return (
		<BlockStack gap="600" className="p-6">
			{/* ── Header ── */}
			<Card>
				<CardContent className="p-5">
					<InlineStack align="space-between" blockAlign="start" wrap>
						<InlineStack gap="400" blockAlign="center" wrap={false}>
							<span className="relative shrink-0">
								<AgentAvatar name={agent.name} size={64} />
								<span className={`absolute -bottom-0.5 -right-0.5 size-3 rounded-full ring-2 ring-surface ${STATUS_DOT[status]}`} />
							</span>
							<BlockStack gap="100">
								<InlineStack gap="200" blockAlign="center">
									<h1 className="text-xl font-semibold tracking-tight">{agent.name}</h1>
									<Badge variant="outline" className="text-[11px]">
										{STATUS_LABEL[status]}
									</Badge>
								</InlineStack>
								<span className="text-sm text-fg-muted">{agent.role}</span>
								<InlineStack gap="150">
									<Badge variant="secondary" className="text-[11px]">
										{agent.model}
									</Badge>
									<span className="text-xs text-fg-muted tabular-nums">${agent.budget.maxPerMission.toFixed(2)} / mission</span>
								</InlineStack>
							</BlockStack>
						</InlineStack>

						<InlineStack gap="200">
							<Link href={`/agents/${slug}/chat`} className={buttonVariants({ variant: "outline", size: "sm" })}>
								<MessageSquare className="size-4 mr-1.5" />
								Discuter
							</Link>
							<Link href={`/settings/agents/${slug}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
								<Settings className="size-4 mr-1.5" />
								Paramètres
							</Link>
							<Button size="sm" onClick={() => setFormOpen(true)}>
								<Plus className="size-4 mr-1" />
								Nouvelle mission
							</Button>
						</InlineStack>
					</InlineStack>
				</CardContent>
			</Card>

			{/* ── KPIs ── */}
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				{stats == null ? (
					[1, 2, 3, 4].map((i) => <Skeleton key={i} className="h-24 w-full rounded-lg" />)
				) : (
					<>
						<StatBlock label="Missions totales" value={stats.total} hint={stats.completed > 0 ? `${stats.completed} terminées` : undefined} />
						<StatBlock label="Ce mois" value={stats.thisMonth} hint={stats.inProgress > 0 ? `${stats.inProgress} actives` : undefined} />
						<StatBlock label="Coût total" value={`$${stats.totalCost.toFixed(2)}`} />
						<StatBlock label="Aujourd'hui" value={`$${agent.usage.todayUsd.toFixed(2)}`} hint={`sur $${agent.budget.maxPerDay.toFixed(2)}`} />
					</>
				)}
			</div>

			{/* ── Budget + Permissions ── */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<BlockStack gap="200">
					<SectionHeader title="Budget" />
					<Card>
						<CardContent className="p-4">
							<BlockStack gap="400">
								<BudgetMeter label="Aujourd'hui" used={agent.usage.todayUsd} limit={agent.budget.maxPerDay} />
								<BudgetMeter label="Ce mois" used={agent.usage.monthUsd} limit={agent.budget.maxPerMonth} />
								<InlineStack align="space-between" className="pt-2 border-t border-edge">
									<span className="text-xs text-fg-muted">Total cumulé</span>
									<span className="text-xs tabular-nums text-fg">${agent.usage.totalUsd.toFixed(2)}</span>
								</InlineStack>
							</BlockStack>
						</CardContent>
					</Card>
				</BlockStack>

				<BlockStack gap="200">
					<SectionHeader title="Permissions" />
					<Card>
						<CardContent className="p-4">
							<BlockStack gap="300">
								<BlockStack gap="100">
									<InlineStack gap="150" blockAlign="center">
										<span className="size-2 rounded-full bg-positive" />
										<span className="text-xs font-medium text-fg">Autorisées ({agent.permissions.safe.length})</span>
									</InlineStack>
									<InlineStack gap="100" wrap>
										{agent.permissions.safe.map((p) => (
											<Badge key={p} variant="outline" className="text-[10px] font-mono">
												{p}
											</Badge>
										))}
									</InlineStack>
								</BlockStack>

								{agent.permissions.confirm.length > 0 && (
									<BlockStack gap="100">
										<InlineStack gap="150" blockAlign="center">
											<span className="size-2 rounded-full bg-caution" />
											<span className="text-xs font-medium text-fg">Avec confirmation ({agent.permissions.confirm.length})</span>
										</InlineStack>
										<InlineStack gap="100" wrap>
											{agent.permissions.confirm.map((p) => (
												<Badge key={p} variant="outline" className="text-[10px] font-mono">
													{p}
												</Badge>
											))}
										</InlineStack>
									</BlockStack>
								)}

								{agent.permissions.blocked.length > 0 && (
									<BlockStack gap="100">
										<InlineStack gap="150" blockAlign="center">
											<span className="size-2 rounded-full bg-critical" />
											<span className="text-xs font-medium text-fg">Bloquées ({agent.permissions.blocked.length})</span>
										</InlineStack>
										<InlineStack gap="100" wrap>
											{agent.permissions.blocked.map((p) => (
												<Badge key={p} variant="outline" className="text-[10px] font-mono">
													{p}
												</Badge>
											))}
										</InlineStack>
									</BlockStack>
								)}
							</BlockStack>
						</CardContent>
					</Card>
				</BlockStack>
			</div>

			{/* ── Recent missions ── */}
			<BlockStack gap="200">
				<SectionHeader title="Missions récentes" href="/missions" />
				{missions === undefined ? (
					<Skeleton className="h-40 w-full rounded-lg" />
				) : recentMissions.length === 0 ? (
					<Card>
						<CardContent className="py-8 text-center">
							<BlockStack gap="200" className="items-center">
								<span className="text-sm text-fg-muted">Aucune mission confiée à {agent.name} pour l&apos;instant.</span>
								<Button variant="outline" size="sm" onClick={() => setFormOpen(true)}>
									<Plus className="size-3 mr-1" />
									Créer la première mission
								</Button>
							</BlockStack>
						</CardContent>
					</Card>
				) : (
					<Card>
						<CardContent className="p-0">
							<BlockStack>
								{recentMissions.map((mission) => (
									<Link key={mission._id} href={`/missions/${mission._id}`} className="flex items-center gap-3 px-4 py-3 border-b border-edge last:border-b-0 transition-colors hover:bg-muted/50">
										<BlockStack gap="050" className="min-w-0 flex-1">
											<span className="text-sm font-medium text-fg truncate">{mission.title}</span>
											<InlineStack gap="200" blockAlign="center">
												<Badge variant="outline" className="text-[10px]">
													{MISSION_STATUS_LABEL[mission.status] ?? mission.status}
												</Badge>
												<span className="text-[11px] text-fg-muted tabular-nums">${(mission.costUsd ?? 0).toFixed(3)}</span>
												<span className="text-[11px] text-fg-muted">{new Date(mission._creationTime).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
											</InlineStack>
										</BlockStack>
										<ArrowRight className="size-3.5 text-fg-muted shrink-0" />
									</Link>
								))}
							</BlockStack>
						</CardContent>
					</Card>
				)}
			</BlockStack>

			{/* ── Memory preview ── */}
			<BlockStack gap="200">
				<SectionHeader title="Mémoire" href={`/settings/agents/${slug}`} />
				{memories === undefined ? (
					<Skeleton className="h-32 w-full rounded-lg" />
				) : memories.length === 0 ? (
					<Card>
						<CardContent className="py-6 text-center">
							<span className="text-sm text-fg-muted">Aucune mémoire enregistrée. {agent.name} apprendra au fil des missions.</span>
						</CardContent>
					</Card>
				) : (
					<Card>
						<CardContent className="p-4">
							<BlockStack gap="200">
								{memories.slice(0, 5).map((m) => (
									<InlineStack key={m._id} gap="200" blockAlign="start" wrap={false}>
										<Badge variant="outline" className="text-[10px] shrink-0">
											{MEMORY_CATEGORY_LABEL[m.category] ?? m.category}
										</Badge>
										{m.scope === "shared" && (
											<Badge variant="secondary" className="text-[10px] shrink-0">
												partagé
											</Badge>
										)}
										<span className="text-sm text-fg min-w-0 flex-1">{m.content}</span>
									</InlineStack>
								))}
							</BlockStack>
						</CardContent>
					</Card>
				)}
			</BlockStack>

			<MissionForm open={formOpen} onOpenChange={setFormOpen} agents={[agent]} defaultAgentId={agent._id} />
		</BlockStack>
	)
}
