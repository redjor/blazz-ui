"use client"

import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPage } from "~/components/docs/doc-page"
import { type DocProp, type DocPropGroup, DocPropsTable } from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
import { Cols2Demo, DetailDemo, FormDemo, SpanDemo } from "./demos"

const examples = [
	{
		key: "detail",
		code: `import { FieldGrid, Field } from "@blazz/ui/components/patterns/field-grid"

<FieldGrid columns={3}>
  <Field label="Nom" value="Acme Corp" />
  <Field label="Secteur" value="SaaS" />
  <Field label="Pays" value="France" />
  <Field label="Téléphone" value="+33 1 23 45 67 89" />
  <Field label="Site web" value="acme.com" />
  <Field label="Employés" value="250" />
</FieldGrid>`,
	},
	{
		key: "span",
		code: `<FieldGrid columns={3}>
  <Field label="Prénom" value="Jean" />
  <Field label="Nom" value="Dupont" />
  <Field label="Email" value="jean@acme.com" />
  <Field label="Adresse" value="12 rue de la Paix, 75001 Paris" span={2} />
  <Field label="Pays" value="France" />
  <Field label="Notes" value={null} span={3} />
</FieldGrid>`,
	},
	{
		key: "cols2",
		code: `<FieldGrid columns={2}>
  <Field label="Référence" value="FACT-2025-0042" />
  <Field label="Statut" value="Envoyée" />
  <Field label="Date d'émission" value="15 jan. 2025" />
  <Field label="Date d'échéance" value="15 fév. 2025" />
  <Field label="Montant HT" value="4 200 €" />
  <Field label="Montant TTC" value="5 040 €" />
</FieldGrid>`,
	},
	{
		key: "form",
		code: `import { useForm } from "react-hook-form"
import { FieldGrid } from "@blazz/ui/components/patterns/field-grid"
import { FormField } from "@blazz/ui/components/patterns/form-field"

function ContactForm() {
  const { control, handleSubmit } = useForm()

  return (
    <form onSubmit={handleSubmit(console.log)}>
      <FieldGrid columns={2}>
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
    </form>
  )
}`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [
	{ id: "usage", title: "Usage" },
	{ id: "examples", title: "Exemples" },
	{ id: "props", title: "Props" },
	{ id: "related", title: "Related" },
]

const propGroups: DocPropGroup[] = [
	{
		title: "FieldGrid",
		props: [
			{
				name: "columns",
				type: "1 | 2 | 3 | 4",
				default: "3",
				description: "Nombre de colonnes sur grands écrans. Sur mobile la grille est toujours 1 colonne, 2 colonnes à partir de sm.",
			},
			{
				name: "children",
				type: "React.ReactNode",
				required: true,
				description: "Champs à afficher — Field pour les fiches détail, FormField pour les formulaires.",
			},
			{
				name: "className",
				type: "string",
				description: "Classes CSS supplémentaires appliquées à la div grid.",
			},
		] satisfies DocProp[],
	},
	{
		title: "Field",
		props: [
			{
				name: "label",
				type: "string",
				required: true,
				description: "Label du champ affiché en text-muted au-dessus de la valeur.",
			},
			{
				name: "value",
				type: "React.ReactNode",
				required: true,
				description: 'Valeur à afficher. Si null ou undefined, affiche "—" (em dash).',
			},
			{
				name: "span",
				type: "number",
				description: "Nombre de colonnes occupées dans la grille via gridColumn: span N.",
			},
			{
				name: "className",
				type: "string",
				description: "Classes CSS supplémentaires appliquées au conteneur dt/dd.",
			},
		] satisfies DocProp[],
	},
]

export default function FieldGridPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Field Grid"
			subtitle="Grille responsive pour aligner des champs en lecture (Field) ou des inputs de formulaire (FormField). S'adapte automatiquement de 1 à 4 colonnes selon la taille d'écran."
			toc={toc}
		>
			<DocSection id="usage" title="Usage">
				<DocExampleClient
					title="Fiche détail — 3 colonnes"
					description="Usage principal : afficher les informations d'une entité en lecture. Field gère l'em dash automatiquement pour les valeurs manquantes."
					code={examples[0].code}
					highlightedCode={html("detail")}
				>
					<DetailDemo />
				</DocExampleClient>
			</DocSection>

			<DocSection id="examples" title="Exemples">
				<DocExampleClient
					title="Champ pleine largeur avec span"
					description="La prop span sur Field ou FormField permet à un champ d'occuper plusieurs colonnes. Utile pour les adresses, descriptions, et textareas."
					code={examples[1].code}
					highlightedCode={html("span")}
				>
					<SpanDemo />
				</DocExampleClient>

				<DocExampleClient title="2 colonnes" description="Utiliser columns={2} pour les fiches avec moins de champs ou les layouts compacts." code={examples[2].code} highlightedCode={html("cols2")}>
					<Cols2Demo />
				</DocExampleClient>

				<DocExampleClient
					title="Formulaire avec FormField"
					description="FieldGrid accueille aussi des FormField. La prop span fonctionne identiquement pour les inputs."
					code={examples[3].code}
					highlightedCode={html("form")}
				>
					<FormDemo />
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable groups={propGroups} />
			</DocSection>

			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Form Field",
							href: "/docs/components/patterns/form-field",
							description: "Input de formulaire connecté à react-hook-form. S'utilise dans un FieldGrid.",
						},
						{
							title: "Form Section",
							href: "/docs/components/patterns/form-section",
							description: "Wrapper de section collapsible qui contient un FieldGrid.",
						},
						{
							title: "Field",
							href: "/docs/components/ui/field",
							description: "Primitive bas niveau pour composer un champ sans FieldGrid.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
