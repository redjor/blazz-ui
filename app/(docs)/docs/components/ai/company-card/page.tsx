"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { CompanyCard } from "@/components/ai/generative/company-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function CompanyCardPage() {
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
				<DocExample
					title="Full Profile"
					description="Company card with all fields."
					code={`<CompanyCard
  name="Acme Corp"
  industry="SaaS · B2B"
  size="250–500 employees"
  revenue="$42M ARR"
  location="San Francisco, CA"
  website="acme.com"
  status="Customer"
  statusVariant="success"
/>`}
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
				</DocExample>

				<DocExample
					title="Prospect"
					description="Minimal company card for a prospect."
					code={`<CompanyCard
  name="Datadog"
  industry="Monitoring"
  location="New York, NY"
  status="Prospect"
  statusVariant="info"
/>`}
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
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
