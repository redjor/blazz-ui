import { Shimmer } from "@blazz/pro/components/ai/chat/shimmer"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"

const examples = [
	{
		key: "default",
		code: `<Shimmer>Thinking...</Shimmer>`,
	},
	{
		key: "custom-duration",
		code: `<Shimmer duration={1}>Fast shimmer</Shimmer>
<Shimmer duration={3}>Slow shimmer</Shimmer>`,
	},
	{
		key: "sizes",
		code: `<Shimmer className="text-xs">Small shimmer</Shimmer>
<Shimmer className="text-base">Medium shimmer</Shimmer>
<Shimmer className="text-xl font-semibold">Large shimmer</Shimmer>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)

const toc = [{ id: "examples", title: "Examples" }]

export default async function ShimmerPage() {
	const highlighted = await highlightedPromise
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Shimmer"
			subtitle="An animated text shimmer effect for loading states and thinking indicators in AI interfaces."
			toc={toc}
		>
			<DocHero>
				<Shimmer className="text-lg font-medium">Thinking...</Shimmer>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Default"
					description="A simple shimmer animation on text content."
					code={examples[0].code}
					highlightedCode={html("default")}
				>
					<Shimmer>Thinking...</Shimmer>
				</DocExampleClient>

				<DocExampleClient
					title="Custom Duration"
					description="Control the animation speed with the duration prop (in seconds)."
					code={examples[1].code}
					highlightedCode={html("custom-duration")}
				>
					<div className="flex flex-col gap-4">
						<Shimmer duration={1}>Fast shimmer (1s)</Shimmer>
						<Shimmer duration={3}>Slow shimmer (3s)</Shimmer>
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="Different Sizes"
					description="Use className to control text size and weight."
					code={examples[2].code}
					highlightedCode={html("sizes")}
				>
					<div className="flex flex-col gap-4">
						<Shimmer className="text-xs">Small shimmer text</Shimmer>
						<Shimmer className="text-base">Medium shimmer text</Shimmer>
						<Shimmer className="text-xl font-semibold">Large shimmer text</Shimmer>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
