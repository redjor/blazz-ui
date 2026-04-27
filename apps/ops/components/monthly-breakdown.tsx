"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { formatCurrency } from "@/lib/format"

interface MonthlyBreakdownProps {
	data: Array<{ month: string; minutes: number; revenue: number }>
	hoursPerDay: number
}

const fmtDays = (n: number) => `${(Math.round(n * 10) / 10).toLocaleString("fr-FR", { minimumFractionDigits: 1, maximumFractionDigits: 1 })}j`

export function MonthlyBreakdown({ data, hoursPerDay }: MonthlyBreakdownProps) {
	if (data.length === 0) return null

	const maxMinutes = Math.max(...data.map((d) => d.minutes))
	const sorted = [...data].reverse()
	const minutesPerDay = hoursPerDay * 60

	return (
		<BlockStack gap="300">
			<p className="text-xs text-fg-muted">Mensuel</p>
			<BlockStack gap="100">
				{sorted.map(({ month, minutes, revenue }) => {
					const label = format(new Date(`${month}-01T00:00:00`), "MMMM yyyy", { locale: fr })
					const widthPct = maxMinutes > 0 ? (minutes / maxMinutes) * 100 : 0
					const days = minutesPerDay > 0 ? minutes / minutesPerDay : 0
					return (
						<div key={month} className="flex items-center gap-3 text-sm">
							<span className="w-32 shrink-0 capitalize text-fg">{label}</span>
							<div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
								<div className="h-full rounded-full bg-brand transition-all" style={{ width: `${widthPct}%` }} />
							</div>
							<span className="w-16 shrink-0 text-right font-mono tabular-nums text-fg">{fmtDays(days)}</span>
							<span className="w-20 shrink-0 text-right font-mono tabular-nums text-fg-muted">{revenue > 0 ? formatCurrency(revenue) : "—"}</span>
						</div>
					)
				})}
			</BlockStack>
		</BlockStack>
	)
}
