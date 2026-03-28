"use client"

import type { TimelineItem } from "@blazz/pro/components/ai/generative/planning/timeline"
import { Timeline } from "@blazz/pro/components/ai/generative/planning/timeline"
import { ChainOfThought, ChainOfThoughtContent, ChainOfThoughtHeader, ChainOfThoughtStep } from "@blazz/pro/components/ai/reasoning/chain-of-thought"
import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { useEffect, useMemo, useRef, useState } from "react"
import { AgentAvatar } from "./agent-avatar"

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

const variantMap: Record<string, TimelineItem["variant"]> = {
	thinking: "default",
	tool_call: "info",
	tool_result: "success",
	error: "critical",
	budget_warning: "warning",
	done: "success",
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

/** Groups consecutive tool_call + tool_result logs into ChainOfThought blocks */
function groupToolSequences(logs: LogEntry[]): Array<LogEntry | { type: "tool_group"; logs: LogEntry[] }> {
	const result: Array<LogEntry | { type: "tool_group"; logs: LogEntry[] }> = []
	let toolBuffer: LogEntry[] = []

	const flushBuffer = () => {
		if (toolBuffer.length > 0) {
			if (toolBuffer.length >= 2) {
				result.push({ type: "tool_group", logs: [...toolBuffer] })
			} else {
				// Single tool log, render inline
				for (const log of toolBuffer) {
					result.push(log)
				}
			}
			toolBuffer = []
		}
	}

	for (const log of logs) {
		if (log.type === "tool_call" || log.type === "tool_result") {
			toolBuffer.push(log)
		} else {
			flushBuffer()
			result.push(log)
		}
	}
	flushBuffer()

	return result
}

function ToolGroupBlock({ logs }: { logs: LogEntry[] }) {
	const toolNames = logs.filter((l) => l.type === "tool_call" && l.toolName).map((l) => l.toolName!)
	const uniqueTools = [...new Set(toolNames)]
	const _allComplete = logs.every((l) => l.type === "tool_result" || l.type === "tool_call")
	const label = uniqueTools.length > 0 ? uniqueTools.join(", ") : "Outils"

	return (
		<ChainOfThought defaultOpen={false} className="my-1">
			<ChainOfThoughtHeader>
				{label} ({logs.length} etapes)
			</ChainOfThoughtHeader>
			<ChainOfThoughtContent>
				{logs.map((log) => (
					<ToolStepEntry key={log._id} log={log} />
				))}
			</ChainOfThoughtContent>
		</ChainOfThought>
	)
}

function ToolStepEntry({ log }: { log: LogEntry }) {
	const [expanded, setExpanded] = useState(false)
	const isCall = log.type === "tool_call"
	const isInterAgent = log.toolName === "ask_agent" || log.toolName === "delegate_to_agent"

	return (
		<ChainOfThoughtStep
			label={
				<InlineStack gap="200" blockAlign="center">
					{log.toolName && (
						<Badge variant="outline" size="xs">
							{log.toolName}
						</Badge>
					)}
					{isInterAgent &&
						isCall &&
						(() => {
							const target = parseInterAgentTarget(log.content)
							if (!target) return null
							return (
								<InlineStack gap="100" blockAlign="center">
									<AgentAvatar name={target.agentName} size={16} className="size-4" />
									<span className="text-xs font-medium text-fg">{target.agentName}</span>
								</InlineStack>
							)
						})()}
					{log.duration != null && <span className="text-xs text-fg-muted tabular-nums">{log.duration}ms</span>}
				</InlineStack>
			}
			status={isCall ? "active" : "complete"}
			description={
				<BlockStack gap="050">
					<button type="button" onClick={() => setExpanded(!expanded)} className="text-xs text-fg-muted hover:text-fg cursor-pointer text-left w-fit">
						{expanded ? "Masquer" : "Voir les details"}
					</button>
					{expanded && <pre className="text-xs bg-muted/50 rounded p-2 overflow-x-auto max-h-48 overflow-y-auto">{tryFormatJson(log.content)}</pre>}
				</BlockStack>
			}
		/>
	)
}

function TimelineOverview({ logs }: { logs: LogEntry[] }) {
	const items: TimelineItem[] = useMemo(
		() =>
			logs.map((log) => ({
				title: log.toolName ? `${log.toolName} (${log.type.replace("_", " ")})` : log.type.replace("_", " "),
				description:
					log.type === "thinking"
						? log.content.slice(0, 150) + (log.content.length > 150 ? "..." : "")
						: log.type === "done"
							? log.content
							: log.type === "error"
								? log.content
								: log.type === "budget_warning"
									? log.content
									: undefined,
				time: new Date(log._creationTime).toLocaleTimeString("fr-FR", {
					hour: "2-digit",
					minute: "2-digit",
					second: "2-digit",
				}),
				variant: variantMap[log.type] ?? "default",
			})),
		[logs]
	)

	return <Timeline items={items} />
}

function DetailedLogs({ logs }: { logs: LogEntry[] }) {
	const grouped = useMemo(() => groupToolSequences(logs), [logs])

	return (
		<BlockStack gap="100">
			{grouped.map((entry) => {
				if ("type" in entry && entry.type === "tool_group") {
					const group = entry as { type: "tool_group"; logs: LogEntry[] }
					return <ToolGroupBlock key={group.logs[0]._id} logs={group.logs} />
				}

				const log = entry as LogEntry

				if (log.type === "thinking") {
					return (
						<Box key={log._id} className="py-2 border-l-2 border-fg-muted/30 pl-3">
							<InlineStack gap="200" blockAlign="center">
								<span className="text-sm text-fg-muted italic">{log.content}</span>
								<span className="text-xs text-fg-muted tabular-nums ml-auto">{new Date(log._creationTime).toLocaleTimeString("fr-FR")}</span>
							</InlineStack>
						</Box>
					)
				}

				if (log.type === "tool_call" || log.type === "tool_result") {
					return (
						<ChainOfThought key={log._id} defaultOpen={false} className="my-1">
							<ChainOfThoughtHeader>{log.toolName ?? log.type}</ChainOfThoughtHeader>
							<ChainOfThoughtContent>
								<ToolStepEntry log={log} />
							</ChainOfThoughtContent>
						</ChainOfThought>
					)
				}

				// error, budget_warning, done
				const _variant = variantMap[log.type] ?? "default"
				const bgMap: Record<string, string> = {
					error: "bg-destructive/5 border-destructive",
					budget_warning: "bg-warning/5 border-warning",
					done: "bg-emerald-500/5 border-emerald-500",
				}
				const bg = bgMap[log.type] ?? "border-fg-muted/30"

				return (
					<Box key={log._id} className={`py-2 border-l-2 pl-3 rounded ${bg}`}>
						<InlineStack gap="200" blockAlign="center">
							<span className="text-sm">{log.content}</span>
							<span className="text-xs text-fg-muted tabular-nums ml-auto">{new Date(log._creationTime).toLocaleTimeString("fr-FR")}</span>
						</InlineStack>
					</Box>
				)
			})}
		</BlockStack>
	)
}

export function MissionLogs({ logs, live }: MissionLogsProps) {
	const logsEndRef = useRef<HTMLDivElement>(null)
	const [view, setView] = useState<"timeline" | "detailed">("detailed")

	useEffect(() => {
		if (live) {
			logsEndRef.current?.scrollIntoView({ behavior: "smooth" })
		}
	}, [live])

	if (logs.length === 0) {
		return <Box className="py-8 text-center text-sm text-fg-muted">Aucun log pour cette mission.</Box>
	}

	return (
		<div className="max-h-[600px] overflow-y-auto">
			<InlineStack gap="200" className="mb-3">
				<button type="button" onClick={() => setView("detailed")} className={`text-xs px-2 py-1 rounded cursor-pointer ${view === "detailed" ? "bg-brand text-white" : "text-fg-muted hover:text-fg"}`}>
					Detail
				</button>
				<button type="button" onClick={() => setView("timeline")} className={`text-xs px-2 py-1 rounded cursor-pointer ${view === "timeline" ? "bg-brand text-white" : "text-fg-muted hover:text-fg"}`}>
					Timeline
				</button>
			</InlineStack>

			{view === "timeline" ? <TimelineOverview logs={logs} /> : <DetailedLogs logs={logs} />}
			<div ref={logsEndRef} />
		</div>
	)
}
