// apps/docs/src/data/components/app-sidebar.ts
import type { ComponentData } from "../types"

export const appSidebarData: ComponentData = {
	name: "AppSidebar",
	category: "patterns",
	description:
		"Sidebar navigable — généralement configuré via AppFrame, rarement utilisé directement.",
	docPath: "/docs/components/patterns/app-sidebar",
	imports: {
		path: "@blazz/ui/components/patterns/app-sidebar",
		named: ["AppSidebar"],
	},
	props: [
		{
			name: "config",
			type: "SidebarConfig",
			required: true,
			description: "Config de la sidebar (navigation, user).",
		},
	],
	gotchas: [
		"Prefer AppFrame over AppSidebar directly — AppFrame handles sidebar + top bar + layout",
	],
	canonicalExample: `// Use AppFrame instead:
<AppFrame navigation={navigationSections}>{children}</AppFrame>`,
}
