"use client"

import { ImageIcon } from "lucide-react"
import { cn } from "../../../../lib/utils"

export interface CellImageProps {
	/** Image source URL */
	src: string
	/** Alt text for the image */
	alt?: string
	/** Image size in pixels (default 40) */
	size?: number
	/** Border radius style */
	rounded?: "sm" | "md" | "full"
}

const roundedClasses = {
	sm: "rounded-md",
	md: "rounded-lg",
	full: "rounded-full",
} as const

/**
 * Renders a thumbnail image with a placeholder fallback.
 */
export function CellImage({ src, alt, size = 40, rounded = "sm" }: CellImageProps) {
	const rClass = roundedClasses[rounded]

	if (!src) {
		return (
			<div
				className={cn(
					"flex items-center justify-center bg-raised border border-container text-fg-muted",
					rClass
				)}
				style={{ width: size, height: size }}
			>
				<ImageIcon className="size-4" />
			</div>
		)
	}

	return (
		<img
			src={src}
			alt={alt ?? ""}
			className={cn("object-cover", rClass)}
			style={{ width: size, height: size }}
		/>
	)
}
