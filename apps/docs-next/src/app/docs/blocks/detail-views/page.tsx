"use client"

import { Page } from "@blazz/ui/components/ui/page"
import { CreditCard, PanelRight, PencilLine, SplitSquareHorizontal } from "lucide-react"
import { CategoryPageHero, ComponentSection } from "~/components/docs/component-card"

const detailViewsComponents = [
	{
		title: "Detail Panel",
		href: "/docs/blocks/detail-panel",
		description:
			"Panneau latéral pour afficher les détails d'un enregistrement sans quitter la vue liste.",
		icon: PanelRight,
		thumbnail: "detail-panel",
	},
	{
		title: "Property Card",
		href: "/docs/blocks/property-card",
		description:
			"Carte de propriétés clé-valeur pour afficher les attributs d'une entité dans une fiche détail.",
		icon: CreditCard,
		thumbnail: "property-card",
	},
	{
		title: "Inline Edit",
		href: "/docs/blocks/inline-edit",
		description:
			"Édition en place avec bascule lecture/écriture au clic. Idéal pour les fiches de détail.",
		icon: PencilLine,
		thumbnail: "inline-edit",
	},
	{
		title: "Split View",
		href: "/docs/blocks/split-view",
		description: "Vue master-detail avec liste à gauche et détail à droite, redimensionnable.",
		icon: SplitSquareHorizontal,
		thumbnail: "split-view",
	},
]

export default function DetailViewsPage() {
	return (
		<Page>
			<CategoryPageHero
				title="Detail Views"
				description="Composants pour afficher et éditer les détails d'un enregistrement. Panneaux latéraux, vues master-detail, édition inline et cartes de propriétés."
			/>
			<ComponentSection components={detailViewsComponents} />
		</Page>
	)
}
