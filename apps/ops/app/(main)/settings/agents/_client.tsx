"use client"

import { SettingsHeader, SettingsPage } from "@blazz/pro/components/blocks/settings-block"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Progress } from "@blazz/ui/components/ui/progress"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { useRouter } from "next/navigation"
import { AgentAvatar } from "@/app/(main)/missions/_components/agent-avatar"
import { api } from "@/convex/_generated/api"

export function AgentsSettingsClient() {
	const agents = useQuery(api.agents.list)
	const router = useRouter()

	if (agents === undefined) {
		return (
			<SettingsPage>
				<SettingsHeader title="Agents" description="Gérez vos agents autonomes." />
				<BlockStack gap="200">
					{[1, 2, 3].map((i) => (
						<Skeleton key={i} className="h-20 w-full rounded-lg" />
					))}
				</BlockStack>
			</SettingsPage>
		)
	}

	return (
		<SettingsPage>
			<SettingsHeader title="Agents" description="Gérez vos agents autonomes." />
			<BlockStack gap="200">
				{agents.map((agent) => {
					const usagePercent = agent.budget.maxPerMonth > 0 ? Math.min(100, Math.round((agent.usage.monthUsd / agent.budget.maxPerMonth) * 100)) : 0

					return (
						<button
							key={agent._id}
							type="button"
							onClick={() => router.push(`/settings/agents/${agent.slug}`)}
							className="w-full rounded-lg border border-edge bg-card p-4 text-left transition-colors hover:bg-muted cursor-pointer"
						>
							<InlineStack align="space-between" blockAlign="center">
								<InlineStack gap="300" blockAlign="center">
									<AgentAvatar name={agent.name} size={40} />
									<BlockStack gap="050">
										<InlineStack gap="200" blockAlign="center">
											<span className="text-sm font-medium text-fg">{agent.name}</span>
											<Badge variant={agent.status === "disabled" ? "outline" : "secondary"} className="text-xs">
												{agent.status === "disabled" ? "Désactivé" : agent.role}
											</Badge>
										</InlineStack>
										<span className="text-xs text-fg-muted">{agent.model}</span>
									</BlockStack>
								</InlineStack>

								<InlineStack gap="300" blockAlign="center">
									<BlockStack gap="050" className="items-end">
										<span className="text-xs text-fg-muted tabular-nums">
											${agent.usage.monthUsd.toFixed(2)} / ${agent.budget.maxPerMonth.toFixed(2)}
										</span>
										<Progress value={usagePercent} className="w-24 h-1.5" />
									</BlockStack>
								</InlineStack>
							</InlineStack>
						</button>
					)
				})}
				{agents.length === 0 && <p className="text-sm text-fg-muted">Aucun agent configuré. Lancez le seed depuis les missions.</p>}
			</BlockStack>
		</SettingsPage>
	)
}
