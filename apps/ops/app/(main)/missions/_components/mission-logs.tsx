"use client"

import { AgentAvatar } from "./agent-avatar"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { useEffect, useRef, useState } from "react"

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
	live?: boolean
}

const styleMap: Record<string, string> = {
	thinking: "border-l-2 border-fg-muted/30 pl-3 italic text-fg-muted",
	tool_call: "border-l-2 border-brand pl-3",
	tool_result: "border-l-2 border-emerald-500 pl-3",
	error: "border-l-2 border-destructive pl-3 bg-destructive/5 rounded",
	budget_warning: "border-l-2 border-warning pl-3 bg-warning/5 rounded",
	done: "border-l-2 border-emerald-500 pl-3 bg-emerald-500/5 rounded",
}

const iconMap: Record<string, string> = {
	thinking: "\u{1F9E0}",
	tool_call: "\u{1F527}",
	tool_result: "\u{1F4C4}",
	error: "\u274C",
	budget_warning: "\u26A0\uFE0F",
	done: "\u2705",
}

function tryFormatJson(str: string): string {
	try {
		return JSON.stringify(JSON.parse(str), null, 2)
	} catch {
		return str
	}
}

function parseInterAgentTarget(content: string): { agentName: string } | null {
	try {
		const parsed = JSON.parse(content)
		if (parsed.agentName) return { agentName: parsed.agentName }
		if (parsed.agent) return { agentName: parsed.agent }
		if (parsed.targetAgent) return { agentName: parsed.targetAgent }
	} catch {
		// not JSON, ignore
	}
	return null
}

function LogEntryRow({ log }: { log: LogEntry }) {
	const [expanded, setExpanded] = useState(false)
	const style = styleMap[log.type] ?? styleMap.thinking
	const icon = iconMap[log.type] ?? "\u{1F9E0}"
	const isInterAgent = log.toolName === "ask_agent" || log.toolName === "delegate_to_agent"

	return (
		<BlockStack gap="050" className={`py-2 ${style}`}>
			<InlineStack gap="200" blockAlign="center">
				<span className="text-xs">{icon}</span>
				{log.toolName && (
					<Badge variant="outline" size="xs">
						{log.toolName}
					</Badge>
				)}
				{isInterAgent && log.type === "tool_call" && (() => {
					const target = parseInterAgentTarget(log.content)
					if (!target) return null
					return (
						<InlineStack gap="100" blockAlign="center">
							<AgentAvatar name={target.agentName} size={16} className="size-4" />
							<span className="text-xs font-medium text-fg">{target.agentName}</span>
						</InlineStack>
					)
				})()}
				{log.duration != null && (
					<span className="text-xs text-fg-muted tabular-nums">{log.duration}ms</span>
				)}
				<span className="text-xs text-fg-muted tabular-nums ml-auto">
					{new Date(log._creationTime).toLocaleTimeString("fr-FR")}
				</span>
			</InlineStack>

			{log.type === "thinking" && (
				<Box className="text-sm text-fg-muted italic">{log.content}</Box>
			)}

			{(log.type === "tool_call" || log.type === "tool_result") && (
				<BlockStack gap="050">
					<button
						type="button"
						onClick={() => setExpanded(!expanded)}
						className="text-xs text-fg-muted hover:text-fg cursor-pointer text-left w-fit"
					>
						{expanded ? "Masquer" : "Voir les d\u00E9tails"}
					</button>
					{expanded && (
						<pre className="text-xs bg-muted/50 rounded p-2 overflow-x-auto max-h-48 overflow-y-auto">
							{tryFormatJson(log.content)}
						</pre>
					)}
				</BlockStack>
			)}

			{(log.type === "error" || log.type === "budget_warning" || log.type === "done") && (
				<Box className="text-sm">{log.content}</Box>
			)}
		</BlockStack>
	)
}

export function MissionLogs({ logs, live }: MissionLogsProps) {
	const logsEndRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (live) {
			logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
		}
	}, [logs.length, live])

	if (logs.length === 0) {
		return (
			<Box className="py-8 text-center text-sm text-fg-muted">
				Aucun log pour cette mission.
			</Box>
		)
	}

	return (
		<div className="max-h-[600px] overflow-y-auto">
			<BlockStack gap="100">
				{logs.map((log) => (
					<LogEntryRow key={log._id} log={log} />
				))}
				<div ref={logsEndRef} />
			</BlockStack>
		</div>
	)
}
