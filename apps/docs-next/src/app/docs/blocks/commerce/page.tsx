import { Page } from "@blazz/ui/components/ui/page"
import { FileSearch, FileText } from "lucide-react"
import { CategoryPageHero, ComponentSection } from "~/components/docs/component-card"

const commerceComponents = [
	{
		title: "Deal Lines Editor",
		href: "/docs/blocks/deal-lines-editor",
		description:
			"Éditeur de lignes de devis avec ajout, suppression et calculs automatiques des totaux.",
		icon: FileText,
		thumbnail: "deal-lines-editor",
	},
	{
		title: "Quote Preview",
		href: "/docs/blocks/quote-preview",
		description:
			"Aperçu de devis avec lignes, totaux, TVA et actions d'envoi ou de téléchargement PDF.",
		icon: FileSearch,
		thumbnail: "quote-preview",
	},
]

export default function CommercePage() {
	return (
		<Page>
			<CategoryPageHero
				title="Commerce"
				description="Devis, lignes de commande et documents commerciaux. Éditeur de lignes avec calculs automatiques et aperçu de devis prêt à envoyer."
			/>
			<ComponentSection components={commerceComponents} />
		</Page>
	)
}
