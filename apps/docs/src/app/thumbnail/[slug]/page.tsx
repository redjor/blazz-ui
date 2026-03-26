import { thumbnailRegistry } from "~/config/thumbnail-registry"
import { ThumbnailClient } from "./client"

export function generateStaticParams() {
	return thumbnailRegistry.map((entry) => ({ slug: entry.slug }))
}

export default async function ThumbnailPage({ params }: { params: Promise<{ slug: string }> }) {
	const { slug } = await params
	return <ThumbnailClient slug={slug} />
}
