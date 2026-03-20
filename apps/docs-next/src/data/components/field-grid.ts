// apps/docs/src/data/components/field-grid.ts
import type { ComponentData } from "../types"

export const fieldGridData: ComponentData = {
	name: "FieldGrid",
	category: "patterns",
	description: "Grille responsive pour aligner des champs de formulaire ou des propriétés.",
	docPath: "/docs/components/patterns/field-grid",
	imports: {
		path: "@blazz/ui/components/patterns/field-grid",
		named: ["FieldGrid"],
	},
	props: [
		{ name: "cols", type: "1 | 2 | 3", default: "2", description: "Nombre de colonnes." },
		{
			name: "children",
			type: "React.ReactNode",
			required: true,
			description: "Champs à afficher en grille.",
		},
	],
	gotchas: [
		"Use col-span-2 or col-span-3 on children for full-width fields (textarea, address)",
		"Use cols={3} for 8-15 fields, cols={2} for < 8 fields",
	],
	canonicalExample: `<FieldGrid cols={2}>
  <FormField label="First Name" required error={errors.firstName?.message}>
    <Input {...register("firstName")} />
  </FormField>
  <FormField label="Last Name" required error={errors.lastName?.message}>
    <Input {...register("lastName")} />
  </FormField>
  <div className="col-span-2">
    <FormField label="Bio" error={errors.bio?.message}>
      <Textarea {...register("bio")} rows={3} />
    </FormField>
  </div>
</FieldGrid>`,
}
