import { createFileRoute } from "@tanstack/react-router"
import { VideoCard } from "@blazz/ui/components/ai/generative/content/video-card"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { highlightCode } from "~/lib/highlight.server"

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

export const Route = createFileRoute(
	"/_docs/docs/components/ai/content/video-card"
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
	component: VideoCardPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function VideoCardPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

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
						<VideoCard
							title="Product Demo: Forge CRM"
							duration="12:34"
							channel="Forge Academy"
						/>
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
