import { StatusUpdate } from "@blazz/pro/components/ai/generative/planning/status-update"
import { createFileRoute } from "@tanstack/react-router"
import { ArrowRightLeft } from "lucide-react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "deal-stage",
		code: `<StatusUpdate
  title="Deal stage updated"
  description="Enterprise License — Acme Corp"
  from="Proposal"
  fromVariant="info"
  to="Negotiation"
  toVariant="warning"
  time="2h ago"
/>`,
	},
	{
		key: "won",
		code: `<StatusUpdate
  title="Deal closed"
  from="Negotiation"
  fromVariant="warning"
  to="Closed Won"
  toVariant="success"
  time="Just now"
/>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/ai/planning/status-update")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: StatusUpdatePage,
})

const toc = [{ id: "examples", title: "Examples" }]

function StatusUpdatePage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Status Update"
			subtitle="Shows a state change with from/to badges — deal stage transitions, status changes."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<StatusUpdate
						title="Deal stage updated"
						description="Enterprise License — Acme Corp"
						from="Proposal"
						fromVariant="info"
						to="Negotiation"
						toVariant="warning"
						time="2h ago"
						icon={<ArrowRightLeft className="size-4" />}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Deal Stage Change"
					description="Shows previous and new stage with arrow."
					code={examples[0].code}
					highlightedCode={html("deal-stage")}
				>
					<div className="max-w-sm">
						<StatusUpdate
							title="Deal stage updated"
							description="Enterprise License — Acme Corp"
							from="Proposal"
							fromVariant="info"
							to="Negotiation"
							toVariant="warning"
							time="2h ago"
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Won Deal"
					description="Transition to a success state."
					code={examples[1].code}
					highlightedCode={html("won")}
				>
					<div className="max-w-sm">
						<StatusUpdate
							title="Deal closed"
							from="Negotiation"
							fromVariant="warning"
							to="Closed Won"
							toVariant="success"
							time="Just now"
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
