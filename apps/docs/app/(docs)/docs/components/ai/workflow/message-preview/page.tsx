"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { MessagePreview } from "@blazz/ui/components/ai/generative/workflow/message-preview"

const toc = [{ id: "examples", title: "Examples" }]

export default function MessagePreviewPage() {
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
				<DocExample
					title="Slack Message"
					description="Message from a Slack channel."
					code={`<MessagePreview
  platform="slack"
  from={{ name: "Sarah Kim" }}
  content="The client confirmed the meeting."
  channel="sales"
  time="2 min ago"
/>`}
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
				</DocExample>

				<DocExample
					title="SMS"
					description="Incoming SMS message."
					code={`<MessagePreview
  platform="sms"
  from={{ name: "John Doe" }}
  content="Running 10 min late to the meeting."
  time="Just now"
/>`}
				>
					<div className="max-w-sm">
						<MessagePreview
							platform="sms"
							from={{ name: "John Doe" }}
							content="Running 10 min late to the meeting. Start without me!"
							time="Just now"
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
