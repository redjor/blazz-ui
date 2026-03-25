"use client"

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@blazz/ui/components/ui/card"
import { formatMinutes } from "@/lib/format"

type WeekInsightsCardProps = {
	stats: {
		focusedMinutes: number
		fragmentedMinutes: number
		uncategorizedMinutes: number
		totalMinutes: number
	}
	summary: string
}

export function WeekInsightsCard({ stats, summary }: WeekInsightsCardProps) {
	return (
		<Card>
			<CardHeader className="border-b border-separator">
				<CardTitle>Semaine</CardTitle>
				<CardDescription>Lecture rapide de ton rythme sur la semaine.</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
					<Metric label="Focus" value={formatMinutes(stats.focusedMinutes)} />
					<Metric label="Fragmenté" value={formatMinutes(stats.fragmentedMinutes)} />
					<Metric label="Non attribué" value={formatMinutes(stats.uncategorizedMinutes)} />
					<Metric label="Temps total" value={formatMinutes(stats.totalMinutes)} />
				</div>
				<div className="rounded-md border border-edge bg-muted px-4 py-3 text-sm text-fg-muted">
					{summary}
				</div>
			</CardContent>
		</Card>
	)
}

function Metric({ label, value }: { label: string; value: string }) {
	return (
		<div className="rounded-md border border-edge bg-card px-4 py-3">
			<p className="text-2xs uppercase tracking-wide text-fg-muted">{label}</p>
			<p className="mt-1 font-mono text-base font-semibold text-fg">{value}</p>
		</div>
	)
}
