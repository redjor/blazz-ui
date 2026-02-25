"use client"

import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocHero } from "@/components/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/docs/doc-example-client"
import { InsightCard } from "@blazz/ui/components/ai/generative/content/insight-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function InsightCardPage() {
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
				<DocExample
					title="Recommendation"
					description="AI-generated recommendation."
					code={`<InsightCard
  title="Optimize Email Timing"
  description="Emails sent between 10-11 AM get 32% higher open rates."
  type="recommendation"
  confidence={92}
  source="Email analytics"
/>`}
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
				</DocExample>

				<DocExample
					title="Warning"
					description="AI-detected risk."
					code={`<InsightCard
  title="Churn Risk: TechStart Inc."
  description="Support tickets increased 3x and login frequency dropped 60%."
  type="warning"
  confidence={78}
/>`}
				>
					<div className="max-w-sm">
						<InsightCard
							title="Churn Risk: TechStart Inc."
							description="Support tickets increased 3x this month and login frequency dropped by 60% compared to last quarter."
							type="warning"
							confidence={78}
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
