"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import {
	Reasoning,
	ReasoningTrigger,
	ReasoningContent,
} from "@/components/ai/reasoning/reasoning"

const toc = [{ id: "examples", title: "Examples" }]

const mockReasoning = `The user is asking about React performance optimization. I should cover the main areas:

1. Component memoization - React.memo, useMemo, useCallback
2. Code splitting - lazy loading with React.lazy and Suspense
3. Virtual DOM optimizations - keys, avoiding unnecessary re-renders
4. Bundle size reduction - tree shaking, dynamic imports

Let me structure the response clearly with practical examples for each technique.`

export default function ReasoningPage() {
	return (
		<DocPage
			title="Reasoning"
			subtitle="A collapsible panel that reveals the AI model's thinking process, with streaming support and auto-open/close behavior."
			toc={toc}
		>
			<DocHero>
				<div className="w-full max-w-lg">
					<Reasoning defaultOpen duration={8}>
						<ReasoningTrigger />
						<ReasoningContent>{mockReasoning}</ReasoningContent>
					</Reasoning>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Expanded by Default"
					description="Set defaultOpen to true to show the reasoning content immediately."
					code={`<Reasoning defaultOpen duration={8}>
  <ReasoningTrigger />
  <ReasoningContent>
    Thinking about the problem step by step...
  </ReasoningContent>
</Reasoning>`}
				>
					<div className="w-full">
						<Reasoning defaultOpen duration={8}>
							<ReasoningTrigger />
							<ReasoningContent>
								The user wants to understand how React Server Components work. Let me break this down into the key concepts: server-only rendering, zero client-side JavaScript for server components, and the boundary between server and client components.
							</ReasoningContent>
						</Reasoning>
					</div>
				</DocExample>

				<DocExample
					title="Collapsed"
					description="By default reasoning is collapsed, showing only the trigger with duration."
					code={`<Reasoning defaultOpen={false} duration={5}>
  <ReasoningTrigger />
  <ReasoningContent>
    Internal reasoning content...
  </ReasoningContent>
</Reasoning>`}
				>
					<div className="w-full">
						<Reasoning defaultOpen={false} duration={5}>
							<ReasoningTrigger />
							<ReasoningContent>
								I need to analyze the user's codebase structure and identify potential areas for optimization. The main bottlenecks appear to be in the data fetching layer and the rendering pipeline.
							</ReasoningContent>
						</Reasoning>
					</div>
				</DocExample>

				<DocExample
					title="Streaming State"
					description="When isStreaming is true, the trigger shows an animated shimmer effect."
					code={`<Reasoning isStreaming defaultOpen>
  <ReasoningTrigger />
  <ReasoningContent>
    Thinking...
  </ReasoningContent>
</Reasoning>`}
				>
					<div className="w-full">
						<Reasoning isStreaming defaultOpen>
							<ReasoningTrigger />
							<ReasoningContent>
								Analyzing the question about state management patterns. I should compare different approaches including local state, context, and external stores...
							</ReasoningContent>
						</Reasoning>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
