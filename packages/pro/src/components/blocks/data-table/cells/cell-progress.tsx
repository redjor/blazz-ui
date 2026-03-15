"use client"

import { cn } from "@blazz/ui"

export interface CellProgressProps {
	/** Progress value between 0 and 100 */
	value: number
	/** Show percentage label to the right */
	showLabel?: boolean
	/** Thresholds that change the bar color */
	colorThresholds?: { warn: number; danger: number }
}

/**
 * Renders a mini progress bar with optional percentage label.
 * Supports color thresholds for visual feedback.
 */
export function CellProgress({ value, showLabel, colorThresholds }: CellProgressProps) {
	const clamped = Math.max(0, Math.min(100, value))

	let barColor = "bg-brand"
	if (colorThresholds) {
		if (clamped < colorThresholds.danger) {
			barColor = "bg-red-500"
		} else if (clamped < colorThresholds.warn) {
			barColor = "bg-amber-500"
		}
	}

	return (
		<div className="flex items-center gap-2">
			<div className="h-1.5 w-full min-w-12 rounded-full bg-surface-3/50">
				<div
					className={cn("h-full rounded-full transition-all", barColor)}
					style={{ width: `${clamped}%` }}
				/>
			</div>
			{showLabel && <span className="text-xs tabular-nums text-fg-muted">{clamped}%</span>}
		</div>
	)
}
