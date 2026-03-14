"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { cn } from "../../../../lib/utils"
import { withProGuard } from "../../../../lib/with-pro-guard"

export interface ImageGalleryItem {
	src: string
	alt?: string
	caption?: string
}

export interface ImageGalleryProps {
	images: ImageGalleryItem[]
	className?: string
}

function ImageGalleryBase({ images, className }: ImageGalleryProps) {
	const [current, setCurrent] = useState(0)

	if (images.length === 0) return null

	const hasPrev = current > 0
	const hasNext = current < images.length - 1
	const image = images[current]

	return (
		<div className={cn("overflow-hidden rounded-lg border border-container bg-surface", className)}>
			<div className="relative">
				<img
					src={image.src}
					alt={image.alt ?? ""}
					className="aspect-video w-full object-cover bg-surface-3"
				/>

				{images.length > 1 && (
					<>
						{hasPrev && (
							<button
								type="button"
								onClick={() => setCurrent((c) => c - 1)}
								className="absolute left-2 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-full bg-surface/80 border border-container backdrop-blur-sm transition-colors hover:bg-surface cursor-pointer"
							>
								<ChevronLeft className="size-4 text-fg" />
							</button>
						)}
						{hasNext && (
							<button
								type="button"
								onClick={() => setCurrent((c) => c + 1)}
								className="absolute right-2 top-1/2 -translate-y-1/2 flex size-7 items-center justify-center rounded-full bg-surface/80 border border-container backdrop-blur-sm transition-colors hover:bg-surface cursor-pointer"
							>
								<ChevronRight className="size-4 text-fg" />
							</button>
						)}

						{/* Dots */}
						<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
							{images.map((_, i) => (
								<button
									key={i}
									type="button"
									onClick={() => setCurrent(i)}
									className={cn(
										"size-1.5 rounded-full transition-colors cursor-pointer",
										i === current ? "bg-white" : "bg-white/50"
									)}
								/>
							))}
						</div>
					</>
				)}
			</div>

			{image.caption && (
				<div className="px-3 py-2">
					<span className="text-xs text-fg-muted">{image.caption}</span>
				</div>
			)}
		</div>
	)
}

export const ImageGallery = withProGuard(ImageGalleryBase, "ImageGallery")
