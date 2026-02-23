"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { InvoiceCard } from "@/components/ai/generative/invoice-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function InvoiceCardPage() {
	return (
		<DocPage
			title="Invoice Card"
			subtitle="An invoice summary with status, line items and due date."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<InvoiceCard
						number="INV-2024-089"
						client="Acme Corporation"
						amount="$12,500.00"
						status="sent"
						issuedDate="Feb 1, 2026"
						dueDate="Mar 3, 2026"
						items={[
							{ description: "Enterprise License", amount: "$10,000.00" },
							{ description: "Professional Services", amount: "$2,500.00" },
						]}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Paid Invoice"
					description="Invoice marked as paid."
					code={`<InvoiceCard
  number="INV-2024-089"
  client="Acme Corporation"
  amount="$12,500.00"
  status="paid"
  issuedDate="Feb 1, 2026"
  dueDate="Mar 3, 2026"
/>`}
				>
					<div className="max-w-sm">
						<InvoiceCard
							number="INV-2024-089"
							client="Acme Corporation"
							amount="$12,500.00"
							status="paid"
							issuedDate="Feb 1, 2026"
							dueDate="Mar 3, 2026"
						/>
					</div>
				</DocExample>

				<DocExample
					title="Overdue"
					description="Invoice past its due date."
					code={`<InvoiceCard
  number="INV-2024-072"
  client="TechStart Inc."
  amount="$3,200.00"
  status="overdue"
  dueDate="Jan 15, 2026"
/>`}
				>
					<div className="max-w-sm">
						<InvoiceCard
							number="INV-2024-072"
							client="TechStart Inc."
							amount="$3,200.00"
							status="overdue"
							dueDate="Jan 15, 2026"
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
