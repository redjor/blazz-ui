"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../../../lib/with-pro-guard"

export interface MetricCardProps {
	label: string
	value: string
	trend?: number
	trendLabel?: string
	icon?: ReactNode
	className?: string
}

function MetricCardBase({ label, value, trend, trendLabel, icon, className }: MetricCardProps) {
	return (
		<div className={cn("rounded-lg border border-container bg-card p-4", className)}>
			<div className="flex items-center justify-between">
				<span className="text-xs uppercase tracking-wide text-fg-muted">{label}</span>
				{icon && <span className="text-fg-muted">{icon}</span>}
			</div>
			<div className="mt-1 text-2xl font-semibold text-fg">{value}</div>
			{trend !== undefined && (
				<div className="mt-1 flex items-center gap-1.5">
					{trend >= 0 ? (
						<TrendingUp className="size-3.5 text-positive" />
					) : (
						<TrendingDown className="size-3.5 text-negative" />
					)}
					<span
						className={cn("text-sm font-medium", trend >= 0 ? "text-positive" : "text-negative")}
					>
						{trend >= 0 ? "+" : ""}
						{trend}%
					</span>
					{trendLabel && <span className="text-xs text-fg-muted">{trendLabel}</span>}
				</div>
			)}
		</div>
	)
}

export const MetricCard = withProGuard(MetricCardBase, "MetricCard")
