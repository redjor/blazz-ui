"use client"

import type { ReactNode } from "react"
import { Lightbulb, TrendingUp, AlertTriangle, Info } from "lucide-react"
import { Badge } from "../../../ui/badge"
import { cn } from "../../../../lib/utils"

export type InsightType = "recommendation" | "opportunity" | "warning" | "info"

export interface InsightCardProps {
	title: string
	description: string
	type?: InsightType
	confidence?: number
	source?: string
	actions?: ReactNode
	className?: string
}

const typeConfig = {
	recommendation: { icon: Lightbulb, color: "text-brand", bg: "bg-brand/10", label: "Recommendation" },
	opportunity: { icon: TrendingUp, color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Opportunity" },
	warning: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10", label: "Warning" },
	info: { icon: Info, color: "text-blue-500", bg: "bg-blue-500/10", label: "Info" },
} as const

export function InsightCard({
	title,
	description,
	type = "recommendation",
	confidence,
	source,
	actions,
	className,
}: InsightCardProps) {
	const config = typeConfig[type]
	const Icon = config.icon

	return (
		<div className={cn("rounded-lg border border-container bg-surface p-4", className)}>
			<div className="flex items-start gap-3">
				<div className={cn("mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full", config.bg)}>
					<Icon className={cn("size-4", config.color)} />
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="text-sm font-semibold text-fg">{title}</span>
						<Badge variant="default" size="xs" fill="subtle">{config.label}</Badge>
					</div>
					<p className="mt-1 text-xs text-fg-muted leading-relaxed">{description}</p>
				</div>
			</div>

			{(confidence !== undefined || source) && (
				<div className="mt-3 flex flex-wrap items-center gap-3">
					{confidence !== undefined && (
						<div className="flex items-center gap-2">
							<span className="text-xs text-fg-muted">Confidence</span>
							<div className="h-1.5 w-16 rounded-full bg-raised overflow-hidden">
								<div
									className={cn("h-full rounded-full", config.bg.replace("/10", ""))}
									style={{ width: `${confidence}%`, backgroundColor: undefined }}
								/>
							</div>
							<span className="text-xs font-medium text-fg tabular-nums">{confidence}%</span>
						</div>
					)}
					{source && (
						<span className="text-xs text-fg-muted">Source: {source}</span>
					)}
				</div>
			)}

			{actions && (
				<div className="mt-3 flex items-center gap-2 border-t border-edge-subtle pt-3">
					{actions}
				</div>
			)}
		</div>
	)
}
