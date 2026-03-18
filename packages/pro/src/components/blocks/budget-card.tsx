"use client"

import { cn } from "@blazz/ui"
import { Card, CardContent } from "@blazz/ui"
import { BlockStack } from "@blazz/ui"
import { Skeleton } from "@blazz/ui"
import { withProGuard } from "../../lib/with-pro-guard"
import { SegmentedProgressBase } from "./segmented-progress"

export interface BudgetCardProps {
	/** Project/item name */
	name: string
	/** Revenue amount (raw number, formatted internally) */
	revenue: number
	/** Days consumed */
	daysConsumed: number
	/** Budget consumption percentage (0-100+) */
	percent: number
	/** Label below the bar (e.g. "0.9 / 10j" or "budget €1 200") */
	budgetLabel?: string
	/** Auto-switch bar color based on thresholds — default true */
	autoColor?: boolean
	/** Loading skeleton state */
	loading?: boolean
	/** Currency formatter — default Intl fr-FR EUR */
	formatCurrency?: (amount: number) => string
	className?: string
}

const defaultFormat = (amount: number) =>
	`€${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(amount))}`

function BudgetCardBase({
	name,
	revenue,
	daysConsumed,
	percent,
	budgetLabel,
	autoColor = true,
	loading = false,
	formatCurrency = defaultFormat,
	className,
}: BudgetCardProps) {
	if (loading) return <BudgetCardSkeleton className={className} />

	const isWarning = percent > 75 && percent <= 90
	const isDanger = percent > 90

	return (
		<Card className={cn("transition-colors duration-150 hover:border-fg-muted/25", className)}>
			<CardContent className="p-4">
				<BlockStack gap="300">
					<span className="text-sm font-medium truncate">{name}</span>

					<div className="flex items-baseline justify-between gap-2">
						<span className="text-lg font-semibold tabular-nums tracking-tight">
							{formatCurrency(revenue)}
						</span>
						<span className="text-xs text-fg-muted tabular-nums">
							{daysConsumed}j
						</span>
					</div>

					<BlockStack gap="100">
						<SegmentedProgressBase percent={percent} autoColor={autoColor} />
						<div className="flex items-center justify-between">
							<span className="text-2xs text-fg-muted tabular-nums">
								{budgetLabel ?? "\u00A0"}
							</span>
							<span
								className={cn(
									"text-2xs font-medium tabular-nums",
									isDanger
										? "text-negative"
										: isWarning
											? "text-caution"
											: "text-fg-muted"
								)}
							>
								{Math.round(percent)}%
							</span>
						</div>
					</BlockStack>
				</BlockStack>
			</CardContent>
		</Card>
	)
}

function BudgetCardSkeleton({ className }: { className?: string }) {
	return (
		<Card className={className}>
			<CardContent className="p-4">
				<BlockStack gap="300">
					<Skeleton className="h-4 w-28" />
					<div className="flex items-baseline justify-between">
						<Skeleton className="h-6 w-20" />
						<Skeleton className="h-3 w-8" />
					</div>
					<Skeleton className="h-1.5 w-full" />
				</BlockStack>
			</CardContent>
		</Card>
	)
}

export const BudgetCard = withProGuard(BudgetCardBase, "BudgetCard")
