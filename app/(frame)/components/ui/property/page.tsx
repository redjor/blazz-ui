"use client"

import { Page } from "@/components/ui/page"
import { Property } from "@/components/ui/property"
import { Badge } from "@/components/ui/badge"
import { ComponentExample } from "@/components/features/docs/component-example"
import { PropsTable, type PropDefinition } from "@/components/features/docs/props-table"
import { Building2, Globe, Mail, Phone, Calendar, MapPin, DollarSign } from "lucide-react"

const propertyProps: PropDefinition[] = [
	{
		name: "label",
		type: "string",
		description: "The label displayed above the value.",
	},
	{
		name: "children",
		type: "React.ReactNode",
		description: "The value content. Can be text, badges, links, or any React node.",
	},
	{
		name: "className",
		type: "string",
		description: "Additional CSS classes for the wrapper.",
	},
]

export default function PropertyPage() {
	return (
		<Page
			title="Property"
			subtitle="Display a label-value pair for showing entity details, metadata, or read-only fields."
		>
			<div className="space-y-10">
				<section className="space-y-6">
					<h2 className="text-lg font-semibold">Examples</h2>

					<ComponentExample
						title="Basic"
						description="A simple label and text value."
						code={`<Property label="Secteur">Technologie</Property>
<Property label="Taille">250 employés</Property>
<Property label="Localisation">Paris, France</Property>`}
					>
						<div className="flex gap-10">
							<Property label="Secteur">Technologie</Property>
							<Property label="Taille">250 employés</Property>
							<Property label="Localisation">Paris, France</Property>
						</div>
					</ComponentExample>

					<ComponentExample
						title="With Badges"
						description="Combine with Badge for status or category values."
						code={`<Property label="Statut">
  <Badge variant="success">Actif</Badge>
</Property>
<Property label="Priorité">
  <Badge variant="critical">Haute</Badge>
</Property>
<Property label="Plan">
  <Badge variant="default">Pro</Badge>
</Property>`}
					>
						<div className="flex gap-10">
							<Property label="Statut">
								<Badge variant="success">Actif</Badge>
							</Property>
							<Property label="Priorité">
								<Badge variant="critical">Haute</Badge>
							</Property>
							<Property label="Plan">
								<Badge variant="default">Pro</Badge>
							</Property>
						</div>
					</ComponentExample>

					<ComponentExample
						title="With Links"
						description="Use links for clickable values like emails or websites."
						code={`<Property label="Email">
  <a href="#" className="text-brand hover:underline">contact@acme.com</a>
</Property>
<Property label="Site web">
  <a href="#" className="text-brand hover:underline">acme.com</a>
</Property>`}
					>
						<div className="flex gap-10">
							<Property label="Email">
								<a href="#" className="text-sm font-semibold text-brand hover:underline">contact@acme.com</a>
							</Property>
							<Property label="Site web">
								<a href="#" className="text-sm font-semibold text-brand hover:underline">acme.com</a>
							</Property>
						</div>
					</ComponentExample>

					<ComponentExample
						title="Company Detail Card"
						description="Real-world layout for an entity detail view."
						code={`<div className="grid grid-cols-2 gap-x-10 gap-y-4">
  <Property label="Entreprise">Acme Corp</Property>
  <Property label="Secteur">Technologie</Property>
  <Property label="Chiffre d'affaires">12.5M €</Property>
  <Property label="Employés">250</Property>
  <Property label="Localisation">Paris, France</Property>
  <Property label="Statut">
    <Badge variant="success">Client actif</Badge>
  </Property>
</div>`}
					>
						<div className="grid grid-cols-2 gap-x-10 gap-y-4 sm:grid-cols-3">
							<Property label="Entreprise">Acme Corp</Property>
							<Property label="Secteur">Technologie</Property>
							<Property label="Chiffre d'affaires">12.5M €</Property>
							<Property label="Employés">250</Property>
							<Property label="Localisation">Paris, France</Property>
							<Property label="Statut">
								<Badge variant="success">Client actif</Badge>
							</Property>
						</div>
					</ComponentExample>

					<ComponentExample
						title="Empty & Fallback"
						description="Handle missing data gracefully."
						code={`<Property label="Téléphone">—</Property>
<Property label="Notes">
  <span className="text-fg-subtle italic">Aucune note</span>
</Property>`}
					>
						<div className="flex gap-10">
							<Property label="Téléphone">—</Property>
							<Property label="Notes">
								<span className="text-sm text-fg-subtle italic">Aucune note</span>
							</Property>
						</div>
					</ComponentExample>
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Props</h2>
					<PropsTable props={propertyProps} />
				</section>

				<section className="space-y-4">
					<h2 className="text-lg font-semibold">Best Practices</h2>
					<ul className="list-inside list-disc space-y-2 text-sm text-muted-foreground">
						<li>Keep labels short and consistent across the page</li>
						<li>Use a grid layout for structured detail views</li>
						<li>Show a dash or placeholder for empty values instead of hiding the field</li>
						<li>Pair with Badge for status values, links for emails/URLs</li>
					</ul>
				</section>
			</div>
		</Page>
	)
}
