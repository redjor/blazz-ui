"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { EventCard } from "@/components/ai/generative/event-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function EventCardPage() {
	return (
		<DocPage
			title="Event Card"
			subtitle="Displays a meeting, call, task or deadline with date, time and participants."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<EventCard
						title="Product Demo — Acme Corp"
						type="meeting"
						date="Mar 12, 2026"
						time="2:00 PM – 3:00 PM"
						location="Google Meet"
						participants={[
							{ name: "Jean Dupont", avatar: "https://i.pravatar.cc/150?u=jean" },
							{ name: "Laura Chen", avatar: "https://i.pravatar.cc/150?u=laura" },
							{ name: "Bob Chen", avatar: "https://i.pravatar.cc/150?u=bob" },
						]}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Meeting"
					description="Meeting with participants and location."
					code={`<EventCard
  title="Product Demo — Acme Corp"
  type="meeting"
  date="Mar 12, 2026"
  time="2:00 PM – 3:00 PM"
  location="Google Meet"
  participants={[
    { name: "Jean Dupont" },
    { name: "Laura Chen" },
  ]}
/>`}
				>
					<div className="max-w-sm">
						<EventCard
							title="Product Demo — Acme Corp"
							type="meeting"
							date="Mar 12, 2026"
							time="2:00 PM – 3:00 PM"
							location="Google Meet"
							participants={[
								{ name: "Jean Dupont", avatar: "https://i.pravatar.cc/150?u=jean" },
								{ name: "Laura Chen", avatar: "https://i.pravatar.cc/150?u=laura" },
							]}
						/>
					</div>
				</DocExample>

				<DocExample
					title="Task & Deadline"
					description="Different event types."
					code={`<div className="space-y-3">
  <EventCard title="Send proposal" type="task" date="Mar 10, 2026" />
  <EventCard title="Q1 Review" type="deadline" date="Mar 31, 2026" />
</div>`}
				>
					<div className="max-w-sm space-y-3">
						<EventCard title="Send proposal" type="task" date="Mar 10, 2026" />
						<EventCard title="Q1 Review" type="deadline" date="Mar 31, 2026" />
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
