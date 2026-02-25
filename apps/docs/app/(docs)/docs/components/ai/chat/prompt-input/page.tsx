"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import {
	PromptInput,
	PromptInputTextarea,
	PromptInputFooter,
	PromptInputSubmit,
	PromptInputTools,
	PromptInputButton,
} from "@blazz/ui/components/ai/chat/prompt-input"
import { Suggestions, Suggestion } from "@blazz/ui/components/ai/chat/suggestion"
import { PaperclipIcon } from "lucide-react"

const toc = [{ id: "examples", title: "Examples" }]

export default function PromptInputPage() {
	return (
		<DocPage
			title="Prompt Input"
			subtitle="A rich text input for AI chat interfaces with support for file attachments, action menus, and submit controls."
			toc={toc}
		>
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
				<DocExample
					title="Basic Input"
					description="A minimal prompt input with textarea and submit button."
					code={`<PromptInput onSubmit={() => {}}>
  <PromptInputTextarea placeholder="Ask anything..." />
  <PromptInputFooter>
    <div />
    <PromptInputSubmit />
  </PromptInputFooter>
</PromptInput>`}
				>
					<PromptInput onSubmit={() => {}}>
						<PromptInputTextarea placeholder="Ask anything..." />
						<PromptInputFooter>
							<div />
							<PromptInputSubmit />
						</PromptInputFooter>
					</PromptInput>
				</DocExample>

				<DocExample
					title="With Tools"
					description="Add tool buttons in the footer for attachments or other actions."
					code={`<PromptInput onSubmit={() => {}}>
  <PromptInputTextarea placeholder="Type your message..." />
  <PromptInputFooter>
    <PromptInputTools>
      <PromptInputButton tooltip="Attach file">
        <PaperclipIcon className="size-4" />
      </PromptInputButton>
    </PromptInputTools>
    <PromptInputSubmit />
  </PromptInputFooter>
</PromptInput>`}
				>
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
				</DocExample>

				<DocExample
					title="With Suggestions"
					description="Combine with Suggestions above the input for quick prompts."
					code={`<div className="space-y-3">
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
</div>`}
				>
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
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
