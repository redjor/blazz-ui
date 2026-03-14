"use client"

import { ActivityTimeline } from "@blazz/ui/components/blocks/activity-timeline"
import { ChartCard } from "@blazz/ui/components/blocks/chart-card"
import { PageHeader } from "@blazz/ui/components/blocks/page-header"
import { StatsGrid } from "@blazz/ui/components/blocks/stats-grid"
import { Card, CardContent, CardHeader, CardTitle } from "@blazz/ui/components/ui/card"
import { BarChart3, Building2, Handshake, TrendingUp } from "lucide-react"
import {
	dashboardStats,
	deals,
	dealsByStageData,
	formatCurrency,
	recentActivities,
	revenueChartData,
} from "@/lib/sample-data"

export default function DashboardPage() {
	const openDeals = deals.filter((d) => !["closed_won", "closed_lost"].includes(d.stage))

	return (
		<div className="p-6 space-y-6">
			<PageHeader
				title="Tableau de bord"
				description="Vue d'ensemble de votre activité commerciale"
			/>

			<StatsGrid
				stats={[
					{
						label: "Clients actifs",
						value: dashboardStats.activeClients,
						trend: dashboardStats.activeClientsTrend,
						icon: Building2,
					},
					{
						label: "Deals en cours",
						value: dashboardStats.monthlyDeals,
						trend: dashboardStats.dealsTrend,
						icon: Handshake,
					},
					{
						label: "CA pipeline",
						value: dashboardStats.revenue,
						trend: dashboardStats.revenueTrend,
						icon: TrendingUp,
					},
					{
						label: "Deal moyen",
						value: dashboardStats.avgDealSize,
						trend: dashboardStats.avgDealTrend,
						trendInverted: false,
						icon: BarChart3,
					},
				]}
				columns={4}
			/>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<ChartCard
					title="Évolution du chiffre d'affaires"
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
				{/* Recent deals */}
				<Card>
					<CardHeader>
						<CardTitle>Deals récents</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-3">
							{openDeals.slice(0, 5).map((deal) => (
								<a
									key={deal.id}
									href={`/deals/${deal.id}`}
									className="flex items-center justify-between rounded-md p-2 hover:bg-surface-3"
								>
									<div>
										<p className="text-sm font-medium">{deal.title}</p>
										<p className="text-xs text-fg-muted">{deal.companyName}</p>
									</div>
									<span className="text-sm font-medium">{formatCurrency(deal.amount)}</span>
								</a>
							))}
						</div>
					</CardContent>
				</Card>

				{/* Recent activity */}
				<Card>
					<CardHeader>
						<CardTitle>Activité récente</CardTitle>
					</CardHeader>
					<CardContent>
						<ActivityTimeline events={recentActivities.slice(0, 5)} />
					</CardContent>
				</Card>
			</div>
		</div>
	)
}
