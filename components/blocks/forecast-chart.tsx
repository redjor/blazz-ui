"use client"

import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
	ReferenceLine,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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

const tooltipStyle = {
	backgroundColor: "hsl(var(--background))",
	border: "1px solid hsl(var(--border))",
	borderRadius: "8px",
	fontSize: "12px",
}

export function ForecastChart({
	title = "Prévision de revenus",
	description,
	data,
	height = 320,
	currency = "EUR",
	className,
}: ForecastChartProps) {
	const formatTooltipValue = (value: number) =>
		new Intl.NumberFormat("fr-FR", { style: "currency", currency, maximumFractionDigits: 0 }).format(value)

	const hasTarget = data.some((d) => d.target !== undefined)

	const content = (
		<ResponsiveContainer width="100%" height={height}>
			<AreaChart data={data}>
				<defs>
					<linearGradient id="actualGradient" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#2563eb" stopOpacity={0.2} />
						<stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
					</linearGradient>
					<linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
						<stop offset="5%" stopColor="#16a34a" stopOpacity={0.15} />
						<stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
					</linearGradient>
				</defs>
				<CartesianGrid strokeDasharray="3 3" className="stroke-border" />
				<XAxis
					dataKey="period"
					className="text-xs"
					tick={{ fill: "hsl(var(--muted-foreground))" }}
				/>
				<YAxis
					className="text-xs"
					tick={{ fill: "hsl(var(--muted-foreground))" }}
					tickFormatter={formatYAxis}
				/>
				<Tooltip
					contentStyle={tooltipStyle}
					formatter={(value: number, name: string) => [
						formatTooltipValue(value),
						name === "actual" ? "Réalisé" : name === "forecast" ? "Prévision" : "Objectif",
					]}
				/>
				<Legend
					formatter={(value: string) =>
						value === "actual" ? "Réalisé" : value === "forecast" ? "Prévision" : "Objectif"
					}
				/>
				<Area
					type="monotone"
					dataKey="actual"
					stroke="#2563eb"
					strokeWidth={2}
					fill="url(#actualGradient)"
					connectNulls={false}
				/>
				<Area
					type="monotone"
					dataKey="forecast"
					stroke="#16a34a"
					strokeWidth={2}
					strokeDasharray="6 3"
					fill="url(#forecastGradient)"
					connectNulls={false}
				/>
				{hasTarget && (
					<Area
						type="monotone"
						dataKey="target"
						stroke="#eab308"
						strokeWidth={1.5}
						strokeDasharray="3 3"
						fill="none"
						connectNulls
					/>
				)}
			</AreaChart>
		</ResponsiveContainer>
	)

	if (!title) return <div className={className}>{content}</div>

	return (
		<Card className={cn(className)}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && (
					<p className="text-sm text-muted-foreground">{description}</p>
				)}
			</CardHeader>
			<CardContent>{content}</CardContent>
		</Card>
	)
}
