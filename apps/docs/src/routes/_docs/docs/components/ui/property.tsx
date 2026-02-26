import { createFileRoute } from "@tanstack/react-router"
import { Property } from "@blazz/ui/components/ui/property"
import { Badge } from "@blazz/ui/components/ui/badge"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocPropsTable, type DocProp } from "~/components/docs/doc-props-table"
import { highlightCode } from "~/lib/highlight.server"

const toc = [
	{ id: "examples", title: "Examples" },
	{ id: "props", title: "Props" },
	{ id: "guidelines", title: "Guidelines" },
]

const propertyProps: DocProp[] = [
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

const examples = [
	{
		key: "basic",
		code: `<Property label="Secteur">Technologie</Property>
<Property label="Taille">250 employés</Property>
<Property label="Localisation">Paris, France</Property>`,
	},
	{
		key: "badges",
		code: `<Property label="Statut">
  <Badge variant="success">Actif</Badge>
</Property>
<Property label="Priorité">
  <Badge variant="critical">Haute</Badge>
</Property>
<Property label="Plan">
  <Badge variant="default">Pro</Badge>
</Property>`,
	},
	{
		key: "links",
		code: `<Property label="Email">
  <a href="#" className="text-brand hover:underline">contact@acme.com</a>
</Property>
<Property label="Site web">
  <a href="#" className="text-brand hover:underline">acme.com</a>
</Property>`,
	},
	{
		key: "detail-card",
		code: `<div className="grid grid-cols-2 gap-x-10 gap-y-4">
  <Property label="Entreprise">Acme Corp</Property>
  <Property label="Secteur">Technologie</Property>
  <Property label="Chiffre d'affaires">12.5M €</Property>
  <Property label="Employés">250</Property>
  <Property label="Localisation">Paris, France</Property>
  <Property label="Statut">
    <Badge variant="success">Client actif</Badge>
  </Property>
</div>`,
	},
	{
		key: "fallback",
		code: `<Property label="Téléphone">—</Property>
<Property label="Notes">
  <span className="text-fg-subtle italic">Aucune note</span>
</Property>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ui/property")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			})),
		)
		return { highlighted }
	},
	component: PropertyPage,
})

function PropertyPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Property"
			subtitle="Display a label-value pair for showing entity details, metadata, or read-only fields."
			toc={toc}
		>
			<DocHero>
				<div className="flex gap-10">
					<Property label="Entreprise">Acme Corp</Property>
					<Property label="Statut">
						<Badge variant="success">Actif</Badge>
					</Property>
					<Property label="Secteur">Technologie</Property>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Basic"
					description="A simple label and text value."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<div className="flex gap-10">
						<Property label="Secteur">Technologie</Property>
						<Property label="Taille">250 employés</Property>
						<Property label="Localisation">Paris, France</Property>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="With Badges"
					description="Combine with Badge for status or category values."
					code={examples[1].code}
					highlightedCode={html("badges")}
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
				</DocExampleClient>

				<DocExampleClient
					title="With Links"
					description="Use links for clickable values like emails or websites."
					code={examples[2].code}
					highlightedCode={html("links")}
				>
					<div className="flex gap-10">
						<Property label="Email">
							<a href="#" className="text-sm font-semibold text-brand hover:underline">contact@acme.com</a>
						</Property>
						<Property label="Site web">
							<a href="#" className="text-sm font-semibold text-brand hover:underline">acme.com</a>
						</Property>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Company Detail Card"
					description="Real-world layout for an entity detail view."
					code={examples[3].code}
					highlightedCode={html("detail-card")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Empty & Fallback"
					description="Handle missing data gracefully."
					code={examples[4].code}
					highlightedCode={html("fallback")}
				>
					<div className="flex gap-10">
						<Property label="Téléphone">—</Property>
						<Property label="Notes">
							<span className="text-sm text-fg-subtle italic">Aucune note</span>
						</Property>
					</div>
				</DocExampleClient>
			</DocSection>

			<DocSection id="props" title="Props">
				<DocPropsTable props={propertyProps} />
			</DocSection>

			<DocSection id="guidelines" title="Guidelines">
				<ul className="list-inside list-disc space-y-2 text-sm text-fg-muted">
					<li>Keep labels short and consistent across the page</li>
					<li>Use a grid layout for structured detail views</li>
					<li>Show a dash or placeholder for empty values instead of hiding the field</li>
					<li>Pair with Badge for status values, links for emails/URLs</li>
				</ul>
			</DocSection>
		</DocPage>
	)
}
