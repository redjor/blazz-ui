"use client"

import { Building2, Handshake, TrendingUp, FileText } from "lucide-react"
import { PageHeader } from "@/components/blocks/page-header"
import { StatsGrid } from "@/components/blocks/stats-grid"
import { ChartCard } from "@/components/blocks/chart-card"
import { FunnelChart } from "@/components/blocks/funnel-chart"
import { ForecastChart } from "@/components/blocks/forecast-chart"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import {
	revenueChartData,
	dealsByStageData,
	deals,
	companies,
	formatCurrency,
	pipelineFunnelData,
	forecastData,
	dealsByAssigneeData,
	dealsBySourceData,
} from "@/lib/sample-data"

export default function ReportsPage() {
	const wonDeals = deals.filter((d) => d.stage === "closed_won")
	const wonTotal = wonDeals.reduce((s, d) => s + d.amount, 0)
	const conversionRate = Math.round((wonDeals.length / deals.length) * 100)
	const pipelineTotal = deals
		.filter((d) => !["closed_won", "closed_lost"].includes(d.stage))
		.reduce((s, d) => s + d.amount, 0)

	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title="Rapports"
				description="Analyse de votre activité commerciale"
				breadcrumbs={[
					{ label: "Dashboard", href: "/examples/crm/dashboard" },
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

			<Tabs defaultValue="overview">
				<TabsList variant="line">
					<TabsTrigger value="overview">Vue d&apos;ensemble</TabsTrigger>
					<TabsTrigger value="pipeline">Pipeline</TabsTrigger>
					<TabsTrigger value="revenue">Revenus</TabsTrigger>
				</TabsList>

				<TabsContent value="overview">
					<div className="space-y-6 pt-4">
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
								data={dealsBySourceData}
								xKey="name"
								yKey="value"
								height={300}
							/>
							<ChartCard
								title="Répartition par assigné"
								type="bar"
								data={dealsByAssigneeData}
								xKey="name"
								yKey="count"
								height={300}
							/>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="pipeline">
					<div className="space-y-6 pt-4">
						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							<FunnelChart
								title="Entonnoir pipeline"
								description="Conversion entre les étapes du pipeline"
								stages={pipelineFunnelData}
							/>
							<ChartCard
								title="Deals par étape"
								description={`${formatCurrency(pipelineTotal)} en pipeline actif`}
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
								data={dealsBySourceData}
								xKey="name"
								yKey="value"
								height={300}
							/>
							<ChartCard
								title="Deals par commercial"
								type="bar"
								data={dealsByAssigneeData}
								xKey="name"
								yKey="count"
								height={300}
							/>
						</div>
					</div>
				</TabsContent>

				<TabsContent value="revenue">
					<div className="space-y-6 pt-4">
						<ForecastChart
							title="Prévision de revenus"
							description="Réalisé vs prévision vs objectif sur 10 mois"
							data={forecastData}
							height={400}
						/>

						<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
							<ChartCard
								title="Évolution mensuelle du CA"
								type="line"
								data={revenueChartData}
								xKey="month"
								yKey="revenue"
								height={300}
							/>
							<ChartCard
								title="CA par commercial"
								type="bar"
								data={dealsByAssigneeData}
								xKey="name"
								yKey="count"
								height={300}
							/>
						</div>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}
