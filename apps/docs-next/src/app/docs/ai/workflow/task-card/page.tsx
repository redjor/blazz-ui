"use client"

import { use } from "react"
import { TaskCard } from "@blazz/pro/components/ai/generative/workflow/task-card"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
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

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default function TaskCardPage() {
	const highlighted = use(highlightedPromise)
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
