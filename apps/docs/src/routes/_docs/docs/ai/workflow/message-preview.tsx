import { MessagePreview } from "@blazz/ui/components/ai/generative/workflow/message-preview"
import { createFileRoute } from "@tanstack/react-router"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "slack",
		code: `<MessagePreview
  platform="slack"
  from={{ name: "Sarah Kim" }}
  content="The client confirmed the meeting."
  channel="sales"
  time="2 min ago"
/>`,
	},
	{
		key: "sms",
		code: `<MessagePreview
  platform="sms"
  from={{ name: "John Doe" }}
  content="Running 10 min late to the meeting."
  time="Just now"
/>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/ai/workflow/message-preview")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: MessagePreviewPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function MessagePreviewPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Message Preview"
			subtitle="Preview an incoming message from SMS, WhatsApp, Slack or email."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<MessagePreview
						platform="slack"
						from={{ name: "Sarah Kim" }}
						content="Hey team, the client just confirmed the meeting for Thursday. Can everyone update their availability?"
						channel="sales"
						time="2 min ago"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Slack Message"
					description="Message from a Slack channel."
					code={examples[0].code}
					highlightedCode={html("slack")}
				>
					<div className="max-w-sm">
						<MessagePreview
							platform="slack"
							from={{ name: "Sarah Kim" }}
							content="The client confirmed the meeting for Thursday."
							channel="sales"
							time="2 min ago"
						/>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="SMS"
					description="Incoming SMS message."
					code={examples[1].code}
					highlightedCode={html("sms")}
				>
					<div className="max-w-sm">
						<MessagePreview
							platform="sms"
							from={{ name: "John Doe" }}
							content="Running 10 min late to the meeting. Start without me!"
							time="Just now"
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
