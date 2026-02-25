"use client"

import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocHero } from "@/components/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/docs/doc-example-client"
import {
	ChainOfThought,
	ChainOfThoughtHeader,
	ChainOfThoughtContent,
	ChainOfThoughtStep,
	ChainOfThoughtSearchResults,
	ChainOfThoughtSearchResult,
} from "@blazz/ui/components/ai/reasoning/chain-of-thought"
import { SearchIcon, DatabaseIcon, CodeIcon, CheckCircleIcon } from "lucide-react"

const toc = [{ id: "examples", title: "Examples" }]

export default function ChainOfThoughtPage() {
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
				<DocExample
					title="Step Statuses"
					description="Each step can be complete, active, or pending to show progress."
					code={`<ChainOfThought defaultOpen>
  <ChainOfThoughtHeader>Processing</ChainOfThoughtHeader>
  <ChainOfThoughtContent>
    <ChainOfThoughtStep label="Step 1" status="complete" />
    <ChainOfThoughtStep label="Step 2" status="active" />
    <ChainOfThoughtStep label="Step 3" status="pending" />
  </ChainOfThoughtContent>
</ChainOfThought>`}
				>
					<ChainOfThought defaultOpen>
						<ChainOfThoughtHeader>Processing</ChainOfThoughtHeader>
						<ChainOfThoughtContent>
							<ChainOfThoughtStep
								label="Analyzing input"
								description="Parsed user query successfully"
								status="complete"
							/>
							<ChainOfThoughtStep
								label="Retrieving context"
								status="active"
							/>
							<ChainOfThoughtStep
								label="Generating response"
								status="pending"
							/>
						</ChainOfThoughtContent>
					</ChainOfThought>
				</DocExample>

				<DocExample
					title="With Search Results"
					description="Steps can include nested search result badges."
					code={`<ChainOfThoughtStep
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
</ChainOfThoughtStep>`}
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
				</DocExample>

				<DocExample
					title="Collapsed"
					description="The chain of thought can be collapsed by default."
					code={`<ChainOfThought defaultOpen={false}>
  <ChainOfThoughtHeader>
    3 steps completed
  </ChainOfThoughtHeader>
  <ChainOfThoughtContent>
    ...
  </ChainOfThoughtContent>
</ChainOfThought>`}
				>
					<ChainOfThought defaultOpen={false}>
						<ChainOfThoughtHeader>3 steps completed</ChainOfThoughtHeader>
						<ChainOfThoughtContent>
							<ChainOfThoughtStep label="Step 1" status="complete" />
							<ChainOfThoughtStep label="Step 2" status="complete" />
							<ChainOfThoughtStep label="Step 3" status="complete" />
						</ChainOfThoughtContent>
					</ChainOfThought>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
