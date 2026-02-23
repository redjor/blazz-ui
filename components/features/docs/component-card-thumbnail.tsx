"use client"

import Image from "next/image"
import { useTheme } from "next-themes"

export function ComponentCardThumbnail({ slug, alt }: { slug: string; alt: string }) {
	const { resolvedTheme } = useTheme()
	const theme = resolvedTheme === "dark" ? "dark" : "light"
	return (
		<div className="relative overflow-hidden border-b border-edge aspect-[5/3]">
			<Image
				src={`/thumbnails/${theme}/${slug}.png`}
				alt={alt}
				fill
				className="object-cover scale-110"
			/>
		</div>
	)
}
