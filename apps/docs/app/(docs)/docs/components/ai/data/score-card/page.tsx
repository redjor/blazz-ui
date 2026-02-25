"use client"

import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocHero } from "@/components/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/docs/doc-example-client"
import { ScoreCard } from "@blazz/ui/components/ai/generative/data/score-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function ScoreCardPage() {
	return (
		<DocPage
			title="Score Card"
			subtitle="A circular score gauge with optional breakdown bars."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<ScoreCard
						title="Lead Quality Score"
						score={78}
						label="Good"
						breakdown={[
							{ label: "Engagement", value: 85, maxValue: 100 },
							{ label: "Fit", value: 72, maxValue: 100 },
							{ label: "Budget", value: 65, maxValue: 100 },
							{ label: "Timeline", value: 90, maxValue: 100 },
						]}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="With Breakdown"
					description="Score with detailed breakdown bars."
					code={`<ScoreCard
  title="Lead Quality Score"
  score={78}
  label="Good"
  breakdown={[
    { label: "Engagement", value: 85, maxValue: 100 },
    { label: "Fit", value: 72, maxValue: 100 },
    { label: "Budget", value: 65, maxValue: 100 },
  ]}
/>`}
				>
					<div className="max-w-sm">
						<ScoreCard
							title="Lead Quality Score"
							score={78}
							label="Good"
							breakdown={[
								{ label: "Engagement", value: 85, maxValue: 100 },
								{ label: "Fit", value: 72, maxValue: 100 },
								{ label: "Budget", value: 65, maxValue: 100 },
							]}
						/>
					</div>
				</DocExample>

				<DocExample
					title="Simple Score"
					description="Just a circular score without breakdown."
					code={`<ScoreCard
  title="Performance"
  score={42}
  maxScore={100}
  label="Needs work"
/>`}
				>
					<div className="max-w-xs">
						<ScoreCard
							title="Performance"
							score={42}
							maxScore={100}
							label="Needs work"
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
