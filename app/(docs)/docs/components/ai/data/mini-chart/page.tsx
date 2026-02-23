"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { MiniChart } from "@/components/ai/generative/data/mini-chart"

const toc = [{ id: "examples", title: "Examples" }]

export default function MiniChartPage() {
	return (
		<DocPage
			title="Mini Chart"
			subtitle="A compact sparkline area chart with label and current value."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<MiniChart
						label="Weekly Signups"
						data={[3, 7, 4, 9, 6, 11, 8, 14, 12, 16]}
						value="16"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Sparkline"
					description="A compact area chart with label and current value."
					code={`<MiniChart
  label="Weekly Signups"
  data={[3, 7, 4, 9, 6, 11, 8, 14, 12, 16]}
  value="16"
/>`}
				>
					<div className="max-w-sm">
						<MiniChart
							label="Weekly Signups"
							data={[3, 7, 4, 9, 6, 11, 8, 14, 12, 16]}
							value="16"
						/>
					</div>
				</DocExample>

				<DocExample
					title="Side by Side"
					description="Multiple sparklines for quick comparison."
					code={`<div className="grid grid-cols-2 gap-3">
  <MiniChart label="MRR" data={[10,12,11,15,18,20]} value="$20K" />
  <MiniChart label="Churn" data={[5,4,6,3,4,2]} value="2%" />
</div>`}
				>
					<div className="grid grid-cols-2 gap-3">
						<MiniChart
							label="MRR"
							data={[10, 12, 11, 15, 18, 20]}
							value="$20K"
						/>
						<MiniChart
							label="Churn"
							data={[5, 4, 6, 3, 4, 2]}
							value="2%"
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
