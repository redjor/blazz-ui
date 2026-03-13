import { TaskCard } from "@blazz/ui/components/ai/generative/workflow/task-card"
import { createFileRoute } from "@tanstack/react-router"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "in-progress",
		code: `<TaskCard
  title="Review Q4 proposal"
  assignee={{ name: "Laura Chen" }}
  dueDate="Mar 15, 2026"
  priority="high"
  status="in-progress"
  subtasks={{ done: 2, total: 5 }}
/>`,
	},
	{
		key: "done",
		code: `<TaskCard
  title="Send invoice to client"
  assignee={{ name: "Marc D." }}
  priority="medium"
  status="done"
/>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/ai/workflow/task-card")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: TaskCardPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function TaskCardPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Task Card"
			subtitle="A task with assignee, due date, priority and progress tracking."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<TaskCard
						title="Review Q4 partnership proposal"
						description="Review the updated proposal from Acme Corp and provide feedback."
						assignee={{ name: "Laura Chen" }}
						dueDate="Mar 15, 2026"
						priority="high"
						status="in-progress"
						subtasks={{ done: 2, total: 5 }}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="In Progress"
					description="Task currently being worked on."
					code={examples[0].code}
					highlightedCode={html("in-progress")}
				>
					<div className="max-w-sm">
						<TaskCard
							title="Review Q4 proposal"
							assignee={{ name: "Laura Chen" }}
							dueDate="Mar 15, 2026"
							priority="high"
							status="in-progress"
							subtasks={{ done: 2, total: 5 }}
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Completed"
					description="Task marked as done."
					code={examples[1].code}
					highlightedCode={html("done")}
				>
					<div className="max-w-sm">
						<TaskCard
							title="Send invoice to client"
							assignee={{ name: "Marc D." }}
							priority="medium"
							status="done"
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
