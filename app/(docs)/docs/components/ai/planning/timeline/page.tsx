"use client"

import { Phone, Mail, FileText, Calendar } from "lucide-react"
import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { Timeline } from "@/components/ai/generative/planning/timeline"

const toc = [{ id: "examples", title: "Examples" }]

export default function TimelinePage() {
	return (
		<DocPage
			title="Timeline"
			subtitle="A vertical activity feed showing events in chronological order."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<Timeline
						title="Recent Activity"
						items={[
							{ icon: <Phone className="size-4" />, title: "Call with Laura Chen", description: "Discussed enterprise pricing", time: "2h ago", variant: "success" },
							{ icon: <Mail className="size-4" />, title: "Email sent to Acme Corp", description: "Proposal follow-up", time: "5h ago" },
							{ icon: <FileText className="size-4" />, title: "Quote #247 created", description: "$48,000 — Enterprise License", time: "Yesterday" },
							{ icon: <Calendar className="size-4" />, title: "Meeting scheduled", description: "Demo with engineering team", time: "2 days ago", variant: "info" },
						]}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="With Icons"
					description="Use icons to differentiate activity types."
					code={`<Timeline
  title="Recent Activity"
  items={[
    { icon: <Phone className="size-4" />, title: "Call with Laura", time: "2h ago", variant: "success" },
    { icon: <Mail className="size-4" />, title: "Email sent", time: "5h ago" },
    { icon: <FileText className="size-4" />, title: "Quote created", time: "Yesterday" },
  ]}
/>`}
				>
					<div className="max-w-sm">
						<Timeline
							title="Recent Activity"
							items={[
								{ icon: <Phone className="size-4" />, title: "Call with Laura", time: "2h ago", variant: "success" },
								{ icon: <Mail className="size-4" />, title: "Email sent", time: "5h ago" },
								{ icon: <FileText className="size-4" />, title: "Quote created", time: "Yesterday" },
							]}
						/>
					</div>
				</DocExample>

				<DocExample
					title="Simple Dots"
					description="Without icons, colored dots indicate event type."
					code={`<Timeline
  items={[
    { title: "Deal moved to Negotiation", variant: "warning", time: "Today" },
    { title: "Contact added", variant: "success", time: "Yesterday" },
    { title: "Deal created", time: "3 days ago" },
  ]}
/>`}
				>
					<div className="max-w-sm">
						<Timeline
							items={[
								{ title: "Deal moved to Negotiation", variant: "warning", time: "Today" },
								{ title: "Contact added", variant: "success", time: "Yesterday" },
								{ title: "Deal created", time: "3 days ago" },
							]}
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
