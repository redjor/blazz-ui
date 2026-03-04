import { createFileRoute, useLoaderData } from "@tanstack/react-router"
import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { FormField } from "@blazz/ui/components/patterns/form-field"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "basic",
		code: `import { useForm } from "react-hook-form"
import { FormField } from "@blazz/ui/components/patterns/form-field"

const schema = z.object({ name: z.string().min(1) })

function MyForm() {
  const { control, handleSubmit } = useForm({ resolver: zodResolver(schema) })

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <FormField
        name="name"
        label="Nom"
        control={control}
        placeholder="Jean Dupont"
      />
    </form>
  )
}`,
	},
	{
		key: "required",
		code: `<FormField
  name="email"
  label="Email"
  control={control}
  type="email"
  placeholder="jean@acme.com"
  required
  description="L'email de contact principal."
/>`,
	},
	{
		key: "select",
		code: `<FormField
  name="status"
  label="Statut"
  control={control}
  type="select"
  options={[
    { value: "active", label: "Actif" },
    { value: "inactive", label: "Inactif" },
    { value: "pending", label: "En attente" },
  ]}
/>`,
	},
	{
		key: "textarea",
		code: `<FormField
  name="notes"
  label="Notes"
  control={control}
  type="textarea"
  placeholder="Ajouter une note..."
  rows={4}
/>`,
	},
	{
		key: "grid",
		code: `import { FormField } from "@blazz/ui/components/patterns/form-field"
import { FormSection } from "@blazz/ui/components/patterns/form-section"
import { FieldGrid } from "@blazz/ui/components/patterns/field-grid"

function ContactForm() {
  const { control, handleSubmit } = useForm({ resolver: zodResolver(schema) })

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <FormSection title="Informations">
        <FieldGrid cols={2}>
          <FormField name="firstName" label="Prénom" control={control} required />
          <FormField name="lastName" label="Nom" control={control} required />
          <FormField name="email" label="Email" control={control} type="email" required />
          <FormField name="phone" label="Téléphone" control={control} type="tel" />
          <FormField
            name="notes"
            label="Notes"
            control={control}
            type="textarea"
            span={2}
          />
        </FieldGrid>
      </FormSection>
    </form>
  )
}`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/patterns/form-field")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: FormFieldPage,
})

