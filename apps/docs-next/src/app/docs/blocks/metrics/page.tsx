import { Page } from "@blazz/ui/components/ui/page"
import { BarChart3, Gauge, LayoutList, TrendingUp } from "lucide-react"
import { CategoryPageHero, ComponentSection } from "~/components/docs/component-card"

const metricsComponents = [
	{
		title: "Stats Grid",
		href: "/docs/blocks/stats-grid",
		description:
			"Grille de KPIs avec valeur principale, trend et sparkline. Idéal pour les dashboards.",
		icon: BarChart3,
		thumbnail: "stats-grid",
	},
	{
		title: "Stats Strip",
		href: "/docs/blocks/stats-strip",
		description:
			"Bande horizontale de métriques compactes pour les en-têtes de page ou de section.",
		icon: LayoutList,
		thumbnail: "stats-strip",
	},
	{
		title: "Budget Card",
		href: "/docs/blocks/budget-card",
		description:
			"Carte de suivi budgétaire avec consommation, revenu et progression par jours ou montant.",
		icon: TrendingUp,
		thumbnail: "budget-card",
	},
	{
		title: "Segmented Progress",
		href: "/docs/blocks/segmented-progress",
		description:
			"Barre de progression segmentée en dots ou waffle pour visualiser la consommation d'un budget.",
		icon: Gauge,
		thumbnail: "segmented-progress",
	},
]

export default function MetricsPage() {
	return (
		<Page>
			<CategoryPageHero
				title="Metrics"
				description="KPIs, statistiques et indicateurs de performance. Grilles de stats, barres de métriques et cartes budgétaires pour les dashboards et en-têtes de page."
			/>
			<ComponentSection components={metricsComponents} />
		</Page>
	)
}
