// apps/docs/src/data/components/app-frame.ts
import type { ComponentData } from "../types"

export const appFrameData: ComponentData = {
	name: "AppFrame",
	category: "patterns",
	description: "Shell principal d'application avec sidebar, top bar et zone de contenu.",
	docPath: "/docs/components/patterns/app-frame",
	imports: {
		path: "@blazz/ui/components/patterns/app-frame",
		named: ["AppFrame"],
	},
	props: [
		{
			name: "sidebarConfig",
			type: "SidebarConfig",
			description:
				"Config complète sidebar (user, navigation). Requis si navigation n'est pas fourni.",
		},
		{
			name: "navigation",
			type: "NavigationSection[]",
			description: "Shortcut pour passer uniquement la navigation.",
		},
		{
			name: "children",
			type: "React.ReactNode",
			required: true,
			description: "Contenu principal de l'app.",
		},
		{
			name: "sidebarHeader",
			type: "React.ReactNode",
			description: "Slot en haut de sidebar (ex: OrgSwitcher).",
		},
		{
			name: "topBarContent",
			type: "React.ReactNode",
			description: "Contenu additionnel dans la top bar.",
		},
	],
	gotchas: [
		"Import from @blazz/ui/components/patterns/app-frame — not from @blazz/ui directly",
		"AppFrame wraps the entire app layout — use in root layout file, not per-page",
		"navigation prop is shorthand — use sidebarConfig for full control (user info, avatar, etc.)",
	],
	canonicalExample: `// In root layout (layout.tsx)
<AppFrame
  navigation={[
    {
      title: "Main",
      items: [
        { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard /> },
        { label: "Contacts", href: "/contacts", icon: <Users /> },
      ]
    }
  ]}
>
  {children}
</AppFrame>`,
}
