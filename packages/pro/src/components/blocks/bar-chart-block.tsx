"use client"

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../lib/with-pro-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@blazz/ui/components/ui/card"
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@blazz/ui/components/ui/chart"

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

export interface BarChartBlockProps {
	title?: string
	description?: string
	data?: Record<string, unknown>[]
	config?: ChartConfig
	xKey?: string
	className?: string
}

function BarChartBlockBase({
	title = "Bar Chart",
	description,
	data = defaultData,
	config = defaultConfig,
	xKey = "month",
	className,
}: BarChartBlockProps) {
	const dataKeys = Object.keys(config)

	return (
		<Card className={cn(className)}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent>
				<ChartContainer config={config} className="min-h-[200px] w-full">
					<BarChart accessibilityLayer data={data}>
						<CartesianGrid vertical={false} />
						<XAxis dataKey={xKey} tickLine={false} tickMargin={10} axisLine={false} />
						<ChartTooltip content={<ChartTooltipContent />} />
						<ChartLegend content={<ChartLegendContent />} />
						{dataKeys.map((key) => (
							<Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={4} />
						))}
					</BarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}

export const BarChartBlock = withProGuard(BarChartBlockBase, "BarChartBlock")
