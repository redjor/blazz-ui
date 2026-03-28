"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@blazz/ui/components/ui/card"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@blazz/ui/components/ui/chart"
import { Bar, CartesianGrid, ComposedChart, Line, XAxis, YAxis } from "recharts"
import { formatCurrency } from "@/lib/format"

interface MonthData {
	label: string
	yearMonth: string
	revenueCents: number
	expenseCents: number
	balanceCents: number
}

interface CashflowChartProps {
	months: MonthData[]
}

const chartConfig = {
	revenue: { label: "Revenus", color: "oklch(0.65 0.2 145)" },
	expenses: { label: "Dépenses", color: "oklch(0.65 0.2 25)" },
	balance: { label: "Solde", color: "oklch(0.585 0.22 275)" },
} satisfies ChartConfig

export function CashflowChart({ months }: CashflowChartProps) {
	const data = months.map((m) => ({
		name: m.label,
		revenue: Math.round(m.revenueCents / 100),
		expenses: Math.round(m.expenseCents / 100),
		balance: Math.round(m.balanceCents / 100),
	}))

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-sm font-medium">Prévisionnel de trésorerie</CardTitle>
			</CardHeader>
			<CardContent>
				<ChartContainer config={chartConfig} className="h-[300px] w-full">
					<ComposedChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
						<CartesianGrid strokeDasharray="3 3" vertical={false} />
						<XAxis dataKey="name" tick={{ fontSize: 11 }} stroke="var(--color-fg-muted)" />
						<YAxis tick={{ fontSize: 11 }} stroke="var(--color-fg-muted)" tickFormatter={(v: number) => formatCurrency(v)} />
						<ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(value as number)} />} />
						<Bar dataKey="revenue" fill="var(--color-revenue)" radius={[4, 4, 0, 0]} barSize={24} />
						<Bar dataKey="expenses" fill="var(--color-expenses)" radius={[4, 4, 0, 0]} barSize={24} />
						<Line dataKey="balance" type="monotone" stroke="var(--color-balance)" strokeWidth={2} dot={{ r: 4, fill: "var(--color-balance)" }} />
					</ComposedChart>
				</ChartContainer>
			</CardContent>
		</Card>
	)
}
