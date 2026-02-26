import { createFileRoute } from "@tanstack/react-router"
import {
	Confirmation,
	ConfirmationTitle,
	ConfirmationRequest,
	ConfirmationAccepted,
	ConfirmationRejected,
	ConfirmationActions,
	ConfirmationAction,
} from "@blazz/ui/components/ai/tools/confirmation"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { highlightCode } from "~/lib/highlight.server"

const examples = [
	{
		key: "pending-approval",
		code: `<Confirmation
  state="approval-requested"
  approval={{ id: "1" }}
>
  <ConfirmationTitle>
    Run database migration?
  </ConfirmationTitle>
  <ConfirmationRequest>
    <p>This will update the schema.</p>
  </ConfirmationRequest>
  <ConfirmationActions>
    <ConfirmationAction variant="outline">
      Deny
    </ConfirmationAction>
    <ConfirmationAction>Allow</ConfirmationAction>
  </ConfirmationActions>
</Confirmation>`,
	},
	{
		key: "accepted",
		code: `<Confirmation
  state="approval-responded"
  approval={{ id: "1", approved: true }}
>
  <ConfirmationTitle>
    File deletion approved
  </ConfirmationTitle>
  <ConfirmationAccepted>
    <p className="text-sm text-positive">
      Approved — executing action...
    </p>
  </ConfirmationAccepted>
</Confirmation>`,
	},
	{
		key: "rejected",
		code: `<Confirmation
  state="approval-responded"
  approval={{ id: "1", approved: false, reason: "Too risky" }}
>
  <ConfirmationTitle>
    Deploy to production
  </ConfirmationTitle>
  <ConfirmationRejected>
    <p className="text-sm text-destructive">
      Denied — action was not executed.
    </p>
  </ConfirmationRejected>
</Confirmation>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/components/ai/confirmation")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: ConfirmationPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function ConfirmationPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Confirmation"
			subtitle="A tool approval UI that shows pending, accepted, and rejected states for AI tool execution requests."
			toc={toc}
		>
			<DocHero>
				<div className="w-full max-w-lg">
					<Confirmation
						state="approval-requested"
						approval={{ id: "1" }}
					>
						<ConfirmationTitle>
							The assistant wants to execute a database query to retrieve your recent orders.
						</ConfirmationTitle>
						<ConfirmationRequest>
							<p className="text-sm text-muted-foreground">
								This will access your order history from the last 30 days.
							</p>
						</ConfirmationRequest>
						<ConfirmationActions>
							<ConfirmationAction variant="outline">Deny</ConfirmationAction>
							<ConfirmationAction>Allow</ConfirmationAction>
						</ConfirmationActions>
					</Confirmation>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Pending Approval"
					description="Shows action buttons when the tool is waiting for user confirmation."
					code={examples[0].code}
					highlightedCode={html("pending-approval")}
				>
					<Confirmation
						state="approval-requested"
						approval={{ id: "demo-1" }}
					>
						<ConfirmationTitle>
							The assistant wants to run a database migration.
						</ConfirmationTitle>
						<ConfirmationRequest>
							<p className="text-sm text-muted-foreground">
								This will update the database schema to add new columns.
							</p>
						</ConfirmationRequest>
						<ConfirmationActions>
							<ConfirmationAction variant="outline">Deny</ConfirmationAction>
							<ConfirmationAction>Allow</ConfirmationAction>
						</ConfirmationActions>
					</Confirmation>
				</DocExampleClient>

				<DocExampleClient
					title="Accepted"
					description="After the user approves, show a confirmation message."
					code={examples[1].code}
					highlightedCode={html("accepted")}
				>
					<Confirmation
						state="approval-responded"
						approval={{ id: "demo-2", approved: true }}
					>
						<ConfirmationTitle>
							File deletion request
						</ConfirmationTitle>
						<ConfirmationAccepted>
							<p className="text-sm text-green-600 dark:text-green-400">
								Approved — the file has been deleted successfully.
							</p>
						</ConfirmationAccepted>
					</Confirmation>
				</DocExampleClient>

				<DocExampleClient
					title="Rejected"
					description="When the user denies the action, show the rejection state."
					code={examples[2].code}
					highlightedCode={html("rejected")}
				>
					<Confirmation
						state="approval-responded"
						approval={{ id: "demo-3", approved: false, reason: "Too risky" }}
					>
						<ConfirmationTitle>
							Deploy to production
						</ConfirmationTitle>
						<ConfirmationRejected>
							<p className="text-sm text-red-600 dark:text-red-400">
								Denied — the deployment was not executed. Reason: Too risky.
							</p>
						</ConfirmationRejected>
					</Confirmation>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
