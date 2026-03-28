"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { useRouter } from "next/navigation"
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

const TYPE_STYLE: Record<string, string> = {
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
	if (str.length <= max) return str
	return `${str.slice(0, max)}…`
}

export function ActivityClient() {
	const logs = useQuery(api.agentLogs.listRecent, { limit: 100 })
	const agents = useQuery(api.agents.list)
	const router = useRouter()

	useAppTopBar([{ label: "Activité" }])

	const agentMap = useMemo(() => {
		if (!agents) return new Map<string, { name: string; role: string }>()
		return new Map(agents.map((a) => [a._id, { name: a.name, role: a.role }]))
	}, [agents])

	if (logs === undefined) {
		return (
			<BlockStack gap="400" className="p-4">
				<PageHeader title="Activité des agents" />
				<BlockStack gap="200">
					{[1, 2, 3, 4, 5].map((i) => (
						<Skeleton key={i} className="h-16 w-full rounded-lg" />
					))}
				</BlockStack>
			</BlockStack>
		)
	}

	if (logs.length === 0) {
		return (
			<BlockStack gap="400" className="p-4">
				<PageHeader title="Activité des agents" />
				<BlockStack className="items-center justify-center py-20">
					<p className="text-sm text-fg-muted">Aucune activité pour le moment.</p>
				</BlockStack>
			</BlockStack>
		)
	}

	return (
		<BlockStack gap="400" className="p-4">
			<PageHeader title="Activité des agents" bottom={<p className="text-sm text-fg-muted">{logs.length} événements récents · mise à jour en temps réel</p>} />

			<BlockStack gap="100">
				{logs.map((log) => {
					const agent = agentMap.get(log.agentId)
					const icon = TYPE_ICON[log.type] ?? "•"
					const style = TYPE_STYLE[log.type] ?? ""
					const isInterAgent = log.toolName === "ask_agent" || log.toolName === "delegate_to_agent"

					return (
						<button
							key={log._id}
							type="button"
							onClick={() => router.push(`/missions/${log.missionId}`)}
							className={`w-full text-left pl-3 py-2.5 pr-3 rounded-md transition-colors hover:bg-muted/50 cursor-pointer ${style}`}
						>
							<InlineStack align="space-between" blockAlign="start">
								<InlineStack gap="200" blockAlign="start" className="min-w-0 flex-1">
									<span className="text-xs mt-0.5 shrink-0">{icon}</span>

									{agent && (
										<InlineStack gap="150" blockAlign="center" className="shrink-0">
											<AgentAvatar name={agent.name} size={16} />
											<span className="text-xs font-medium text-fg">{agent.name}</span>
										</InlineStack>
									)}

									{log.toolName && (
										<Badge variant="outline" className="text-[10px] shrink-0">
											{isInterAgent ? `→ ${log.toolName}` : log.toolName}
										</Badge>
									)}

									<span className="text-xs text-fg-muted truncate min-w-0">
										{log.type === "thinking" ? truncate(log.content, 80) : log.type === "done" ? log.content : log.type === "error" || log.type === "budget_warning" ? truncate(log.content, 100) : ""}
									</span>
								</InlineStack>

								<span className="text-[10px] text-fg-muted tabular-nums shrink-0 ml-2">{formatTime(log._creationTime)}</span>
							</InlineStack>
						</button>
					)
				})}
			</BlockStack>
		</BlockStack>
	)
}
