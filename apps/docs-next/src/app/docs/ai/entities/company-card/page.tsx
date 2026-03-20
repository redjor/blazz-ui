"use client"

import { use } from "react"
import { CompanyCard } from "@blazz/pro/components/ai/generative/entities/company-card"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
const examples = [
	{
		key: "full",
		code: `<CompanyCard
  name="Acme Corp"
  industry="SaaS · B2B"
  size="250–500 employees"
  revenue="$42M ARR"
  location="San Francisco, CA"
  website="acme.com"
  status="Customer"
  statusVariant="success"
/>`,
	},
	{
		key: "prospect",
		code: `<CompanyCard
  name="Datadog"
  industry="Monitoring"
  location="New York, NY"
  status="Prospect"
  statusVariant="info"
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default function CompanyCardPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Company Card"
			subtitle="Displays a company profile with industry, size, revenue and location."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<CompanyCard
						name="Acme Corp"
						industry="SaaS · B2B"
						size="250–500 employees"
						revenue="$42M ARR"
						location="San Francisco, CA"
						website="acme.com"
						status="Customer"
						statusVariant="success"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Full Profile"
					description="Company card with all fields."
					code={examples[0].code}
					highlightedCode={html("full")}
				>
					<div className="max-w-sm">
						<CompanyCard
							name="Acme Corp"
							industry="SaaS · B2B"
							size="250–500 employees"
							revenue="$42M ARR"
							location="San Francisco, CA"
							website="acme.com"
							status="Customer"
							statusVariant="success"
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Prospect"
					description="Minimal company card for a prospect."
					code={examples[1].code}
					highlightedCode={html("prospect")}
				>
					<div className="max-w-sm">
						<CompanyCard
							name="Datadog"
							industry="Monitoring"
							location="New York, NY"
							status="Prospect"
							statusVariant="info"
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
