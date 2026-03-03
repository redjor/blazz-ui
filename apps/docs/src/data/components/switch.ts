// apps/docs/src/data/components/switch.ts
import type { ComponentData } from "../types"

export const switchData: ComponentData = {
	name: "Switch",
	category: "ui",
	description: "Interrupteur toggle on/off.",
	docPath: "/docs/components/ui/switch",
	imports: {
		path: "@blazz/ui/components/ui/switch",
		named: ["Switch"],
	},
	props: [
		{ name: "checked", type: "boolean", description: "État activé contrôlé." },
		{
			name: "onCheckedChange",
			type: "(checked: boolean) => void",
			description: "Callback au changement.",
		},
		{ name: "disabled", type: "boolean", default: "false", description: "Désactive le switch." },
	],
	gotchas: [
		"With react-hook-form: use watch+setValue — `onCheckedChange={(checked) => setValue('active', checked)}`",
	],
	canonicalExample: `<div className="flex items-center gap-2">
  <Switch
    id="active"
    checked={watch("active")}
    onCheckedChange={(checked) => setValue("active", checked)}
  />
  <Label htmlFor="active">Active</Label>
</div>`,
}
