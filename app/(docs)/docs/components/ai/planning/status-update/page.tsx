"use client"

import { ArrowRightLeft } from "lucide-react"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { StatusUpdate } from "@/components/ai/generative/planning/status-update"

const toc = [{ id: "examples", title: "Examples" }]

export default function StatusUpdatePage() {
	return (
		<DocPage
			title="Status Update"
			subtitle="Shows a state change with from/to badges — deal stage transitions, status changes."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<StatusUpdate
						title="Deal stage updated"
						description="Enterprise License — Acme Corp"
						from="Proposal"
						fromVariant="info"
						to="Negotiation"
						toVariant="warning"
						time="2h ago"
						icon={<ArrowRightLeft className="size-4" />}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Deal Stage Change"
					description="Shows previous and new stage with arrow."
					code={`<StatusUpdate
  title="Deal stage updated"
  description="Enterprise License — Acme Corp"
  from="Proposal"
  fromVariant="info"
  to="Negotiation"
  toVariant="warning"
  time="2h ago"
/>`}
				>
					<div className="max-w-sm">
						<StatusUpdate
							title="Deal stage updated"
							description="Enterprise License — Acme Corp"
							from="Proposal"
							fromVariant="info"
							to="Negotiation"
							toVariant="warning"
							time="2h ago"
						/>
					</div>
				</DocExample>

				<DocExample
					title="Won Deal"
					description="Transition to a success state."
					code={`<StatusUpdate
  title="Deal closed"
  from="Negotiation"
  fromVariant="warning"
  to="Closed Won"
  toVariant="success"
  time="Just now"
/>`}
				>
					<div className="max-w-sm">
						<StatusUpdate
							title="Deal closed"
							from="Negotiation"
							fromVariant="warning"
							to="Closed Won"
							toVariant="success"
							time="Just now"
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
