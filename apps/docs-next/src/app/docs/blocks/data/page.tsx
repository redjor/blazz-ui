import { Page } from "@blazz/ui/components/ui/page"
import { CheckSquare, Filter, Settings2, Table2 } from "lucide-react"
import { CategoryPageHero, ComponentSection } from "~/components/docs/component-card"

const dataComponents = [
	{
		title: "Data Table",
		href: "/docs/blocks/data-table",
		description:
			"Table de données avancée avec tri, filtrage, pagination et sélection. Basée sur TanStack Table.",
		icon: Table2,
		thumbnail: "data-table",
	},
	{
		title: "Filter Bar",
		href: "/docs/blocks/filter-bar",
		description:
			"Barre de filtres combinant recherche, facettes et filtres actifs au-dessus d'une table.",
		icon: Filter,
		thumbnail: "filter-bar",
	},
	{
		title: "Bulk Action Bar",
		href: "/docs/blocks/bulk-action-bar",
		description:
			"Barre d'actions groupées apparaissant lors de la sélection multiple dans une table.",
		icon: CheckSquare,
		thumbnail: "bulk-action-bar",
	},
	{
		title: "View Config Panel",
		href: "/docs/blocks/view-config-panel",
		description:
			"Panneau de configuration de vue pour personnaliser l'affichage, les filtres et les propriétés visibles.",
		icon: Settings2,
		thumbnail: "view-config-panel",
	},
]

export default function DataPage() {
	return (
		<Page>
			<CategoryPageHero
				title="Data"
				description="Composants pour afficher, filtrer et manipuler des données tabulaires. Tables avancées, barres de filtres et actions groupées pour les interfaces data-heavy."
			/>
			<ComponentSection components={dataComponents} />
		</Page>
	)
}
