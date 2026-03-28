"use client"

import { PromptInput, PromptInputButton, PromptInputFooter, PromptInputSubmit, PromptInputTextarea, PromptInputTools } from "@blazz/pro/components/ai/chat/prompt-input"
import { Suggestion, Suggestions } from "@blazz/pro/components/ai/chat/suggestion"
import { PaperclipIcon } from "lucide-react"
import { use } from "react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const examples = [
	{
		key: "basic",
		code: `<PromptInput onSubmit={() => {}}>
  <PromptInputTextarea placeholder="Ask anything..." />
  <PromptInputFooter>
    <div />
    <PromptInputSubmit />
  </PromptInputFooter>
</PromptInput>`,
	},
	{
		key: "with-tools",
		code: `<PromptInput onSubmit={() => {}}>
  <PromptInputTextarea placeholder="Type your message..." />
  <PromptInputFooter>
    <PromptInputTools>
      <PromptInputButton tooltip="Attach file">
        <PaperclipIcon className="size-4" />
      </PromptInputButton>
    </PromptInputTools>
    <PromptInputSubmit />
  </PromptInputFooter>
</PromptInput>`,
	},
	{
		key: "with-suggestions",
		code: `<div className="space-y-3">
  <Suggestions>
    <Suggestion suggestion="Explain React hooks" />
    <Suggestion suggestion="Write a unit test" />
    <Suggestion suggestion="Optimize performance" />
  </Suggestions>
  <PromptInput onSubmit={() => {}}>
    <PromptInputTextarea placeholder="Ask anything..." />
    <PromptInputFooter>
      <div />
      <PromptInputSubmit />
    </PromptInputFooter>
  </PromptInput>
</div>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [{ id: "examples", title: "Examples" }]

export default function PromptInputPage() {
	const highlighted = use(highlightedPromise)
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage title="Prompt Input" subtitle="A rich text input for AI chat interfaces with support for file attachments, action menus, and submit controls." toc={toc}>
			<DocHero>
				<div className="w-full max-w-lg">
					<PromptInput onSubmit={() => {}}>
						<PromptInputTextarea placeholder="Posez votre question..." />
						<PromptInputFooter>
							<div />
							<PromptInputSubmit />
						</PromptInputFooter>
					</PromptInput>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient title="Basic Input" description="A minimal prompt input with textarea and submit button." code={examples[0].code} highlightedCode={html("basic")}>
					<PromptInput onSubmit={() => {}}>
						<PromptInputTextarea placeholder="Ask anything..." />
						<PromptInputFooter>
							<div />
							<PromptInputSubmit />
						</PromptInputFooter>
					</PromptInput>
				</DocExampleClient>

				<DocExampleClient title="With Tools" description="Add tool buttons in the footer for attachments or other actions." code={examples[1].code} highlightedCode={html("with-tools")}>
					<PromptInput onSubmit={() => {}}>
						<PromptInputTextarea placeholder="Type your message..." />
						<PromptInputFooter>
							<PromptInputTools>
								<PromptInputButton tooltip="Attach file">
									<PaperclipIcon className="size-4" />
								</PromptInputButton>
							</PromptInputTools>
							<PromptInputSubmit />
						</PromptInputFooter>
					</PromptInput>
				</DocExampleClient>

				<DocExampleClient title="With Suggestions" description="Combine with Suggestions above the input for quick prompts." code={examples[2].code} highlightedCode={html("with-suggestions")}>
					<div className="space-y-3">
						<Suggestions>
							<Suggestion suggestion="Explain React hooks" onClick={() => {}} />
							<Suggestion suggestion="Write a unit test" onClick={() => {}} />
							<Suggestion suggestion="Optimize performance" onClick={() => {}} />
						</Suggestions>
						<PromptInput onSubmit={() => {}}>
							<PromptInputTextarea placeholder="Ask anything..." />
							<PromptInputFooter>
								<div />
								<PromptInputSubmit />
							</PromptInputFooter>
						</PromptInput>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
