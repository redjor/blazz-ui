import { createFileRoute } from "@tanstack/react-router"
import { RatingCard } from "@blazz/ui/components/ai/generative/data/rating-card"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "stars",
		code: `<RatingCard
  title="Customer Satisfaction"
  score={4.3}
  type="stars"
  reviewCount={128}
/>`,
	},
	{
		key: "nps",
		code: `<RatingCard
  title="Net Promoter Score"
  score={62}
  type="nps"
  label="Q4 2025"
/>`,
	},
	{
		key: "numeric",
		code: `<RatingCard
  title="Product Score"
  score={8.5}
  maxScore={10}
  type="numeric"
/>`,
	},
] as const

export const Route = createFileRoute(
	"/_docs/docs/ai/data/rating-card"
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
	component: RatingCardPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function RatingCardPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Rating Card"
			subtitle="Display star ratings, numeric scores or NPS gauges."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-xs space-y-3">
					<RatingCard
						title="Customer Satisfaction"
						score={4.3}
						type="stars"
						reviewCount={128}
						label="Based on recent surveys"
					/>
					<RatingCard
						title="Net Promoter Score"
						score={62}
						type="nps"
						label="Q4 2025"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Star Rating"
					description="Classic star-based rating."
					code={examples[0].code}
					highlightedCode={html("stars")}
				>
					<div className="max-w-xs">
						<RatingCard
							title="Customer Satisfaction"
							score={4.3}
							type="stars"
							reviewCount={128}
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="NPS Score"
					description="Net Promoter Score with gauge."
					code={examples[1].code}
					highlightedCode={html("nps")}
				>
					<div className="max-w-xs">
						<RatingCard
							title="Net Promoter Score"
							score={62}
							type="nps"
							label="Q4 2025"
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Numeric Score"
					description="Simple numeric rating."
					code={examples[2].code}
					highlightedCode={html("numeric")}
				>
					<div className="max-w-xs">
						<RatingCard
							title="Product Score"
							score={8.5}
							maxScore={10}
							type="numeric"
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
