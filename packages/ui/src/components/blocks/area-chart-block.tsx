"use client"

import { withProGuard } from "../../lib/with-pro-guard"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import {
	type ChartConfig,
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
	ChartLegend,
	ChartLegendContent,
} from "../ui/chart"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card"
import { cn } from "../../lib/utils"

const defaultData = [
	{ month: "Jan", desktop: 186, mobile: 80 },
	{ month: "Fév", desktop: 305, mobile: 200 },
	{ month: "Mar", desktop: 237, mobile: 120 },
	{ month: "Avr", desktop: 73, mobile: 190 },
	{ month: "Mai", desktop: 209, mobile: 130 },
	{ month: "Juin", desktop: 214, mobile: 140 },
]

const defaultConfig = {
	desktop: {
		label: "Desktop",
		color: "hsl(var(--chart-1))",
	},
	mobile: {
		label: "Mobile",
		color: "hsl(var(--chart-2))",
	},
} satisfies ChartConfig

export interface AreaChartBlockProps {
	title?: string
	description?: string
	data?: Record<string, unknown>[]
	config?: ChartConfig
	xKey?: string
	stacked?: boolean
	className?: string
}

function AreaChartBlockBase({
	title = "Area Chart",
	description,
	data = defaultData,
	config = defaultConfig,
	xKey = "month",
	stacked = false,
	className,
}: AreaChartBlockProps) {
	const dataKeys = Object.keys(config)

	return (
		<Card className={cn(className)}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent>
				<ChartContainer config={config} className="min-h-[200px] w-full">
					<AreaChart accessibilityLayer data={data}>
						<CartesianGrid vertical={false} />
						<XAxis
							dataKey={xKey}
							tickLine={false}
							tickMargin={10}
							axisLine={false}
						/>
						<ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
						<ChartLegend content={<ChartLegendContent />} />
						{dataKeys.map((key) => (
							<Area
								key={key}
								type="natural"
								dataKey={key}
								fill={`var(--color-${key})`}
								fillOpacity={0.15}
								stroke={`var(--color-${key})`}
								strokeWidth={2}
								stackId={stacked ? "a" : undefined}
							/>
						))}
					</AreaChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}

export const AreaChartBlock = withProGuard(AreaChartBlockBase, "AreaChartBlock")
