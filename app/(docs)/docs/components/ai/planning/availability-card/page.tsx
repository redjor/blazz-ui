"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { AvailabilityCard } from "@/components/ai/generative/planning/availability-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function AvailabilityCardPage() {
	return (
		<DocPage
			title="Availability Card"
			subtitle="A time slot grid for scheduling with available, busy and tentative states."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<AvailabilityCard
						title="Available times"
						days={[
							{
								date: "Monday, Mar 11",
								slots: [
									{ time: "9:00 AM", status: "available" },
									{ time: "10:00 AM", status: "busy" },
									{ time: "11:00 AM", status: "available" },
									{ time: "2:00 PM", status: "tentative" },
									{ time: "3:00 PM", status: "available" },
								],
							},
							{
								date: "Tuesday, Mar 12",
								slots: [
									{ time: "9:00 AM", status: "busy" },
									{ time: "10:00 AM", status: "available" },
									{ time: "11:00 AM", status: "available" },
									{ time: "2:00 PM", status: "busy" },
								],
							},
						]}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Meeting Scheduler"
					description="Pick a time slot to schedule a meeting."
					code={`<AvailabilityCard
  days={[{
    date: "Monday, Mar 11",
    slots: [
      { time: "9:00 AM", status: "available" },
      { time: "10:00 AM", status: "busy" },
      { time: "11:00 AM", status: "available" },
    ],
  }]}
/>`}
				>
					<div className="max-w-sm">
						<AvailabilityCard
							days={[{
								date: "Monday, Mar 11",
								slots: [
									{ time: "9:00 AM", status: "available" },
									{ time: "10:00 AM", status: "busy" },
									{ time: "11:00 AM", status: "available" },
									{ time: "2:00 PM", status: "tentative" },
								],
							}]}
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
