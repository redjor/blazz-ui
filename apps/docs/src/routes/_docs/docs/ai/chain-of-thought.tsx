import {
	ChainOfThought,
	ChainOfThoughtContent,
	ChainOfThoughtHeader,
	ChainOfThoughtSearchResult,
	ChainOfThoughtSearchResults,
	ChainOfThoughtStep,
} from "@blazz/pro/components/ai/reasoning/chain-of-thought"
import { createFileRoute } from "@tanstack/react-router"
import { CheckCircleIcon, CodeIcon, DatabaseIcon, SearchIcon } from "lucide-react"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "step-statuses",
		code: `<ChainOfThought defaultOpen>
  <ChainOfThoughtHeader>Processing</ChainOfThoughtHeader>
  <ChainOfThoughtContent>
    <ChainOfThoughtStep label="Step 1" status="complete" />
    <ChainOfThoughtStep label="Step 2" status="active" />
    <ChainOfThoughtStep label="Step 3" status="pending" />
  </ChainOfThoughtContent>
</ChainOfThought>`,
	},
	{
		key: "with-search-results",
		code: `<ChainOfThoughtStep
  icon={SearchIcon}
  label="Web search"
  status="complete"
>
  <ChainOfThoughtSearchResults>
    <ChainOfThoughtSearchResult>
      Result 1
    </ChainOfThoughtSearchResult>
    <ChainOfThoughtSearchResult>
      Result 2
    </ChainOfThoughtSearchResult>
  </ChainOfThoughtSearchResults>
</ChainOfThoughtStep>`,
	},
	{
		key: "collapsed",
		code: `<ChainOfThought defaultOpen={false}>
  <ChainOfThoughtHeader>
    3 steps completed
  </ChainOfThoughtHeader>
  <ChainOfThoughtContent>
    ...
  </ChainOfThoughtContent>
</ChainOfThought>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/ai/chain-of-thought")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: ChainOfThoughtPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function ChainOfThoughtPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Chain of Thought"
			subtitle="A step-by-step visualization of the AI reasoning process with collapsible header and status indicators for each step."
			toc={toc}
		>
			<DocHero>
				<div className="w-full max-w-lg">
					<ChainOfThought defaultOpen>
						<ChainOfThoughtHeader>Reasoning steps</ChainOfThoughtHeader>
						<ChainOfThoughtContent>
							<ChainOfThoughtStep
								icon={SearchIcon}
								label="Searching documentation"
								description="Found 3 relevant articles"
								status="complete"
							>
								<ChainOfThoughtSearchResults>
									<ChainOfThoughtSearchResult>React docs</ChainOfThoughtSearchResult>
									<ChainOfThoughtSearchResult>MDN Web Docs</ChainOfThoughtSearchResult>
									<ChainOfThoughtSearchResult>TypeScript handbook</ChainOfThoughtSearchResult>
								</ChainOfThoughtSearchResults>
							</ChainOfThoughtStep>
							<ChainOfThoughtStep
								icon={DatabaseIcon}
								label="Querying knowledge base"
								status="complete"
							/>
							<ChainOfThoughtStep
								icon={CodeIcon}
								label="Generating code examples"
								status="active"
							/>
							<ChainOfThoughtStep
								icon={CheckCircleIcon}
								label="Formatting response"
								status="pending"
							/>
						</ChainOfThoughtContent>
					</ChainOfThought>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Step Statuses"
					description="Each step can be complete, active, or pending to show progress."
					code={examples[0].code}
					highlightedCode={html("step-statuses")}
				>
					<ChainOfThought defaultOpen>
						<ChainOfThoughtHeader>Processing</ChainOfThoughtHeader>
						<ChainOfThoughtContent>
							<ChainOfThoughtStep
								label="Analyzing input"
								description="Parsed user query successfully"
								status="complete"
							/>
							<ChainOfThoughtStep label="Retrieving context" status="active" />
							<ChainOfThoughtStep label="Generating response" status="pending" />
						</ChainOfThoughtContent>
					</ChainOfThought>
				</DocExampleClient>

				<DocExampleClient
					title="With Search Results"
					description="Steps can include nested search result badges."
					code={examples[1].code}
					highlightedCode={html("with-search-results")}
				>
					<ChainOfThought defaultOpen>
						<ChainOfThoughtHeader>Research</ChainOfThoughtHeader>
						<ChainOfThoughtContent>
							<ChainOfThoughtStep
								icon={SearchIcon}
								label="Searching the web"
								description="Found 4 relevant sources"
								status="complete"
							>
								<ChainOfThoughtSearchResults>
									<ChainOfThoughtSearchResult>stackoverflow.com</ChainOfThoughtSearchResult>
									<ChainOfThoughtSearchResult>react.dev</ChainOfThoughtSearchResult>
									<ChainOfThoughtSearchResult>github.com</ChainOfThoughtSearchResult>
									<ChainOfThoughtSearchResult>dev.to</ChainOfThoughtSearchResult>
								</ChainOfThoughtSearchResults>
							</ChainOfThoughtStep>
						</ChainOfThoughtContent>
					</ChainOfThought>
				</DocExampleClient>

				<DocExampleClient
					title="Collapsed"
					description="The chain of thought can be collapsed by default."
					code={examples[2].code}
					highlightedCode={html("collapsed")}
				>
					<ChainOfThought defaultOpen={false}>
						<ChainOfThoughtHeader>3 steps completed</ChainOfThoughtHeader>
						<ChainOfThoughtContent>
							<ChainOfThoughtStep label="Step 1" status="complete" />
							<ChainOfThoughtStep label="Step 2" status="complete" />
							<ChainOfThoughtStep label="Step 3" status="complete" />
						</ChainOfThoughtContent>
					</ChainOfThought>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
