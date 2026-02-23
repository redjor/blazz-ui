"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { Shimmer } from "@/components/ai-elements/shimmer"

const toc = [{ id: "examples", title: "Examples" }]

export default function ShimmerPage() {
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
				<DocExample
					title="Default"
					description="A simple shimmer animation on text content."
					code={`<Shimmer>Thinking...</Shimmer>`}
				>
					<Shimmer>Thinking...</Shimmer>
				</DocExample>

				<DocExample
					title="Custom Duration"
					description="Control the animation speed with the duration prop (in seconds)."
					code={`<Shimmer duration={1}>Fast shimmer</Shimmer>
<Shimmer duration={3}>Slow shimmer</Shimmer>`}
				>
					<div className="flex flex-col gap-4">
						<Shimmer duration={1}>Fast shimmer (1s)</Shimmer>
						<Shimmer duration={3}>Slow shimmer (3s)</Shimmer>
					</div>
				</DocExample>

				<DocExample
					title="Different Sizes"
					description="Use className to control text size and weight."
					code={`<Shimmer className="text-xs">Small shimmer</Shimmer>
<Shimmer className="text-base">Medium shimmer</Shimmer>
<Shimmer className="text-xl font-semibold">Large shimmer</Shimmer>`}
				>
					<div className="flex flex-col gap-4">
						<Shimmer className="text-xs">Small shimmer text</Shimmer>
						<Shimmer className="text-base">Medium shimmer text</Shimmer>
						<Shimmer className="text-xl font-semibold">Large shimmer text</Shimmer>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
