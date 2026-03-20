"use client"

import { use } from "react"
import { QuoteSummary } from "@blazz/pro/components/ai/generative/commerce/quote-summary"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
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

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default function QuoteSummaryPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

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
