"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@blazz/ui/components/ui/card"
import { Grid } from "@blazz/ui/components/ui/grid"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { Banknote, Calendar, Clock, Target, TrendingUp } from "lucide-react"
import { useMemo, useState } from "react"
import {
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"
import { api } from "@/convex/_generated/api"
import { formatCurrency } from "@/lib/format"
import { GoalsConfigDialog } from "./_config-dialog"

const MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]

export default function GoalsPageClient() {
	const year = new Date().getFullYear()
	const data = useQuery(api.goals.dashboard, { year })
	const plan = useQuery(api.goals.get, { year })
	const [configOpen, setConfigOpen] = useState(false)

	useAppTopBar([{ label: "Objectifs" }])

	const revenueChartData = useMemo(
		() =>
			MONTHS_FR.map((name, i) => ({
				name,
				cible: data?.revenue.monthlyTargets[i] ?? 0,
				réel: data?.revenue.monthlyActuals[i] ?? 0,
			})),
		[data],
	)

	const daysChartData = useMemo(
		() =>
			MONTHS_FR.map((name, i) => ({
				name,
				cible: data?.days.monthlyTargets[i] ?? 0,
				réel: data?.days.monthlyActuals[i] ?? 0,
			})),
		[data],
	)

	const quarters = useMemo(
		() =>
			[0, 1, 2, 3].map((qi) => {
				const start = qi * 3
				const target = (data?.revenue.monthlyTargets ?? []).slice(start, start + 3).reduce((a, b) => a + b, 0)
				const actual = (data?.revenue.monthlyActuals ?? []).slice(start, start + 3).reduce((a, b) => a + b, 0)
				return {
					label: `Q${qi + 1}`,
					target,
					actual,
					percent: target > 0 ? Math.round((actual / target) * 100) : 0,
				}
			}),
		[data],
	)

	// Loading
	if (data === undefined || plan === undefined) {
		return (
			<BlockStack gap="600" className="p-6">
				<PageHeader title={`Objectifs ${year}`} />
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-64 w-full" />
			</BlockStack>
		)
	}

	// Empty state
	if (data === null) {
		return (
			<BlockStack gap="600" className="p-6">
				<PageHeader title={`Objectifs ${year}`} />
				<Box padding="8" className="text-center">
					<BlockStack gap="300" className="items-center">
						<Target className="size-12 text-fg-muted" />
						<span className="text-base font-medium">Pas encore d'objectifs</span>
						<span className="text-sm text-fg-muted">
							Définissez vos cibles pour {year}
						</span>
						<Button onClick={() => setConfigOpen(true)} className="mt-2">
							Définir mes objectifs
						</Button>
					</BlockStack>
				</Box>
				<GoalsConfigDialog
					open={configOpen}
					onOpenChange={setConfigOpen}
					year={year}
					plan={plan}
				/>
			</BlockStack>
		)
	}

	// Success state
	return (
		<BlockStack gap="600" className="p-6">
			<PageHeader
				title={`Objectifs ${year}`}
				actions={
					<Button variant="outline" onClick={() => setConfigOpen(true)}>
						Modifier les cibles
					</Button>
				}
			/>

			<StatsGrid
				columns={4}
				stats={[
					{
						label: "CA Annuel",
						value: formatCurrency(data.revenue.annual.actual),
						description: `/ ${formatCurrency(data.revenue.annual.target)}`,
						icon: Banknote,
						trend: data.revenue.annual.percent - 100,
					},
					{
						label: `CA ${data.revenue.month.label}`,
						value: formatCurrency(data.revenue.month.actual),
						description: `/ ${formatCurrency(data.revenue.month.target)}`,
						icon: Calendar,
						trend: data.revenue.month.percent - 100,
					},
					{
						label: "Jours",
						value: `${data.days.month.actual}j`,
						description: `/ ${data.days.month.target}j`,
						icon: Clock,
						trend: data.days.month.percent - 100,
					},
					{
						label: "TJM moyen",
						value: formatCurrency(data.tjm.actual),
						description: `cible ${formatCurrency(data.tjm.target)}`,
						icon: TrendingUp,
						trend: data.tjm.trend,
					},
				]}
			/>

			<Grid>
				<Grid.Cell columnSpan={{ xs: 12, md: 6 }}>
					<Card>
						<CardHeader>
							<CardTitle className="text-sm font-medium">Revenu mensuel</CardTitle>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={280}>
								<BarChart data={revenueChartData}>
									<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-edge)" />
									<XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--color-fg-muted)" />
									<YAxis tick={{ fontSize: 12 }} stroke="var(--color-fg-muted)" />
									<Tooltip />
									<Bar dataKey="cible" fill="var(--color-fg-muted)" opacity={0.2} radius={[4, 4, 0, 0]} />
									<Bar dataKey="réel" fill="var(--color-brand)" radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</Grid.Cell>
				<Grid.Cell columnSpan={{ xs: 12, md: 6 }}>
					<Card>
						<CardHeader>
							<CardTitle className="text-sm font-medium">Jours facturés</CardTitle>
						</CardHeader>
						<CardContent>
							<ResponsiveContainer width="100%" height={280}>
								<BarChart data={daysChartData}>
									<CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-edge)" />
									<XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="var(--color-fg-muted)" />
									<YAxis tick={{ fontSize: 12 }} stroke="var(--color-fg-muted)" />
									<Tooltip />
									<Bar dataKey="cible" fill="var(--color-fg-muted)" opacity={0.2} radius={[4, 4, 0, 0]} />
									<Bar dataKey="réel" fill="var(--color-brand)" radius={[4, 4, 0, 0]} />
								</BarChart>
							</ResponsiveContainer>
						</CardContent>
					</Card>
				</Grid.Cell>
			</Grid>

			<Card>
				<CardHeader>
					<CardTitle className="text-sm font-medium">Récapitulatif trimestriel</CardTitle>
				</CardHeader>
				<CardContent>
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-edge text-fg-muted text-left">
								<th className="pb-2 font-medium">Période</th>
								<th className="pb-2 font-medium text-right">Cible</th>
								<th className="pb-2 font-medium text-right">Réel</th>
								<th className="pb-2 font-medium text-right">%</th>
								<th className="pb-2 font-medium text-right">Écart</th>
							</tr>
						</thead>
						<tbody>
							{quarters.map((q) => (
								<tr key={q.label} className="border-b border-edge/50">
									<td className="py-2 font-medium">{q.label}</td>
									<td className="py-2 text-right tabular-nums">{formatCurrency(q.target)}</td>
									<td className="py-2 text-right tabular-nums">{formatCurrency(q.actual)}</td>
									<td className="py-2 text-right tabular-nums">{q.percent}%</td>
									<td className="py-2 text-right tabular-nums">{formatCurrency(q.actual - q.target)}</td>
								</tr>
							))}
							<tr className="font-semibold">
								<td className="py-2">{data.year}</td>
								<td className="py-2 text-right tabular-nums">{formatCurrency(data.revenue.annual.target)}</td>
								<td className="py-2 text-right tabular-nums">{formatCurrency(data.revenue.annual.actual)}</td>
								<td className="py-2 text-right tabular-nums">{data.revenue.annual.percent}%</td>
								<td className="py-2 text-right tabular-nums">{formatCurrency(data.revenue.annual.actual - data.revenue.annual.target)}</td>
							</tr>
						</tbody>
					</table>
				</CardContent>
			</Card>

			<GoalsConfigDialog
				open={configOpen}
				onOpenChange={setConfigOpen}
				year={year}
				plan={plan}
			/>
		</BlockStack>
	)
}
