// apps/docs/src/data/components/popover.ts
import type { ComponentData } from "../types"

export const popoverData: ComponentData = {
	name: "Popover",
	category: "ui",
	description: "Panneau flottant ancré à un trigger, pour du contenu riche non-modal.",
	docPath: "/docs/components/ui/popover",
	imports: {
		path: "@blazz/ui/components/ui/popover",
		named: ["Popover", "PopoverTrigger", "PopoverContent"],
	},
	props: [
		{ name: "open", type: "boolean", description: "État d'ouverture contrôlé." },
		{
			name: "onOpenChange",
			type: "(open: boolean) => void",
			description: "Callback au changement d'état.",
		},
	],
	gotchas: ["PopoverTrigger uses render prop: `<PopoverTrigger render={<Button />}>Open</PopoverTrigger>`", "PopoverContent align prop: 'start' | 'center' (default) | 'end'"],
	canonicalExample: `<Popover>
  <PopoverTrigger render={<Button variant="outline" />}>Open</PopoverTrigger>
  <PopoverContent>
    <p>Popover content</p>
  </PopoverContent>
</Popover>`,
}
