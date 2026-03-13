import { Page } from "@blazz/ui/components/ui/page"
import { createFileRoute } from "@tanstack/react-router"
import {
	Activity,
	BarChart3,
	Bell,
	Building2,
	Columns3,
	CreditCard,
	FileSearch,
	FileText,
	GitBranch,
	Inbox,
	LayoutList,
	ListOrdered,
	PanelRight,
	PencilLine,
	SplitSquareHorizontal,
	Zap,
} from "lucide-react"
import { CategoryPageHero, ComponentSection } from "~/components/docs/component-card"

export const Route = createFileRoute("/_docs/docs/blocks/business")({
	component: BusinessPage,
})

const businessComponents = [
	{
		title: "Activity Timeline",
		href: "/docs/blocks/activity-timeline",
		description:
			"Fil d'activité chronologique pour afficher l'historique des événements, appels, emails et notes.",
		icon: Activity,
		thumbnail: "activity-timeline",
	},
	{
		title: "Detail Panel",
		href: "/docs/blocks/detail-panel",
		description:
			"Panneau latéral pour afficher les détails d'un enregistrement sans quitter la vue liste.",
		icon: PanelRight,
		thumbnail: "detail-panel",
	},
	{
		title: "Deal Lines Editor",
		href: "/docs/blocks/deal-lines-editor",
		description:
			"Éditeur de lignes de devis avec ajout, suppression et calculs automatiques des totaux.",
		icon: FileText,
		thumbnail: "deal-lines-editor",
	},
	{
		title: "Inbox",
		href: "/docs/blocks/inbox",
		description:
			"Boîte de réception style Linear pour les notifications et messages avec filtres et actions rapides.",
		icon: Inbox,
		thumbnail: "inbox",
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
		title: "Kanban Board",
		href: "/docs/blocks/kanban-board",
		description: "Tableau kanban avec drag & drop pour visualiser et gérer un pipeline d'étapes.",
		icon: Columns3,
		thumbnail: "kanban-board",
	},
	{
		title: "Multi Step Form",
		href: "/docs/blocks/multi-step-form",
		description:
			"Formulaire multi-étapes avec stepper, validation par étape et navigation avant/arrière.",
		icon: ListOrdered,
		thumbnail: "multi-step-form",
	},
	{
		title: "Notification Center",
		href: "/docs/blocks/notification-center",
		description:
			"Centre de notifications avec groupement par date, marquage lu/non-lu et actions rapides.",
		icon: Bell,
		thumbnail: "notification-center",
	},
	{
		title: "Org Menu",
		href: "/docs/blocks/org-menu",
		description:
			"Menu de sélection d'organisation ou d'espace de travail avec switcher et création rapide.",
		icon: Building2,
		thumbnail: "org-menu",
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
		title: "Quick Log Activity",
		href: "/docs/blocks/quick-log-activity",
		description:
			"Formulaire rapide pour logger une activité CRM : appel, email, note ou rendez-vous.",
		icon: Zap,
		thumbnail: "quick-log-activity",
	},
	{
		title: "Quote Preview",
		href: "/docs/blocks/quote-preview",
		description:
			"Aperçu de devis avec lignes, totaux, TVA et actions d'envoi ou de téléchargement PDF.",
		icon: FileSearch,
		thumbnail: "quote-preview",
	},
	{
		title: "Split View",
		href: "/docs/blocks/split-view",
		description: "Vue master-detail avec liste à gauche et détail à droite, redimensionnable.",
		icon: SplitSquareHorizontal,
		thumbnail: "split-view",
	},
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
		title: "Status Flow",
		href: "/docs/blocks/status-flow",
		description: "Visualisation de pipeline de statuts avec étapes, progression et transitions.",
		icon: GitBranch,
		thumbnail: "status-flow",
	},
]

function BusinessPage() {
	return (
		<Page>
			<CategoryPageHero
				title="Business"
				description="Composants métier prêts à l'emploi pour construire des apps CRM, ERP et outils internes. Timelines, kanban, formulaires multi-étapes, fiches détail et plus."
			/>
			<ComponentSection components={businessComponents} />
		</Page>
	)
}
