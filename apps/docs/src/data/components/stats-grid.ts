// apps/docs/src/data/components/stats-grid.ts
import type { ComponentData } from "../types"

export const statsGridData: ComponentData = {
	name: "StatsGrid",
	category: "blocks",
	description: "Grille de KPIs avec valeur principale, tendance et icône.",
	docPath: "/docs/blocks/stats-grid",
	imports: {
		path: "@blazz/ui/components/blocks/stats-grid",
		named: ["StatsGrid"],
	},
	props: [
		{
			name: "stats",
			type: "StatItem[]",
			required: true,
			description:
				"Tableau de stats à afficher. Chaque item: { label, value, trend?, trendInverted?, icon? }.",
		},
		{
			name: "columns",
			type: "2 | 3 | 4",
			default: "4",
			description: "Nombre de colonnes.",
		},
		{
			name: "loading",
			type: "boolean",
			default: "false",
			description: "Affiche des Skeletons à la place des cartes pendant le chargement.",
		},
		{
			name: "className",
			type: "string",
			description: "Classe CSS additionnelle sur le conteneur grid.",
		},
	],
	gotchas: [
		"Maximum 4 stats per row — beyond that the eye doesn't know where to focus",
		"trend is a number (positive = green ▲, negative = red ▼)",
		"value should be pre-formatted string ('€1.2M', '2 847') — not a raw number",
		"icon accepts a LucideIcon component reference (icon: DollarSign), not a JSX element",
		"trendInverted reverses the color logic — use it for metrics where lower is better (e.g. bug count, churn)",
	],
	canonicalExample: `import { DollarSign, Users, Briefcase, TrendingUp } from "lucide-react"

<StatsGrid
  stats={[
    { label: "Revenue", value: "€1.2M", trend: 8.2, icon: DollarSign },
    { label: "Contacts", value: "2 847", trend: 12, icon: Users },
    { label: "Deals", value: "143", trend: -3.1, icon: Briefcase },
    { label: "Win Rate", value: "34%", trend: 2.4, icon: TrendingUp },
  ]}
/>`,
}
