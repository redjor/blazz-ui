import { Page } from "@blazz/ui/components/ui/page"
import { Activity, Bell, Inbox, Zap } from "lucide-react"
import { CategoryPageHero, ComponentSection } from "~/components/docs/component-card"

const feedsComponents = [
	{
		title: "Activity Timeline",
		href: "/docs/blocks/activity-timeline",
		description:
			"Fil d'activité chronologique pour afficher l'historique des événements, appels, emails et notes.",
		icon: Activity,
		thumbnail: "activity-timeline",
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
		title: "Notification Center",
		href: "/docs/blocks/notification-center",
		description:
			"Centre de notifications avec groupement par date, marquage lu/non-lu et actions rapides.",
		icon: Bell,
		thumbnail: "notification-center",
	},
	{
		title: "Quick Log Activity",
		href: "/docs/blocks/quick-log-activity",
		description:
			"Formulaire rapide pour logger une activité CRM : appel, email, note ou rendez-vous.",
		icon: Zap,
		thumbnail: "quick-log-activity",
	},
]

export default function FeedsPage() {
	return (
		<Page>
			<CategoryPageHero
				title="Feeds"
				description="Flux d'activité, notifications et messagerie. Timelines, inbox, centres de notifications et formulaires de log rapide."
			/>
			<ComponentSection components={feedsComponents} />
		</Page>
	)
}
