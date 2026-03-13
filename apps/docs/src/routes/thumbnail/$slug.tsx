import { createFileRoute } from "@tanstack/react-router"
import { previewMap } from "~/components/thumbnails"
import { ThumbnailShell } from "~/components/thumbnails/thumbnail-shell"
import { thumbnailRegistry } from "~/config/thumbnail-registry"

export const Route = createFileRoute("/thumbnail/$slug")({
	component: ThumbnailPage,
})

function ThumbnailPage() {
	const { slug } = Route.useParams()
	const entry = thumbnailRegistry.find((e) => e.slug === slug)
	if (!entry) return <div>Not found</div>

	const Preview = previewMap[slug]
	if (!Preview) return <div>Not found</div>

	return (
		<ThumbnailShell>
			<Preview />
		</ThumbnailShell>
	)
}
