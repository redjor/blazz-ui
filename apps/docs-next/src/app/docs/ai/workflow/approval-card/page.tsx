import { ApprovalCard } from "@blazz/pro/components/ai/generative/workflow/approval-card"
import { Button } from "@blazz/ui/components/ui/button"
import { Check, X } from "lucide-react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
const examples = [
	{
		key: "pending",
		code: `<ApprovalCard
  title="Discount Approval Required"
  description="Jean requests 15% discount for Acme Corp."
  details={[
    { label: "Deal", value: "Enterprise License" },
    { label: "Amount", value: "$48,000" },
    { label: "Discount", value: "15%" },
  ]}
  actions={
    <>
      <Button size="xs"><Check /> Approve</Button>
      <Button size="xs" variant="outline"><X /> Reject</Button>
    </>
  }
/>`,
	},
	{
		key: "approved",
		code: `<ApprovalCard
  title="Discount Approved"
  status="approved"
  details={[
    { label: "Deal", value: "Enterprise License" },
    { label: "Final Amount", value: "$40,800" },
  ]}
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default async function ApprovalCardPage() {
	const highlighted = await highlightedPromise
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Approval Card"
			subtitle="A decision card with context details and accept/reject actions."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<ApprovalCard
						title="Discount Approval Required"
						description="Jean Dupont requests 15% discount for Acme Corp."
						details={[
							{ label: "Deal", value: "Enterprise License" },
							{ label: "Original Amount", value: "$48,000" },
							{ label: "Discount", value: "15% ($7,200)" },
							{ label: "Final Amount", value: "$40,800" },
						]}
						actions={
							<>
								<Button size="xs" variant="default">
									<Check className="size-3.5" /> Approve
								</Button>
								<Button size="xs" variant="outline">
									<X className="size-3.5" /> Reject
								</Button>
							</>
						}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Pending Approval"
					description="Full approval card with details and action buttons."
					code={examples[0].code}
					highlightedCode={html("pending")}
				>
					<div className="max-w-sm">
						<ApprovalCard
							title="Discount Approval Required"
							description="Jean requests 15% discount for Acme Corp."
							details={[
								{ label: "Deal", value: "Enterprise License" },
								{ label: "Amount", value: "$48,000" },
								{ label: "Discount", value: "15%" },
							]}
							actions={
								<>
									<Button size="xs" variant="default">
										<Check className="size-3.5" /> Approve
									</Button>
									<Button size="xs" variant="outline">
										<X className="size-3.5" /> Reject
									</Button>
								</>
							}
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Already Approved"
					description="Card in approved state without actions."
					code={examples[1].code}
					highlightedCode={html("approved")}
				>
					<div className="max-w-sm">
						<ApprovalCard
							title="Discount Approved"
							status="approved"
							details={[
								{ label: "Deal", value: "Enterprise License" },
								{ label: "Final Amount", value: "$40,800" },
							]}
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
