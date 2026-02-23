"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { LocationCard } from "@/components/ai/generative/location-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function LocationCardPage() {
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
				<DocExample
					title="With Coordinates"
					description="Address with precise map coordinates."
					code={`<LocationCard
  name="Acme Corporation HQ"
  address="123 Innovation Drive, Suite 400"
  city="San Francisco"
  country="United States"
  coordinates={{ lat: 37.7749, lng: -122.4194 }}
/>`}
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
				</DocExample>

				<DocExample
					title="Simple Address"
					description="Address without a name or coordinates."
					code={`<LocationCard
  address="45 rue du Faubourg Saint-Honoré"
  city="Paris"
  country="France"
/>`}
				>
					<div className="max-w-sm">
						<LocationCard
							address="45 rue du Faubourg Saint-Honoré"
							city="Paris"
							country="France"
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
