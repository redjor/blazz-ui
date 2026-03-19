import { Page } from "@blazz/ui/components/ui/page"
import { createFileRoute } from "@tanstack/react-router"
import { Building2, Settings2 } from "lucide-react"
import { CategoryPageHero, ComponentSection } from "~/components/docs/component-card"

export const Route = createFileRoute("/_docs/docs/blocks/settings")({
	component: SettingsPage,
})

const settingsComponents = [
	{
		title: "Org Menu",
		href: "/docs/blocks/org-menu",
		description:
			"Menu de sélection d'organisation ou d'espace de travail avec switcher et création rapide.",
		icon: Building2,
		thumbnail: "org-menu",
	},
	{
		title: "Settings Block",
		href: "/docs/blocks/settings-block",
		description:
			"Bloc de réglages avec sections, danger zone et actions. Pour les pages de configuration.",
		icon: Settings2,
		thumbnail: "settings-block",
	},
]

function SettingsPage() {
	return (
		<Page>
			<CategoryPageHero
				title="Settings"
				description="Configuration d'app et gestion d'organisation. Switcher d'espace de travail et blocs de réglages avec sections et danger zone."
			/>
			<ComponentSection components={settingsComponents} />
		</Page>
	)
}
