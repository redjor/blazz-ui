"use client"

import * as React from "react"
import { useDropzone } from "react-dropzone"
import { Plus, Upload } from "lucide-react"
import { cn } from "@/lib/utils"
import { ImagePreview } from "./image-preview"
import type { UploadedImage } from "./types"

export interface ImageUploadProps {
	images: UploadedImage[]
	onImagesChange: (images: UploadedImage[]) => void
	maxFiles?: number
	maxSize?: number
	className?: string
}

export function ImageUpload({
	images,
	onImagesChange,
	maxFiles = 10,
	maxSize = 5 * 1024 * 1024, // 5MB
	className,
}: ImageUploadProps) {
	const onDrop = React.useCallback(
		(acceptedFiles: File[]) => {
			const newImages: UploadedImage[] = acceptedFiles.map((file) => ({
				id: `${Date.now()}-${Math.random()}`,
				file,
				preview: URL.createObjectURL(file),
			}))

			const updatedImages = [...images, ...newImages].slice(0, maxFiles)
			onImagesChange(updatedImages)
		},
		[images, maxFiles, onImagesChange]
	)

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".png", ".jpg", ".jpeg", ".webp"],
		},
		maxSize,
		maxFiles: maxFiles - images.length,
		disabled: images.length >= maxFiles,
	})

	const removeImage = (id: string) => {
		const image = images.find((img) => img.id === id)
		if (image) {
			URL.revokeObjectURL(image.preview)
		}
		onImagesChange(images.filter((img) => img.id !== id))
	}

	// Cleanup previews on unmount
	React.useEffect(() => {
		return () => {
			images.forEach((image) => URL.revokeObjectURL(image.preview))
		}
	}, [images])

	return (
		<div className={cn("space-y-4", className)}>
			<div className="grid grid-cols-2 md:grid-cols-3 gap-4">
				{images.map((image) => (
					<ImagePreview key={image.id} image={image} onRemove={removeImage} />
				))}

				{images.length < maxFiles && (
					<div
						{...getRootProps()}
						className={cn(
							"aspect-square rounded-lg border-2 border-dashed border-input cursor-pointer",
							"flex flex-col items-center justify-center gap-2",
							"hover:border-primary hover:bg-primary/5 transition-colors",
							isDragActive && "border-primary bg-primary/10"
						)}
					>
						<input {...getInputProps()} />
						{isDragActive ? (
							<>
								<Upload className="h-8 w-8 text-muted-foreground" />
								<p className="text-sm text-muted-foreground">Drop the files here...</p>
							</>
						) : (
							<>
								<Plus className="h-8 w-8 text-muted-foreground" />
								<p className="text-sm text-muted-foreground text-center px-2">
									Add image
								</p>
							</>
						)}
					</div>
				)}
			</div>

			{images.length > 0 && (
				<p className="text-sm text-muted-foreground">
					{images.length} / {maxFiles} images
				</p>
			)}
		</div>
	)
}
