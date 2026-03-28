"use client"

import { MessagePreview } from "@blazz/pro/components/ai/generative/workflow/message-preview"
import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

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

const highlightedPromise = highlightExamples(examples as any)

const toc = [{ id: "examples", title: "Examples" }]

export default function MessagePreviewPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="Message Preview" subtitle="Preview an incoming message from SMS, WhatsApp, Slack or email." toc={toc}>
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
				<DocExampleClient title="Slack Message" description="Message from a Slack channel." code={examples[0].code} highlightedCode={html("slack")}>
					<div className="max-w-sm">
						<MessagePreview platform="slack" from={{ name: "Sarah Kim" }} content="The client confirmed the meeting for Thursday." channel="sales" time="2 min ago" />
					</div>
				</DocExampleClient>

				<DocExampleClient title="SMS" description="Incoming SMS message." code={examples[1].code} highlightedCode={html("sms")}>
					<div className="max-w-sm">
						<MessagePreview platform="sms" from={{ name: "John Doe" }} content="Running 10 min late to the meeting. Start without me!" time="Just now" />
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
