"use client"

import { Suspense } from "react"
import { previewMap } from "~/components/thumbnails"
import { ThumbnailShell } from "~/components/thumbnails/thumbnail-shell"

export function ThumbnailClient({ slug }: { slug: string }) {
	const Preview = previewMap[slug]

	if (!Preview) {
		return <div className="flex items-center justify-center text-fg-muted">No preview for &quot;{slug}&quot;</div>
	}

	return (
		<Suspense>
			<ThumbnailShell>
				<Preview />
			</ThumbnailShell>
		</Suspense>
	)
}
