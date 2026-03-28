// apps/docs/src/data/components/textarea.ts
import type { ComponentData } from "../types"

export const textareaData: ComponentData = {
	name: "Textarea",
	category: "ui",
	description: "Champ de saisie multi-lignes.",
	docPath: "/docs/components/ui/textarea",
	imports: {
		path: "@blazz/ui/components/ui/textarea",
		named: ["Textarea"],
	},
	props: [
		{ name: "placeholder", type: "string", description: "Texte placeholder." },
		{ name: "rows", type: "number", default: "3", description: "Nombre de lignes visibles." },
		{ name: "disabled", type: "boolean", default: "false", description: "Désactive le textarea." },
	],
	gotchas: ["With react-hook-form: spread register() props — `<Textarea {...register('description')} />`", "Error state: add aria-invalid={!!errors.field} to show red border"],
	canonicalExample: `<Textarea
  placeholder="Enter description..."
  rows={4}
  {...register("description")}
  aria-invalid={!!errors.description}
/>`,
}
