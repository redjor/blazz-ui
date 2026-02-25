"use client"

import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocHero } from "@/components/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/docs/doc-example-client"
import { PollCard } from "@blazz/ui/components/ai/generative/workflow/poll-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function PollCardPage() {
	return (
		<DocPage
			title="Poll Card"
			subtitle="An interactive poll for quick decision-making within a conversation."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<PollCard
						question="Which CRM should we migrate to?"
						options={[
							{ label: "Salesforce", votes: 12 },
							{ label: "HubSpot", votes: 8 },
							{ label: "Pipedrive", votes: 5 },
							{ label: "Build in-house", votes: 3 },
						]}
						showResults
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="With Results"
					description="Results shown with percentage bars."
					code={`<PollCard
  question="Which CRM should we migrate to?"
  options={[
    { label: "Salesforce", votes: 12 },
    { label: "HubSpot", votes: 8 },
    { label: "Pipedrive", votes: 5 },
  ]}
  showResults
/>`}
				>
					<div className="max-w-sm">
						<PollCard
							question="Which CRM should we migrate to?"
							options={[
								{ label: "Salesforce", votes: 12 },
								{ label: "HubSpot", votes: 8 },
								{ label: "Pipedrive", votes: 5 },
							]}
							showResults
						/>
					</div>
				</DocExample>

				<DocExample
					title="Interactive Vote"
					description="Click an option to vote — results appear after selection."
					code={`<PollCard
  question="Best time for the team sync?"
  options={[
    { label: "Monday 9 AM", votes: 4 },
    { label: "Tuesday 2 PM", votes: 6 },
    { label: "Wednesday 10 AM", votes: 3 },
  ]}
/>`}
				>
					<div className="max-w-sm">
						<PollCard
							question="Best time for the team sync?"
							options={[
								{ label: "Monday 9 AM", votes: 4 },
								{ label: "Tuesday 2 PM", votes: 6 },
								{ label: "Wednesday 10 AM", votes: 3 },
							]}
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
