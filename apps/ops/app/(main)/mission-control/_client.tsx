"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { Activity, Bot, DollarSign, type LucideIcon, Plus, Zap } from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { MissionForm } from "@/app/(main)/missions/_components/mission-form"
import { api } from "@/convex/_generated/api"
import { ActiveMissionsPanel } from "./_components/active-missions-panel"
import { ActivityStreamPanel } from "./_components/activity-stream-panel"
import { AgentRosterPanel } from "./_components/agent-roster-panel"
import { BudgetMeter } from "./_components/budget-meter"

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

type StatCardProps = {
	label: string
	value: string | number
	hint?: string
	icon: LucideIcon
}

function StatCard({ label, value, hint, icon: Icon }: StatCardProps) {
	return (
		<Card>
			<CardContent className="pt-4">
				<InlineStack align="space-between" blockAlign="start" wrap={false}>
					<BlockStack gap="150">
						<span className="text-sm text-fg-muted">{label}</span>
						<span className="text-2xl font-semibold tracking-tight tabular-nums">{value}</span>
						{hint && <span className="text-xs text-fg-muted">{hint}</span>}
					</BlockStack>
					<Box padding="2" borderRadius="md" className="shrink-0 bg-muted">
						<Icon className="size-4 text-fg-muted" />
					</Box>
				</InlineStack>
			</CardContent>
		</Card>
	)
}

function StatCardSkeleton() {
	return (
		<Card>
			<CardContent className="pt-4">
				<BlockStack gap="150">
					<Skeleton className="h-4 w-24" />
					<Skeleton className="h-8 w-20" />
					<Skeleton className="h-3 w-32" />
				</BlockStack>
			</CardContent>
		</Card>
	)
}

export function MissionControlClient() {
	const [formOpen, setFormOpen] = useState(false)
	const agents = useQuery(api.agents.list)
	const missions = useQuery(api.missions.list, {})

	useAppTopBar([{ label: "Mission Control" }])

	const stats = useMemo(() => {
		if (!agents || !missions) return null

		const totalAgents = agents.length
		const busyAgents = agents.filter((a) => a.status === "busy").length
		const activeMissions = missions.filter((m) => m.status === "in_progress" || m.status === "review").length
		const inProgress = missions.filter((m) => m.status === "in_progress").length
		const toReview = missions.filter((m) => m.status === "review").length

		const todaySpend = agents.reduce((sum, a) => sum + a.usage.todayUsd, 0)
		const todayBudget = agents.reduce((sum, a) => sum + a.budget.maxPerDay, 0)
		const monthSpend = agents.reduce((sum, a) => sum + a.usage.monthUsd, 0)
		const monthBudget = agents.reduce((sum, a) => sum + a.budget.maxPerMonth, 0)

		return {
			totalAgents,
			busyAgents,
			activeMissions,
			inProgress,
			toReview,
			todaySpend,
			todayBudget,
			monthSpend,
			monthBudget,
		}
	}, [agents, missions])

	return (
		<BlockStack gap="600" className="p-6">
			<PageHeader
				title="Mission Control"
				bottom={<p className="text-sm text-fg-muted">Supervision de l'équipe d'agents en temps réel</p>}
				actions={
					<Button onClick={() => setFormOpen(true)}>
						<Plus className="size-4 mr-1" />
						Nouvelle mission
					</Button>
				}
			/>

			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{stats == null ? (
					[1, 2, 3, 4].map((i) => <StatCardSkeleton key={i} />)
				) : (
					<>
						<StatCard label="Agents" value={`${stats.busyAgents} / ${stats.totalAgents}`} icon={Bot} hint={stats.busyAgents > 0 ? `${stats.busyAgents} en mission` : "Tous au repos"} />
						<StatCard label="Missions actives" value={stats.activeMissions} icon={Zap} hint={`${stats.inProgress} en cours · ${stats.toReview} à valider`} />
						<StatCard label="Spend aujourd'hui" value={`$${stats.todaySpend.toFixed(2)}`} icon={Activity} hint={`sur $${stats.todayBudget.toFixed(2)} de budget`} />
						<StatCard label="Spend ce mois" value={`$${stats.monthSpend.toFixed(2)}`} icon={DollarSign} hint={`sur $${stats.monthBudget.toFixed(2)} de budget`} />
					</>
				)}
			</div>

			{stats && (
				<BlockStack gap="200">
					<SectionHeader title="Budget global" />
					<BlockStack gap="300" className="rounded-lg border border-edge bg-card p-4">
						<BudgetMeter label="Aujourd'hui" used={stats.todaySpend} limit={stats.todayBudget} />
						<BudgetMeter label="Ce mois" used={stats.monthSpend} limit={stats.monthBudget} />
					</BlockStack>
				</BlockStack>
			)}

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<BlockStack gap="200">
					<SectionHeader title="Équipe" href="/settings/agents" />
					<AgentRosterPanel />
				</BlockStack>

				<BlockStack gap="200">
					<SectionHeader title="Activité temps réel" href="/activity" />
					<ActivityStreamPanel limit={15} />
				</BlockStack>
			</div>

			<BlockStack gap="200">
				<SectionHeader title="Missions actives" href="/missions" />
				<ActiveMissionsPanel />
			</BlockStack>

			{agents && <MissionForm open={formOpen} onOpenChange={setFormOpen} agents={agents} />}
		</BlockStack>
	)
}
