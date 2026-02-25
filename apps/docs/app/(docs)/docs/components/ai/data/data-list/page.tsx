"use client"

import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocHero } from "@/components/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/docs/doc-example-client"
import { DataList } from "@blazz/ui/components/ai/generative/data/data-list"

const toc = [{ id: "examples", title: "Examples" }]

export default function DataListPage() {
	return (
		<DocPage
			title="Data List"
			subtitle="A vertical key-value list with optional badges."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<DataList
						title="Deal Summary"
						items={[
							{ label: "Company", value: "Acme Corp" },
							{ label: "Amount", value: "$48,000" },
							{
								label: "Stage",
								value: "Negotiation",
								badge: { text: "Active", variant: "success" },
							},
							{ label: "Close Date", value: "Mar 15, 2026" },
							{
								label: "Probability",
								value: "75%",
								badge: { text: "High", variant: "warning" },
							},
						]}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="With Badges"
					description="Vertical list of labeled values with optional status badges."
					code={`<DataList
  title="Deal Summary"
  items={[
    { label: "Company", value: "Acme Corp" },
    { label: "Amount", value: "$48,000" },
    { label: "Stage", value: "Negotiation", badge: { text: "Active", variant: "success" } },
    { label: "Close Date", value: "Mar 15, 2026" },
    { label: "Probability", value: "75%", badge: { text: "High", variant: "warning" } },
  ]}
/>`}
				>
					<div className="max-w-sm">
						<DataList
							title="Deal Summary"
							items={[
								{ label: "Company", value: "Acme Corp" },
								{ label: "Amount", value: "$48,000" },
								{
									label: "Stage",
									value: "Negotiation",
									badge: { text: "Active", variant: "success" },
								},
								{ label: "Close Date", value: "Mar 15, 2026" },
								{
									label: "Probability",
									value: "75%",
									badge: { text: "High", variant: "warning" },
								},
							]}
						/>
					</div>
				</DocExample>

				<DocExample
					title="Simple List"
					description="Plain key-value pairs without badges."
					code={`<DataList
  title="Contact Info"
  items={[
    { label: "Name", value: "Sarah Connor" },
    { label: "Email", value: "sarah@skynet.com" },
    { label: "Phone", value: "+1 555-0199" },
    { label: "Location", value: "Los Angeles, CA" },
  ]}
/>`}
				>
					<div className="max-w-sm">
						<DataList
							title="Contact Info"
							items={[
								{ label: "Name", value: "Sarah Connor" },
								{ label: "Email", value: "sarah@skynet.com" },
								{ label: "Phone", value: "+1 555-0199" },
								{ label: "Location", value: "Los Angeles, CA" },
							]}
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
