"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"

const typeConfig: Record<string, { icon: string; label: string; color: string }> = {
	thinking: { icon: "\u{1F9E0}", label: "Thinking", color: "text-inform" },
	tool_call: { icon: "\u{1F527}", label: "Tool Call", color: "text-caution" },
	tool_result: { icon: "\u{1F4C4}", label: "Tool Result", color: "text-fg-muted" },
	error: { icon: "\u274C", label: "Error", color: "text-negative" },
	budget_warning: { icon: "\u26A0\uFE0F", label: "Budget Warning", color: "text-caution" },
	done: { icon: "\u2705", label: "Done", color: "text-positive" },
}

interface LogEntry {
	_id: string
	_creationTime: number
	type: string
	content: string
	toolName?: string
	duration?: number
}

interface MissionLogsProps {
	logs: LogEntry[]
}

export function MissionLogs({ logs }: MissionLogsProps) {
	if (logs.length === 0) {
		return (
			<Box className="py-8 text-center text-sm text-fg-muted">
				Aucun log pour cette mission.
			</Box>
		)
	}

	return (
		<BlockStack gap="100">
			{logs.map((log) => {
				const config = typeConfig[log.type] ?? typeConfig.thinking
				return (
					<InlineStack
						key={log._id}
						gap="300"
						blockAlign="start"
						className="py-2.5 border-b border-edge last:border-0"
					>
						<Box className="shrink-0 pt-0.5 text-base leading-none">{config.icon}</Box>
						<BlockStack gap="050" className="flex-1 min-w-0">
							<InlineStack gap="200" blockAlign="center">
								<span className={`text-xs font-medium ${config.color}`}>
									{config.label}
								</span>
								{log.toolName && (
									<span className="text-xs font-mono text-fg-muted bg-muted px-1.5 py-0.5 rounded">
										{log.toolName}
									</span>
								)}
								{log.duration != null && (
									<span className="text-xs text-fg-muted">
										{log.duration}ms
									</span>
								)}
								<span className="text-xs text-fg-muted ml-auto shrink-0">
									{new Date(log._creationTime).toLocaleTimeString("fr-FR")}
								</span>
							</InlineStack>
							<Box className="text-sm text-fg whitespace-pre-wrap break-words">
								{log.content}
							</Box>
						</BlockStack>
					</InlineStack>
				)
			})}
		</BlockStack>
	)
}
