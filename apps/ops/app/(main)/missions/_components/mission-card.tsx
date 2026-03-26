"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import type { Id } from "@/convex/_generated/dataModel"

type Priority = "low" | "medium" | "high" | "urgent"
type Status = "planning" | "todo" | "in_progress" | "review" | "done" | "rejected" | "aborted"

interface MissionCardProps {
	mission: {
		_id: Id<"missions">
		title: string
		priority: Priority
		status: Status
		costUsd?: number
		mode?: "dry-run" | "live"
		agentId: Id<"agents">
	}
	agent?: {
		name: string
		role: string
		avatar?: string
	} | null
	onClick?: () => void
}

const PRIORITY_DOT: Record<Priority, string> = {
	low: "bg-fg-muted",
	medium: "bg-caution",
	high: "bg-warning",
	urgent: "bg-destructive",
}

const PRIORITY_LABEL: Record<Priority, string> = {
	low: "Basse",
	medium: "Moyenne",
	high: "Haute",
	urgent: "Urgente",
}

const STATUS_VARIANT: Record<Status, "secondary" | "outline" | "default" | "destructive"> = {
	planning: "outline",
	todo: "secondary",
	in_progress: "default",
	review: "secondary",
	done: "secondary",
	rejected: "destructive",
	aborted: "outline",
}

const STATUS_LABEL: Record<Status, string> = {
	planning: "Planification",
	todo: "A faire",
	in_progress: "En cours",
	review: "En revue",
	done: "Terminee",
	rejected: "Rejetee",
	aborted: "Annulee",
}

export function MissionCard({ mission, agent, onClick }: MissionCardProps) {
	const budgetMax = agent ? 0.15 : undefined

	return (
		<Box
			as="button"
			onClick={onClick}
			className="w-full rounded-lg border border-edge bg-card px-3 py-2.5 text-left transition-colors hover:bg-muted cursor-pointer"
		>
			<BlockStack gap="100">
				<InlineStack align="space-between" blockAlign="center">
					<span className="text-[13px] font-medium text-fg truncate">
						{mission.title}
					</span>
					<Badge variant={STATUS_VARIANT[mission.status]} className="shrink-0 text-[10px]">
						{STATUS_LABEL[mission.status]}
					</Badge>
				</InlineStack>

				{agent && (
					<InlineStack gap="100" blockAlign="center">
						<span className="text-xs">{agent.avatar}</span>
						<span className="text-xs text-fg-muted">
							{agent.name} · {agent.role}
						</span>
					</InlineStack>
				)}

				<InlineStack gap="200" blockAlign="center">
					<InlineStack gap="100" blockAlign="center">
						<span className={`size-2 rounded-full ${PRIORITY_DOT[mission.priority]}`} />
						<span className="text-xs text-fg-muted">
							{PRIORITY_LABEL[mission.priority]}
						</span>
					</InlineStack>

					<span className="text-xs tabular-nums text-fg-muted">
						${(mission.costUsd ?? 0).toFixed(2)}
						{budgetMax != null && ` / $${budgetMax.toFixed(2)}`}
					</span>

					{mission.mode === "dry-run" && (
						<Badge variant="outline" className="text-[10px]">
							dry-run
						</Badge>
					)}
				</InlineStack>
			</BlockStack>
		</Box>
	)
}
