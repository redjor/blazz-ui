"use client"

import { DocPage } from "@/components/features/docs/doc-page"
import { DocSection } from "@/components/features/docs/doc-section"
import { DocHero } from "@/components/features/docs/doc-hero"
import { DocExampleSync as DocExample } from "@/components/features/docs/doc-example-client"
import { ImageGallery } from "@/components/ai/generative/image-gallery"

const toc = [{ id: "examples", title: "Examples" }]

export default function ImageGalleryPage() {
	return (
		<DocPage
			title="Image Gallery"
			subtitle="An inline image carousel with navigation and captions."
			toc={toc}
		>
			<DocHero>
				<div className="max-w-sm">
					<ImageGallery
						images={[
							{ src: "https://picsum.photos/seed/office1/600/400", alt: "Office space", caption: "Main office — 3rd floor" },
							{ src: "https://picsum.photos/seed/office2/600/400", alt: "Meeting room", caption: "Conference room A" },
							{ src: "https://picsum.photos/seed/office3/600/400", alt: "Workspace", caption: "Open workspace area" },
						]}
					/>
				</div>
			</DocHero>

			<DocSection id="examples" title="Examples">
				<DocExample
					title="Multi-Image"
					description="Navigate between images with prev/next buttons."
					code={`<ImageGallery
  images={[
    { src: "/img/photo1.jpg", caption: "Main office" },
    { src: "/img/photo2.jpg", caption: "Meeting room" },
    { src: "/img/photo3.jpg", caption: "Workspace" },
  ]}
/>`}
				>
					<div className="max-w-sm">
						<ImageGallery
							images={[
								{ src: "https://picsum.photos/seed/a1/600/400", caption: "Main office" },
								{ src: "https://picsum.photos/seed/a2/600/400", caption: "Meeting room" },
								{ src: "https://picsum.photos/seed/a3/600/400", caption: "Workspace" },
							]}
						/>
					</div>
				</DocExample>

				<DocExample
					title="Single Image"
					description="No navigation when there's only one image."
					code={`<ImageGallery
  images={[
    { src: "/img/hero.jpg", alt: "Product shot", caption: "New dashboard design" },
  ]}
/>`}
				>
					<div className="max-w-sm">
						<ImageGallery
							images={[
								{ src: "https://picsum.photos/seed/single/600/400", alt: "Product shot", caption: "New dashboard design" },
							]}
						/>
					</div>
				</DocExample>
			</DocSection>
		</DocPage>
	)
}
