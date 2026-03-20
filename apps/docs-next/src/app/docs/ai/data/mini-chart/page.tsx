import { MiniChart } from "@blazz/pro/components/ai/generative/data/mini-chart"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
const examples = [
	{
		key: "sparkline",
		code: `<MiniChart
  label="Weekly Signups"
  data={[3, 7, 4, 9, 6, 11, 8, 14, 12, 16]}
  value="16"
/>`,
	},
	{
		key: "side-by-side",
		code: `<div className="grid grid-cols-2 gap-3">
  <MiniChart label="MRR" data={[10,12,11,15,18,20]} value="$20K" />
  <MiniChart label="Churn" data={[5,4,6,3,4,2]} value="2%" />
</div>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default async function MiniChartPage() {
	const highlighted = await highlightedPromise
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Mini Chart"
			subtitle="A compact sparkline area chart with label and current value."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<MiniChart label="Weekly Signups" data={[3, 7, 4, 9, 6, 11, 8, 14, 12, 16]} value="16" />
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Sparkline"
					description="A compact area chart with label and current value."
					code={examples[0].code}
					highlightedCode={html("sparkline")}
				>
					<div className="max-w-sm">
						<MiniChart
							label="Weekly Signups"
							data={[3, 7, 4, 9, 6, 11, 8, 14, 12, 16]}
							value="16"
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Side by Side"
					description="Multiple sparklines for quick comparison."
					code={examples[1].code}
					highlightedCode={html("side-by-side")}
				>
					<div className="grid grid-cols-2 gap-3">
						<MiniChart label="MRR" data={[10, 12, 11, 15, 18, 20]} value="$20K" />
						<MiniChart label="Churn" data={[5, 4, 6, 3, 4, 2]} value="2%" />
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
