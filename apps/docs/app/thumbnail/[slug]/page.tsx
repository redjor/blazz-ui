import { Suspense } from "react"
import { notFound } from "next/navigation"
import { thumbnailRegistry } from "@/config/thumbnail-registry"
import { previewMap } from "@/components/thumbnails"
import { ThumbnailShell } from "@/components/thumbnails/thumbnail-shell"

type Params = Promise<{ slug: string }>

export default async function ThumbnailPage({ params }: { params: Params }) {
  const { slug } = await params
  const entry = thumbnailRegistry.find((e) => e.slug === slug)
  if (!entry) notFound()

  const Preview = previewMap[slug]
  if (!Preview) notFound()

  return (
    <Suspense>
      <ThumbnailShell>
        <Preview />
      </ThumbnailShell>
    </Suspense>
  )
}

export function generateStaticParams() {
  return thumbnailRegistry.map((entry) => ({ slug: entry.slug }))
}
