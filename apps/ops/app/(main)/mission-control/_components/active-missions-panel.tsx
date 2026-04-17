"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import { AgentAvatar } from "@/app/(main)/missions/_components/agent-avatar"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

type MissionStatus = "planning" | "todo" | "in_progress" | "review" | "done" | "rejected" | "aborted"

const STATUS_LABEL: Record<MissionStatus, string> = {
	planning: "Planification",
	todo: "À faire",
	in_progress: "En cours",
	review: "À valider",
	done: "Terminée",
	rejected: "Rejetée",
	aborted: "Annulée",
}

const STATUS_DOT: Record<MissionStatus, string> = {
	planning: "bg-fg-muted/40",
	todo: "bg-brand",
	in_progress: "bg-emerald-500 animate-pulse",
	review: "bg-caution",
	done: "bg-positive",
	rejected: "bg-critical",
	aborted: "bg-fg-muted/40",
}

function formatDuration(ms: number): string {
	if (ms < 60_000) return `${Math.round(ms / 1000)}s`
	if (ms < 3600_000) return `${Math.round(ms / 60_000)}min`
	return `${(ms / 3600_000).toFixed(1)}h`
}

function formatElapsed(startedAt?: number, completedAt?: number): string | null {
	if (!startedAt) return null
	const end = completedAt ?? Date.now()
	return formatDuration(end - startedAt)
}

export function ActiveMissionsPanel() {
	const missions = useQuery(api.missions.list, {})
	const agents = useQuery(api.agents.list)

	const agentMap = useMemo(() => {
		if (!agents) return new Map<Id<"agents">, { name: string; role: string }>()
		return new Map(agents.map((a) => [a._id, { name: a.name, role: a.role }]))
	}, [agents])

	const activeMissions = useMemo(() => {
		if (!missions) return []
		return missions.filter((m) => m.status === "in_progress" || m.status === "review").slice(0, 6)
	}, [missions])

	if (missions === undefined) {
		return (
			<Card>
				<CardContent className="p-3">
					<BlockStack gap="200">
						{[1, 2, 3].map((i) => (
							<Skeleton key={i} className="h-16 w-full rounded-md" />
						))}
					</BlockStack>
				</CardContent>
			</Card>
		)
	}

	if (activeMissions.length === 0) {
		return (
			<Card>
				<CardContent className="py-8 text-center">
					<BlockStack gap="100">
						<span className="text-sm text-fg-muted">Aucune mission en cours.</span>
						<Link href="/missions" className="text-xs text-brand hover:underline">
							Voir toutes les missions →
						</Link>
					</BlockStack>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardContent className="p-0">
				<BlockStack>
					{activeMissions.map((mission) => {
						const agent = agentMap.get(mission.agentId)
						const status = mission.status as MissionStatus
						const elapsed = formatElapsed(mission.startedAt, mission.completedAt)

						return (
							<Link key={mission._id} href={`/missions/${mission._id}`} className="flex items-center gap-3 px-4 py-3 border-b border-edge last:border-b-0 transition-colors hover:bg-muted/50">
								{agent && <AgentAvatar name={agent.name} size={32} className="shrink-0" />}

								<BlockStack gap="050" className="min-w-0 flex-1">
									<InlineStack gap="200" blockAlign="center" wrap={false}>
										<span className={`size-2 rounded-full shrink-0 ${STATUS_DOT[status]}`} />
										<span className="text-sm font-medium text-fg truncate">{mission.title}</span>
									</InlineStack>
									<InlineStack gap="200" blockAlign="center" wrap={false}>
										{agent && <span className="text-xs text-fg-muted shrink-0">{agent.name}</span>}
										<span className="text-[11px] text-fg-muted">·</span>
										<Badge variant="outline" className="text-[10px] shrink-0">
											{STATUS_LABEL[status]}
										</Badge>
										{elapsed && <span className="text-[11px] text-fg-muted tabular-nums">{elapsed}</span>}
									</InlineStack>
								</BlockStack>

								<BlockStack gap="050" className="shrink-0 items-end">
									<span className="text-xs tabular-nums text-fg">${(mission.costUsd ?? 0).toFixed(3)}</span>
									<ArrowRight className="size-3.5 text-fg-muted" />
								</BlockStack>
							</Link>
						)
					})}
				</BlockStack>
			</CardContent>
		</Card>
	)
}
