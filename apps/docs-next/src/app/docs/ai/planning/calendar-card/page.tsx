"use client"

import { use } from "react"
import { CalendarCard } from "@blazz/pro/components/ai/generative/planning/calendar-card"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
const examples = [
	{
		key: "week-view",
		code: `<CalendarCard
  month="March 2026"
  days={[
    { day: 10, events: [{ title: "Team standup", time: "9:00 AM" }] },
    { day: 11, isToday: true, events: [{ title: "Client call", time: "2:00 PM" }] },
    { day: 12, events: [{ title: "Sprint planning", time: "10:00 AM" }] },
  ]}
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default function CalendarCardPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Calendar Card"
			subtitle="A mini calendar view highlighting specific days with events."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<CalendarCard
						month="March 2026"
						days={[
							{ day: 10, events: [{ title: "Team standup", time: "9:00 AM" }] },
							{
								day: 11,
								isToday: true,
								events: [
									{ title: "Client call", time: "2:00 PM", variant: "info" },
									{ title: "Design review", time: "4:00 PM" },
								],
							},
							{
								day: 12,
								events: [{ title: "Sprint planning", time: "10:00 AM", variant: "warning" }],
							},
							{ day: 13, isHighlighted: true },
							{ day: 14, events: [{ title: "Demo day", time: "3:00 PM", variant: "success" }] },
						]}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Week View"
					description="A few days with events highlighted."
					code={examples[0].code}
					highlightedCode={html("week-view")}
				>
					<div className="max-w-sm">
						<CalendarCard
							month="March 2026"
							days={[
								{ day: 10, events: [{ title: "Team standup", time: "9:00 AM" }] },
								{ day: 11, isToday: true, events: [{ title: "Client call", time: "2:00 PM" }] },
								{ day: 12, events: [{ title: "Sprint planning", time: "10:00 AM" }] },
							]}
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
