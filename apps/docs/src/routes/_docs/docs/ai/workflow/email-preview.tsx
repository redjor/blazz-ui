import { createFileRoute } from "@tanstack/react-router"
import { EmailPreview } from "@blazz/ui/components/ai/generative/workflow/email-preview"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "draft",
		code: `<EmailPreview
  subject="Follow-up: Q4 Proposal"
  from={{ name: "Laura Chen", email: "laura@acme.com" }}
  to={[{ name: "Marc Dupont", email: "marc@forge.io" }]}
  body="Hi Marc, just following up..."
  status="draft"
  attachments={1}
/>`,
	},
	{
		key: "sent",
		code: `<EmailPreview
  subject="Invoice #2024-089"
  from={{ name: "Billing", email: "billing@forge.io" }}
  to={[{ name: "Acme Corp", email: "accounts@acme.com" }]}
  body="Please find attached..."
  status="sent"
  date="Yesterday, 10:15 AM"
/>`,
	},
] as const

export const Route = createFileRoute(
	"/_docs/docs/ai/workflow/email-preview"
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
	component: EmailPreviewPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function EmailPreviewPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

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
				<DocExampleClient
					title="Draft Email"
					description="Email ready to be sent."
					code={examples[0].code}
					highlightedCode={html("draft")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Sent Email"
					description="Email that has been sent."
					code={examples[1].code}
					highlightedCode={html("sent")}
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
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
