"use client"

import { ChevronRight, FileText } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../../../lib/with-pro-guard"

export interface SummaryCardProps {
	title: string
	points: string[]
	conclusion?: string
	source?: string
	actions?: ReactNode
	className?: string
}

function SummaryCardBase({
	title,
	points,
	conclusion,
	source,
	actions,
	className,
}: SummaryCardProps) {
	return (
		<div className={cn("rounded-lg border border-container bg-surface p-4", className)}>
			<div className="flex items-center gap-2">
				<FileText className="size-4 text-fg-muted" />
				<span className="text-sm font-semibold text-fg">{title}</span>
			</div>

			<ul className="mt-3 space-y-1.5">
				{points.map((point, i) => (
					<li key={i} className="flex items-start gap-2">
						<ChevronRight className="size-3 mt-0.5 shrink-0 text-brand" />
						<span className="text-xs text-fg-muted leading-relaxed">{point}</span>
					</li>
				))}
			</ul>

			{conclusion && (
				<div className="mt-3 rounded-md bg-surface-3/50 p-3">
					<p className="text-xs font-medium text-fg leading-relaxed">{conclusion}</p>
				</div>
			)}

			{source && <p className="mt-2 text-xs text-fg-muted">Source: {source}</p>}

			{actions && (
				<div className="mt-3 flex items-center gap-2 border-t border-edge-subtle pt-3">
					{actions}
				</div>
			)}
		</div>
	)
}

export const SummaryCard = withProGuard(SummaryCardBase, "SummaryCard")
