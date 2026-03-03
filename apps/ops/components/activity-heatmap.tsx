"use client"

import { addDays, format, startOfWeek, subWeeks } from "date-fns"
import { fr } from "date-fns/locale"

interface Props {
	entries: Array<{ date: string; minutes: number }>
	weeks?: number
}

function getLevel(minutes: number): 0 | 1 | 2 | 3 | 4 {
	if (minutes === 0) return 0
	if (minutes < 60) return 1
	if (minutes < 180) return 2
	if (minutes < 300) return 3
	return 4
}

// bg-brand at increasing opacity — works in light and dark
const LEVEL_CLASSES: Record<0 | 1 | 2 | 3 | 4, string> = {
	0: "bg-edge rounded-sm",
	1: "bg-brand/25 rounded-sm",
	2: "bg-brand/50 rounded-sm",
	3: "bg-brand/75 rounded-sm",
	4: "bg-brand rounded-sm",
}

const CELL = 11 // px — cell size
const GAP = 2 // px — gap between cells
const STEP = CELL + GAP // 13px per column/row

const DAY_LABELS = ["Lun", "", "Mer", "", "Ven", "", ""]

export function ActivityHeatmap({ entries, weeks = 26 }: Props) {
	// Build daily map: date string → total minutes
	const dailyMap: Record<string, number> = {}
	for (const e of entries) {
		dailyMap[e.date] = (dailyMap[e.date] ?? 0) + e.minutes
	}

	// Grid starts on the Monday `weeks` weeks ago
	const today = new Date()
	const gridStart = subWeeks(startOfWeek(today, { weekStartsOn: 1 }), weeks - 1)

	// Build array of week-start dates (one per column)
	const weekStarts: Date[] = []
	let cur = gridStart
	while (cur <= today) {
		weekStarts.push(cur)
		cur = addDays(cur, 7)
	}

	// Compute month label positions (leftmost column where month starts)
	const monthLabels: Array<{ label: string; col: number }> = []
	let prevMonth = -1
	weekStarts.forEach((ws, col) => {
		const m = ws.getMonth()
		if (m !== prevMonth) {
			monthLabels.push({ label: format(ws, "MMM", { locale: fr }), col })
			prevMonth = m
		}
	})

	return (
		<div className="space-y-2">
			{/* Month labels row */}
			<div className="relative h-4" style={{ marginLeft: 28 }}>
				{monthLabels.map(({ label, col }) => (
					<span
						key={col}
						className="absolute text-[10px] text-fg-muted capitalize"
						style={{ left: col * STEP }}
					>
						{label}
					</span>
				))}
			</div>

			{/* Grid */}
			<div className="flex gap-2">
				{/* Day-of-week labels */}
				<div className="flex flex-col" style={{ gap: GAP, width: 24 }}>
					{DAY_LABELS.map((label, i) => (
						<div
							key={i}
							className="flex items-center text-[10px] text-fg-muted"
							style={{ height: CELL }}
						>
							{label}
						</div>
					))}
				</div>

				{/* Heatmap cells */}
				<div className="flex overflow-x-auto" style={{ gap: GAP }}>
					{weekStarts.map((ws, colIdx) => (
						<div key={colIdx} className="flex flex-col shrink-0" style={{ gap: GAP }}>
							{Array.from({ length: 7 }).map((_, dow) => {
								const date = addDays(ws, dow)
								if (date > today) {
									return <div key={dow} style={{ width: CELL, height: CELL }} />
								}
								const dateStr = format(date, "yyyy-MM-dd")
								const minutes = dailyMap[dateStr] ?? 0
								const level = getLevel(minutes)
								const hours = Math.round((minutes / 60) * 10) / 10
								const label = format(date, "d MMM yyyy", { locale: fr })
								return (
									<div
										key={dow}
										title={
											minutes > 0
												? `${label} — ${hours}h`
												: `${label} — aucune activité`
										}
										className={`cursor-default ${LEVEL_CLASSES[level]}`}
										style={{ width: CELL, height: CELL }}
									/>
								)
							})}
						</div>
					))}
				</div>
			</div>

			{/* Legend */}
			<div className="flex items-center gap-1.5 justify-end">
				<span className="text-[10px] text-fg-muted">Moins</span>
				{([0, 1, 2, 3, 4] as const).map((level) => (
					<div
						key={level}
						className={LEVEL_CLASSES[level]}
						style={{ width: CELL, height: CELL }}
					/>
				))}
				<span className="text-[10px] text-fg-muted">Plus</span>
			</div>
		</div>
	)
}
