"use client"

import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@blazz/ui/components/ui/select"
import type { Id } from "@/convex/_generated/dataModel"
import { AgentAvatar } from "./agent-avatar"

interface Agent {
	_id: Id<"agents">
	name: string
	role: string
	avatar?: string
	budget: {
		maxPerMission: number
		maxPerDay: number
		maxPerMonth: number
	}
	usage: {
		monthUsd: number
		totalUsd: number
		todayUsd: number
		lastResetDay: string
		lastResetMonth: string
	}
}

interface AgentPickerProps {
	agents: Agent[]
	value: string
	onValueChange: (value: string) => void
}

export function AgentPicker({ agents, value, onValueChange }: AgentPickerProps) {
	return (
		<Select
			value={value}
			onValueChange={(val: string | null) => {
				if (val) onValueChange(val)
			}}
			items={agents.map((a) => ({ value: a._id, label: `${a.avatar ?? ""} ${a.name} — ${a.role}` }))}
		>
			<SelectTrigger className="w-full">
				<SelectValue placeholder="Choisir un agent..." />
			</SelectTrigger>
			<SelectContent>
				{agents.map((agent) => (
					<SelectItem key={agent._id} value={agent._id}>
						<InlineStack gap="200" blockAlign="center">
							<AgentAvatar name={agent.name} size={20} />
							<span className="text-sm">
								{agent.name} — {agent.role}
							</span>
							<span className="text-xs text-fg-muted ml-auto tabular-nums">${(agent.budget.maxPerMonth - agent.usage.monthUsd).toFixed(2)} restant</span>
						</InlineStack>
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	)
}
