import Image from "next/image"

export function ComponentCardThumbnail({ slug, alt }: { slug: string; alt: string }) {
	return (
		<div className="relative overflow-hidden border-b border-separator aspect-[5/3]">
			<Image
				src={`/thumbnails/dark/${slug}.png`}
				alt={alt}
				fill
				className="object-cover scale-110"
			/>
		</div>
	)
}
