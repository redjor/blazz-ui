import { ProgressCard } from "@blazz/pro/components/ai/generative/data/progress-card"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
const examples = [
	{
		key: "target",
		code: `<ProgressCard
  label="Q4 Revenue Target"
  value={78}
  description="$1.24M of $1.6M target reached"
/>`,
	},
	{
		key: "pipeline",
		code: `<div className="space-y-3">
  <ProgressCard label="Prospecting" value={100} />
  <ProgressCard label="Qualification" value={65} />
  <ProgressCard label="Proposal" value={30} />
  <ProgressCard label="Negotiation" value={10} />
</div>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default async function ProgressCardPage() {
	const highlighted = await highlightedPromise
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

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
				<DocExampleClient
					title="Target Progress"
					description="A labeled progress bar with description."
					code={examples[0].code}
					highlightedCode={html("target")}
				>
					<div className="max-w-sm">
						<ProgressCard
							label="Q4 Revenue Target"
							value={78}
							description="$1.24M of $1.6M target reached"
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Pipeline Stages"
					description="Stack several progress cards for pipeline or milestone views."
					code={examples[1].code}
					highlightedCode={html("pipeline")}
				>
					<div className="max-w-sm space-y-3">
						<ProgressCard label="Prospecting" value={100} />
						<ProgressCard label="Qualification" value={65} />
						<ProgressCard label="Proposal" value={30} />
						<ProgressCard label="Negotiation" value={10} />
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
