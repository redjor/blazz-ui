"use client"

import { Star } from "lucide-react"
import { cn } from "../../../../lib/utils"
import { withProGuard } from "../../../../lib/with-pro-guard"

export interface RatingCardProps {
	title: string
	score: number
	maxScore?: number
	type?: "stars" | "numeric" | "nps"
	label?: string
	reviewCount?: number
	className?: string
}

function RatingCardBase({
	title,
	score,
	maxScore = 5,
	type = "stars",
	label,
	reviewCount,
	className,
}: RatingCardProps) {
	return (
		<div className={cn("rounded-lg border border-container bg-surface p-4", className)}>
			<span className="text-sm font-semibold text-fg">{title}</span>

			<div className="mt-2">
				{type === "stars" && (
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-0.5">
							{Array.from({ length: maxScore }, (_, i) => (
								<Star
									key={i}
									className={cn(
										"size-4",
										i < Math.floor(score)
											? "fill-amber-400 text-amber-400"
											: i < score
												? "fill-amber-400/50 text-amber-400"
												: "text-fg-muted/30"
									)}
								/>
							))}
						</div>
						<span className="text-sm font-semibold text-fg tabular-nums">{score}</span>
						<span className="text-xs text-fg-muted">/ {maxScore}</span>
					</div>
				)}

				{type === "numeric" && (
					<div className="flex items-baseline gap-1">
						<span className="text-2xl font-bold text-fg tabular-nums">{score}</span>
						<span className="text-sm text-fg-muted">/ {maxScore}</span>
					</div>
				)}

				{type === "nps" && (
					<div className="space-y-2">
						<div className="flex items-baseline gap-1">
							<span className="text-2xl font-bold text-fg tabular-nums">{score}</span>
							<span className="text-sm text-fg-muted">NPS</span>
						</div>
						<div className="h-2 w-full rounded-full bg-raised overflow-hidden">
							<div
								className={cn(
									"h-full rounded-full transition-all",
									score >= 50 ? "bg-emerald-500" : score >= 0 ? "bg-amber-500" : "bg-red-500"
								)}
								style={{ width: `${((score + 100) / 200) * 100}%` }}
							/>
						</div>
						<div className="flex justify-between text-xs text-fg-muted">
							<span>-100</span>
							<span>0</span>
							<span>+100</span>
						</div>
					</div>
				)}
			</div>

			{(label || reviewCount !== undefined) && (
				<div className="mt-2 flex items-center gap-2">
					{label && <span className="text-xs text-fg-muted">{label}</span>}
					{reviewCount !== undefined && (
						<span className="text-xs text-fg-muted">
							({reviewCount} review{reviewCount !== 1 ? "s" : ""})
						</span>
					)}
				</div>
			)}
		</div>
	)
}

export const RatingCard = withProGuard(RatingCardBase, "RatingCard")
