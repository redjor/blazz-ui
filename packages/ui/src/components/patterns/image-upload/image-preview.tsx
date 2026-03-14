"use client"

import { X } from "lucide-react"
import { Button } from "../../ui/button"
import type { UploadedImage } from "./types"

export interface ImagePreviewProps {
	image: UploadedImage
	onRemove: (id: string) => void
}

export function ImagePreview({ image, onRemove }: ImagePreviewProps) {
	return (
		<div className="relative group aspect-square rounded-lg border border-container overflow-hidden bg-surface-3">
			<img src={image.preview} alt="Preview" className="w-full h-full object-cover" />
			<div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
				<Button
					type="button"
					variant="destructive"
					size="icon-sm"
					onClick={() => onRemove(image.id)}
				>
					<X className="h-4 w-4" />
				</Button>
			</div>
		</div>
	)
}
