"use client"

import { use } from "react"
import { Timeline } from "@blazz/pro/components/ai/generative/planning/timeline"
import { Calendar, FileText, Mail, Phone } from "lucide-react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
const examples = [
	{
		key: "with-icons",
		code: `<Timeline
  title="Recent Activity"
  items={[
    { icon: <Phone className="size-4" />, title: "Call with Laura", time: "2h ago", variant: "success" },
    { icon: <Mail className="size-4" />, title: "Email sent", time: "5h ago" },
    { icon: <FileText className="size-4" />, title: "Quote created", time: "Yesterday" },
  ]}
/>`,
	},
	{
		key: "simple",
		code: `<Timeline
  items={[
    { title: "Deal moved to Negotiation", variant: "warning", time: "Today" },
    { title: "Contact added", variant: "success", time: "Yesterday" },
    { title: "Deal created", time: "3 days ago" },
  ]}
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default function TimelinePage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

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
							{
								icon: <Phone className="size-4" />,
								title: "Call with Laura Chen",
								description: "Discussed enterprise pricing",
								time: "2h ago",
								variant: "success",
							},
							{
								icon: <Mail className="size-4" />,
								title: "Email sent to Acme Corp",
								description: "Proposal follow-up",
								time: "5h ago",
							},
							{
								icon: <FileText className="size-4" />,
								title: "Quote #247 created",
								description: "$48,000 — Enterprise License",
								time: "Yesterday",
							},
							{
								icon: <Calendar className="size-4" />,
								title: "Meeting scheduled",
								description: "Demo with engineering team",
								time: "2 days ago",
								variant: "info",
							},
						]}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="With Icons"
					description="Use icons to differentiate activity types."
					code={examples[0].code}
					highlightedCode={html("with-icons")}
				>
					<div className="max-w-sm">
						<Timeline
							title="Recent Activity"
							items={[
								{
									icon: <Phone className="size-4" />,
									title: "Call with Laura",
									time: "2h ago",
									variant: "success",
								},
								{ icon: <Mail className="size-4" />, title: "Email sent", time: "5h ago" },
								{
									icon: <FileText className="size-4" />,
									title: "Quote created",
									time: "Yesterday",
								},
							]}
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Simple Dots"
					description="Without icons, colored dots indicate event type."
					code={examples[1].code}
					highlightedCode={html("simple")}
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
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
