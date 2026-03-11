"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@blazz/ui/components/ui/card"

type JournalDayCardProps = {
	dateLabel: string
	summary: string
	energy?: "high" | "medium" | "low" | null
	topActivities?: string[]
	note?: string | null
	onClick?: () => void
}

const ENERGY_CONFIG = {
	high: { label: "Énergie haute", variant: "success" as const },
	medium: { label: "Énergie moyenne", variant: "secondary" as const },
	low: { label: "Énergie basse", variant: "warning" as const },
}

export function JournalDayCard({
	dateLabel,
	summary,
	energy,
	topActivities = [],
	note,
	onClick,
}: JournalDayCardProps) {
	const content = (
		<Card className="transition-colors hover:bg-raised/30">
			<CardHeader>
				<CardTitle>{dateLabel}</CardTitle>
				<CardDescription>{summary}</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				{topActivities.length > 0 ? (
					<div className="space-y-1">
						<p className="text-2xs uppercase tracking-wide text-fg-muted">Activités marquantes</p>
						<p className="text-sm text-fg">{topActivities.join(" · ")}</p>
					</div>
				) : null}
				{energy ? (
					<Badge variant={ENERGY_CONFIG[energy].variant} fill="subtle" size="sm">
						{ENERGY_CONFIG[energy].label}
					</Badge>
				) : null}
				{note ? (
					<div className="rounded-md border border-edge bg-raised px-3 py-2 text-sm text-fg-muted">
						{note}
					</div>
				) : null}
			</CardContent>
		</Card>
	)

	if (!onClick) return content

	return (
		<button type="button" onClick={onClick} className="block w-full text-left">
			{content}
		</button>
	)
}
