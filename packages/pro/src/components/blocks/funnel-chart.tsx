"use client"

import { cn } from "@blazz/ui"
import { withProGuard } from "../../lib/with-pro-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@blazz/ui"

export interface FunnelStage {
	label: string
	value: number
	color?: string
}

export interface FunnelChartProps {
	title?: string
	description?: string
	stages: FunnelStage[]
	formatValue?: (value: number) => string
	className?: string
}

const DEFAULT_COLORS = [
	"bg-blue-500",
	"bg-blue-400",
	"bg-yellow-400",
	"bg-orange-400",
	"bg-green-500",
	"bg-red-400",
]

function FunnelChartBase({
	title,
	description,
	stages,
	formatValue = (v) => String(v),
	className,
}: FunnelChartProps) {
	const maxValue = Math.max(...stages.map((s) => s.value), 1)

	const content = (
		<div className="space-y-2">
			{stages.map((stage, i) => {
				const widthPercent = (stage.value / maxValue) * 100
				const conversionRate =
					i > 0 && stages[i - 1].value > 0
						? ((stage.value / stages[i - 1].value) * 100).toFixed(0)
						: null

				return (
					<div key={stage.label} className="space-y-1">
						<div className="flex items-center justify-between text-sm">
							<span className="font-medium">{stage.label}</span>
							<div className="flex items-center gap-2">
								{conversionRate && <span className="text-xs text-fg-muted">{conversionRate}%</span>}
								<span className="font-semibold tabular-nums">{formatValue(stage.value)}</span>
							</div>
						</div>
						<div className="h-8 w-full rounded-md bg-muted/50">
							<div
								className={cn(
									"flex h-full items-center rounded-md transition-all",
									stage.color || DEFAULT_COLORS[i % DEFAULT_COLORS.length]
								)}
								style={{ width: `${Math.max(widthPercent, 4)}%` }}
							/>
						</div>
					</div>
				)
			})}
		</div>
	)

	if (!title) return <div className={className}>{content}</div>

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <p className="text-sm text-fg-muted">{description}</p>}
			</CardHeader>
			<CardContent>{content}</CardContent>
		</Card>
	)
}

export const FunnelChart = withProGuard(FunnelChartBase, "FunnelChart")
