import { PropertyCard } from "@/components/blocks/property-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExample } from "@/components/features/docs/doc-example"
import {
	DocPropsTable,
	type DocProp,
} from "@/components/features/docs/doc-props-table"
import { DocRelated } from "@/components/features/docs/doc-related"

// ---------------------------------------------------------------------------
// TOC
// ---------------------------------------------------------------------------

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "property-card-props", title: "PropertyCard Props" },
	{ id: "property-card-item-props", title: "PropertyCard.Item Props" },
	{ id: "best-practices", title: "Best Practices" },
	{ id: "related", title: "Related" },
]

// ---------------------------------------------------------------------------
// Props tables
// ---------------------------------------------------------------------------

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
		description: "Value content. Shows \"—\" when undefined/null.",
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

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function PropertyCardPage() {
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
				{/* Basic */}
				<DocExample
					title="Basic"
					description="A simple card with a title and a grid of properties."
					code={`<PropertyCard title="Informations générales" columns={3}>
  <PropertyCard.Item label="Entreprise" value="Acme Corporation" />
  <PropertyCard.Item label="Secteur" value="Technologie" />
  <PropertyCard.Item label="CA" value="€12.5M" />
  <PropertyCard.Item label="Employés" value="250" />
  <PropertyCard.Item label="Statut" value={<Badge variant="success">Actif</Badge>} />
  <PropertyCard.Item label="Localisation" value="Paris, France" />
</PropertyCard>`}
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
				</DocExample>

				{/* With Actions */}
				<DocExample
					title="With Actions"
					description="Pass an actions slot to show buttons in the card header."
					code={`<PropertyCard
  title="Contact principal"
  columns={2}
  actions={<Button variant="outline" size="sm"><Edit /> Modifier</Button>}
>
  <PropertyCard.Item label="Nom" value="Jean Dupont" />
  <PropertyCard.Item label="Email" value="jean@acme.com" />
  <PropertyCard.Item label="Téléphone" value="+33 1 23 45 67 89" />
  <PropertyCard.Item label="Poste" value="Directeur Commercial" />
</PropertyCard>`}
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
				</DocExample>

				{/* With Description */}
				<DocExample
					title="With Description"
					description="Add a subtitle below the card title for extra context."
					code={`<PropertyCard
  title="Adresse"
  description="Adresse de facturation principale"
  columns={2}
>
  <PropertyCard.Item label="Rue" value="123 Avenue des Champs-Élysées" span={2} />
  <PropertyCard.Item label="Ville" value="Paris" />
  <PropertyCard.Item label="Pays" value="France" />
</PropertyCard>`}
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
				</DocExample>

				{/* Missing values */}
				<DocExample
					title="Missing Values"
					description='When value is undefined or null, an em dash "—" is displayed automatically.'
					code={`<PropertyCard title="Métadonnées" columns={3}>
  <PropertyCard.Item label="Assigné à" value="Marie Martin" />
  <PropertyCard.Item label="Source" />
  <PropertyCard.Item label="Notes" />
</PropertyCard>`}
				>
					<div className="max-w-2xl">
						<PropertyCard title="Métadonnées" columns={3}>
							<PropertyCard.Item label="Assigné à" value="Marie Martin" />
							<PropertyCard.Item label="Source" />
							<PropertyCard.Item label="Notes" />
						</PropertyCard>
					</div>
				</DocExample>

				{/* Stacked sections */}
				<DocExample
					title="Stacked Sections"
					description="Stack multiple PropertyCards for a complete detail view."
					code={`<div className="space-y-6">
  <PropertyCard title="Informations" columns={3}>
    <PropertyCard.Item label="Entreprise" value="Acme Corp" />
    <PropertyCard.Item label="Secteur" value="Tech" />
    <PropertyCard.Item label="Statut" value={<Badge variant="success">Actif</Badge>} />
  </PropertyCard>
  <PropertyCard title="Adresse" columns={2}>
    <PropertyCard.Item label="Ville" value="Paris" />
    <PropertyCard.Item label="Pays" value="France" />
  </PropertyCard>
</div>`}
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
				</DocExample>
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
							title: "Card",
							href: "/docs/components/layout/card",
							description: "Underlying card container.",
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
