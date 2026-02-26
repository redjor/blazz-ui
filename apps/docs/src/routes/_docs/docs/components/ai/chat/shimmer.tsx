import { createFileRoute } from "@tanstack/react-router"
import { Shimmer } from "@blazz/ui/components/ai/chat/shimmer"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { highlightCode } from "~/lib/highlight.server"

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

export const Route = createFileRoute(
	"/_docs/docs/components/ai/chat/shimmer"
)({
	loader: async () => {
		const highlighted = await Promise.all(
			examples.map(async (ex) => ({
				key: ex.key,
				html: await highlightCode({ data: { code: ex.code } }),
			}))
		)
		return { highlighted }
	},
	component: ShimmerPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function ShimmerPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

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
