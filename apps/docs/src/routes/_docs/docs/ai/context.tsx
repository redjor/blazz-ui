import {
	Context,
	ContextContent,
	ContextContentBody,
	ContextContentFooter,
	ContextContentHeader,
	ContextInputUsage,
	ContextOutputUsage,
	ContextTrigger,
} from "@blazz/ui/components/ai/tools/context"
import { createFileRoute } from "@tanstack/react-router"
import type { LanguageModelUsage } from "ai"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "low-usage",
		code: `<Context
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
</Context>`,
	},
	{
		key: "high-usage",
		code: `<Context
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
</Context>`,
	},
	{
		key: "without-model",
		code: `<Context
  usedTokens={15000}
  maxTokens={32000}
>
  <ContextTrigger />
  <ContextContent>
    <ContextContentHeader />
  </ContextContent>
</Context>`,
	},
] as const

export const Route = createFileRoute("/_docs/docs/ai/context")({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: ContextPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function mockUsage(input: number, output: number): LanguageModelUsage {
	return {
		inputTokens: input,
		inputTokenDetails: {
			noCacheTokens: input,
			cacheReadTokens: undefined,
			cacheWriteTokens: undefined,
		},
		outputTokens: output,
		outputTokenDetails: { textTokens: output, reasoningTokens: undefined },
		totalTokens: input + output,
	}
}

function ContextPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

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
				<DocExampleClient
					title="Low Usage"
					description="Context display when only a small portion of the window is used."
					code={examples[0].code}
					highlightedCode={html("low-usage")}
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
				</DocExampleClient>

				<DocExampleClient
					title="High Usage"
					description="Shows the display when approaching context window limits."
					code={examples[1].code}
					highlightedCode={html("high-usage")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Without Model (No Cost)"
					description="When no modelId is provided, cost information is omitted."
					code={examples[2].code}
					highlightedCode={html("without-model")}
				>
					<Context usedTokens={15000} maxTokens={32000}>
						<ContextTrigger />
						<ContextContent>
							<ContextContentHeader />
						</ContextContent>
					</Context>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
