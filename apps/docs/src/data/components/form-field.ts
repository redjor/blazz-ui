// apps/docs/src/data/components/form-field.ts
import type { ComponentData } from "../types"

export const formFieldData: ComponentData = {
	name: "FormField",
	category: "patterns",
	description: "Wrapper label + input + erreur + description pour les formulaires react-hook-form.",
	docPath: "/docs/components/patterns/form-field",
	imports: {
		path: "@blazz/ui/components/patterns/form-field",
		named: ["FormField"],
	},
	props: [
		{ name: "label", type: "string", required: true, description: "Label du champ." },
		{
			name: "error",
			type: "string",
			description: "Message d'erreur (depuis react-hook-form errors).",
		},
		{ name: "description", type: "string", description: "Texte d'aide affiché sous l'input." },
		{ name: "required", type: "boolean", description: "Affiche un * après le label." },
		{
			name: "children",
			type: "React.ReactNode",
			required: true,
			description: "Le composant input.",
		},
	],
	gotchas: ["Always use FormField to wrap inputs in forms — never write label+input+error manually", "Pass error={errors.fieldName?.message} directly from react-hook-form"],
	canonicalExample: `<FormField
  label="Email"
  required
  error={errors.email?.message}
  description="We'll send a confirmation to this address."
>
  <Input type="email" {...register("email")} aria-invalid={!!errors.email} />
</FormField>`,
}
