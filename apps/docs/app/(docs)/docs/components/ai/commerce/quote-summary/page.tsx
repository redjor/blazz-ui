"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { QuoteSummary } from "@blazz/ui/components/ai/generative/commerce/quote-summary"

const toc = [{ id: "examples", title: "Examples" }]

export default function QuoteSummaryPage() {
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
				<DocExample
					title="Accepted Quote"
					description="Quote that has been accepted by the client."
					code={`<QuoteSummary
  number="QT-2026-014"
  client="Acme Corporation"
  total="$48,000.00"
  status="accepted"
  validUntil="Mar 31, 2026"
  itemCount={5}
/>`}
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
				</DocExample>

				<DocExample
					title="Expired Quote"
					description="Quote past its validity date."
					code={`<QuoteSummary
  number="QT-2025-098"
  client="TechStart Inc."
  total="$12,000.00"
  status="expired"
  itemCount={3}
/>`}
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
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
