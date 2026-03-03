// apps/docs/src/data/components/tabs.ts
import type { ComponentData } from "../types"

export const tabsData: ComponentData = {
	name: "Tabs",
	category: "ui",
	description: "Navigation par onglets.",
	docPath: "/docs/components/ui/tabs",
	imports: {
		path: "@blazz/ui/components/ui/tabs",
		named: ["Tabs", "TabsList", "TabsTrigger", "TabsContent"],
	},
	props: [
		{ name: "defaultValue", type: "string", description: "Onglet actif par défaut." },
		{ name: "value", type: "string", description: "Onglet actif contrôlé." },
		{
			name: "onValueChange",
			type: "(value: string) => void",
			description: "Callback au changement d'onglet.",
		},
		{
			name: "orientation",
			type: '"horizontal" | "vertical"',
			default: '"horizontal"',
			description: "Orientation des tabs.",
		},
	],
	gotchas: [
		"TabsList variant prop: 'default' (underline) | 'pills' (filled buttons)",
		"For page-level navigation use NavigationTabs (patterns) not Tabs — it persists tab in URL",
	],
	canonicalExample: `<Tabs defaultValue="overview">
  <TabsList>
    <TabsTrigger value="overview">Overview</TabsTrigger>
    <TabsTrigger value="activity">Activity</TabsTrigger>
  </TabsList>
  <TabsContent value="overview">...</TabsContent>
  <TabsContent value="activity">...</TabsContent>
</Tabs>`,
}
