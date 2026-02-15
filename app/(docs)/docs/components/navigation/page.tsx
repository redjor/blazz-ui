import { Page } from "@/components/ui/page"
import { ComponentSection } from "@/components/features/docs/component-card"
import { ChevronRight, Command, Menu, FolderTree } from "lucide-react"

const navigationComponents = [
	{
		title: "Breadcrumb",
		href: "/docs/components/ui/breadcrumb",
		description: "Shows the current page's location within the navigational hierarchy and allows quick navigation to parent pages.",
		icon: ChevronRight,
	},
	{
		title: "Command",
		href: "/docs/components/ui/command",
		description: "A command palette for quick navigation and actions with keyboard shortcuts and fuzzy search.",
		icon: Command,
	},
	{
		title: "Menu",
		href: "/docs/components/ui/menu",
		description: "An unstyled, accessible menu component for building custom navigation and action menus.",
		icon: Menu,
	},
	{
		title: "Tabs",
		href: "/docs/components/ui/tabs",
		description: "Organize content into multiple sections that can be easily switched between.",
		icon: FolderTree,
	},
]

export default function NavigationPage() {
	return (
		<Page
			title="Navigation"
			subtitle="Navigation components help users understand where they are in your application and move efficiently between different sections and pages."
		>
			<ComponentSection components={navigationComponents} />
		</Page>
	)
}
