import { LocationCard } from "@blazz/pro/components/ai/generative/content/location-card"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
const examples = [
	{
		key: "with-coordinates",
		code: `<LocationCard
  name="Acme Corporation HQ"
  address="123 Innovation Drive, Suite 400"
  city="San Francisco"
  country="United States"
  coordinates={{ lat: 37.7749, lng: -122.4194 }}
/>`,
	},
	{
		key: "simple",
		code: `<LocationCard
  address="45 rue du Faubourg Saint-Honoré"
  city="Paris"
  country="France"
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default async function LocationCardPage() {
	const highlighted = await highlightedPromise
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Location Card"
			subtitle="Display a formatted address with a Google Maps link."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<LocationCard
						name="Acme Corporation HQ"
						address="123 Innovation Drive, Suite 400"
						city="San Francisco"
						country="United States"
						coordinates={{ lat: 37.7749, lng: -122.4194 }}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="With Coordinates"
					description="Address with precise map coordinates."
					code={examples[0].code}
					highlightedCode={html("with-coordinates")}
				>
					<div className="max-w-sm">
						<LocationCard
							name="Acme Corporation HQ"
							address="123 Innovation Drive, Suite 400"
							city="San Francisco"
							country="United States"
							coordinates={{ lat: 37.7749, lng: -122.4194 }}
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Simple Address"
					description="Address without a name or coordinates."
					code={examples[1].code}
					highlightedCode={html("simple")}
				>
					<div className="max-w-sm">
						<LocationCard address="45 rue du Faubourg Saint-Honoré" city="Paris" country="France" />
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
