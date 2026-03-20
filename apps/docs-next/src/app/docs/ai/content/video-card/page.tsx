import { VideoCard } from "@blazz/pro/components/ai/generative/content/video-card"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { highlightExamples } from "~/lib/highlight-examples"
const examples = [
	{
		key: "without-thumbnail",
		code: `<VideoCard
  title="Product Demo: Forge CRM"
  duration="12:34"
  channel="Forge Academy"
/>`,
	},
	{
		key: "with-link",
		code: `<VideoCard
  title="Getting Started with AI Elements"
  duration="5:20"
  channel="Forge Tutorials"
  url="https://example.com/video"
/>`,
	},
] as const

const highlightedPromise = highlightExamples(examples as any)


const toc = [{ id: "examples", title: "Examples" }]

export default async function VideoCardPage() {
	const highlighted = await highlightedPromise
	const html = (key: string) => highlighted.find((h) => h.key === key)?.html ?? ""

	return (
		<DocPage
			title="Video Card"
			subtitle="A video thumbnail with play button, duration and metadata."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-xs">
					<VideoCard
						title="Product Demo: Forge CRM Overview"
						duration="12:34"
						channel="Forge Academy"
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExampleClient
					title="Without Thumbnail"
					description="Video card with placeholder."
					code={examples[0].code}
					highlightedCode={html("without-thumbnail")}
				>
					<div className="max-w-xs">
						<VideoCard title="Product Demo: Forge CRM" duration="12:34" channel="Forge Academy" />
					</div>
				</DocExampleClient>

				<DocExampleClient
					title="With Link"
					description="Clickable video card that opens in a new tab."
					code={examples[1].code}
					highlightedCode={html("with-link")}
				>
					<div className="max-w-xs">
						<VideoCard
							title="Getting Started with AI Elements"
							duration="5:20"
							channel="Forge Tutorials"
							url="https://example.com/video"
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
