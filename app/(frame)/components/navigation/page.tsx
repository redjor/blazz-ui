import { Page } from "@/components/ui/page"
import { ComponentSection } from "@/components/features/docs/component-card"
import { ChevronRight, Command, Menu, FolderTree } from "lucide-react"

const navigationComponents = [
	{
		title: "Breadcrumb",
		href: "/components/ui/breadcrumb",
		description: "Shows the current page's location within the navigational hierarchy and allows quick navigation to parent pages.",
		icon: ChevronRight,
	},
	{
		title: "Command",
		href: "/components/ui/command",
		description: "A command palette for quick navigation and actions with keyboard shortcuts and fuzzy search.",
		icon: Command,
	},
	{
		title: "Menu",
		href: "/components/ui/menu",
		description: "An unstyled, accessible menu component for building custom navigation and action menus.",
		icon: Menu,
	},
	{
		title: "Tabs",
		href: "/components/ui/tabs",
		description: "Organize content into multiple sections that can be easily switched between.",
		icon: FolderTree,
	},
]

export default function NavigationPage() {
	return (
		<Page
			title="Navigation"
			subtitle="Components that help users navigate through your application."
		>
			<ComponentSection
				title="Navigation"
				description="Navigation components help users understand where they are in your application and move efficiently between different sections and pages."
				components={navigationComponents}
			/>
		</Page>
	)
}
