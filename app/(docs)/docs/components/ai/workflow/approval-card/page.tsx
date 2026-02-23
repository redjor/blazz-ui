"use client"

import { Check, X } from "lucide-react"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { ApprovalCard } from "@/components/ai/generative/workflow/approval-card"
import { Button } from "@/components/ui/button"

const toc = [{ id: "examples", title: "Examples" }]

export default function ApprovalCardPage() {
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
				<DocExample
					title="Pending Approval"
					description="Full approval card with details and action buttons."
					code={`<ApprovalCard
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
/>`}
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
				</DocExample>

				<DocExample
					title="Already Approved"
					description="Card in approved state without actions."
					code={`<ApprovalCard
  title="Discount Approved"
  status="approved"
  details={[
    { label: "Deal", value: "Enterprise License" },
    { label: "Final Amount", value: "$40,800" },
  ]}
/>`}
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
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
