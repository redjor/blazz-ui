"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../lib/with-pro-guard"

export interface SegmentedProgressProps {
	/** Percentage filled (0-100+) */
	percent: number
	/** Dot color — default "brand" */
	color?: "brand" | "caution" | "negative"
	/** Auto-switch color based on percent thresholds (75% caution, 90% negative) — default false */
	autoColor?: boolean
	/** Dot size in px — default 6 */
	dotSize?: number
	/** Gap between dots in px — default 2 */
	gap?: number
	className?: string
}

function resolveColor(
	percent: number,
	color?: "brand" | "caution" | "negative",
	autoColor?: boolean
): string {
	if (autoColor) {
		if (percent > 90) return "bg-negative"
		if (percent > 75) return "bg-caution"
		return "bg-brand"
	}
	const colorMap = { brand: "bg-brand", caution: "bg-caution", negative: "bg-negative" }
	return colorMap[color ?? "brand"]
}

function SegmentedProgressBase({
	percent,
	color,
	autoColor = false,
	dotSize = 6,
	gap = 2,
	className,
}: SegmentedProgressProps) {
	const ref = useRef<HTMLDivElement>(null)
	const [dotCount, setDotCount] = useState(0)

	useEffect(() => {
		const el = ref.current
		if (!el) return
		const observer = new ResizeObserver(([entry]) => {
			const width = entry.contentRect.width
			setDotCount(Math.floor((width + gap) / (dotSize + gap)))
		})
		observer.observe(el)
		return () => observer.disconnect()
	}, [dotSize, gap])

	const filled = Math.round((Math.min(percent, 100) / 100) * dotCount)
	const activeColor = resolveColor(percent, color, autoColor)

	return (
		<div ref={ref} className={cn("flex", className)} style={{ gap }}>
			{Array.from({ length: dotCount }, (_, i) => (
				<div
					key={i}
					className={cn("shrink-0 rounded-[1px]", i < filled ? activeColor : "bg-surface-3")}
					style={{ width: dotSize, height: dotSize }}
				/>
			))}
		</div>
	)
}

/** @internal — used by BudgetCard to avoid double pro-guard */
export { SegmentedProgressBase }
export const SegmentedProgress = withProGuard(SegmentedProgressBase, "SegmentedProgress")
