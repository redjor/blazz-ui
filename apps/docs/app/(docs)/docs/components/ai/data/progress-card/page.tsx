"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { ProgressCard } from "@blazz/ui/components/ai/generative/data/progress-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function ProgressCardPage() {
	return (
		<DocPage
			title="Progress Card"
			subtitle="A labeled progress bar with description text."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<ProgressCard
						label="Q4 Revenue Target"
						value={78}
						description="$1.24M of $1.6M target reached"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Target Progress"
					description="A labeled progress bar with description."
					code={`<ProgressCard
  label="Q4 Revenue Target"
  value={78}
  description="$1.24M of $1.6M target reached"
/>`}
				>
					<div className="max-w-sm">
						<ProgressCard
							label="Q4 Revenue Target"
							value={78}
							description="$1.24M of $1.6M target reached"
						/>
					</div>
				</DocExample>

				<DocExample
					title="Pipeline Stages"
					description="Stack several progress cards for pipeline or milestone views."
					code={`<div className="space-y-3">
  <ProgressCard label="Prospecting" value={100} />
  <ProgressCard label="Qualification" value={65} />
  <ProgressCard label="Proposal" value={30} />
  <ProgressCard label="Negotiation" value={10} />
</div>`}
				>
					<div className="max-w-sm space-y-3">
						<ProgressCard label="Prospecting" value={100} />
						<ProgressCard label="Qualification" value={65} />
						<ProgressCard label="Proposal" value={30} />
						<ProgressCard label="Negotiation" value={10} />
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
