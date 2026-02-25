"use client"

import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocHero } from "@/components/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/docs/doc-example-client"
import { ComparisonTable } from "@blazz/ui/components/ai/generative/data/comparison-table"

const toc = [{ id: "examples", title: "Examples" }]

export default function ComparisonTablePage() {
	return (
		<DocPage
			title="Comparison Table"
			subtitle="A compact table for side-by-side data comparisons."
			toc={toc}
		>
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
				<DocExample
					title="Plan Comparison"
					description="A lightweight table for side-by-side comparison data."
					code={`<ComparisonTable
  title="Plan Comparison"
  columns={["Feature", "Starter", "Pro", "Enterprise"]}
  rows={[
    ["Users", "5", "25", "Unlimited"],
    ["Storage", "10 GB", "100 GB", "1 TB"],
    ["Support", "Email", "Priority", "Dedicated"],
  ]}
/>`}
				>
					<ComparisonTable
						title="Plan Comparison"
						columns={["Feature", "Starter", "Pro", "Enterprise"]}
						rows={[
							["Users", "5", "25", "Unlimited"],
							["Storage", "10 GB", "100 GB", "1 TB"],
							["Support", "Email", "Priority", "Dedicated"],
						]}
					/>
				</DocExample>

				<DocExample
					title="Without Title"
					description="The title is optional — the table renders standalone."
					code={`<ComparisonTable
  columns={["Metric", "Q3", "Q4"]}
  rows={[
    ["Revenue", "$980K", "$1.24M"],
    ["Deals", "41", "47"],
    ["Win Rate", "29%", "34%"],
  ]}
/>`}
				>
					<ComparisonTable
						columns={["Metric", "Q3", "Q4"]}
						rows={[
							["Revenue", "$980K", "$1.24M"],
							["Deals", "41", "47"],
							["Win Rate", "29%", "34%"],
						]}
					/>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
