import { createFileRoute } from "@tanstack/react-router"
import { PropertyCard } from "@blazz/ui/components/blocks/property-card"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { Edit } from "lucide-react"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import {
	DocPropsTable,
	type DocProp,
} from "~/components/docs/doc-props-table"
import { DocRelated } from "~/components/docs/doc-related"
import { highlightCode } from "~/lib/highlight-code"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "property-card-props", title: "PropertyCard Props" },
	{ id: "property-card-item-props", title: "PropertyCard.Item Props" },
	{ id: "best-practices", title: "Best Practices" },
	{ id: "related", title: "Related" },
]

const propertyCardProps: DocProp[] = [
	{
		name: "title",
		type: "string",
		description: "Section title displayed in the card header.",
	},
	{
		name: "description",
		type: "string",
		description: "Optional description below the title.",
	},
	{
		name: "columns",
		type: "1 | 2 | 3 | 4",
		default: "3",
		description: "Number of grid columns (responsive).",
	},
	{
		name: "actions",
		type: "React.ReactNode",
		description: "Slot for action buttons in the top-right corner.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "PropertyCard.Item elements.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional classes for the card.",
	},
]

const propertyCardItemProps: DocProp[] = [
	{
		name: "label",
		type: "string",
		description: "Label displayed above the value.",
	},
	{
		name: "value",
		type: "React.ReactNode",
		description: 'Value content. Shows "—" when undefined/null.',
	},
	{
		name: "span",
		type: "number",
		description: "Number of grid columns to span.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional classes.",
	},
]

const examples = [
	{
		key: "basic",
		code: `<PropertyCard title="Informations générales" columns={3}>
  <PropertyCard.Item label="Entreprise" value="Acme Corporation" />
  <PropertyCard.Item label="Secteur" value="Technologie" />
  <PropertyCard.Item label="CA" value="€12.5M" />
  <PropertyCard.Item label="Employés" value="250" />
  <PropertyCard.Item label="Statut" value={<Badge variant="success">Actif</Badge>} />
  <PropertyCard.Item label="Localisation" value="Paris, France" />
</PropertyCard>`,
	},
	{
		key: "with-actions",
		code: `<PropertyCard
  title="Contact principal"
  columns={2}
  actions={<Button variant="outline" size="sm"><Edit /> Modifier</Button>}
>
  <PropertyCard.Item label="Nom" value="Jean Dupont" />
  <PropertyCard.Item label="Email" value="jean@acme.com" />
  <PropertyCard.Item label="Téléphone" value="+33 1 23 45 67 89" />
  <PropertyCard.Item label="Poste" value="Directeur Commercial" />
</PropertyCard>`,
	},
	{
		key: "with-description",
		code: `<PropertyCard
  title="Adresse"
  description="Adresse de facturation principale"
  columns={2}
>
  <PropertyCard.Item label="Rue" value="123 Avenue des Champs-Élysées" span={2} />
  <PropertyCard.Item label="Ville" value="Paris" />
  <PropertyCard.Item label="Pays" value="France" />
</PropertyCard>`,
	},
	{
		key: "missing",
		code: `<PropertyCard title="Métadonnées" columns={3}>
  <PropertyCard.Item label="Assigné à" value="Marie Martin" />
  <PropertyCard.Item label="Source" />
  <PropertyCard.Item label="Notes" />
</PropertyCard>`,
	},
	{
		key: "stacked",
		code: `<div className="space-y-6">
  <PropertyCard title="Informations" columns={3}>
    <PropertyCard.Item label="Entreprise" value="Acme Corp" />
    <PropertyCard.Item label="Secteur" value="Tech" />
    <PropertyCard.Item label="Statut" value={<Badge variant="success">Actif</Badge>} />
  </PropertyCard>
  <PropertyCard title="Adresse" columns={2}>
    <PropertyCard.Item label="Ville" value="Paris" />
    <PropertyCard.Item label="Pays" value="France" />
  </PropertyCard>
</div>`,
	},
] as const

export const Route = createFileRoute(
	"/_docs/docs/components/blocks/property-card",
)({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			})),
		)
		return { highlighted }
	},
	component: PropertyCardPage,
})

function PropertyCardPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="PropertyCard"
			subtitle="A card with a titled section of key-value properties, designed for entity detail pages."
			toc={toc}
		>
			{/* Hero */}
			<DocHero>
				<div className="w-full max-w-2xl">
					<PropertyCard title="Informations générales" columns={3}>
						<PropertyCard.Item label="Entreprise" value="Acme Corporation" />
						<PropertyCard.Item label="Secteur" value="Technologie" />
						<PropertyCard.Item label="Chiffre d'affaires" value="€12.5M" />
						<PropertyCard.Item label="Employés" value="250" />
						<PropertyCard.Item label="Statut" value={<Badge variant="success">Actif</Badge>} />
						<PropertyCard.Item label="Localisation" value="Paris, France" />
					</PropertyCard>
				</div>
			</DocHero>

			{/* Examples */}
			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic"
					description="A simple card with a title and a grid of properties."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<div className="max-w-2xl">
						<PropertyCard title="Informations générales" columns={3}>
							<PropertyCard.Item label="Entreprise" value="Acme Corporation" />
							<PropertyCard.Item label="Secteur" value="Technologie" />
							<PropertyCard.Item label="CA" value="€12.5M" />
							<PropertyCard.Item label="Employés" value="250" />
							<PropertyCard.Item label="Statut" value={<Badge variant="success">Actif</Badge>} />
							<PropertyCard.Item label="Localisation" value="Paris, France" />
						</PropertyCard>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="With Actions"
					description="Pass an actions slot to show buttons in the card header."
					code={examples[1].code}
					highlightedCode={html("with-actions")}
				>
					<div className="max-w-2xl">
						<PropertyCard
							title="Contact principal"
							columns={2}
							actions={
								<Button variant="outline" size="sm">
									<Edit className="size-4" data-icon="inline-start" />
									Modifier
								</Button>
							}
						>
							<PropertyCard.Item label="Nom" value="Jean Dupont" />
							<PropertyCard.Item label="Email" value="jean@acme.com" />
							<PropertyCard.Item label="Téléphone" value="+33 1 23 45 67 89" />
							<PropertyCard.Item label="Poste" value="Directeur Commercial" />
						</PropertyCard>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="With Description"
					description="Add a subtitle below the card title for extra context."
					code={examples[2].code}
					highlightedCode={html("with-description")}
				>
					<div className="max-w-2xl">
						<PropertyCard
							title="Adresse"
							description="Adresse de facturation principale"
							columns={2}
						>
							<PropertyCard.Item label="Rue" value="123 Avenue des Champs-Élysées" span={2} />
							<PropertyCard.Item label="Ville" value="Paris" />
							<PropertyCard.Item label="Pays" value="France" />
						</PropertyCard>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Missing Values"
					description='When value is undefined or null, an em dash "—" is displayed automatically.'
					code={examples[3].code}
					highlightedCode={html("missing")}
				>
					<div className="max-w-2xl">
						<PropertyCard title="Métadonnées" columns={3}>
							<PropertyCard.Item label="Assigné à" value="Marie Martin" />
							<PropertyCard.Item label="Source" />
							<PropertyCard.Item label="Notes" />
						</PropertyCard>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Stacked Sections"
					description="Stack multiple PropertyCards for a complete detail view."
					code={examples[4].code}
					highlightedCode={html("stacked")}
				>
					<div className="max-w-2xl space-y-6">
						<PropertyCard title="Informations" columns={3}>
							<PropertyCard.Item label="Entreprise" value="Acme Corp" />
							<PropertyCard.Item label="Secteur" value="Tech" />
							<PropertyCard.Item label="Statut" value={<Badge variant="success">Actif</Badge>} />
						</PropertyCard>
						<PropertyCard title="Adresse" columns={2}>
							<PropertyCard.Item label="Ville" value="Paris" />
							<PropertyCard.Item label="Pays" value="France" />
						</PropertyCard>
					</div>
				</DocExampleClient>
			</DocSection>

			{/* PropertyCard Props */}
			<DocSection id="property-card-props" title="PropertyCard Props">
				<DocPropsTable props={propertyCardProps} />
			</DocSection>

			{/* PropertyCard.Item Props */}
			<DocSection id="property-card-item-props" title="PropertyCard.Item Props">
				<DocPropsTable props={propertyCardItemProps} />
			</DocSection>

			{/* Best Practices */}
			<DocSection id="best-practices" title="Best Practices">
				<ul className="list-disc list-inside space-y-2 text-fg-muted">
					<li>Use 2 columns for fewer than 8 fields, 3 columns for 8-15 fields</li>
					<li>Use <code className="text-xs">span</code> for long values like addresses or descriptions</li>
					<li>Stack multiple PropertyCards with <code className="text-xs">space-y-6</code> for detail pages</li>
					<li>Pair with Badge for status values, links for emails/URLs</li>
					<li>Never leave a field empty — omit the Item or show "—"</li>
				</ul>
			</DocSection>

			{/* Related */}
			<DocSection id="related" title="Related">
				<DocRelated
					items={[
						{
							title: "Property",
							href: "/docs/components/ui/property",
							description: "Standalone label-value primitive.",
						},
						{
							title: "Badge",
							href: "/docs/components/ui/badge",
							description: "Used for status values.",
						},
					]}
				/>
			</DocSection>
		</DocPage>
	)
}
