// apps/docs/src/data/components/dropdown-menu.ts
import type { ComponentData } from "../types"

export const dropdownMenuData: ComponentData = {
	name: "DropdownMenu",
	category: "ui",
	description: "Menu contextuel attaché à un trigger.",
	docPath: "/docs/components/ui/dropdown-menu",
	imports: {
		path: "@blazz/ui/components/ui/dropdown-menu",
		named: [
			"DropdownMenu",
			"DropdownMenuTrigger",
			"DropdownMenuContent",
			"DropdownMenuItem",
			"DropdownMenuSeparator",
			"DropdownMenuLabel",
			"DropdownMenuSub",
			"DropdownMenuSubTrigger",
			"DropdownMenuSubContent",
		],
	},
	props: [
		{ name: "open", type: "boolean", description: "État d'ouverture contrôlé." },
		{
			name: "onOpenChange",
			type: "(open: boolean) => void",
			description: "Callback au changement d'état.",
		},
	],
	gotchas: [
		"DropdownMenuTrigger uses render prop: `<DropdownMenuTrigger render={<Button size='icon' />}><MoreHorizontal /></DropdownMenuTrigger>`",
		"For row actions use size='icon' variant='ghost' button as trigger",
		"DropdownMenuContent align prop: 'start' | 'center' (default) | 'end'",
	],
	canonicalExample: `<DropdownMenu>
  <DropdownMenuTrigger render={<Button size="icon" variant="ghost" />}>
    <MoreHorizontal className="size-4" />
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end">
    <DropdownMenuItem>Edit</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`,
}
