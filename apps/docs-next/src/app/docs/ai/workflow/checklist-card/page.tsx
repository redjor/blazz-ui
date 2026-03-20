"use client"

import { use } from "react"
import { ChecklistCard } from "@blazz/pro/components/ai/generative/workflow/checklist-card"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
const examples = [
	{
		key: "onboarding",
		code: `<ChecklistCard
  title="Onboarding Steps"
  items={[
    { label: "Create account", checked: true },
    { label: "Complete profile", checked: true },
    { label: "Import contacts", checked: false },
    { label: "Set up integrations", checked: false },
  ]}
/>`,
	},
	{
		key: "without-title",
		code: `<ChecklistCard
  items={[
    { label: "Review proposal" },
    { label: "Send to client" },
    { label: "Schedule follow-up" },
  ]}
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default function ChecklistCardPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Checklist Card"
			subtitle="An interactive checklist with checkable items and a progress bar."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<ChecklistCard
						title="Onboarding Steps"
						items={[
							{ label: "Create account", checked: true },
							{ label: "Complete profile", checked: true },
							{ label: "Import contacts", checked: false },
							{ label: "Set up integrations", checked: false },
							{ label: "Invite team members", checked: false },
						]}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Onboarding"
					description="Step-by-step onboarding checklist."
					code={examples[0].code}
					highlightedCode={html("onboarding")}
				>
					<div className="max-w-sm">
						<ChecklistCard
							title="Onboarding Steps"
							items={[
								{ label: "Create account", checked: true },
								{ label: "Complete profile", checked: true },
								{ label: "Import contacts", checked: false },
								{ label: "Set up integrations", checked: false },
							]}
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Without Title"
					description="Simple checklist without a title."
					code={examples[1].code}
					highlightedCode={html("without-title")}
				>
					<div className="max-w-sm">
						<ChecklistCard
							items={[
								{ label: "Review proposal" },
								{ label: "Send to client" },
								{ label: "Schedule follow-up" },
							]}
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
