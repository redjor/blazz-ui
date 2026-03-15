import { ActionList } from "@blazz/pro/components/ai/generative/workflow/action-list"
import { createFileRoute } from "@tanstack/react-router"
import { Calendar, FileText, Mail, Phone } from "lucide-react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "with-icons",
		code: `<ActionList
  title="Suggested Actions"
  items={[
    { icon: <Mail className="size-4" />, label: "Send email", description: "Follow-up on proposal" },
    { icon: <Phone className="size-4" />, label: "Schedule call", description: "30min sync" },
    { icon: <FileText className="size-4" />, label: "Generate quote" },
  ]}
/>`,
	},
	{
		key: "simple",
		code: `<ActionList
  items={[
    { label: "View all contacts" },
    { label: "Export to CSV" },
    { label: "Create report" },
  ]}
/>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/ai/workflow/action-list")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: ActionListPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function ActionListPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Action List"
			subtitle="A list of clickable actions the AI can suggest to the user."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<ActionList
						title="Suggested Actions"
						items={[
							{
								icon: <Mail className="size-4" />,
								label: "Send follow-up email",
								description: "Draft a proposal follow-up to Laura Chen",
							},
							{
								icon: <Phone className="size-4" />,
								label: "Schedule a call",
								description: "Book 30min with the engineering team",
							},
							{
								icon: <Calendar className="size-4" />,
								label: "Create a meeting",
								description: "Product demo for next week",
							},
							{
								icon: <FileText className="size-4" />,
								label: "Generate quote",
								description: "Enterprise License — $48,000",
							},
						]}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="With Icons"
					description="Actions with icons and descriptions."
					code={examples[0].code}
					highlightedCode={html("with-icons")}
				>
					<div className="max-w-sm">
						<ActionList
							title="Suggested Actions"
							items={[
								{
									icon: <Mail className="size-4" />,
									label: "Send email",
									description: "Follow-up on proposal",
								},
								{
									icon: <Phone className="size-4" />,
									label: "Schedule call",
									description: "30min sync",
								},
								{ icon: <FileText className="size-4" />, label: "Generate quote" },
							]}
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Simple List"
					description="Without icons, just labels."
					code={examples[1].code}
					highlightedCode={html("simple")}
				>
					<div className="max-w-sm">
						<ActionList
							items={[
								{ label: "View all contacts" },
								{ label: "Export to CSV" },
								{ label: "Create report" },
							]}
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
