"use client"

import { Bar, BarChart, CartesianGrid, Line, LineChart, Pie, PieChart, XAxis, YAxis } from "recharts"
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

const CHART_COLORS = [
	"var(--chart-1)",
	"var(--chart-2)",
	"var(--chart-3)",
	"var(--chart-4)",
	"var(--chart-5)",
]

export interface ChartCardProps {
	title: string
	description?: string
	type: "line" | "bar" | "pie"
	data: Record<string, unknown>[]
	xKey?: string
	yKey?: string | string[]
	colorKey?: string
	height?: number
	className?: string
}

function buildConfig(yKeys: string[]): ChartConfig {
	const config: ChartConfig = {}
	for (let i = 0; i < yKeys.length; i++) {
		config[yKeys[i]] = {
			label: yKeys[i].charAt(0).toUpperCase() + yKeys[i].slice(1),
			color: CHART_COLORS[i % CHART_COLORS.length],
		}
	}
	return config
}

function ChartCardBase({
	title,
	description,
	type,
	data,
	xKey = "name",
	yKey = "value",
	height = 300,
	className,
}: ChartCardProps) {
	const yKeys = Array.isArray(yKey) ? yKey : [yKey]
	const config = buildConfig(yKeys)

	return (
		<Card className={cn(className)}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <p className="text-sm text-fg-muted">{description}</p>}
			</CardHeader>
			<CardContent>
				<ChartContainer config={config} className="w-full" style={{ minHeight: height }}>
					{type === "line" ? (
						<LineChart accessibilityLayer data={data}>
							<CartesianGrid vertical={false} />
							<XAxis dataKey={xKey} tickLine={false} tickMargin={10} axisLine={false} />
							<YAxis tickLine={false} axisLine={false} />
							<ChartTooltip content={<ChartTooltipContent />} />
							{yKeys.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
							{yKeys.map((key) => (
								<Line
									key={key}
									type="monotone"
									dataKey={key}
									stroke={`var(--color-${key})`}
									strokeWidth={2}
									dot={false}
									activeDot={{ r: 4 }}
								/>
							))}
						</LineChart>
					) : type === "bar" ? (
						<BarChart accessibilityLayer data={data}>
							<CartesianGrid vertical={false} />
							<XAxis dataKey={xKey} tickLine={false} tickMargin={10} axisLine={false} />
							<YAxis tickLine={false} axisLine={false} />
							<ChartTooltip content={<ChartTooltipContent />} />
							{yKeys.length > 1 && <ChartLegend content={<ChartLegendContent />} />}
							{yKeys.map((key) => (
								<Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={4} />
							))}
						</BarChart>
					) : (
						<PieChart>
							<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
							<Pie
								data={data}
								dataKey={yKeys[0]}
								nameKey={xKey}
								innerRadius={0}
								strokeWidth={5}
								label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(0)}%`}
								labelLine={false}
							/>
							<ChartLegend content={<ChartLegendContent nameKey={xKey} />} />
						</PieChart>
					)}
				</ChartContainer>
			</CardContent>
		</Card>
	)
}

export const ChartCard = withProGuard(ChartCardBase, "ChartCard")
