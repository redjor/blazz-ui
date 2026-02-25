"use client"

import { cn } from "../../../../lib/utils"

export interface ScoreBreakdown {
	label: string
	value: number
	maxValue?: number
}

export interface ScoreCardProps {
	title: string
	score: number
	maxScore?: number
	label?: string
	breakdown?: ScoreBreakdown[]
	className?: string
}

export function ScoreCard({
	title,
	score,
	maxScore = 100,
	label,
	breakdown,
	className,
}: ScoreCardProps) {
	const percentage = (score / maxScore) * 100
	const circumference = 2 * Math.PI * 36
	const dashOffset = circumference - (percentage / 100) * circumference

	const color = percentage >= 75 ? "text-emerald-500" : percentage >= 50 ? "text-amber-500" : "text-red-500"
	const strokeColor = percentage >= 75 ? "stroke-emerald-500" : percentage >= 50 ? "stroke-amber-500" : "stroke-red-500"

	return (
		<div className={cn("rounded-lg border border-container bg-surface p-4", className)}>
			<span className="text-sm font-semibold text-fg">{title}</span>

			<div className="mt-3 flex items-center gap-4">
				<div className="relative size-20 shrink-0">
					<svg className="size-20 -rotate-90" viewBox="0 0 80 80">
						<circle
							cx="40"
							cy="40"
							r="36"
							fill="none"
							className="stroke-raised"
							strokeWidth="6"
						/>
						<circle
							cx="40"
							cy="40"
							r="36"
							fill="none"
							className={strokeColor}
							strokeWidth="6"
							strokeLinecap="round"
							strokeDasharray={circumference}
							strokeDashoffset={dashOffset}
						/>
					</svg>
					<div className="absolute inset-0 flex flex-col items-center justify-center">
						<span className={cn("text-lg font-bold tabular-nums", color)}>{score}</span>
						{label && <span className="text-[10px] text-fg-muted">{label}</span>}
					</div>
				</div>

				{breakdown && breakdown.length > 0 && (
					<div className="flex-1 space-y-2">
						{breakdown.map((item) => {
							const itemMax = item.maxValue ?? maxScore
							const itemPct = (item.value / itemMax) * 100
							return (
								<div key={item.label}>
									<div className="flex items-center justify-between">
										<span className="text-xs text-fg-muted">{item.label}</span>
										<span className="text-xs font-medium text-fg tabular-nums">
											{item.value}/{itemMax}
										</span>
									</div>
									<div className="mt-0.5 h-1.5 rounded-full bg-raised overflow-hidden">
										<div
											className={cn(
												"h-full rounded-full",
												itemPct >= 75 ? "bg-emerald-500" : itemPct >= 50 ? "bg-amber-500" : "bg-red-500",
											)}
											style={{ width: `${itemPct}%` }}
										/>
									</div>
								</div>
							)
						})}
					</div>
				)}
			</div>
		</div>
	)
}
