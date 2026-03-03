// apps/docs/src/data/components/radio-group.ts
import type { ComponentData } from "../types"

export const radioGroupData: ComponentData = {
	name: "RadioGroup",
	category: "ui",
	description: "Groupe de boutons radio pour sélection exclusive.",
	docPath: "/docs/components/ui/radio-group",
	imports: {
		path: "@blazz/ui/components/ui/radio-group",
		named: ["RadioGroup"],
	},
	props: [
		{ name: "value", type: "string", description: "Valeur sélectionnée contrôlée." },
		{
			name: "onValueChange",
			type: "(value: string) => void",
			description: "Callback à la sélection.",
		},
		{
			name: "options",
			type: "Array<{ value: string; label: string; description?: string }>",
			required: true,
			description: "Options du groupe.",
		},
		{
			name: "orientation",
			type: '"horizontal" | "vertical"',
			default: '"vertical"',
			description: "Orientation du groupe.",
		},
	],
	gotchas: [
		"Use the options prop API — not RadioGroupItem children, which is more verbose",
		"With react-hook-form: `value={watch('type')} onValueChange={(v) => setValue('type', v)}`",
	],
	canonicalExample: `<RadioGroup
  value={watch("plan")}
  onValueChange={(v) => setValue("plan", v)}
  options={[
    { value: "free", label: "Free", description: "Up to 5 users" },
    { value: "pro", label: "Pro", description: "Unlimited users" },
  ]}
/>`,
}
