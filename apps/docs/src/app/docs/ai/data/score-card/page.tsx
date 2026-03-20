"use client"

import { use } from "react"
import { ScoreCard } from "@blazz/pro/components/ai/generative/data/score-card"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
const examples = [
	{
		key: "with-breakdown",
		code: `<ScoreCard
  title="Lead Quality Score"
  score={78}
  label="Good"
  breakdown={[
    { label: "Engagement", value: 85, maxValue: 100 },
    { label: "Fit", value: 72, maxValue: 100 },
    { label: "Budget", value: 65, maxValue: 100 },
  ]}
/>`,
	},
	{
		key: "simple",
		code: `<ScoreCard
  title="Performance"
  score={42}
  maxScore={100}
  label="Needs work"
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default function ScoreCardPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

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
				<DocExampleClient
					title="With Breakdown"
					description="Score with detailed breakdown bars."
					code={examples[0].code}
					highlightedCode={html("with-breakdown")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Simple Score"
					description="Just a circular score without breakdown."
					code={examples[1].code}
					highlightedCode={html("simple")}
				>
					<div className="max-w-xs">
						<ScoreCard title="Performance" score={42} maxScore={100} label="Needs work" />
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
