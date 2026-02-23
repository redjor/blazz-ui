"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { TransactionCard } from "@/components/ai/generative/transaction-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function TransactionCardPage() {
	return (
		<DocPage
			title="Transaction Card"
			subtitle="A payment or transaction record with amount, method and status."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm space-y-2">
					<TransactionCard
						title="Payment from Acme Corp"
						amount="$12,500.00"
						type="incoming"
						status="completed"
						method="Wire Transfer"
						date="Feb 15, 2026"
						reference="TXN-20260215-001"
					/>
					<TransactionCard
						title="SaaS subscription"
						amount="$299.00"
						type="outgoing"
						status="pending"
						method="Credit Card"
						date="Feb 20, 2026"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Incoming Payment"
					description="A received payment."
					code={`<TransactionCard
  title="Payment from Acme Corp"
  amount="$12,500.00"
  type="incoming"
  status="completed"
  method="Wire Transfer"
  date="Feb 15, 2026"
/>`}
				>
					<div className="max-w-sm">
						<TransactionCard
							title="Payment from Acme Corp"
							amount="$12,500.00"
							type="incoming"
							status="completed"
							method="Wire Transfer"
							date="Feb 15, 2026"
						/>
					</div>
				</DocExample>

				<DocExample
					title="Failed Transaction"
					description="A transaction that failed."
					code={`<TransactionCard
  title="Refund to TechStart"
  amount="$850.00"
  type="outgoing"
  status="failed"
  date="Feb 18, 2026"
/>`}
				>
					<div className="max-w-sm">
						<TransactionCard
							title="Refund to TechStart"
							amount="$850.00"
							type="outgoing"
							status="failed"
							date="Feb 18, 2026"
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
