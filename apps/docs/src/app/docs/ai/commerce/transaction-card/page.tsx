"use client"

import { TransactionCard } from "@blazz/pro/components/ai/generative/commerce/transaction-card"
import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const examples = [
	{
		key: "incoming",
		code: `<TransactionCard
  title="Payment from Acme Corp"
  amount="$12,500.00"
  type="incoming"
  status="completed"
  method="Wire Transfer"
  date="Feb 15, 2026"
/>`,
	},
	{
		key: "failed",
		code: `<TransactionCard
  title="Refund to TechStart"
  amount="$850.00"
  type="outgoing"
  status="failed"
  date="Feb 18, 2026"
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [{ id: "examples", title: "Examples" }]

export default function TransactionCardPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="Transaction Card" subtitle="A payment or transaction record with amount, method and status." toc={toc}>
			<DocHero>
				<div className="max-w-sm space-y-2">
					<TransactionCard title="Payment from Acme Corp" amount="$12,500.00" type="incoming" status="completed" method="Wire Transfer" date="Feb 15, 2026" reference="TXN-20260215-001" />
					<TransactionCard title="SaaS subscription" amount="$299.00" type="outgoing" status="pending" method="Credit Card" date="Feb 20, 2026" />
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient title="Incoming Payment" description="A received payment." code={examples[0].code} highlightedCode={html("incoming")}>
					<div className="max-w-sm">
						<TransactionCard title="Payment from Acme Corp" amount="$12,500.00" type="incoming" status="completed" method="Wire Transfer" date="Feb 15, 2026" />
					</div>
				</DocExampleClient>

				<DocExampleClient title="Failed Transaction" description="A transaction that failed." code={examples[1].code} highlightedCode={html("failed")}>
					<div className="max-w-sm">
						<TransactionCard title="Refund to TechStart" amount="$850.00" type="outgoing" status="failed" date="Feb 18, 2026" />
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
