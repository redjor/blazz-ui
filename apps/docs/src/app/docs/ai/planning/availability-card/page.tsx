"use client"

import { AvailabilityCard } from "@blazz/pro/components/ai/generative/planning/availability-card"
import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const examples = [
	{
		key: "scheduler",
		code: `<AvailabilityCard
  days={[{
    date: "Monday, Mar 11",
    slots: [
      { time: "9:00 AM", status: "available" },
      { time: "10:00 AM", status: "busy" },
      { time: "11:00 AM", status: "available" },
    ],
  }]}
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [{ id: "examples", title: "Examples" }]

export default function AvailabilityCardPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="Availability Card" subtitle="A time slot grid for scheduling with available, busy and tentative states." toc={toc}>
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
				<DocExampleClient title="Meeting Scheduler" description="Pick a time slot to schedule a meeting." code={examples[0].code} highlightedCode={html("scheduler")}>
					<div className="max-w-sm">
						<AvailabilityCard
							days={[
								{
									date: "Monday, Mar 11",
									slots: [
										{ time: "9:00 AM", status: "available" },
										{ time: "10:00 AM", status: "busy" },
										{ time: "11:00 AM", status: "available" },
										{ time: "2:00 PM", status: "tentative" },
									],
								},
							]}
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
