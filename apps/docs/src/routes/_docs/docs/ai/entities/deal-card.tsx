import { DealCard } from "@blazz/pro/components/ai/generative/entities/deal-card"
import { createFileRoute } from "@tanstack/react-router"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "negotiation",
		code: `<DealCard
  title="Enterprise License"
  amount="$48,000"
  stage="negotiation"
  probability={75}
  company="Acme Corp"
  closeDate="Mar 15, 2026"
  owner="Jean Dupont"
/>`,
	},
	{
		key: "closed-won",
		code: `<DealCard
  title="Pro Upgrade"
  amount="$12,000"
  stage="closed-won"
  company="Datadog"
/>`,
	},
	{
		key: "multiple",
		code: `<div className="space-y-3">
  <DealCard title="Enterprise" amount="$48K" stage="negotiation" company="Acme" />
  <DealCard title="Pro Plan" amount="$12K" stage="proposal" company="Stripe" />
  <DealCard title="Starter" amount="$3.6K" stage="qualification" company="Linear" />
</div>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/ai/entities/deal-card")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: DealCardPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function DealCardPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Deal Card"
			subtitle="Displays a sales deal with amount, pipeline stage, probability and close date."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<DealCard
						title="Enterprise License"
						amount="$48,000"
						stage="negotiation"
						probability={75}
						company="Acme Corp"
						closeDate="Mar 15, 2026"
						owner="Jean Dupont"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="In Negotiation"
					description="Active deal with probability and close date."
					code={examples[0].code}
					highlightedCode={html("negotiation")}
				>
					<div className="max-w-sm">
						<DealCard
							title="Enterprise License"
							amount="$48,000"
							stage="negotiation"
							probability={75}
							company="Acme Corp"
							closeDate="Mar 15, 2026"
							owner="Jean Dupont"
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Closed Won"
					description="Successfully closed deal."
					code={examples[1].code}
					highlightedCode={html("closed-won")}
				>
					<div className="max-w-sm">
						<DealCard title="Pro Upgrade" amount="$12,000" stage="closed-won" company="Datadog" />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Multiple Deals"
					description="Stack deal cards to show a pipeline."
					code={examples[2].code}
					highlightedCode={html("multiple")}
				>
					<div className="max-w-sm space-y-3">
						<DealCard title="Enterprise" amount="$48K" stage="negotiation" company="Acme" />
						<DealCard title="Pro Plan" amount="$12K" stage="proposal" company="Stripe" />
						<DealCard title="Starter" amount="$3.6K" stage="qualification" company="Linear" />
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
