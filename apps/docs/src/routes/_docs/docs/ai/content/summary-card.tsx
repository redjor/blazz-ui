import { createFileRoute } from "@tanstack/react-router"
import { SummaryCard } from "@blazz/ui/components/ai/generative/content/summary-card"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "meeting",
		code: `<SummaryCard
  title="Q4 Sales Meeting Summary"
  points={[
    "Revenue target exceeded by 12%",
    "Three new enterprise accounts closed",
    "Pipeline for Q1 is 35% above last year",
  ]}
  conclusion="Strong quarter. Focus Q1 on mid-market."
  source="Meeting transcript"
/>`,
	},
	{
		key: "simple",
		code: `<SummaryCard
  title="Key Takeaways"
  points={[
    "API response time improved by 40%",
    "Zero critical bugs in production",
    "User satisfaction score: 4.8/5",
  ]}
/>`,
	},
] as const

export const Route = createFileRoute(
	"/_docs/docs/ai/content/summary-card"
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
	component: SummaryCardPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function SummaryCardPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Summary Card"
			subtitle="A structured text summary with bullet points and conclusion."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<SummaryCard
						title="Q4 Sales Meeting Summary"
						points={[
							"Revenue target exceeded by 12% ($2.4M vs $2.1M goal)",
							"Three new enterprise accounts closed (Acme, TechStart, GlobalCo)",
							"Pipeline for Q1 is 35% above same period last year",
							"Customer retention rate improved to 94%",
						]}
						conclusion="Strong quarter overall. Focus Q1 efforts on mid-market expansion and reducing sales cycle length."
						source="Meeting transcript — Dec 15, 2025"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Meeting Summary"
					description="Summary of a meeting with key points and conclusion."
					code={examples[0].code}
					highlightedCode={html("meeting")}
				>
					<div className="max-w-sm">
						<SummaryCard
							title="Q4 Sales Meeting Summary"
							points={[
								"Revenue target exceeded by 12%",
								"Three new enterprise accounts closed",
								"Pipeline for Q1 is 35% above last year",
							]}
							conclusion="Strong quarter. Focus Q1 on mid-market expansion."
							source="Meeting transcript"
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Simple Summary"
					description="Bullet points without conclusion."
					code={examples[1].code}
					highlightedCode={html("simple")}
				>
					<div className="max-w-sm">
						<SummaryCard
							title="Key Takeaways"
							points={[
								"API response time improved by 40%",
								"Zero critical bugs in production",
								"User satisfaction score: 4.8/5",
							]}
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
