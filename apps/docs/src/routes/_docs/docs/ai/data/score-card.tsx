import { createFileRoute } from "@tanstack/react-router"
import { ScoreCard } from "@blazz/ui/components/ai/generative/data/score-card"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { highlightCode } from "~/lib/highlight-code"

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

export const Route = createFileRoute(
	"/_docs/docs/ai/data/score-card"
)({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: ScoreCardPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function ScoreCardPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

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
						<ScoreCard
							title="Performance"
							score={42}
							maxScore={100}
							label="Needs work"
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
