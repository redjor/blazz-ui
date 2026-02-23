"use client"

import { TrendingUp, TrendingDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface StatItem {
	label: string
	value: string
	trend?: number
}

export interface GenStatsRowProps {
	items: StatItem[]
	className?: string
}

export function GenStatsRow({ items, className }: GenStatsRowProps) {
	return (
		<div
			className={cn(
				"flex divide-x divide-edge rounded-lg border border-edge bg-surface",
				className,
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
							<span
								className={cn(
									"text-sm",
									item.trend >= 0 ? "text-positive" : "text-negative",
								)}
							>
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
