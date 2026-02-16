"use client"

import {
	LineChart,
	Line,
	BarChart,
	Bar,
	PieChart,
	Pie,
	Cell,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Legend,
} from "recharts"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const CHART_COLORS = [
	"hsl(var(--chart-1))",
	"hsl(var(--chart-2))",
	"hsl(var(--chart-3))",
	"hsl(var(--chart-4))",
	"hsl(var(--chart-5))",
]

// Fallback colors if CSS variables aren't defined
const FALLBACK_COLORS = [
	"#2563eb",
	"#16a34a",
	"#eab308",
	"#dc2626",
	"#9333ea",
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

export function ChartCard({
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

	return (
		<Card className={cn(className)}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && (
					<p className="text-sm text-fg-muted">{description}</p>
				)}
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={height}>
					{type === "line" ? (
						<LineChart data={data}>
							<CartesianGrid strokeDasharray="3 3" className="stroke-edge" />
							<XAxis
								dataKey={xKey}
								className="text-xs"
								tick={{ fill: "hsl(var(--muted-foreground))" }}
							/>
							<YAxis
								className="text-xs"
								tick={{ fill: "hsl(var(--muted-foreground))" }}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "hsl(var(--background))",
									border: "1px solid hsl(var(--border))",
									borderRadius: "8px",
									fontSize: "12px",
								}}
							/>
							{yKeys.length > 1 && <Legend />}
							{yKeys.map((key, i) => (
								<Line
									key={key}
									type="monotone"
									dataKey={key}
									stroke={FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
									strokeWidth={2}
									dot={false}
									activeDot={{ r: 4 }}
								/>
							))}
						</LineChart>
					) : type === "bar" ? (
						<BarChart data={data}>
							<CartesianGrid strokeDasharray="3 3" className="stroke-edge" />
							<XAxis
								dataKey={xKey}
								className="text-xs"
								tick={{ fill: "hsl(var(--muted-foreground))" }}
							/>
							<YAxis
								className="text-xs"
								tick={{ fill: "hsl(var(--muted-foreground))" }}
							/>
							<Tooltip
								contentStyle={{
									backgroundColor: "hsl(var(--background))",
									border: "1px solid hsl(var(--border))",
									borderRadius: "8px",
									fontSize: "12px",
								}}
							/>
							{yKeys.length > 1 && <Legend />}
							{yKeys.map((key, i) => (
								<Bar
									key={key}
									dataKey={key}
									fill={FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
									radius={[4, 4, 0, 0]}
								/>
							))}
						</BarChart>
					) : (
						<PieChart>
							<Pie
								data={data}
								dataKey={yKeys[0]}
								nameKey={xKey}
								cx="50%"
								cy="50%"
								outerRadius={height / 3}
								label={({ name, percent }) =>
									`${name} ${(percent * 100).toFixed(0)}%`
								}
								labelLine={false}
							>
								{data.map((_, i) => (
									<Cell
										key={i}
										fill={FALLBACK_COLORS[i % FALLBACK_COLORS.length]}
									/>
								))}
							</Pie>
							<Tooltip
								contentStyle={{
									backgroundColor: "hsl(var(--background))",
									border: "1px solid hsl(var(--border))",
									borderRadius: "8px",
									fontSize: "12px",
								}}
							/>
							<Legend />
						</PieChart>
					)}
				</ResponsiveContainer>
			</CardContent>
		</Card>
	)
}
