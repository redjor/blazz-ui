"use client"

import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocHero } from "@/components/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/docs/doc-example-client"
import { Suggestions, Suggestion } from "@blazz/ui/components/ai/chat/suggestion"

const toc = [{ id: "examples", title: "Examples" }]

export default function SuggestionPage() {
	return (
		<DocPage
			title="Suggestion"
			subtitle="Horizontally scrollable suggestion chips for quick prompt selection in chat interfaces."
			toc={toc}
		>
			<DocHero>
				<Suggestions>
					<Suggestion suggestion="Summarize this document" onClick={() => {}} />
					<Suggestion suggestion="Translate to English" onClick={() => {}} />
					<Suggestion suggestion="Generate a summary table" onClick={() => {}} />
					<Suggestion suggestion="List key takeaways" onClick={() => {}} />
				</Suggestions>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Basic Suggestions"
					description="A row of clickable suggestion pills."
					code={`<Suggestions>
  <Suggestion suggestion="Tell me a joke" onClick={(s) => console.log(s)} />
  <Suggestion suggestion="Explain quantum physics" onClick={(s) => console.log(s)} />
  <Suggestion suggestion="Write a haiku" onClick={(s) => console.log(s)} />
</Suggestions>`}
				>
					<Suggestions>
						<Suggestion suggestion="Tell me a joke" onClick={() => {}} />
						<Suggestion suggestion="Explain quantum physics" onClick={() => {}} />
						<Suggestion suggestion="Write a haiku" onClick={() => {}} />
					</Suggestions>
				</DocExample>

				<DocExample
					title="Custom Labels"
					description="Use children to render custom content inside each suggestion."
					code={`<Suggestions>
  <Suggestion suggestion="code-review">
    Review my code
  </Suggestion>
  <Suggestion suggestion="debug">
    Help me debug
  </Suggestion>
</Suggestions>`}
				>
					<Suggestions>
						<Suggestion suggestion="code-review" onClick={() => {}}>
							Review my code
						</Suggestion>
						<Suggestion suggestion="debug" onClick={() => {}}>
							Help me debug
						</Suggestion>
						<Suggestion suggestion="refactor" onClick={() => {}}>
							Refactor this function
						</Suggestion>
					</Suggestions>
				</DocExample>

				<DocExample
					title="Many Suggestions"
					description="The container scrolls horizontally when suggestions overflow."
					code={`<Suggestions>
  <Suggestion suggestion="Option 1" />
  <Suggestion suggestion="Option 2" />
  <Suggestion suggestion="Option 3" />
  <Suggestion suggestion="Option 4" />
  <Suggestion suggestion="Option 5" />
  <Suggestion suggestion="Option 6" />
</Suggestions>`}
				>
					<Suggestions>
						<Suggestion suggestion="What is React?" onClick={() => {}} />
						<Suggestion suggestion="Explain server components" onClick={() => {}} />
						<Suggestion suggestion="How does Suspense work?" onClick={() => {}} />
						<Suggestion suggestion="Compare Next.js and Remix" onClick={() => {}} />
						<Suggestion suggestion="TypeScript generics guide" onClick={() => {}} />
						<Suggestion suggestion="Best testing practices" onClick={() => {}} />
					</Suggestions>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
