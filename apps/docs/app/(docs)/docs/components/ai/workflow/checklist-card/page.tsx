"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { ChecklistCard } from "@blazz/ui/components/ai/generative/workflow/checklist-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function ChecklistCardPage() {
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
				<DocExample
					title="Onboarding"
					description="Step-by-step onboarding checklist."
					code={`<ChecklistCard
  title="Onboarding Steps"
  items={[
    { label: "Create account", checked: true },
    { label: "Complete profile", checked: true },
    { label: "Import contacts", checked: false },
    { label: "Set up integrations", checked: false },
  ]}
/>`}
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
				</DocExample>

				<DocExample
					title="Without Title"
					description="Simple checklist without a title."
					code={`<ChecklistCard
  items={[
    { label: "Review proposal" },
    { label: "Send to client" },
    { label: "Schedule follow-up" },
  ]}
/>`}
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
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
