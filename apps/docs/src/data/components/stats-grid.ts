// apps/docs/src/data/components/stats-grid.ts
import type { ComponentData } from "../types"

export const statsGridData: ComponentData = {
	name: "StatsGrid",
	category: "blocks",
	description: "Grille de KPIs avec valeur principale, tendance et sparkline.",
	docPath: "/docs/components/blocks/stats-grid",
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
				"Tableau de stats à afficher. Chaque item: { label, value, trend?, trendLabel?, icon?, sparkline? }.",
		},
		{ name: "cols", type: "2 | 3 | 4", default: "4", description: "Nombre de colonnes." },
	],
	gotchas: [
		"Maximum 4 stats per row — beyond that the eye doesn't know where to focus",
		"trend is a number (positive = green ▲, negative = red ▼)",
		"value should be pre-formatted string ('€1.2M', '2 847') — not a raw number",
	],
	canonicalExample: `<StatsGrid
  stats={[
    { label: "Revenue", value: "€1.2M", trend: 8.2, trendLabel: "vs last month", icon: <DollarSign /> },
    { label: "Contacts", value: "2 847", trend: 12, trendLabel: "new this month", icon: <Users /> },
    { label: "Deals", value: "143", trend: -3.1, trendLabel: "vs last month", icon: <Briefcase /> },
    { label: "Win Rate", value: "34%", trend: 2.4, trendLabel: "vs last quarter", icon: <TrendingUp /> },
  ]}
/>`,
}
