"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import Link from "next/link"
import { AgentAvatar } from "@/app/(main)/missions/_components/agent-avatar"
import { api } from "@/convex/_generated/api"
import { BudgetMeter } from "./budget-meter"

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

function AgentRosterSkeleton() {
	return (
		<Card>
			<CardContent className="p-0">
				<BlockStack>
					{[1, 2, 3, 4].map((i) => (
						<InlineStack key={i} gap="300" blockAlign="center" wrap={false} className="px-4 py-3 border-b border-edge last:border-b-0">
							<Skeleton className="size-10 rounded-full" />
							<BlockStack gap="100" className="flex-1">
								<Skeleton className="h-3 w-24" />
								<Skeleton className="h-2 w-32" />
							</BlockStack>
							<Skeleton className="h-4 w-24" />
						</InlineStack>
					))}
				</BlockStack>
			</CardContent>
		</Card>
	)
}

export function AgentRosterPanel() {
	const agents = useQuery(api.agents.list)

	if (agents === undefined) return <AgentRosterSkeleton />

	if (agents.length === 0) {
		return (
			<Card>
				<CardContent className="py-8 text-center">
					<span className="text-sm text-fg-muted">Aucun agent. Lance le seed depuis Mission Control.</span>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardContent className="p-0">
				<BlockStack>
					{agents.map((agent) => {
						const status = (agent.status ?? "idle") as AgentStatus
						const dotClass = STATUS_DOT[status]
						const isBlocked = status === "disabled" || status === "paused"

						return (
							<Link key={agent._id} href={`/agents/${agent.slug}`} className="flex items-center gap-3 px-4 py-3 border-b border-edge last:border-b-0 transition-colors hover:bg-muted/50">
								<span className="relative shrink-0">
									<AgentAvatar name={agent.name} size={36} />
									<span className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-surface ${dotClass}`} />
								</span>

								<BlockStack gap="050" className="min-w-0 flex-1">
									<InlineStack gap="200" blockAlign="center" wrap={false}>
										<span className="text-sm font-medium text-fg truncate">{agent.name}</span>
										<Badge variant="outline" className="text-[10px] shrink-0">
											{STATUS_LABEL[status]}
										</Badge>
									</InlineStack>
									<span className="text-xs text-fg-muted truncate">{agent.role}</span>
								</BlockStack>

								<div className={`shrink-0 w-44 ${isBlocked ? "opacity-60" : ""}`}>
									<BudgetMeter label="Mois" used={agent.usage.monthUsd} limit={agent.budget.maxPerMonth} size="sm" />
								</div>
							</Link>
						)
					})}
				</BlockStack>
			</CardContent>
		</Card>
	)
}
