"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import {
	Confirmation,
	ConfirmationTitle,
	ConfirmationRequest,
	ConfirmationAccepted,
	ConfirmationRejected,
	ConfirmationActions,
	ConfirmationAction,
} from "@/components/ai-elements/confirmation"

const toc = [{ id: "examples", title: "Examples" }]

export default function ConfirmationPage() {
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
				<DocExample
					title="Pending Approval"
					description="Shows action buttons when the tool is waiting for user confirmation."
					code={`<Confirmation
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
</Confirmation>`}
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
				</DocExample>

				<DocExample
					title="Accepted"
					description="After the user approves, show a confirmation message."
					code={`<Confirmation
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
</Confirmation>`}
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
				</DocExample>

				<DocExample
					title="Rejected"
					description="When the user denies the action, show the rejection state."
					code={`<Confirmation
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
</Confirmation>`}
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
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
