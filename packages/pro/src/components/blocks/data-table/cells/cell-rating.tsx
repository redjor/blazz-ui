"use client"

import { Star } from "lucide-react"
import { cn } from "@blazz/ui"

export interface CellRatingProps {
	/** Current rating value */
	value: number
	/** Maximum rating (default 5) */
	max?: number
	/** Display style: star icons or small dots */
	variant?: "star" | "dot"
}

/**
 * Renders a rating as filled/empty stars or dots.
 */
export function CellRating({ value, max = 5, variant = "star" }: CellRatingProps) {
	const clamped = Math.max(0, Math.min(max, Math.round(value)))

	if (variant === "dot") {
		return (
			<div className="flex items-center gap-1">
				{Array.from({ length: max }, (_, i) => (
					<span
						key={i}
						className={cn(
							"inline-block h-2.5 w-2.5 rounded-full",
							i < clamped ? "bg-brand" : "bg-fg-muted/30"
						)}
					/>
				))}
			</div>
		)
	}

	return (
		<div className="flex items-center gap-0.5">
			{Array.from({ length: max }, (_, i) => (
				<Star
					key={i}
					className={cn(
						"size-3.5",
						i < clamped ? "text-amber-400 fill-amber-400" : "text-fg-muted/30"
					)}
				/>
			))}
		</div>
	)
}
