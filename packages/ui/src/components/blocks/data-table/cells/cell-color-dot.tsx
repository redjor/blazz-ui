"use client"

import { cn } from "../../../../lib/utils"

export interface CellColorDotProps {
	/** The value/label to display */
	value: string
	/** Map of value → Tailwind bg class (e.g. { high: 'bg-red-500' }) */
	colorMap?: Record<string, string>
}

/**
 * Renders a small colored dot followed by a label.
 */
export function CellColorDot({ value, colorMap }: CellColorDotProps) {
	if (!value) {
		return <span className="text-fg-muted">&mdash;</span>
	}

	const dotClass = colorMap?.[value] ?? "bg-fg-muted"

	return (
		<div className="flex items-center gap-2">
			<span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", dotClass)} />
			<span className="text-body-md">{value}</span>
		</div>
	)
}
