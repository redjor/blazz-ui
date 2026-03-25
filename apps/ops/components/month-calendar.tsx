"use client"

import { cn } from "@blazz/ui/lib/utils"
import {
	addDays,
	endOfMonth,
	endOfWeek,
	format,
	isSameMonth,
	isToday,
	isWeekend,
	startOfMonth,
	startOfWeek,
} from "date-fns"
import { useMemo } from "react"
import type { Doc } from "@/convex/_generated/dataModel"
import { formatCurrency, formatMinutes } from "@/lib/format"

type TimeEntry = Doc<"timeEntries">

interface MonthCalendarProps {
	month: Date
	entries: TimeEntry[]
}

const DAY_LABELS = ["lun", "mar", "mer", "jeu", "ven", "sam", "dim"]

export function MonthCalendar({ month, entries }: MonthCalendarProps) {
	// Build calendar grid (weeks × 7 days, starting Monday)
	const calendarDays = useMemo(() => {
		const monthStart = startOfMonth(month)
		const monthEnd = endOfMonth(month)
		const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 })
		const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 })

		const days: Date[] = []
		let current = gridStart
		while (current <= gridEnd) {
			days.push(current)
			current = addDays(current, 1)
		}
		return days
	}, [month])

	// Build a map: dateStr → { totalMinutes, billableMinutes, amount }
	const dayMap = useMemo(() => {
		const map = new Map<string, { totalMinutes: number; billableMinutes: number; amount: number }>()
		for (const entry of entries) {
			const existing = map.get(entry.date) ?? {
				totalMinutes: 0,
				billableMinutes: 0,
				amount: 0,
			}
			existing.totalMinutes += entry.minutes
			if (entry.billable) {
				existing.billableMinutes += entry.minutes
				existing.amount += (entry.minutes / 60) * entry.hourlyRate
			}
			map.set(entry.date, existing)
		}
		return map
	}, [entries])

	// Month totals
	const monthStats = useMemo(() => {
		let totalMinutes = 0
		let billableMinutes = 0
		let amount = 0
		let daysWorked = 0
		for (const [, stats] of dayMap) {
			totalMinutes += stats.totalMinutes
			billableMinutes += stats.billableMinutes
			amount += stats.amount
			if (stats.totalMinutes > 0) daysWorked++
		}
		return { totalMinutes, billableMinutes, amount, daysWorked }
	}, [dayMap])

	// Max for intensity scaling
	const maxMinutes = useMemo(() => {
		let max = 0
		for (const [, stats] of dayMap) {
			if (stats.totalMinutes > max) max = stats.totalMinutes
		}
		return Math.max(max, 1)
	}, [dayMap])

	// Split into weeks
	const weeks = useMemo(() => {
		const result: Date[][] = []
		for (let i = 0; i < calendarDays.length; i += 7) {
			result.push(calendarDays.slice(i, i + 7))
		}
		return result
	}, [calendarDays])

	return (
		<div className="space-y-6">
			{/* Month summary */}
			<div className="grid grid-cols-4 gap-3">
				<SummaryCard
					label="Total mois"
					value={formatMinutes(monthStats.totalMinutes)}
					sub={`${monthStats.daysWorked} jour${monthStats.daysWorked !== 1 ? "s" : ""} travaillé${monthStats.daysWorked !== 1 ? "s" : ""}`}
				/>
				<SummaryCard
					label="Facturable"
					value={formatMinutes(monthStats.billableMinutes)}
					sub={
						monthStats.totalMinutes > 0
							? `${Math.round((monthStats.billableMinutes / monthStats.totalMinutes) * 100)}% du total`
							: undefined
					}
				/>
				<SummaryCard
					label="Montant"
					value={formatCurrency(monthStats.amount)}
					sub={
						monthStats.billableMinutes > 0
							? `${formatCurrency(monthStats.amount / (monthStats.billableMinutes / 60))}/h moy.`
							: undefined
					}
				/>
				<SummaryCard
					label="Moy. / jour"
					value={
						monthStats.daysWorked > 0
							? formatMinutes(Math.round(monthStats.totalMinutes / monthStats.daysWorked))
							: "—"
					}
					sub={monthStats.daysWorked > 0 ? `sur ${monthStats.daysWorked} jours` : undefined}
				/>
			</div>

			{/* Calendar grid */}
			<div className="border border-edge rounded-lg overflow-hidden">
				{/* Header row */}
				<div className="grid grid-cols-7 border-b border-edge bg-muted">
					{DAY_LABELS.map((label) => (
						<div
							key={label}
							className="py-2 text-center text-xs font-medium text-fg-muted uppercase tracking-wide"
						>
							{label}
						</div>
					))}
				</div>

				{/* Week rows */}
				{weeks.map((week, wi) => (
					<div
						key={wi}
						className={cn("grid grid-cols-7", wi < weeks.length - 1 && "border-b border-edge")}
					>
						{week.map((day) => {
							const dateStr = format(day, "yyyy-MM-dd")
							const inMonth = isSameMonth(day, month)
							const today = isToday(day)
							const weekend = isWeekend(day)
							const stats = dayMap.get(dateStr)
							const mins = stats?.totalMinutes ?? 0
							const intensity = mins > 0 ? Math.max(mins / maxMinutes, 0.15) : 0

							return (
								<div
									key={dateStr}
									className={cn(
										"relative min-h-[72px] p-1.5 transition-colors",
										!inMonth && "opacity-30",
										weekend && inMonth && "bg-card/50",
										"[&:not(:last-child)]:border-r border-edge"
									)}
								>
									{/* Day number */}
									<div className="flex items-center justify-between mb-1">
										<span
											className={cn(
												"text-xs font-medium leading-none",
												today
													? "bg-brand text-white size-5 rounded-full flex items-center justify-center"
													: "text-fg-muted"
											)}
										>
											{format(day, "d")}
										</span>
									</div>

									{/* Hours block */}
									{mins > 0 && inMonth && (
										<div
											className="rounded px-1.5 py-1 mt-0.5"
											style={{
												backgroundColor: `oklch(0.585 0.22 275 / ${intensity * 0.3})`,
											}}
										>
											<p className="text-xs font-mono font-semibold text-fg leading-tight">
												{formatMinutes(mins)}
											</p>
											{stats && stats.amount > 0 && (
												<p className="text-[10px] text-fg-muted font-mono leading-tight">
													{formatCurrency(stats.amount)}
												</p>
											)}
										</div>
									)}
								</div>
							)
						})}
					</div>
				))}
			</div>
		</div>
	)
}

function SummaryCard({ label, value, sub }: { label: string; value: string; sub?: string }) {
	return (
		<div className="rounded-lg border border-edge bg-muted p-4">
			<p className="text-xs text-fg-muted uppercase tracking-wide mb-1">{label}</p>
			<p className="text-2xl font-semibold font-mono text-fg">{value}</p>
			{sub && <p className="text-xs text-fg-muted mt-1">{sub}</p>}
		</div>
	)
}
