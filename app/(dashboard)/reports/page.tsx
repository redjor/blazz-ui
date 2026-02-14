"use client"

import { Building2, Handshake, TrendingUp, FileText } from "lucide-react"
import { PageHeader } from "@/components/blocks/page-header"
import { StatsGrid } from "@/components/blocks/stats-grid"
import { ChartCard } from "@/components/blocks/chart-card"
import {
	revenueChartData,
	dealsByStageData,
	deals,
	companies,
	formatCurrency,
} from "@/lib/sample-data"

export default function ReportsPage() {
	const wonDeals = deals.filter((d) => d.stage === "closed_won")
	const wonTotal = wonDeals.reduce((s, d) => s + d.amount, 0)
	const conversionRate = Math.round((wonDeals.length / deals.length) * 100)

	const dealsBySource = Object.entries(
		deals.reduce<Record<string, number>>((acc, d) => {
			acc[d.source] = (acc[d.source] || 0) + 1
			return acc
		}, {})
	).map(([name, count]) => ({ name, count }))

	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title="Rapports"
				description="Analyse de votre activité commerciale"
				breadcrumbs={[
					{ label: "Dashboard", href: "/dashboard" },
					{ label: "Rapports" },
				]}
			/>

			<StatsGrid
				stats={[
					{ label: "Entreprises", value: companies.length, icon: Building2 },
					{ label: "Deals total", value: deals.length, icon: Handshake },
					{ label: "CA gagné", value: formatCurrency(wonTotal), icon: TrendingUp },
					{ label: "Taux conversion", value: `${conversionRate}%`, icon: FileText },
				]}
				columns={4}
			/>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<ChartCard
					title="Évolution du CA"
					type="line"
					data={revenueChartData}
					xKey="month"
					yKey="revenue"
					height={300}
				/>
				<ChartCard
					title="Deals par étape"
					type="bar"
					data={dealsByStageData}
					xKey="name"
					yKey="count"
					height={300}
				/>
			</div>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<ChartCard
					title="Sources des deals"
					type="pie"
					data={dealsBySource}
					xKey="name"
					yKey="count"
					height={300}
				/>
				<ChartCard
					title="Répartition par assigné"
					type="bar"
					data={[
						{ name: "Sophie Martin", count: deals.filter((d) => d.assignedTo === "Sophie Martin").length },
						{ name: "Marc Leroy", count: deals.filter((d) => d.assignedTo === "Marc Leroy").length },
					]}
					xKey="name"
					yKey="count"
					height={300}
				/>
			</div>
		</div>
	)
}
