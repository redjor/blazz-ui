"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../../../lib/with-pro-guard"

export interface StatItem {
	label: string
	value: string
	trend?: number
}

export interface StatsRowProps {
	items: StatItem[]
	className?: string
}

function StatsRowBase({ items, className }: StatsRowProps) {
	return (
		<div
			className={cn(
				"flex divide-x divide-separator rounded-lg border border-container bg-surface",
				className
			)}
		>
			{items.map((item, i) => (
				<div key={i} className="flex flex-1 flex-col gap-1 px-4 py-3">
					<span className="text-xs text-fg-muted">{item.label}</span>
					<span className="text-lg font-semibold text-fg">{item.value}</span>
					{item.trend !== undefined && (
						<div className="flex items-center gap-1">
							{item.trend >= 0 ? (
								<TrendingUp className="size-3 text-positive" />
							) : (
								<TrendingDown className="size-3 text-negative" />
							)}
							<span className={cn("text-sm", item.trend >= 0 ? "text-positive" : "text-negative")}>
								{item.trend >= 0 ? "+" : ""}
								{item.trend}%
							</span>
						</div>
					)}
				</div>
			))}
		</div>
	)
}

export const StatsRow = withProGuard(StatsRowBase, "StatsRow")
