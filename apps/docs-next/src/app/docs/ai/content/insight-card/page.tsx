"use client"

import { use } from "react"
import { InsightCard } from "@blazz/pro/components/ai/generative/content/insight-card"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
const examples = [
	{
		key: "recommendation",
		code: `<InsightCard
  title="Optimize Email Timing"
  description="Emails sent between 10-11 AM get 32% higher open rates."
  type="recommendation"
  confidence={92}
  source="Email analytics"
/>`,
	},
	{
		key: "warning",
		code: `<InsightCard
  title="Churn Risk: TechStart Inc."
  description="Support tickets increased 3x and login frequency dropped 60%."
  type="warning"
  confidence={78}
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default function InsightCardPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Insight Card"
			subtitle="An AI recommendation or finding with confidence level and source."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<InsightCard
						title="Upsell Opportunity Detected"
						description="Acme Corp's usage has grown 45% this quarter. Consider proposing an upgrade to the Enterprise plan during the next quarterly review."
						type="opportunity"
						confidence={87}
						source="Usage analytics"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Recommendation"
					description="AI-generated recommendation."
					code={examples[0].code}
					highlightedCode={html("recommendation")}
				>
					<div className="max-w-sm">
						<InsightCard
							title="Optimize Email Timing"
							description="Emails sent between 10-11 AM get 32% higher open rates for this segment."
							type="recommendation"
							confidence={92}
							source="Email analytics"
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Warning"
					description="AI-detected risk."
					code={examples[1].code}
					highlightedCode={html("warning")}
				>
					<div className="max-w-sm">
						<InsightCard
							title="Churn Risk: TechStart Inc."
							description="Support tickets increased 3x this month and login frequency dropped by 60% compared to last quarter."
							type="warning"
							confidence={78}
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
