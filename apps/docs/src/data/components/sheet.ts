// apps/docs/src/data/components/sheet.ts
import type { ComponentData } from "../types"

export const sheetData: ComponentData = {
	name: "Sheet",
	category: "ui",
	description: "Panneau glissant depuis un côté de l'écran (drawer/sidebar overlay).",
	docPath: "/docs/components/ui/sheet",
	imports: {
		path: "@blazz/ui/components/ui/sheet",
		named: ["Sheet", "SheetTrigger", "SheetContent", "SheetHeader", "SheetTitle", "SheetDescription", "SheetFooter", "SheetClose"],
	},
	props: [
		{ name: "open", type: "boolean", description: "État d'ouverture contrôlé." },
		{
			name: "onOpenChange",
			type: "(open: boolean) => void",
			description: "Callback au changement d'état.",
		},
		{ name: "defaultOpen", type: "boolean", description: "État initial (usage non-contrôlé)." },
	],
	gotchas: [
		"SheetTrigger uses render prop: `<SheetTrigger render={<Button />}>Open</SheetTrigger>` — never asChild",
		"SheetContent side prop: 'left' (default) | 'right' | 'top' | 'bottom'",
		"SheetTrigger is an alias for DialogPrimitive.Trigger — same Base UI pattern",
	],
	canonicalExample: `<Sheet>
  <SheetTrigger render={<Button variant="outline" />}>Open</SheetTrigger>
  <SheetContent side="right">
    <SheetHeader>
      <SheetTitle>Title</SheetTitle>
    </SheetHeader>
    {/* content */}
  </SheetContent>
</Sheet>`,
}
