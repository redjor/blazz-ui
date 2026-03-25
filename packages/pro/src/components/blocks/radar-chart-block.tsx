"use client"

import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../lib/with-pro-guard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@blazz/ui"
import {
	type ChartConfig,
	ChartContainer,
	ChartLegend,
	ChartLegendContent,
	ChartTooltip,
	ChartTooltipContent,
} from "@blazz/ui"

const defaultData = [
	{ skill: "Design", desktop: 86, mobile: 60 },
	{ skill: "Dev", desktop: 95, mobile: 75 },
	{ skill: "Marketing", desktop: 60, mobile: 90 },
	{ skill: "Support", desktop: 75, mobile: 85 },
	{ skill: "Sales", desktop: 70, mobile: 68 },
	{ skill: "Ops", desktop: 80, mobile: 55 },
]

const defaultConfig = {
	desktop: {
		label: "Desktop",
		color: "var(--chart-1))",
	},
	mobile: {
		label: "Mobile",
		color: "var(--chart-2))",
	},
} satisfies ChartConfig

export interface RadarChartBlockProps {
	title?: string
	description?: string
	data?: Record<string, unknown>[]
	config?: ChartConfig
	angleKey?: string
	className?: string
}

function RadarChartBlockBase({
	title = "Radar Chart",
	description,
	data = defaultData,
	config = defaultConfig,
	angleKey = "skill",
	className,
}: RadarChartBlockProps) {
	const dataKeys = Object.keys(config)

	return (
		<Card className={cn(className)}>
			<CardHeader className="items-center pb-4">
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent className="pb-0">
				<ChartContainer config={config} className="mx-auto aspect-square max-h-[250px]">
					<RadarChart data={data}>
						<ChartTooltip cursor={false} content={<ChartTooltipContent />} />
						<PolarAngleAxis dataKey={angleKey} />
						<PolarGrid />
						{dataKeys.map((key) => (
							<Radar
								key={key}
								dataKey={key}
								fill={`var(--color-${key})`}
								fillOpacity={0.15}
								stroke={`var(--color-${key})`}
								strokeWidth={2}
							/>
						))}
						<ChartLegend className="mt-4" content={<ChartLegendContent />} />
					</RadarChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}

export const RadarChartBlock = withProGuard(RadarChartBlockBase, "RadarChartBlock")
