import { createFileRoute } from "@tanstack/react-router"
import { QuoteSummary } from "@blazz/ui/components/ai/generative/commerce/quote-summary"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "accepted",
		code: `<QuoteSummary
  number="QT-2026-014"
  client="Acme Corporation"
  total="$48,000.00"
  status="accepted"
  validUntil="Mar 31, 2026"
  itemCount={5}
/>`,
	},
	{
		key: "expired",
		code: `<QuoteSummary
  number="QT-2025-098"
  client="TechStart Inc."
  total="$12,000.00"
  status="expired"
  itemCount={3}
/>`,
	},
] as const

export const Route = createFileRoute(
	"/_docs/docs/ai/commerce/quote-summary"
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
	component: QuoteSummaryPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function QuoteSummaryPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Quote Summary"
			subtitle="A compact summary of a sales quote with status and validity."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<QuoteSummary
						number="QT-2026-014"
						client="Acme Corporation"
						total="$48,000.00"
						status="sent"
						validUntil="Mar 31, 2026"
						itemCount={5}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Accepted Quote"
					description="Quote that has been accepted by the client."
					code={examples[0].code}
					highlightedCode={html("accepted")}
				>
					<div className="max-w-sm">
						<QuoteSummary
							number="QT-2026-014"
							client="Acme Corporation"
							total="$48,000.00"
							status="accepted"
							validUntil="Mar 31, 2026"
							itemCount={5}
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Expired Quote"
					description="Quote past its validity date."
					code={examples[1].code}
					highlightedCode={html("expired")}
				>
					<div className="max-w-sm">
						<QuoteSummary
							number="QT-2025-098"
							client="TechStart Inc."
							total="$12,000.00"
							status="expired"
							itemCount={3}
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
