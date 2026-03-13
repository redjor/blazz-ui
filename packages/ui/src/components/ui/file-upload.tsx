"use client"

import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react"
import * as React from "react"
import { cn } from "../../lib/utils"

export interface FileUploadProps {
	value?: File[]
	onValueChange?: (files: File[]) => void
	/** Accepted file types (e.g. "image/*,.pdf") */
	accept?: string
	/** Allow multiple files. @default false */
	multiple?: boolean
	/** Max file size in bytes */
	maxSize?: number
	/** Max number of files */
	maxFiles?: number
	disabled?: boolean
	className?: string
	/** Placeholder text */
	placeholder?: string
	/** Description text below the placeholder */
	description?: string
}

function FileUpload({
	value = [],
	onValueChange,
	accept,
	multiple = false,
	maxSize,
	maxFiles,
	disabled = false,
	className,
	placeholder = "Drag and drop files here, or click to browse",
	description,
}: FileUploadProps) {
	const [isDragging, setIsDragging] = React.useState(false)
	const inputRef = React.useRef<HTMLInputElement>(null)

	const handleFiles = React.useCallback(
		(fileList: FileList | null) => {
			if (!fileList) return
			let files = Array.from(fileList)

			if (maxSize) {
				files = files.filter((f) => f.size <= maxSize)
			}
			if (maxFiles) {
				files = files.slice(0, maxFiles - value.length)
			}

			const next = multiple ? [...value, ...files] : files.slice(0, 1)
			onValueChange?.(next)
		},
		[value, multiple, maxSize, maxFiles, onValueChange]
	)

	const handleDrop = React.useCallback(
		(e: React.DragEvent) => {
			e.preventDefault()
			setIsDragging(false)
			if (disabled) return
			handleFiles(e.dataTransfer.files)
		},
		[disabled, handleFiles]
	)

	const removeFile = (index: number) => {
		const next = value.filter((_, i) => i !== index)
		onValueChange?.(next)
	}

	const formatSize = (bytes: number) => {
		if (bytes < 1024) return `${bytes} B`
		if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
		return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
	}

	return (
		<div data-slot="file-upload" className={cn("space-y-2", className)}>
			<div
				role="button"
				tabIndex={disabled ? -1 : 0}
				onClick={() => !disabled && inputRef.current?.click()}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.preventDefault()
						!disabled && inputRef.current?.click()
					}
				}}
				onDragOver={(e) => {
					e.preventDefault()
					if (!disabled) setIsDragging(true)
				}}
				onDragLeave={() => setIsDragging(false)}
				onDrop={handleDrop}
				className={cn(
					"flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed p-6",
					"border-edge bg-surface text-center",
					"transition-colors duration-150 cursor-pointer",
					"hover:bg-raised hover:border-fg-muted",
					"focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-brand/20 focus-visible:border-brand",
					isDragging && "border-brand bg-brand/5",
					disabled && "opacity-50 pointer-events-none cursor-not-allowed"
				)}
			>
				<UploadCloudIcon className="size-8 text-fg-muted" />
				<p className="text-sm text-fg-muted">{placeholder}</p>
				{description && <p className="text-xs text-fg-muted">{description}</p>}
			</div>

			<input
				ref={inputRef}
				type="file"
				accept={accept}
				multiple={multiple}
				disabled={disabled}
				onChange={(e) => handleFiles(e.target.files)}
				className="sr-only"
				tabIndex={-1}
			/>

			{value.length > 0 && (
				<ul className="space-y-1">
					{value.map((file, i) => (
						<li
							key={`${file.name}-${i}`}
							className="flex items-center gap-2 rounded-md border border-edge bg-surface px-2.5 py-1.5 text-sm"
						>
							<FileIcon className="size-4 shrink-0 text-fg-muted" />
							<span className="truncate flex-1 text-fg">{file.name}</span>
							<span className="shrink-0 text-xs text-fg-muted tabular-nums">
								{formatSize(file.size)}
							</span>
							<button
								type="button"
								onClick={() => removeFile(i)}
								className="shrink-0 text-fg-muted hover:text-fg transition-colors outline-none"
								aria-label={`Remove ${file.name}`}
							>
								<XIcon className="size-3.5" />
							</button>
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export { FileUpload }
