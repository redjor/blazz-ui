// apps/docs/src/data/components/checkbox.ts
import type { ComponentData } from "../types"

export const checkboxData: ComponentData = {
	name: "Checkbox",
	category: "ui",
	description: "Case à cocher individuelle ou groupée.",
	docPath: "/docs/components/ui/checkbox",
	imports: {
		path: "@blazz/ui/components/ui/checkbox",
		named: ["Checkbox", "CheckboxGroup"],
	},
	props: [
		{ name: "checked", type: "boolean", description: "État coché contrôlé." },
		{
			name: "onCheckedChange",
			type: "(checked: boolean) => void",
			description: "Callback au changement.",
		},
		{ name: "disabled", type: "boolean", default: "false", description: "Désactive la checkbox." },
	],
	gotchas: [
		"With react-hook-form: use Controller or watch+setValue — `onCheckedChange={(checked) => setValue('field', !!checked)}`",
		"For multiple checkboxes with labels, use CheckboxGroup with options prop",
		"onCheckedChange receives boolean | 'indeterminate' — cast with !!checked for booleans",
	],
	canonicalExample: `<Checkbox
  id="agree"
  checked={watch("agree")}
  onCheckedChange={(checked) => setValue("agree", !!checked)}
/>
<Label htmlFor="agree">I agree to the terms</Label>`,
}
