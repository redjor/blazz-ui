"use client"

import { ComparisonTable } from "@blazz/pro/components/ai/generative/data/comparison-table"
import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const examples = [
	{
		key: "plan-comparison",
		code: `<ComparisonTable
  title="Plan Comparison"
  columns={["Feature", "Starter", "Pro", "Enterprise"]}
  rows={[
    ["Users", "5", "25", "Unlimited"],
    ["Storage", "10 GB", "100 GB", "1 TB"],
    ["Support", "Email", "Priority", "Dedicated"],
  ]}
/>`,
	},
	{
		key: "without-title",
		code: `<ComparisonTable
  columns={["Metric", "Q3", "Q4"]}
  rows={[
    ["Revenue", "$980K", "$1.24M"],
    ["Deals", "41", "47"],
    ["Win Rate", "29%", "34%"],
  ]}
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [{ id: "examples", title: "Examples" }]

export default function ComparisonTablePage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="Comparison Table" subtitle="A compact table for side-by-side data comparisons." toc={toc}>
			<DocHero>
				<ComparisonTable
					title="Plan Comparison"
					columns={["Feature", "Starter", "Pro", "Enterprise"]}
					rows={[
						["Users", "5", "25", "Unlimited"],
						["Storage", "10 GB", "100 GB", "1 TB"],
						["Support", "Email", "Priority", "Dedicated"],
					]}
				/>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient title="Plan Comparison" description="A lightweight table for side-by-side comparison data." code={examples[0].code} highlightedCode={html("plan-comparison")}>
					<ComparisonTable
						title="Plan Comparison"
						columns={["Feature", "Starter", "Pro", "Enterprise"]}
						rows={[
							["Users", "5", "25", "Unlimited"],
							["Storage", "10 GB", "100 GB", "1 TB"],
							["Support", "Email", "Priority", "Dedicated"],
						]}
					/>
				</DocExampleClient>

				<DocExampleClient title="Without Title" description="The title is optional — the table renders standalone." code={examples[1].code} highlightedCode={html("without-title")}>
					<ComparisonTable
						columns={["Metric", "Q3", "Q4"]}
						rows={[
							["Revenue", "$980K", "$1.24M"],
							["Deals", "41", "47"],
							["Win Rate", "29%", "34%"],
						]}
					/>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
