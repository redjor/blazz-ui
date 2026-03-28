// apps/docs/src/data/components/tooltip.ts
import type { ComponentData } from "../types"

export const tooltipData: ComponentData = {
	name: "Tooltip",
	category: "ui",
	description: "Infobulles affichées au survol d'un élément.",
	docPath: "/docs/components/ui/tooltip",
	imports: {
		path: "@blazz/ui/components/ui/tooltip",
		named: ["Tooltip", "TooltipTrigger", "TooltipContent"],
	},
	props: [
		{
			name: "side",
			type: '"top" | "right" | "bottom" | "left"',
			default: '"top"',
			description: "Côté d'affichage du tooltip.",
		},
		{
			name: "sideOffset",
			type: "number",
			default: "4",
			description: "Distance en pixels depuis le trigger.",
		},
	],
	gotchas: ["TooltipTrigger uses render prop: `<TooltipTrigger render={<Button />}>…</TooltipTrigger>`", "For icon-only buttons always add a Tooltip for accessibility"],
	canonicalExample: `<Tooltip>
  <TooltipTrigger render={<Button size="icon" variant="ghost" />}>
    <Settings className="size-4" />
  </TooltipTrigger>
  <TooltipContent>Settings</TooltipContent>
</Tooltip>`,
}
