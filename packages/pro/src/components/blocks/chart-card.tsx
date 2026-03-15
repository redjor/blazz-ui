"use client"

import {
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Legend,
	Line,
	LineChart,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../lib/with-pro-guard"
import { Card, CardContent, CardHeader, CardTitle } from "@blazz/ui/components/ui/card"

const CHART_COLORS = ["#2563eb", "#16a34a", "#eab308", "#dc2626", "#9333ea"]

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

	return (
		<Card className={cn(className)}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <p className="text-sm text-fg-muted">{description}</p>}
			</CardHeader>
			<CardContent>
				<ResponsiveContainer width="100%" height={height}>
					{type === "line" ? (
						<LineChart data={data}>
							<CartesianGrid strokeDasharray="3 3" className="stroke-edge" />
							<XAxis dataKey={xKey} className="text-xs" tick={{ fill: "var(--text-secondary)" }} />
							<YAxis className="text-xs" tick={{ fill: "var(--text-secondary)" }} />
							<Tooltip
								contentStyle={{
									backgroundColor: "var(--surface-2)",
									border: "1px solid var(--border-default)",
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
									stroke={CHART_COLORS[i % CHART_COLORS.length]}
									strokeWidth={2}
									dot={false}
									activeDot={{ r: 4 }}
								/>
							))}
						</LineChart>
					) : type === "bar" ? (
						<BarChart data={data}>
							<CartesianGrid strokeDasharray="3 3" className="stroke-edge" />
							<XAxis dataKey={xKey} className="text-xs" tick={{ fill: "var(--text-secondary)" }} />
							<YAxis className="text-xs" tick={{ fill: "var(--text-secondary)" }} />
							<Tooltip
								contentStyle={{
									backgroundColor: "var(--surface-2)",
									border: "1px solid var(--border-default)",
									borderRadius: "8px",
									fontSize: "12px",
								}}
							/>
							{yKeys.length > 1 && <Legend />}
							{yKeys.map((key, i) => (
								<Bar
									key={key}
									dataKey={key}
									fill={CHART_COLORS[i % CHART_COLORS.length]}
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
								label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
								labelLine={false}
							>
								{data.map((_, i) => (
									<Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
								))}
							</Pie>
							<Tooltip
								contentStyle={{
									backgroundColor: "var(--surface-2)",
									border: "1px solid var(--border-default)",
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

export const ChartCard = withProGuard(ChartCardBase, "ChartCard")
