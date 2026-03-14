"use client"

import type { LucideIcon } from "lucide-react"
import { TrendingDown, TrendingUp } from "lucide-react"
import { cn } from "../../lib/utils"
import { withProGuard } from "../../lib/with-pro-guard"
import { Card, CardContent } from "../ui/card"
import { Skeleton } from "../ui/skeleton"

export interface StatItem {
	label: string
	value: string | number
	trend?: number
	trendInverted?: boolean
	icon?: LucideIcon
}

export interface StatsGridProps {
	stats: StatItem[]
	columns?: 2 | 3 | 4
	loading?: boolean
	className?: string
}

function StatCard({ stat }: { stat: StatItem }) {
	const Icon = stat.icon
	const hasTrend = stat.trend !== undefined && stat.trend !== null
	const isPositiveTrend = hasTrend && stat.trend! > 0
	const isNegativeTrend = hasTrend && stat.trend! < 0

	// When trendInverted, lower = better (green), higher = worse (red)
	const trendIsGood = stat.trendInverted ? isNegativeTrend : isPositiveTrend
	const trendIsBad = stat.trendInverted ? isPositiveTrend : isNegativeTrend

	return (
		<Card>
			<CardContent className="pt-4">
				<div className="flex items-start justify-between">
					<div className="space-y-2">
						<p className="text-sm text-fg-muted">{stat.label}</p>
						<p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
					</div>
					{Icon && (
						<div className="rounded-md bg-surface-3 p-2">
							<Icon className="size-4 text-fg-muted" />
						</div>
					)}
				</div>
				{hasTrend && (
					<div className="mt-2 flex items-center gap-1 text-xs">
						{trendIsGood && (
							<>
								<TrendingUp className="size-3 text-green-600" />
								<span className="text-green-600">+{Math.abs(stat.trend!)}%</span>
							</>
						)}
						{trendIsBad && (
							<>
								<TrendingDown className="size-3 text-red-600" />
								<span className="text-red-600">{stat.trend!}%</span>
							</>
						)}
						{!trendIsGood && !trendIsBad && <span className="text-fg-muted">0%</span>}
						<span className="text-fg-muted">vs période précédente</span>
					</div>
				)}
			</CardContent>
		</Card>
	)
}

function StatCardSkeleton() {
	return (
		<Card>
			<CardContent className="pt-4">
				<div className="flex items-start justify-between">
					<div className="space-y-2">
						<Skeleton className="h-4 w-24" />
						<Skeleton className="h-8 w-16" />
					</div>
					<Skeleton className="size-8 rounded-md" />
				</div>
				<Skeleton className="mt-2 h-3 w-32" />
			</CardContent>
		</Card>
	)
}

function StatsGridBase({ stats, columns = 4, loading = false, className }: StatsGridProps) {
	const gridCols = {
		2: "grid-cols-1 sm:grid-cols-2",
		3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
		4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
	}

	return (
		<div className={cn("grid gap-4", gridCols[columns], className)}>
			{loading
				? Array.from({ length: columns }).map((_, i) => <StatCardSkeleton key={i} />)
				: stats.map((stat, i) => <StatCard key={i} stat={stat} />)}
		</div>
	)
}

export const StatsGrid = withProGuard(StatsGridBase, "StatsGrid")
