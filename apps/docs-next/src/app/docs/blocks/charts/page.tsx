import { Page } from "@blazz/ui/components/ui/page"
import { AreaChart, BarChart3, LineChart, PieChart, Radar } from "lucide-react"
import { ComponentSection } from "~/components/docs/component-card"

const chartComponents = [
	{
		title: "Bar Chart",
		href: "/docs/components/charts/bar-chart",
		description:
			"Barres verticales pour comparer des valeurs par catégorie. Supporte les séries simples et multiples.",
		icon: BarChart3,
		thumbnail: "bar-chart",
	},
	{
		title: "Line Chart",
		href: "/docs/components/charts/line-chart",
		description:
			"Courbes pour visualiser des tendances temporelles. Idéal pour suivre l'évolution de métriques.",
		icon: LineChart,
		thumbnail: "line-chart",
	},
	{
		title: "Area Chart",
		href: "/docs/components/charts/area-chart",
		description:
			"Courbes remplies pour visualiser des volumes et tendances cumulées. Supporte le mode stacked.",
		icon: AreaChart,
		thumbnail: "area-chart",
	},
	{
		title: "Pie Chart",
		href: "/docs/components/charts/pie-chart",
		description:
			"Camembert et donut pour visualiser des répartitions en pourcentages avec total optionnel.",
		icon: PieChart,
		thumbnail: "pie-chart",
	},
	{
		title: "Radar Chart",
		href: "/docs/components/charts/radar-chart",
		description:
			"Diagramme radar pour comparer des données multi-dimensionnelles comme des scores ou compétences.",
		icon: Radar,
		thumbnail: "radar-chart",
	},
]

export default function ChartsPage() {
	return (
		<Page
			title="Charts"
			subtitle="Composants de visualisation de données basés sur Recharts et les primitives shadcn Chart. Chaque chart est un block réutilisable avec données de démo, tooltips et légende intégrés."
		>
			<ComponentSection components={chartComponents} />
		</Page>
	)
}
