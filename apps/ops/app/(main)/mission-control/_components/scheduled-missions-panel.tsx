"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { Clock } from "lucide-react"
import Link from "next/link"
import { useMemo } from "react"
import { AgentAvatar } from "@/app/(main)/missions/_components/agent-avatar"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

const WEEKDAY_NAMES = ["dimanche", "lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi"]
const WEEKDAY_ALIASES: Record<string, number> = {
	SUN: 0,
	MON: 1,
	TUE: 2,
	WED: 3,
	THU: 4,
	FRI: 5,
	SAT: 6,
}

// Normalize a cron dow field to a sorted set of day numbers 0..6, or null if
// the field can't be parsed (e.g. has steps or ranges beyond what we handle).
function parseDow(dow: string): Set<number> | null {
	if (dow === "*") return null
	const tokens = dow.toUpperCase().split(",")
	const days = new Set<number>()
	for (const token of tokens) {
		const rangeMatch = token.match(/^([A-Z0-9]+)-([A-Z0-9]+)$/)
		if (rangeMatch) {
			const start = WEEKDAY_ALIASES[rangeMatch[1]] ?? Number(rangeMatch[1])
			const end = WEEKDAY_ALIASES[rangeMatch[2]] ?? Number(rangeMatch[2])
			if (Number.isNaN(start) || Number.isNaN(end) || start < 0 || end > 6) return null
			for (let d = start; d <= end; d++) days.add(d)
		} else {
			const d = WEEKDAY_ALIASES[token] ?? Number(token)
			if (Number.isNaN(d) || d < 0 || d > 6) return null
			days.add(d)
		}
	}
	return days
}

function humanizeCron(expr: string): string {
	const trimmed = expr.trim()
	const parts = trimmed.split(/\s+/)
	if (parts.length !== 5) return trimmed
	const [minute, hour, dom, month, dow] = parts

	const pad = (n: string) => (n.length === 1 ? `0${n}` : n)
	const time = hour !== "*" && minute !== "*" && /^\d+$/.test(hour) && /^\d+$/.test(minute) ? `${pad(hour)}:${pad(minute)}` : null

	// Every N hours at :00 — "0 */N * * *"
	if (minute === "0" && hour.startsWith("*/") && dom === "*" && month === "*" && dow === "*") {
		return `Toutes les ${hour.slice(2)} h`
	}
	// Hourly at :MM — "M * * * *"
	if (hour === "*" && /^\d+$/.test(minute) && dom === "*" && month === "*" && dow === "*") {
		return minute === "0" ? "Chaque heure" : `Chaque heure à :${pad(minute)}`
	}

	const dowSet = dow === "*" ? null : parseDow(dow)
	const isWeekdaySet = (set: Set<number>) => set.size === 5 && [1, 2, 3, 4, 5].every((d) => set.has(d))
	const isWeekendSet = (set: Set<number>) => set.size === 2 && set.has(0) && set.has(6)

	// Weekdays at HH:MM — accepts "1-5", "MON-FRI", "1,2,3,4,5"
	if (time && dom === "*" && month === "*" && dowSet && isWeekdaySet(dowSet)) {
		return `En semaine à ${time}`
	}
	// Weekend at HH:MM
	if (time && dom === "*" && month === "*" && dowSet && isWeekendSet(dowSet)) {
		return `Le week-end à ${time}`
	}
	// Single day weekly — "M H * * N" or "M H * * MON"
	if (time && dom === "*" && month === "*" && dowSet && dowSet.size === 1) {
		const d = [...dowSet][0]
		return `Chaque ${WEEKDAY_NAMES[d]} à ${time}`
	}
	// Daily — "M H * * *"
	if (time && dom === "*" && month === "*" && dow === "*") {
		return `Chaque jour à ${time}`
	}
	// Monthly — "M H D * *"
	if (time && /^\d+$/.test(dom) && month === "*" && dow === "*") {
		return `Le ${dom} de chaque mois à ${time}`
	}
	return trimmed
}

export function ScheduledMissionsPanel() {
	const templates = useQuery(api.missions.listCron)
	const agents = useQuery(api.agents.list)

	const agentMap = useMemo(() => {
		if (!agents) return new Map<Id<"agents">, { name: string; role: string }>()
		return new Map(agents.map((a) => [a._id, { name: a.name, role: a.role }]))
	}, [agents])

	if (templates === undefined) {
		return (
			<Card>
				<CardContent className="p-3">
					<BlockStack gap="200">
						{[1, 2].map((i) => (
							<Skeleton key={i} className="h-14 w-full rounded-md" />
						))}
					</BlockStack>
				</CardContent>
			</Card>
		)
	}

	if (templates.length === 0) {
		return (
			<Card>
				<CardContent className="py-6 text-center">
					<BlockStack gap="100" className="items-center">
						<Clock className="size-5 text-fg-muted" />
						<span className="text-sm text-fg-muted">Aucune mission planifiée.</span>
						<span className="text-xs text-fg-muted">
							Ajoute un champ <code className="font-mono text-[11px]">cron</code> à une mission terminée pour la relancer automatiquement.
						</span>
					</BlockStack>
				</CardContent>
			</Card>
		)
	}

	return (
		<Card>
			<CardContent className="p-0">
				<BlockStack>
					{templates.map((template) => {
						const agent = agentMap.get(template.agentId)
						const schedule = template.cron ? humanizeCron(template.cron) : "—"

						return (
							<Link key={template._id} href={`/missions/${template._id}`} className="flex items-center gap-3 px-4 py-3 border-b border-edge last:border-b-0 transition-colors hover:bg-muted/50">
								{agent && <AgentAvatar name={agent.name} size={28} className="shrink-0" />}

								<BlockStack gap="050" className="min-w-0 flex-1">
									<InlineStack gap="200" blockAlign="center" wrap={false}>
										<Clock className="size-3 text-fg-muted shrink-0" />
										<span className="text-sm font-medium text-fg truncate">{template.title}</span>
									</InlineStack>
									<InlineStack gap="200" blockAlign="center" wrap={false}>
										{agent && <span className="text-xs text-fg-muted shrink-0">{agent.name}</span>}
										<span className="text-[11px] text-fg-muted">·</span>
										<span className="text-xs text-fg-muted">{schedule}</span>
									</InlineStack>
								</BlockStack>

								<Badge variant="outline" className="text-[10px] font-mono shrink-0">
									{template.cron}
								</Badge>
							</Link>
						)
					})}
				</BlockStack>
			</CardContent>
		</Card>
	)
}
