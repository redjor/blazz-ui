import { createFileRoute } from "@tanstack/react-router"
import { ImageGallery } from "@blazz/ui/components/ai/generative/content/image-gallery"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"
import { DocHero } from "~/components/docs/doc-hero"
import { DocExampleClient } from "~/components/docs/doc-example-client"
import { highlightCode } from "~/lib/highlight-code"

const examples = [
	{
		key: "multi-image",
		code: `<ImageGallery
  images={[
    { src: "/img/photo1.jpg", caption: "Main office" },
    { src: "/img/photo2.jpg", caption: "Meeting room" },
    { src: "/img/photo3.jpg", caption: "Workspace" },
  ]}
/>`,
	},
	{
		key: "single",
		code: `<ImageGallery
  images={[
    { src: "/img/hero.jpg", alt: "Product shot", caption: "New dashboard design" },
  ]}
/>`,
	},
] as const

export const Route = createFileRoute(
	"/_docs/docs/components/ai/content/image-gallery"
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
	component: ImageGalleryPage,
})

const toc = [{ id: "examples", title: "Examples" }]

function ImageGalleryPage() {
	const { highlighted } = Route.useLoaderData()
	const html = (key: string) =>
		highlighted.find((h) => h.key === key)?.html ?? ""

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
				<DocExampleClient
					title="Multi-Image"
					description="Navigate between images with prev/next buttons."
					code={examples[0].code}
					highlightedCode={html("multi-image")}
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
				</DocExampleClient>

				<DocExampleClient
					title="Single Image"
					description="No navigation when there's only one image."
					code={examples[1].code}
					highlightedCode={html("single")}
				>
					<div className="max-w-sm">
						<ImageGallery
							images={[
								{ src: "https://picsum.photos/seed/single/600/400", alt: "Product shot", caption: "New dashboard design" },
							]}
						/>
					</div>
				</DocExampleClient>
			</DocSection>
		</DocPage>
	)
}
