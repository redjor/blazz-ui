"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../lib/with-pro-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@blazz/ui"
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@blazz/ui"

export interface ForecastDataPoint {
	period: string
	actual?: number
	forecast?: number
	target?: number
}

export interface ForecastChartProps {
	title?: string
	description?: string
	data: ForecastDataPoint[]
	height?: number
	currency?: string
	className?: string
}

function formatYAxis(value: number) {
	if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`
	if (value >= 1_000) return `${(value / 1_000).toFixed(0)}k`
	return String(value)
}

const forecastConfig = {
	actual: {
		label: "Réalisé",
		color: "var(--chart-1)",
	},
	forecast: {
		label: "Prévision",
		color: "var(--chart-2)",
	},
	target: {
		label: "Objectif",
		color: "var(--chart-3)",
	},
} satisfies ChartConfig

function ForecastChartBase({
	title = "Prévision de revenus",
	description,
	data,
	height = 320,
	currency = "EUR",
	className,
}: ForecastChartProps) {
	const formatTooltipValue = (value: number) =>
		new Intl.NumberFormat("fr-FR", {
			style: "currency",
			currency,
			maximumFractionDigits: 0,
		}).format(value)

	const hasTarget = data.some((d) => d.target !== undefined)

	const content = (
		<ChartContainer config={forecastConfig} className="w-full" style={{ minHeight: height }}>
			<AreaChart accessibilityLayer data={data}>
				<defs>
					<linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="var(--color-actual)" stopOpacity={0.2} />
						<stop offset="95%" stopColor="var(--color-actual)" stopOpacity={0} />
					</linearGradient>
					<linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="var(--color-forecast)" stopOpacity={0.15} />
						<stop offset="95%" stopColor="var(--color-forecast)" stopOpacity={0} />
					</linearGradient>
				</defs>
				<CartesianGrid vertical={false} />
				<XAxis dataKey="period" tickLine={false} tickMargin={10} axisLine={false} />
				<YAxis tickLine={false} axisLine={false} tickFormatter={formatYAxis} />
				<ChartTooltip
					content={
						<ChartTooltipContent
							formatter={(value, name, item, index) => (
								<>
									<div
										className="h-2.5 w-2.5 shrink-0 rounded-[2px]"
										style={{ backgroundColor: `var(--color-${name})` }}
									/>
									<span className="text-fg-muted">
										{forecastConfig[name as keyof typeof forecastConfig]?.label ?? name}
									</span>
									<span className="text-fg font-mono font-medium tabular-nums ml-auto">
										{formatTooltipValue(value as number)}
									</span>
								</>
							)}
						/>
					}
				/>
				<ChartLegend content={<ChartLegendContent />} />
				<Area
					type="monotone"
					dataKey="actual"
					stroke="var(--color-actual)"
					strokeWidth={2}
					fill="url(#actualGradient)"
					connectNulls={false}
				/>
				<Area
					type="monotone"
					dataKey="forecast"
					stroke="var(--color-forecast)"
					strokeWidth={2}
					strokeDasharray="6 3"
					fill="url(#forecastGradient)"
					connectNulls={false}
				/>
				{hasTarget && (
					<Area
						type="monotone"
						dataKey="target"
						stroke="var(--color-target)"
						strokeWidth={1.5}
						strokeDasharray="3 3"
						fill="none"
						connectNulls
					/>
				)}
			</AreaChart>
		</ChartContainer>
	)

	if (!title) return <div className={className}>{content}</div>

	return (
		<Card className={cn(className)}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <p className="text-sm text-fg-muted">{description}</p>}
			</CardHeader>
			<CardContent>{content}</CardContent>
		</Card>
	)
}

export const ForecastChart = withProGuard(ForecastChartBase, "ForecastChart")
