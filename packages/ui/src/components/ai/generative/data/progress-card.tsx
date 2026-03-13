"use client"

import { cn } from "../../../../lib/utils"
import { withProGuard } from "../../../../lib/with-pro-guard"

export interface ProgressCardProps {
	label: string
	value: number
	description?: string
	color?: string
	className?: string
}

function ProgressCardBase({ label, value, description, color, className }: ProgressCardProps) {
	const clamped = Math.min(100, Math.max(0, value))

	return (
		<div className={cn("rounded-lg border border-container bg-surface p-4", className)}>
			<div className="flex items-baseline justify-between">
				<span className="text-sm font-medium text-fg">{label}</span>
				<span className="text-sm tabular-nums text-fg-muted">{clamped}%</span>
			</div>
			<div className="mt-2 h-2 overflow-hidden rounded-full bg-raised">
				<div
					className="h-full rounded-full bg-brand transition-all"
					style={{
						width: `${clamped}%`,
						...(color ? { backgroundColor: color } : {}),
					}}
				/>
			</div>
			{description && <p className="mt-2 text-xs text-fg-muted">{description}</p>}
		</div>
	)
}

export const ProgressCard = withProGuard(ProgressCardBase, "ProgressCard")
