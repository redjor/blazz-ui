"use client"

import { use } from "react"
import { StatsRow } from "@blazz/pro/components/ai/generative/data/stats-row"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
const examples = [
	{
		key: "with-trends",
		code: `<StatsRow
  items={[
    { label: "Contacts", value: "1,204", trend: 4.3 },
    { label: "Deals Open", value: "39" },
    { label: "Revenue", value: "$284K", trend: 12.1 },
    { label: "Win Rate", value: "34%", trend: -2.5 },
  ]}
/>`,
	},
	{
		key: "two-metrics",
		code: `<StatsRow
  items={[
    { label: "Open", value: "12" },
    { label: "Closed", value: "84" },
  ]}
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default function StatsRowPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Stats Row"
			subtitle="2-4 KPIs displayed in a compact horizontal row with dividers."
			toc={toc}
		>
			<DocHero>
				<StatsRow
					className="w-full max-w-lg"
					items={[
						{ label: "Deals Won", value: "47", trend: 8.5 },
						{ label: "Avg Deal Size", value: "$26.4K", trend: -3.2 },
						{ label: "Win Rate", value: "34%", trend: 5.1 },
					]}
				/>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="With Trends"
					description="Each metric can have an optional trend indicator."
					code={examples[0].code}
					highlightedCode={html("with-trends")}
				>
					<StatsRow
						items={[
							{ label: "Contacts", value: "1,204", trend: 4.3 },
							{ label: "Deals Open", value: "39" },
							{ label: "Revenue", value: "$284K", trend: 12.1 },
							{ label: "Win Rate", value: "34%", trend: -2.5 },
						]}
					/>
				</DocExampleClient>

				<DocExampleClient
					title="Two Metrics"
					description="Works with as few as two items."
					code={examples[1].code}
					highlightedCode={html("two-metrics")}
				>
					<div className="max-w-xs">
						<StatsRow
							items={[
								{ label: "Open", value: "12" },
								{ label: "Closed", value: "84" },
							]}
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
