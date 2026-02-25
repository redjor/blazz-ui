"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { TaskCard } from "@blazz/ui/components/ai/generative/workflow/task-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function TaskCardPage() {
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
				<DocExample
					title="In Progress"
					description="Task currently being worked on."
					code={`<TaskCard
  title="Review Q4 proposal"
  assignee={{ name: "Laura Chen" }}
  dueDate="Mar 15, 2026"
  priority="high"
  status="in-progress"
  subtasks={{ done: 2, total: 5 }}
/>`}
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
				</DocExample>

				<DocExample
					title="Completed"
					description="Task marked as done."
					code={`<TaskCard
  title="Send invoice to client"
  assignee={{ name: "Marc D." }}
  priority="medium"
  status="done"
/>`}
				>
					<div className="max-w-sm">
						<TaskCard
							title="Send invoice to client"
							assignee={{ name: "Marc D." }}
							priority="medium"
							status="done"
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
