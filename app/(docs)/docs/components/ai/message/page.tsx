"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import {
	Message,
	MessageContent,
	MessageActions,
	MessageAction,
} from "@/components/ai/chat/message"
import { CopyIcon, ThumbsUpIcon, ThumbsDownIcon, RefreshCwIcon } from "lucide-react"

const toc = [{ id: "examples", title: "Examples" }]

export default function MessagePage() {
	return (
		<DocPage
			title="Message"
			subtitle="Displays a single chat message from a user or assistant with support for actions and branching."
			toc={toc}
		>
			<DocHero>
				<div className="flex w-full max-w-lg flex-col gap-6">
					<Message from="user">
						<MessageContent>
							What are the benefits of using TypeScript with React?
						</MessageContent>
					</Message>
					<Message from="assistant">
						<MessageContent>
							<div className="space-y-2">
								<p>TypeScript brings several key benefits to React development:</p>
								<ul className="list-inside list-disc space-y-1">
									<li>Catch errors at compile time rather than runtime</li>
									<li>Better IDE support with autocompletion and inline docs</li>
									<li>Self-documenting code through type annotations</li>
									<li>Safer refactoring across large codebases</li>
								</ul>
							</div>
						</MessageContent>
						<MessageActions>
							<MessageAction tooltip="Copy">
								<CopyIcon className="size-3.5" />
							</MessageAction>
							<MessageAction tooltip="Like">
								<ThumbsUpIcon className="size-3.5" />
							</MessageAction>
							<MessageAction tooltip="Dislike">
								<ThumbsDownIcon className="size-3.5" />
							</MessageAction>
						</MessageActions>
					</Message>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="User Message"
					description="Messages from the user are aligned to the right with a subtle background."
					code={`<Message from="user">
  <MessageContent>
    How do I deploy a Next.js app?
  </MessageContent>
</Message>`}
				>
					<div className="flex flex-col gap-4">
						<Message from="user">
							<MessageContent>How do I deploy a Next.js app?</MessageContent>
						</Message>
					</div>
				</DocExample>

				<DocExample
					title="Assistant Message"
					description="Messages from the assistant are aligned to the left."
					code={`<Message from="assistant">
  <MessageContent>
    You can deploy a Next.js app using Vercel,
    Docker, or any Node.js hosting platform.
  </MessageContent>
</Message>`}
				>
					<div className="flex flex-col gap-4">
						<Message from="assistant">
							<MessageContent>
								You can deploy a Next.js app using Vercel, Docker, or any Node.js hosting platform. Vercel is the recommended option as it provides zero-config deployments with edge functions support.
							</MessageContent>
						</Message>
					</div>
				</DocExample>

				<DocExample
					title="With Actions"
					description="Add action buttons below the message for copy, feedback, or regeneration."
					code={`<Message from="assistant">
  <MessageContent>Here is the answer...</MessageContent>
  <MessageActions>
    <MessageAction tooltip="Copy">
      <CopyIcon className="size-3.5" />
    </MessageAction>
    <MessageAction tooltip="Regenerate">
      <RefreshCwIcon className="size-3.5" />
    </MessageAction>
  </MessageActions>
</Message>`}
				>
					<div className="flex flex-col gap-4">
						<Message from="assistant">
							<MessageContent>
								Here is an example of an assistant message with action buttons attached below.
							</MessageContent>
							<MessageActions>
								<MessageAction tooltip="Copy">
									<CopyIcon className="size-3.5" />
								</MessageAction>
								<MessageAction tooltip="Regenerate">
									<RefreshCwIcon className="size-3.5" />
								</MessageAction>
								<MessageAction tooltip="Like">
									<ThumbsUpIcon className="size-3.5" />
								</MessageAction>
								<MessageAction tooltip="Dislike">
									<ThumbsDownIcon className="size-3.5" />
								</MessageAction>
							</MessageActions>
						</Message>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