const toc = [
	{ id: "usage", title: "Usage" },
	{ id: "examples", title: "Exemples" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const formFieldProps: DocProp[] = [
	{
		name: "name",
		type: "FieldPath<TFieldValues>",
		required: true,
		description: "Nom du champ dans le schéma react-hook-form. Doit correspondre exactement à une clé du formulaire.",
	},
	{
		name: "label",
		type: "string",
		required: true,
		description: "Label affiché au-dessus de l'input.",
	},
	{
		name: "control",
		type: "Control<TFieldValues>",
		required: true,
		description: "Objet control retourné par useForm(). Connecte le champ à react-hook-form.",
	},
	{
		name: "type",
		type: '"text" | "email" | "tel" | "number" | "password" | "select" | "textarea"',
		default: '"text"',
		description: "Type de l'input. Utiliser \"select\" avec la prop options, \"textarea\" pour les textes longs.",
	},
	{
		name: "placeholder",
		type: "string",
		description: "Texte de placeholder affiché dans l'input vide.",
	},
	{
		name: "description",
		type: "string",
		description: "Texte d'aide affiché sous l'input. Masqué si une erreur de validation est présente.",
	},
	{
		name: "required",
		type: "boolean",
		description: "Affiche un astérisque rouge * après le label.",
	},
	{
		name: "options",
		type: "FormFieldOption[]",
		description: 'Options du select. Requis quand type="select". Chaque option = { value: string, label: string }.',
	},
	{
		name: "rows",
		type: "number",
		default: "3",
		description: 'Nombre de lignes visibles du textarea. Utilisé quand type="textarea".',
	},
	{
		name: "span",
		type: "number",
		description: "Nombre de colonnes occupées dans un FieldGrid via gridColumn: span N. Utile pour les champs pleine largeur.",
	},
	{
		name: "className",
		type: "string",
		description: "Classes CSS supplémentaires appliquées au conteneur du champ.",
	},
]

// --- Demo components ---

const basicSchema = z.object({
	name: z.string().min(1, "Le nom est requis"),
})

function BasicDemo() {
	const { control } = useForm({
		resolver: zodResolver(basicSchema),
		defaultValues: { name: "" },
	})
	return (
		<div className="w-full max-w-sm">
			<FormField
				name="name"
				label="Nom"
				control={control}
				placeholder="Jean Dupont"
			/>
		</div>
	)
}

const requiredSchema = z.object({
	email: z.string().email("Email invalide").min(1),
})

function RequiredDemo() {
	const { control, handleSubmit } = useForm({
		resolver: zodResolver(requiredSchema),
		defaultValues: { email: "" },
	})
	return (
		<div className="w-full max-w-sm">
			<form onSubmit={handleSubmit(() => {})}>
				<FormField
					name="email"
					label="Email"
					control={control}
					type="email"
					placeholder="jean@acme.com"
					required
					description="L'email de contact principal."
				/>
			</form>
		</div>
	)
}

const selectSchema = z.object({
	status: z.string().min(1),
})

function SelectDemo() {
	const { control } = useForm({
		resolver: zodResolver(selectSchema),
		defaultValues: { status: "" },
	})
	return (
		<div className="w-full max-w-sm">
			<FormField
				name="status"
				label="Statut"
				control={control}
				type="select"
				options={[
					{ value: "active", label: "Actif" },
					{ value: "inactive", label: "Inactif" },
					{ value: "pending", label: "En attente" },
				]}
			/>
		</div>
	)
}

const textareaSchema = z.object({
	notes: z.string().optional(),
})

function TextareaDemo() {
	const { control } = useForm({
		resolver: zodResolver(textareaSchema),
		defaultValues: { notes: "" },
	})
	return (
		<div className="w-full max-w-sm">
			<FormField
				name="notes"
				label="Notes"
				control={control}
				type="textarea"
				placeholder="Ajouter une note..."
				rows={4}
			/>
		</div>
	)
}

const gridSchema = z.object({
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	email: z.string().email(),
	phone: z.string().optional(),
	notes: z.string().optional(),
})

function GridDemo() {
	const { control } = useForm({
		resolver: zodResolver(gridSchema),
		defaultValues: { firstName: "", lastName: "", email: "", phone: "", notes: "" },
	})
	return (
		<div className="w-full grid grid-cols-2 gap-4">
			<FormField name="firstName" label="Prénom" control={control} required />
			<FormField name="lastName" label="Nom" control={control} required />
			<FormField name="email" label="Email" control={control} type="email" required />
			<FormField name="phone" label="Téléphone" control={control} type="tel" />
			<FormField
				name="notes"
				label="Notes"
				control={control}
				type="textarea"
				span={2}
				placeholder="Ajouter une note..."
			/>
		</div>
	)
}

// --- Page ---

function FormFieldPage() {
	const { highlighted } = useLoaderData({ from: "/_docs/docs/components/patterns/form-field" })
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Form Field"
			subtitle="Champ de formulaire connecté à react-hook-form. Gère le label, l'input, la description et les erreurs de validation dans un seul composant."
			toc={toc}
		>
			<DocSection id="usage" title="Usage">
				<DocExampleClient
					title="Champ texte basique"
					description="Passer name, label et control suffit pour un champ fonctionnel."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<BasicDemo />
				</DocExampleClient>
			</DocSection>

			<DocSection id="examples" title="Exemples">
				<DocExampleClient
					title="Champ requis avec description"
					description="required affiche un * rouge après le label. description disparaît si une erreur est présente."
					code={examples[1].code}
					highlightedCode={html("required")}
				>
					<RequiredDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Select"
					description='Passer type="select" avec une prop options pour un champ de sélection.'
					code={examples[2].code}
					highlightedCode={html("select")}
				>
					<SelectDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Textarea"
					description='Passer type="textarea" pour les textes longs. rows contrôle la hauteur initiale.'
					code={examples[3].code}
					highlightedCode={html("textarea")}
				>
					<TextareaDemo />
				</DocExampleClient>

				<DocExampleClient
					title="Grille de champs"
					description="FormField s'intègre dans un FieldGrid. La prop span permet à un champ d'occuper plusieurs colonnes."
					code={examples[4].code}
					highlightedCode={html("grid")}
				>
					<GridDemo />
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={formFieldProps} />
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Form Section",
							href: "/docs/components/patterns/form-section",
							description: "Groupe de champs avec titre collapsible. Contient un ou plusieurs FieldGrid.",
						},
						{
							title: "Field Grid",
							href: "/docs/components/patterns/field-grid",
							description: "Grille responsive pour aligner des FormField en 1, 2 ou 3 colonnes.",
						},
						{
							title: "Field",
							href: "/docs/components/ui/field",
							description: "Primitive bas niveau pour composer un champ sans react-hook-form.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
