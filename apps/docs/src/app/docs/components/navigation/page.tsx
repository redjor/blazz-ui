"use client"

import { Page } from "@blazz/ui/components/ui/page"
import { Building2, ChevronRight, Command, FolderTree, List, Menu, PanelTop } from "lucide-react"
import { CategoryPageHero, ComponentSection } from "~/components/docs/component-card"

const navigationComponents = [
	{
		title: "Breadcrumb",
		href: "/docs/components/ui/breadcrumb",
		description: "Shows the current page's location within the navigational hierarchy and allows quick navigation to parent pages.",
		icon: ChevronRight,
		thumbnail: "breadcrumb",
	},
	{
		title: "Command",
		href: "/docs/components/ui/command",
		description: "A command palette for quick navigation and actions with keyboard shortcuts and fuzzy search.",
		icon: Command,
		thumbnail: "command",
	},
	{
		title: "Menu",
		href: "/docs/components/ui/menu",
		description: "An unstyled, accessible menu component for building custom navigation and action menus.",
		icon: Menu,
		thumbnail: "menu",
	},
	{
		title: "Menubar",
		href: "/docs/components/ui/menubar",
		description: "A horizontal menu bar with dropdown menus, keyboard navigation, and support for checkboxes and radio items.",
		icon: PanelTop,
		thumbnail: "menubar",
	},
	{
		title: "Nav Menu",
		href: "/docs/components/ui/nav-menu",
		description: "Lightweight vertical navigation menu for page sidebars, dialogs, sheets, or any panel.",
		icon: List,
		thumbnail: "nav-menu",
	},
	{
		title: "Org Menu",
		href: "/docs/components/ui/org-menu",
		description: "Organization switcher menu for selecting between workspaces, teams, or accounts.",
		icon: Building2,
		thumbnail: "org-menu",
	},
	{
		title: "Tabs",
		href: "/docs/components/ui/tabs",
		description: "Organize content into multiple sections that can be easily switched between.",
		icon: FolderTree,
		thumbnail: "tabs",
	},
]

export default function NavigationPage() {
	return (
		<Page>
			<CategoryPageHero title="Navigation" description="Navigation components help users understand where they are in your application and move efficiently between different sections and pages." />
			<ComponentSection components={navigationComponents} />
		</Page>
	)
}
