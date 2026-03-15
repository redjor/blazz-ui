"use client"

import { Label, Pie, PieChart } from "recharts"
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
	{ browser: "chrome", visitors: 275, fill: "var(--color-chrome)" },
	{ browser: "safari", visitors: 200, fill: "var(--color-safari)" },
	{ browser: "firefox", visitors: 187, fill: "var(--color-firefox)" },
	{ browser: "edge", visitors: 173, fill: "var(--color-edge)" },
	{ browser: "other", visitors: 90, fill: "var(--color-other)" },
]

const defaultConfig = {
	visitors: { label: "Visiteurs" },
	chrome: { label: "Chrome", color: "hsl(var(--chart-1))" },
	safari: { label: "Safari", color: "hsl(var(--chart-2))" },
	firefox: { label: "Firefox", color: "hsl(var(--chart-3))" },
	edge: { label: "Edge", color: "hsl(var(--chart-4))" },
	other: { label: "Autre", color: "hsl(var(--chart-5))" },
} satisfies ChartConfig

export interface PieChartBlockProps {
	title?: string
	description?: string
	data?: Record<string, unknown>[]
	config?: ChartConfig
	dataKey?: string
	nameKey?: string
	donut?: boolean
	showTotal?: boolean
	totalLabel?: string
	className?: string
}

function PieChartBlockBase({
	title = "Pie Chart",
	description,
	data = defaultData,
	config = defaultConfig,
	dataKey = "visitors",
	nameKey = "browser",
	donut = false,
	showTotal = false,
	totalLabel = "Total",
	className,
}: PieChartBlockProps) {
	const total = data.reduce((sum, item) => sum + (Number(item[dataKey]) || 0), 0)

	return (
		<Card className={cn("flex flex-col", className)}>
			<CardHeader className="items-center pb-0">
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
			</CardHeader>
			<CardContent className="flex-1 pb-0">
				<ChartContainer config={config} className="mx-auto aspect-square max-h-[250px]">
					<PieChart>
						<ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
						<Pie
							data={data}
							dataKey={dataKey}
							nameKey={nameKey}
							innerRadius={donut ? 60 : 0}
							strokeWidth={5}
						>
							{donut && showTotal && (
								<Label
									content={({ viewBox }) => {
										if (viewBox && "cx" in viewBox && "cy" in viewBox) {
											return (
												<text
													x={viewBox.cx}
													y={viewBox.cy}
													textAnchor="middle"
													dominantBaseline="middle"
												>
													<tspan
														x={viewBox.cx}
														y={viewBox.cy}
														className="fill-fg text-3xl font-bold"
													>
														{total.toLocaleString()}
													</tspan>
													<tspan
														x={viewBox.cx}
														y={(viewBox.cy || 0) + 24}
														className="fill-fg-muted"
													>
														{totalLabel}
													</tspan>
												</text>
											)
										}
									}}
								/>
							)}
						</Pie>
						<ChartLegend
							content={<ChartLegendContent nameKey={nameKey} />}
							className="-translate-y-2 flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
						/>
					</PieChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}

export const PieChartBlock = withProGuard(PieChartBlockBase, "PieChartBlock")
