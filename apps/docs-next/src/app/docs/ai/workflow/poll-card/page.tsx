import { PollCard } from "@blazz/pro/components/ai/generative/workflow/poll-card"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
const examples = [
	{
		key: "with-results",
		code: `<PollCard
  question="Which CRM should we migrate to?"
  options={[
    { label: "Salesforce", votes: 12 },
    { label: "HubSpot", votes: 8 },
    { label: "Pipedrive", votes: 5 },
  ]}
  showResults
/>`,
	},
	{
		key: "interactive",
		code: `<PollCard
  question="Best time for the team sync?"
  options={[
    { label: "Monday 9 AM", votes: 4 },
    { label: "Tuesday 2 PM", votes: 6 },
    { label: "Wednesday 10 AM", votes: 3 },
  ]}
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default async function PollCardPage() {
	const highlighted = await highlightedPromise
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

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
				<DocExampleClient
					title="With Results"
					description="Results shown with percentage bars."
					code={examples[0].code}
					highlightedCode={html("with-results")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Interactive Vote"
					description="Click an option to vote — results appear after selection."
					code={examples[1].code}
					highlightedCode={html("interactive")}
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
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
