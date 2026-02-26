export function ComponentCardThumbnail({ slug, alt }: { slug: string; alt: string }) {
	return (
		<div className="relative overflow-hidden border-b border-separator aspect-[5/3]">
			<img
				src={`/thumbnails/dark/${slug}.png`}
				alt={alt}
				className="object-cover scale-110 w-full h-full"
			/>
		</div>
	)
}
