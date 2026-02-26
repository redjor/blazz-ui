import { createFileRoute } from "@tanstack/react-router"
import { Page } from "@blazz/ui/components/ui/page"
import { ComponentSection } from "~/components/docs/component-card"
import { MessageSquare, Square, Box, PanelRight, Info } from "lucide-react"

export const Route = createFileRoute("/_docs/docs/components/overlays")({
	component: OverlaysPage,
})

const overlayComponents = [
	{
		title: "Confirmation Dialog",
		href: "/docs/components/ui/confirmation-dialog",
		description: "A specialized dialog for confirming destructive or important user actions with consistent patterns.",
		icon: MessageSquare,
		thumbnail: "confirmation-dialog",
	},
	{
		title: "Dialog",
		href: "/docs/components/ui/dialog",
		description: "A modal window that appears on top of the main content, capturing user focus until dismissed.",
		icon: Square,
		thumbnail: "dialog",
	},
	{
		title: "Popover",
		href: "/docs/components/ui/popover",
		description: "A floating panel for displaying additional content or controls without leaving the current context.",
		icon: Box,
		thumbnail: "popover",
	},
	{
		title: "Sheet",
		href: "/docs/components/ui/sheet",
		description: "A panel that slides in from the edge of the screen for contextual actions and information.",
		icon: PanelRight,
		thumbnail: "sheet",
	},
	{
		title: "Tooltip",
		href: "/docs/components/ui/tooltip",
		description: "A small popup that provides helpful information on hover or focus without cluttering the interface.",
		icon: Info,
		thumbnail: "tooltip",
	},
]

function OverlaysPage() {
	return (
		<Page
			title="Overlays"
			subtitle="Overlay components present temporary content and actions above the main interface. They help users focus on specific tasks while maintaining context of the underlying page."
		>
			<ComponentSection components={overlayComponents} />
		</Page>
	)
}
