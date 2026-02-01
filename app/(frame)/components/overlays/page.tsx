import { Page } from "@/components/ui/page"
import { ComponentSection } from "@/components/features/docs/component-card"
import { MessageSquare, Square, Box, PanelRight, Info } from "lucide-react"

const overlayComponents = [
	{
		title: "Confirmation Dialog",
		href: "/components/ui/confirmation-dialog",
		description: "A specialized dialog for confirming destructive or important user actions with consistent patterns.",
		icon: MessageSquare,
	},
	{
		title: "Dialog",
		href: "/components/ui/dialog",
		description: "A modal window that appears on top of the main content, capturing user focus until dismissed.",
		icon: Square,
	},
	{
		title: "Popover",
		href: "/components/ui/popover",
		description: "A floating panel for displaying additional content or controls without leaving the current context.",
		icon: Box,
	},
	{
		title: "Sheet",
		href: "/components/ui/sheet",
		description: "A panel that slides in from the edge of the screen for contextual actions and information.",
		icon: PanelRight,
	},
	{
		title: "Tooltip",
		href: "/components/ui/tooltip",
		description: "A small popup that provides helpful information on hover or focus without cluttering the interface.",
		icon: Info,
	},
]

export default function OverlaysPage() {
	return (
		<Page
			title="Overlays"
			subtitle="Components that display content on top of the main interface."
		>
			<ComponentSection
				title="Overlays"
				description="Overlay components present temporary content and actions above the main interface. They help users focus on specific tasks while maintaining context of the underlying page."
				components={overlayComponents}
			/>
		</Page>
	)
}
