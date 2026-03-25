// apps/docs/src/data/components/app-frame.ts
import type { ComponentData } from "../types"

export const appFrameData: ComponentData = {
	name: "AppFrame",
	category: "blocks",
	description:
		"Application shell with sidebar, top bar, breadcrumbs, and optional browser-style tabs.",
	docPath: "/docs/blocks/app-frame",
	imports: {
		path: "@blazz/pro/components/blocks/app-frame",
		named: ["AppFrame", "useAppTopBar"],
	},
	props: [
		{
			name: "navItems",
			type: "NavItem[] | NavGroup[]",
			required: true,
			description: "Navigation items — flat array or grouped.",
		},
		{
			name: "logo",
			type: "React.ReactNode",
			description: "Logo rendered in the sidebar header.",
		},
		{
			name: "sidebarFooter",
			type: "React.ReactNode",
			description: "Content rendered at the bottom of the sidebar.",
		},
		{
			name: "sidebarCollapsible",
			type: '"offcanvas" | "icon" | "none"',
			default: '"offcanvas"',
			description: "Sidebar collapse behavior.",
		},
		{
			name: "tabs",
			type: "TabsConfig",
			description: "Enable browser-style tabs. Pass { storageKey, alwaysShow? }.",
		},
		{
			name: "children",
			type: "React.ReactNode",
			required: true,
			description: "Page content.",
		},
	],
	gotchas: [
		"Import from @blazz/pro/components/blocks/app-frame — requires @blazz/pro",
		"Use useAppTopBar(breadcrumbs, actions?) in page components to set the top bar",
		"navItems accepts NavItem[] (auto-wrapped in one group) or NavGroup[] (multiple sections)",
		"tabs prop enables browser-style tabs — requires @blazz/tabs peer dependency",
	],
	canonicalExample: `import { AppFrame } from "@blazz/pro/components/blocks/app-frame"

const navItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Contacts", url: "/contacts", icon: Users },
]

export default function Layout({ children }) {
  return (
    <AppFrame navItems={navItems} logo={<Logo />}>
      {children}
    </AppFrame>
  )
}`,
}
