import { Suggestion, Suggestions } from "@blazz/pro/components/ai/chat/suggestion"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const examples = [
	{
		key: "basic",
		code: `<Suggestions>
  <Suggestion suggestion="Tell me a joke" onClick={(s) => console.log(s)} />
  <Suggestion suggestion="Explain quantum physics" onClick={(s) => console.log(s)} />
  <Suggestion suggestion="Write a haiku" onClick={(s) => console.log(s)} />
</Suggestions>`,
	},
	{
		key: "custom-labels",
		code: `<Suggestions>
  <Suggestion suggestion="code-review">
    Review my code
  </Suggestion>
  <Suggestion suggestion="debug">
    Help me debug
  </Suggestion>
</Suggestions>`,
	},
	{
		key: "many",
		code: `<Suggestions>
  <Suggestion suggestion="Option 1" />
  <Suggestion suggestion="Option 2" />
  <Suggestion suggestion="Option 3" />
  <Suggestion suggestion="Option 4" />
  <Suggestion suggestion="Option 5" />
  <Suggestion suggestion="Option 6" />
</Suggestions>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [{ id: "examples", title: "Examples" }]

export default async function SuggestionPage() {
	const highlighted = await highlightedPromise
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

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
				<DocExampleClient
					title="Basic Suggestions"
					description="A row of clickable suggestion pills."
					code={examples[0].code}
					highlightedCode={html("basic")}
				>
					<Suggestions>
						<Suggestion suggestion="Tell me a joke" onClick={() => {}} />
						<Suggestion suggestion="Explain quantum physics" onClick={() => {}} />
						<Suggestion suggestion="Write a haiku" onClick={() => {}} />
					</Suggestions>
				</DocExampleClient>

				<DocExampleClient
					title="Custom Labels"
					description="Use children to render custom content inside each suggestion."
					code={examples[1].code}
					highlightedCode={html("custom-labels")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Many Suggestions"
					description="The container scrolls horizontally when suggestions overflow."
					code={examples[2].code}
					highlightedCode={html("many")}
				>
					<Suggestions>
						<Suggestion suggestion="What is React?" onClick={() => {}} />
						<Suggestion suggestion="Explain server components" onClick={() => {}} />
						<Suggestion suggestion="How does Suspense work?" onClick={() => {}} />
						<Suggestion suggestion="Compare Next.js and Remix" onClick={() => {}} />
						<Suggestion suggestion="TypeScript generics guide" onClick={() => {}} />
						<Suggestion suggestion="Best testing practices" onClick={() => {}} />
					</Suggestions>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
