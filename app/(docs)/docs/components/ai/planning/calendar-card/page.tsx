"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { CalendarCard } from "@/components/ai/generative/planning/calendar-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function CalendarCardPage() {
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
							{ day: 11, isToday: true, events: [{ title: "Client call", time: "2:00 PM", variant: "info" }, { title: "Design review", time: "4:00 PM" }] },
							{ day: 12, events: [{ title: "Sprint planning", time: "10:00 AM", variant: "warning" }] },
							{ day: 13, isHighlighted: true },
							{ day: 14, events: [{ title: "Demo day", time: "3:00 PM", variant: "success" }] },
						]}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Week View"
					description="A few days with events highlighted."
					code={`<CalendarCard
  month="March 2026"
  days={[
    { day: 10, events: [{ title: "Team standup", time: "9:00 AM" }] },
    { day: 11, isToday: true, events: [{ title: "Client call", time: "2:00 PM" }] },
    { day: 12, events: [{ title: "Sprint planning", time: "10:00 AM" }] },
  ]}
/>`}
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
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
