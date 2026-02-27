import { createFileRoute } from "@tanstack/react-router"
import { AvailabilityCard } from "@blazz/ui/components/ai/generative/planning/availability-card"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { highlightCode } from "~/lib/highlight-code"

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

export const Route = createFileRoute(
	"/_docs/docs/components/ai/planning/availability-card"
)({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: AvailabilityCardPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function AvailabilityCardPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

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
				<DocExampleClient
					title="Meeting Scheduler"
					description="Pick a time slot to schedule a meeting."
					code={examples[0].code}
					highlightedCode={html("scheduler")}
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
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
