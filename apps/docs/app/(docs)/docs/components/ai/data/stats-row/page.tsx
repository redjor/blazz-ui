"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { StatsRow } from "@blazz/ui/components/ai/generative/data/stats-row"

const toc = [{ id: "examples", title: "Examples" }]

export default function StatsRowPage() {
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
				<DocExample
					title="With Trends"
					description="Each metric can have an optional trend indicator."
					code={`<StatsRow
  items={[
    { label: "Contacts", value: "1,204", trend: 4.3 },
    { label: "Deals Open", value: "39" },
    { label: "Revenue", value: "$284K", trend: 12.1 },
    { label: "Win Rate", value: "34%", trend: -2.5 },
  ]}
/>`}
				>
					<StatsRow
						items={[
							{ label: "Contacts", value: "1,204", trend: 4.3 },
							{ label: "Deals Open", value: "39" },
							{ label: "Revenue", value: "$284K", trend: 12.1 },
							{ label: "Win Rate", value: "34%", trend: -2.5 },
						]}
					/>
				</DocExample>

				<DocExample
					title="Two Metrics"
					description="Works with as few as two items."
					code={`<StatsRow
  items={[
    { label: "Open", value: "12" },
    { label: "Closed", value: "84" },
  ]}
/>`}
				>
					<div className="max-w-xs">
						<StatsRow
							items={[
								{ label: "Open", value: "12" },
								{ label: "Closed", value: "84" },
							]}
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
