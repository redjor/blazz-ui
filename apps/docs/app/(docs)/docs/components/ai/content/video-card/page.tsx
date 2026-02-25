"use client"

import { DocPage } from "@/components/docs/doc-page"
import { DocSection } from "@/components/docs/doc-section"
import { DocHero } from "@/components/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/docs/doc-example-client"
import { VideoCard } from "@blazz/ui/components/ai/generative/content/video-card"

const toc = [{ id: "examples", title: "Examples" }]

export default function VideoCardPage() {
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
				<DocExample
					title="Without Thumbnail"
					description="Video card with placeholder."
					code={`<VideoCard
  title="Product Demo: Forge CRM"
  duration="12:34"
  channel="Forge Academy"
/>`}
				>
					<div className="max-w-xs">
						<VideoCard
							title="Product Demo: Forge CRM"
							duration="12:34"
							channel="Forge Academy"
						/>
					</div>
				</DocExample>

				<DocExample
					title="With Link"
					description="Clickable video card that opens in a new tab."
					code={`<VideoCard
  title="Getting Started with AI Elements"
  duration="5:20"
  channel="Forge Tutorials"
  url="https://example.com/video"
/>`}
				>
					<div className="max-w-xs">
						<VideoCard
							title="Getting Started with AI Elements"
							duration="5:20"
							channel="Forge Tutorials"
							url="https://example.com/video"
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
