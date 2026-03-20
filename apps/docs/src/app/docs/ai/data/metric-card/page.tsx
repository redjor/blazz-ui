"use client"

import { use } from "react"
import { MetricCard } from "@blazz/pro/components/ai/generative/data/metric-card"
import { DollarSign, Users } from "lucide-react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
const examples = [
	{
		key: "with-icon-trend",
		code: `<MetricCard
  label="Revenue"
  value="$1.24M"
  trend={12.3}
  trendLabel="vs last quarter"
  icon={<DollarSign className="size-4" />}
/>`,
	},
	{
		key: "negative-trend",
		code: `<MetricCard
  label="Churn Rate"
  value="4.8%"
  trend={-1.2}
  trendLabel="vs last month"
/>`,
	},
	{
		key: "minimal",
		code: `<MetricCard label="Total Contacts" value="1,204" />`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default function MetricCardPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Metric Card"
			subtitle="A single KPI with label, formatted value, and optional trend indicator."
			toc={toc}
		>
			<DocHero>
				<div className="grid w-full max-w-md gap-3 sm:grid-cols-2">
					<MetricCard
						label="Revenue"
						value="$1.24M"
						trend={12.3}
						trendLabel="vs Q3"
						icon={<DollarSign className="size-4" />}
					/>
					<MetricCard
						label="Active Users"
						value="8,429"
						trend={-2.1}
						trendLabel="vs Q3"
						icon={<Users className="size-4" />}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="With Icon & Trend"
					description="Full metric card with icon, value, trend arrow and contextual label."
					code={examples[0].code}
					highlightedCode={html("with-icon-trend")}
				>
					<div className="max-w-xs">
						<MetricCard
							label="Revenue"
							value="$1.24M"
							trend={12.3}
							trendLabel="vs last quarter"
							icon={<DollarSign className="size-4" />}
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Negative Trend"
					description="Trend arrow and color flip when the value is negative."
					code={examples[1].code}
					highlightedCode={html("negative-trend")}
				>
					<div className="max-w-xs">
						<MetricCard label="Churn Rate" value="4.8%" trend={-1.2} trendLabel="vs last month" />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Minimal"
					description="Just a label and value, no trend or icon."
					code={examples[2].code}
					highlightedCode={html("minimal")}
				>
					<div className="max-w-xs">
						<MetricCard label="Total Contacts" value="1,204" />
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
