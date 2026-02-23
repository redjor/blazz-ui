"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { SummaryCard } from "@/components/ai/generative/content/summary-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function SummaryCardPage() {
	return (
		<DocPage
			title="Summary Card"
			subtitle="A structured text summary with bullet points and conclusion."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<SummaryCard
						title="Q4 Sales Meeting Summary"
						points={[
							"Revenue target exceeded by 12% ($2.4M vs $2.1M goal)",
							"Three new enterprise accounts closed (Acme, TechStart, GlobalCo)",
							"Pipeline for Q1 is 35% above same period last year",
							"Customer retention rate improved to 94%",
						]}
						conclusion="Strong quarter overall. Focus Q1 efforts on mid-market expansion and reducing sales cycle length."
						source="Meeting transcript — Dec 15, 2025"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Meeting Summary"
					description="Summary of a meeting with key points and conclusion."
					code={`<SummaryCard
  title="Q4 Sales Meeting Summary"
  points={[
    "Revenue target exceeded by 12%",
    "Three new enterprise accounts closed",
    "Pipeline for Q1 is 35% above last year",
  ]}
  conclusion="Strong quarter. Focus Q1 on mid-market."
  source="Meeting transcript"
/>`}
				>
					<div className="max-w-sm">
						<SummaryCard
							title="Q4 Sales Meeting Summary"
							points={[
								"Revenue target exceeded by 12%",
								"Three new enterprise accounts closed",
								"Pipeline for Q1 is 35% above last year",
							]}
							conclusion="Strong quarter. Focus Q1 on mid-market expansion."
							source="Meeting transcript"
						/>
					</div>
				</DocExample>

				<DocExample
					title="Simple Summary"
					description="Bullet points without conclusion."
					code={`<SummaryCard
  title="Key Takeaways"
  points={[
    "API response time improved by 40%",
    "Zero critical bugs in production",
    "User satisfaction score: 4.8/5",
  ]}
/>`}
				>
					<div className="max-w-sm">
						<SummaryCard
							title="Key Takeaways"
							points={[
								"API response time improved by 40%",
								"Zero critical bugs in production",
								"User satisfaction score: 4.8/5",
							]}
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
