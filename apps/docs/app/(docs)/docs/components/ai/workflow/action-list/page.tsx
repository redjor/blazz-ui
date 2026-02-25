"use client"

import { Mail, Phone, Calendar, FileText } from "lucide-react"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { ActionList } from "@blazz/ui/components/ai/generative/workflow/action-list"

const toc = [{ id: "examples", title: "Examples" }]

export default function ActionListPage() {
	return (
		<DocPage
			title="Action List"
			subtitle="A list of clickable actions the AI can suggest to the user."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<ActionList
						title="Suggested Actions"
						items={[
							{ icon: <Mail className="size-4" />, label: "Send follow-up email", description: "Draft a proposal follow-up to Laura Chen" },
							{ icon: <Phone className="size-4" />, label: "Schedule a call", description: "Book 30min with the engineering team" },
							{ icon: <Calendar className="size-4" />, label: "Create a meeting", description: "Product demo for next week" },
							{ icon: <FileText className="size-4" />, label: "Generate quote", description: "Enterprise License — $48,000" },
						]}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="With Icons"
					description="Actions with icons and descriptions."
					code={`<ActionList
  title="Suggested Actions"
  items={[
    { icon: <Mail className="size-4" />, label: "Send email", description: "Follow-up on proposal" },
    { icon: <Phone className="size-4" />, label: "Schedule call", description: "30min sync" },
    { icon: <FileText className="size-4" />, label: "Generate quote" },
  ]}
/>`}
				>
					<div className="max-w-sm">
						<ActionList
							title="Suggested Actions"
							items={[
								{ icon: <Mail className="size-4" />, label: "Send email", description: "Follow-up on proposal" },
								{ icon: <Phone className="size-4" />, label: "Schedule call", description: "30min sync" },
								{ icon: <FileText className="size-4" />, label: "Generate quote" },
							]}
						/>
					</div>
				</DocExample>

				<DocExample
					title="Simple List"
					description="Without icons, just labels."
					code={`<ActionList
  items={[
    { label: "View all contacts" },
    { label: "Export to CSV" },
    { label: "Create report" },
  ]}
/>`}
				>
					<div className="max-w-sm">
						<ActionList
							items={[
								{ label: "View all contacts" },
								{ label: "Export to CSV" },
								{ label: "Create report" },
							]}
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
