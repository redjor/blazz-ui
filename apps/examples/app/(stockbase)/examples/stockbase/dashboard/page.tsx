"use client"

import { ChartCard } from "@blazz/pro/components/blocks/chart-card"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"
import { AlertTriangle, ArrowLeftRight, Package, TrendingUp } from "lucide-react"
import {
	movementsByCategoryChartData,
	stockbaseDashboardStats,
	stockValueChartData,
} from "@/lib/stockbase-data"

export default function StockBaseDashboardPage() {
	return (
		<div className="p-6 space-y-6">
			<PageHeader title="Tableau de bord" description="Vue d'ensemble de l'inventaire" />

			<StatsGrid
				stats={[
					{
						label: "Articles en stock",
						value: stockbaseDashboardStats.totalItems,
						trend: stockbaseDashboardStats.totalItemsTrend,
						icon: Package,
					},
					{
						label: "Valeur totale stock",
						value: stockbaseDashboardStats.totalStockValue,
						trend: stockbaseDashboardStats.stockValueTrend,
						icon: TrendingUp,
					},
					{
						label: "Alertes rupture",
						value: stockbaseDashboardStats.lowStockAlerts,
						trend: stockbaseDashboardStats.lowStockAlertsTrend,
						icon: AlertTriangle,
					},
					{
						label: "Mouvements ce mois",
						value: stockbaseDashboardStats.movementsThisMonth,
						trend: stockbaseDashboardStats.movementsTrend,
						icon: ArrowLeftRight,
					},
				]}
				columns={4}
			/>

			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<ChartCard
					title="Valeur du stock"
					type="line"
					data={stockValueChartData}
					xKey="month"
					yKey="value"
					height={300}
				/>
				<ChartCard
					title="Mouvements par categorie"
					type="bar"
					data={movementsByCategoryChartData}
					xKey="name"
					yKey="count"
					height={300}
				/>
			</div>
		</div>
	)
}
