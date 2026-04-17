"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import Link from "next/link"
import { useMemo } from "react"
import { AgentAvatar } from "@/app/(main)/missions/_components/agent-avatar"
import { api } from "@/convex/_generated/api"

const TYPE_ICON: Record<string, string> = {
	thinking: "🧠",
	tool_call: "🔧",
	tool_result: "📄",
	error: "❌",
	budget_warning: "⚠️",
	done: "✅",
}

const TYPE_LINE: Record<string, string> = {
	thinking: "border-l-2 border-fg-muted/30",
	tool_call: "border-l-2 border-brand",
	tool_result: "border-l-2 border-emerald-500/50",
	error: "border-l-2 border-destructive bg-destructive/5",
	budget_warning: "border-l-2 border-warning bg-warning/5",
	done: "border-l-2 border-emerald-500 bg-emerald-500/5",
}

function formatTime(ts: number): string {
	const diff = Date.now() - ts
	if (diff < 60_000) return "à l'instant"
	if (diff < 3600_000) return `il y a ${Math.floor(diff / 60_000)}min`
	return new Date(ts).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })
}

function truncate(str: string, max: number): string {
	if (!str) return ""
	return str.length <= max ? str : `${str.slice(0, max)}…`
}

export function ActivityStreamPanel({ limit = 20 }: { limit?: number }) {
	const logs = useQuery(api.agentLogs.listRecent, { limit })
	const agents = useQuery(api.agents.list)

	const agentMap = useMemo(() => {
		if (!agents) return new Map<string, { name: string; role: string }>()
		return new Map(agents.map((a) => [a._id, { name: a.name, role: a.role }]))
	}, [agents])

	if (logs === undefined) {
		return (
			<Card>
				<CardContent className="p-3">
					<BlockStack gap="100">
						{[1, 2, 3, 4, 5, 6].map((i) => (
							<Skeleton key={i} className="h-10 w-full rounded-md" />
						))}
					</BlockStack>
				</CardContent>
			</Card>
		)
	}

	if (logs.length === 0) {
		return (
			<Card>
				<CardContent className="py-8 text-center">
					<BlockStack gap="100">
						<span className="text-sm text-fg-muted">Aucune activité pour l'instant.</span>
						<span className="text-xs text-fg-muted">Lance une mission pour voir les agents travailler ici en direct.</span>
					</BlockStack>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardContent className="p-2">
				<BlockStack gap="050">
					{logs.map((log) => {
						const agent = agentMap.get(log.agentId)
						const icon = TYPE_ICON[log.type] ?? "•"
						const lineClass = TYPE_LINE[log.type] ?? ""
						const isInterAgent = log.toolName === "ask_agent" || log.toolName === "delegate_to_agent"
						const content =
							log.type === "thinking" ? truncate(log.content, 80) : log.type === "done" ? log.content : log.type === "error" || log.type === "budget_warning" ? truncate(log.content, 100) : ""

						return (
							<Link key={log._id} href={`/missions/${log.missionId}`} className={`block w-full pl-2.5 pr-2 py-1.5 rounded-md transition-colors hover:bg-muted/50 ${lineClass}`}>
								<InlineStack align="space-between" blockAlign="start" wrap={false}>
									<InlineStack gap="150" blockAlign="center" className="min-w-0 flex-1" wrap={false}>
										<span className="text-[11px] shrink-0">{icon}</span>
										{agent && (
											<InlineStack gap="100" blockAlign="center" wrap={false} className="shrink-0">
												<AgentAvatar name={agent.name} size={14} />
												<span className="text-[11px] font-medium text-fg">{agent.name}</span>
											</InlineStack>
										)}
										{log.toolName && (
											<Badge variant="outline" className="text-[10px] shrink-0 px-1.5 py-0">
												{isInterAgent ? `→ ${log.toolName}` : log.toolName}
											</Badge>
										)}
										{content && <span className="text-[11px] text-fg-muted truncate min-w-0">{content}</span>}
									</InlineStack>
									<span className="text-[10px] text-fg-muted tabular-nums shrink-0 ml-2">{formatTime(log._creationTime)}</span>
								</InlineStack>
							</Link>
						)
					})}
				</BlockStack>
			</CardContent>
		</Card>
	)
}
