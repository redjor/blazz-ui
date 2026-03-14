"use client"

import { Card, CardContent } from "@blazz/ui/components/ui/card"
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@blazz/ui/components/ui/chart"
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis, YAxis } from "recharts"
import { type BudgetMetrics, healthColor } from "@/lib/budget"
import { formatCurrency } from "@/lib/format"

interface BudgetSectionProps {
	metrics: BudgetMetrics
	tjm: number
	weeklyBurnDown: Array<{ week: string; remaining: number; theoretical: number }> | null
}

const chartConfig = {
	remaining: { label: "Reste réel", color: "oklch(0.585 0.22 275)" },
	theoretical: { label: "Théorique", color: "oklch(0.7 0.05 260)" },
} satisfies ChartConfig

export function BudgetSection({ metrics, tjm, weeklyBurnDown }: BudgetSectionProps) {
	const colors = healthColor(metrics.health)
	const clampedPercent = Math.min(metrics.percentUsed, 100)
	const daysRemaining = tjm > 0 ? metrics.remaining / tjm : 0

	return (
		<div className="space-y-4">
			{/* Alert banner */}
			{metrics.health === "over" && (
				<div className={`px-4 py-2.5 rounded-lg text-sm font-medium ${colors.bg} ${colors.text}`}>
					Budget dépassé de {formatCurrency(Math.abs(metrics.remaining))}
				</div>
			)}
			{(metrics.health === "danger" || metrics.health === "warning") && (
				<div className={`px-4 py-2.5 rounded-lg text-sm font-medium ${colors.bg} ${colors.text}`}>
					{metrics.percentUsed}% du budget consommé
				</div>
			)}

			{/* Progress bar */}
			<div className="space-y-2">
				<div className="flex items-center justify-between text-xs">
					<span className="text-fg-muted">Budget</span>
					<span className="text-fg font-mono font-medium">
						{formatCurrency(metrics.revenueConsumed)} / {formatCurrency(metrics.budgetAmount)} (
						{metrics.percentUsed}%)
					</span>
				</div>
				<div className="h-2.5 bg-surface-3 rounded-full overflow-hidden border border-edge">
					<div
						className={`h-full rounded-full transition-all ${colors.bar}`}
						style={{ width: `${clampedPercent}%` }}
					/>
				</div>
				<p className="text-xs text-fg-muted font-mono">
					Reste : {formatCurrency(Math.max(0, metrics.remaining))} (~
					{Math.round(daysRemaining * 10) / 10}j)
				</p>
			</div>

			{/* TJM effectif card */}
			<Card>
				<CardContent className="p-4">
					<p className="text-xs text-fg-muted mb-1">TJM effectif</p>
					<div className="flex items-baseline gap-2">
						<p
							className={`text-xl font-semibold font-mono ${
								metrics.effectiveTjm !== null && metrics.effectiveTjm >= tjm
									? "text-green-600 dark:text-green-400"
									: "text-red-600 dark:text-red-400"
							}`}
						>
							{metrics.effectiveTjm !== null ? `${metrics.effectiveTjm}€` : "—"}
						</p>
						<span className="text-xs text-fg-muted">TJM vendu : {tjm}€</span>
					</div>
				</CardContent>
			</Card>

			{/* Burn-down sparkline */}
			{weeklyBurnDown && weeklyBurnDown.length >= 2 && (
				<div className="space-y-2">
					<p className="text-xs text-fg-muted">Burn-down budget</p>
					<ChartContainer config={chartConfig} className="h-[140px] w-full">
						<AreaChart data={weeklyBurnDown} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
							<CartesianGrid strokeDasharray="3 3" vertical={false} />
							<XAxis
								dataKey="week"
								tickFormatter={(v: string) => v.slice(5)}
								tick={{ fontSize: 10 }}
							/>
							<YAxis hide />
							<ReferenceLine y={0} stroke="var(--color-fg-muted)" strokeDasharray="3 3" />
							<ChartTooltip content={<ChartTooltipContent />} />
							<Area
								dataKey="theoretical"
								stroke="var(--color-theoretical)"
								fill="var(--color-theoretical)"
								fillOpacity={0.05}
								strokeDasharray="4 4"
								type="linear"
							/>
							<Area
								dataKey="remaining"
								stroke="var(--color-remaining)"
								fill="var(--color-remaining)"
								fillOpacity={0.15}
								type="monotone"
							/>
						</AreaChart>
					</ChartContainer>
				</div>
			)}
		</div>
	)
}
