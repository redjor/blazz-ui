"use client"

import { ChartCard } from "@blazz/pro/components/blocks/chart-card"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"
import { Briefcase, Calendar, TrendingUp, Users } from "lucide-react"
import {
	applicationsChartData,
	pipelineChartData,
	talentflowDashboardStats,
} from "@/lib/talentflow-data"

export default function TalentFlowDashboardPage() {
	return (
		<div className="p-6 space-y-6">
			<PageHeader title="Tableau de bord" description="Vue d'ensemble du recrutement" />

			<StatsGrid
				stats={[
					{
						label: "Postes ouverts",
						value: talentflowDashboardStats.openPositions,
						trend: talentflowDashboardStats.openPositionsTrend,
						icon: Briefcase,
					},
					{
						label: "Candidatures ce mois",
						value: talentflowDashboardStats.applicationsThisMonth,
						trend: talentflowDashboardStats.applicationsTrend,
						icon: Users,
					},
					{
						label: "Entretiens cette semaine",
						value: talentflowDashboardStats.interviewsThisWeek,
						trend: talentflowDashboardStats.interviewsTrend,
						icon: Calendar,
					},
					{
						label: "Taux d'embauche",
						value: talentflowDashboardStats.hireRate,
						trend: talentflowDashboardStats.hireRateTrend,
						icon: TrendingUp,
					},
				]}
				columns={4}
			/>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<ChartCard
					title="Candidatures reçues"
					type="line"
					data={applicationsChartData}
					xKey="month"
					yKey="applications"
					height={300}
				/>
				<ChartCard
					title="Pipeline recrutement"
					type="bar"
					data={pipelineChartData}
					xKey="name"
					yKey="count"
					height={300}
				/>
			</div>
		</div>
	)
}
