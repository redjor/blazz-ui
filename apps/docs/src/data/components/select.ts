// apps/docs/src/data/components/select.ts
import type { ComponentData } from "../types"

export const selectData: ComponentData = {
	name: "Select",
	category: "ui",
	description: "Dropdown pour sélectionner une valeur unique dans une liste.",
	docPath: "/docs/components/ui/select",
	imports: {
		path: "@blazz/ui/components/ui/select",
		named: [
			"Select",
			"SelectTrigger",
			"SelectValue",
			"SelectContent",
			"SelectItem",
			"SelectGroup",
			"SelectLabel",
			"SelectSeparator",
		],
	},
	props: [
		{
			name: "items",
			type: "Record<string, string> | Array<{ value: string; label: string }>",
			description:
				"Requis fonctionnellement — sans ce prop, SelectValue affiche la value brute au lieu du label.",
		},
		{
			name: "value",
			type: "string",
			description: "Valeur contrôlée.",
		},
		{
			name: "onValueChange",
			type: "(value: string) => void",
			description: "Callback à la sélection.",
		},
		{
			name: "defaultValue",
			type: "string",
			description: "Valeur par défaut (usage non-contrôlé).",
		},
		{
			name: "disabled",
			type: "boolean",
			default: "false",
			description: "Désactive le select.",
		},
	],
	gotchas: [
		"ALWAYS pass `items` prop — without it SelectValue renders raw value ('apple') not label ('Apple')",
		"Use `render={<Button />}` not `asChild` on trigger components — Base UI, not Radix",
		"items: prefer Array<{value,label}> format in this codebase (Base UI also accepts Record<string,string> but array is the @blazz/ui convention)",
	],
	canonicalExample: `<Select
  items={[{ value: "active", label: "Active" }, { value: "inactive", label: "Inactive" }]}
  value={status}
  onValueChange={setStatus}
>
  <SelectTrigger><SelectValue placeholder="Select..." /></SelectTrigger>
  <SelectContent>
    <SelectItem value="active">Active</SelectItem>
    <SelectItem value="inactive">Inactive</SelectItem>
  </SelectContent>
</Select>`,
}
