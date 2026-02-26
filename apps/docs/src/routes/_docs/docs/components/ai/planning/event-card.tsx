import { createFileRoute } from "@tanstack/react-router"
import { EventCard } from "@blazz/ui/components/ai/generative/planning/event-card"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { highlightCode } from "~/lib/highlight.server"

const examples = [
	{
		key: "meeting",
		code: `<EventCard
  title="Product Demo — Acme Corp"
  type="meeting"
  date="Mar 12, 2026"
  time="2:00 PM – 3:00 PM"
  location="Google Meet"
  participants={[
    { name: "Jean Dupont" },
    { name: "Laura Chen" },
  ]}
/>`,
	},
	{
		key: "task-deadline",
		code: `<div className="space-y-3">
  <EventCard title="Send proposal" type="task" date="Mar 10, 2026" />
  <EventCard title="Q1 Review" type="deadline" date="Mar 31, 2026" />
</div>`,
	},
] as const

export const Route = createFileRoute(
	"/_docs/docs/components/ai/planning/event-card"
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
	component: EventCardPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function EventCardPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

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
				<DocExampleClient
					title="Meeting"
					description="Meeting with participants and location."
					code={examples[0].code}
					highlightedCode={html("meeting")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Task & Deadline"
					description="Different event types."
					code={examples[1].code}
					highlightedCode={html("task-deadline")}
				>
					<div className="max-w-sm space-y-3">
						<EventCard title="Send proposal" type="task" date="Mar 10, 2026" />
						<EventCard title="Q1 Review" type="deadline" date="Mar 31, 2026" />
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
