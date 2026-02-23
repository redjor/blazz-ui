"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import type { LanguageModelUsage } from "ai"
import {
	Context,
	ContextTrigger,
	ContextContent,
	ContextContentHeader,
	ContextContentBody,
	ContextContentFooter,
	ContextInputUsage,
	ContextOutputUsage,
} from "@/components/ai-elements/context"

const toc = [{ id: "examples", title: "Examples" }]

function mockUsage(input: number, output: number): LanguageModelUsage {
	return {
		inputTokens: input,
		inputTokenDetails: { noCacheTokens: input, cacheReadTokens: undefined, cacheWriteTokens: undefined },
		outputTokens: output,
		outputTokenDetails: { textTokens: output, reasoningTokens: undefined },
		totalTokens: input + output,
	}
}

export default function ContextPage() {
	return (
		<DocPage
			title="Context"
			subtitle="A hover card that displays token usage, cost breakdown, and context window utilization for AI model interactions."
			toc={toc}
		>
			<DocHero>
				<Context
					usedTokens={32000}
					maxTokens={128000}
					usage={mockUsage(24000, 8000)}
					modelId="claude-3-5-sonnet-20241022"
				>
					<ContextTrigger />
					<ContextContent>
						<ContextContentHeader />
						<ContextContentBody>
							<div className="space-y-2">
								<ContextInputUsage />
								<ContextOutputUsage />
							</div>
						</ContextContentBody>
						<ContextContentFooter />
					</ContextContent>
				</Context>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Low Usage"
					description="Context display when only a small portion of the window is used."
					code={`<Context
  usedTokens={5000}
  maxTokens={128000}
  usage={{ inputTokens: 3000, outputTokens: 2000 }}
  modelId="claude-3-5-sonnet-20241022"
>
  <ContextTrigger />
  <ContextContent>
    <ContextContentHeader />
    <ContextContentBody>
      <ContextInputUsage />
      <ContextOutputUsage />
    </ContextContentBody>
    <ContextContentFooter />
  </ContextContent>
</Context>`}
				>
					<Context
						usedTokens={5000}
						maxTokens={128000}
						usage={mockUsage(3000, 2000)}
						modelId="claude-3-5-sonnet-20241022"
					>
						<ContextTrigger />
						<ContextContent>
							<ContextContentHeader />
							<ContextContentBody>
								<div className="space-y-2">
									<ContextInputUsage />
									<ContextOutputUsage />
								</div>
							</ContextContentBody>
							<ContextContentFooter />
						</ContextContent>
					</Context>
				</DocExample>

				<DocExample
					title="High Usage"
					description="Shows the display when approaching context window limits."
					code={`<Context
  usedTokens={100000}
  maxTokens={128000}
  usage={{ inputTokens: 80000, outputTokens: 20000 }}
  modelId="gpt-4o"
>
  <ContextTrigger />
  <ContextContent>
    <ContextContentHeader />
    <ContextContentBody>
      <ContextInputUsage />
      <ContextOutputUsage />
    </ContextContentBody>
    <ContextContentFooter />
  </ContextContent>
</Context>`}
				>
					<Context
						usedTokens={100000}
						maxTokens={128000}
						usage={mockUsage(80000, 20000)}
						modelId="gpt-4o"
					>
						<ContextTrigger />
						<ContextContent>
							<ContextContentHeader />
							<ContextContentBody>
								<div className="space-y-2">
									<ContextInputUsage />
									<ContextOutputUsage />
								</div>
							</ContextContentBody>
							<ContextContentFooter />
						</ContextContent>
					</Context>
				</DocExample>

				<DocExample
					title="Without Model (No Cost)"
					description="When no modelId is provided, cost information is omitted."
					code={`<Context
  usedTokens={15000}
  maxTokens={32000}
>
  <ContextTrigger />
  <ContextContent>
    <ContextContentHeader />
  </ContextContent>
</Context>`}
				>
					<Context
						usedTokens={15000}
						maxTokens={32000}
					>
						<ContextTrigger />
						<ContextContent>
							<ContextContentHeader />
						</ContextContent>
					</Context>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
