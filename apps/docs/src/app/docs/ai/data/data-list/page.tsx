"use client"

import { use } from "react"
import { DataList } from "@blazz/pro/components/ai/generative/data/data-list"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
const examples = [
	{
		key: "with-badges",
		code: `<DataList
  title="Deal Summary"
  items={[
    { label: "Company", value: "Acme Corp" },
    { label: "Amount", value: "$48,000" },
    { label: "Stage", value: "Negotiation", badge: { text: "Active", variant: "success" } },
    { label: "Close Date", value: "Mar 15, 2026" },
    { label: "Probability", value: "75%", badge: { text: "High", variant: "warning" } },
  ]}
/>`,
	},
	{
		key: "simple",
		code: `<DataList
  title="Contact Info"
  items={[
    { label: "Name", value: "Sarah Connor" },
    { label: "Email", value: "sarah@skynet.com" },
    { label: "Phone", value: "+1 555-0199" },
    { label: "Location", value: "Los Angeles, CA" },
  ]}
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default function DataListPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="Data List" subtitle="A vertical key-value list with optional badges." toc={toc}>
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
							{ label: "Probability", value: "75%", badge: { text: "High", variant: "warning" } },
						]}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="With Badges"
					description="Vertical list of labeled values with optional status badges."
					code={examples[0].code}
					highlightedCode={html("with-badges")}
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
								{ label: "Probability", value: "75%", badge: { text: "High", variant: "warning" } },
							]}
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Simple List"
					description="Plain key-value pairs without badges."
					code={examples[1].code}
					highlightedCode={html("simple")}
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
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
