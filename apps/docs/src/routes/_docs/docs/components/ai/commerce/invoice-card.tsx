import { createFileRoute } from "@tanstack/react-router"
import { InvoiceCard } from "@blazz/ui/components/ai/generative/commerce/invoice-card"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { highlightCode } from "~/lib/highlight.server"

const examples = [
	{
		key: "paid",
		code: `<InvoiceCard
  number="INV-2024-089"
  client="Acme Corporation"
  amount="$12,500.00"
  status="paid"
  issuedDate="Feb 1, 2026"
  dueDate="Mar 3, 2026"
/>`,
	},
	{
		key: "overdue",
		code: `<InvoiceCard
  number="INV-2024-072"
  client="TechStart Inc."
  amount="$3,200.00"
  status="overdue"
  dueDate="Jan 15, 2026"
/>`,
	},
] as const

export const Route = createFileRoute(
	"/_docs/docs/components/ai/commerce/invoice-card"
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
	component: InvoiceCardPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function InvoiceCardPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

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
				<DocExampleClient
					title="Paid Invoice"
					description="Invoice marked as paid."
					code={examples[0].code}
					highlightedCode={html("paid")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Overdue"
					description="Invoice past its due date."
					code={examples[1].code}
					highlightedCode={html("overdue")}
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
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
