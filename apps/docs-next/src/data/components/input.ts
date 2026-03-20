// apps/docs/src/data/components/input.ts
import type { ComponentData } from "../types"

export const inputData: ComponentData = {
	name: "Input",
	category: "ui",
	description: "Champ de saisie texte standard.",
	docPath: "/docs/components/ui/input",
	imports: {
		path: "@blazz/ui/components/ui/input",
		named: ["Input"],
	},
	props: [
		{ name: "type", type: "string", default: '"text"', description: "Type HTML de l'input." },
		{ name: "placeholder", type: "string", description: "Texte placeholder." },
		{ name: "disabled", type: "boolean", default: "false", description: "Désactive l'input." },
		{
			name: "aria-invalid",
			type: "boolean",
			description: "Marque l'input comme invalide (style rouge).",
		},
	],
	gotchas: [
		"With react-hook-form: spread register() props — `<Input {...register('name')} />`",
		"Error state: add aria-invalid={!!errors.field} to show red border automatically",
		"NEVER use type='date' — use DateSelector instead",
		"For numbers use NumberInput, for currency use CurrencyInput — not Input type='number'",
	],
	canonicalExample: `<Input
  placeholder="Enter name..."
  {...register("name")}
  aria-invalid={!!errors.name}
/>`,
}
