"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { EmailPreview } from "@blazz/ui/components/ai/generative/workflow/email-preview"

const toc = [{ id: "examples", title: "Examples" }]

export default function EmailPreviewPage() {
	return (
		<DocPage
			title="Email Preview"
			subtitle="Preview a drafted or received email with sender, recipients and body."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<EmailPreview
						subject="Follow-up: Q4 Partnership Proposal"
						from={{ name: "Laura Chen", email: "laura@acme.com" }}
						to={[{ name: "Marc Dupont", email: "marc@forge.io" }]}
						body={"Hi Marc,\n\nJust following up on our conversation last week about the Q4 partnership. I've attached the revised proposal with the updated pricing.\n\nLooking forward to your feedback."}
						date="Today, 2:30 PM"
						attachments={1}
						status="draft"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Draft Email"
					description="Email ready to be sent."
					code={`<EmailPreview
  subject="Follow-up: Q4 Proposal"
  from={{ name: "Laura Chen", email: "laura@acme.com" }}
  to={[{ name: "Marc Dupont", email: "marc@forge.io" }]}
  body="Hi Marc, just following up..."
  status="draft"
  attachments={1}
/>`}
				>
					<div className="max-w-sm">
						<EmailPreview
							subject="Follow-up: Q4 Proposal"
							from={{ name: "Laura Chen", email: "laura@acme.com" }}
							to={[{ name: "Marc Dupont", email: "marc@forge.io" }]}
							body="Hi Marc, just following up on our conversation about the partnership."
							status="draft"
							attachments={1}
						/>
					</div>
				</DocExample>

				<DocExample
					title="Sent Email"
					description="Email that has been sent."
					code={`<EmailPreview
  subject="Invoice #2024-089"
  from={{ name: "Billing", email: "billing@forge.io" }}
  to={[{ name: "Acme Corp", email: "accounts@acme.com" }]}
  body="Please find attached..."
  status="sent"
  date="Yesterday, 10:15 AM"
/>`}
				>
					<div className="max-w-sm">
						<EmailPreview
							subject="Invoice #2024-089"
							from={{ name: "Billing", email: "billing@forge.io" }}
							to={[{ name: "Acme Corp", email: "accounts@acme.com" }]}
							body="Please find attached your invoice for the month of November. Payment is due within 30 days."
							status="sent"
							date="Yesterday, 10:15 AM"
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
