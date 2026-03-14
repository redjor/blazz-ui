"use client"

import { Download, File, FileCode, FileImage, FileSpreadsheet, FileText } from "lucide-react"
import Link from "next/link"
import { cn } from "../../../../lib/utils"
import { withProGuard } from "../../../../lib/with-pro-guard"

const iconMap: Record<string, typeof FileText> = {
	pdf: FileText,
	doc: FileText,
	docx: FileText,
	txt: FileText,
	png: FileImage,
	jpg: FileImage,
	jpeg: FileImage,
	gif: FileImage,
	svg: FileImage,
	webp: FileImage,
	xls: FileSpreadsheet,
	xlsx: FileSpreadsheet,
	csv: FileSpreadsheet,
	js: FileCode,
	ts: FileCode,
	tsx: FileCode,
	jsx: FileCode,
	json: FileCode,
	html: FileCode,
	css: FileCode,
}

function getFileIcon(filename: string) {
	const ext = filename.split(".").pop()?.toLowerCase() ?? ""
	return iconMap[ext] ?? File
}

export interface FileCardProps {
	name: string
	size?: string
	type?: string
	href?: string
	className?: string
}

function FileCardBase({ name, size, type, href, className }: FileCardProps) {
	const Icon = getFileIcon(name)
	const Wrapper = href ? Link : "div"
	const wrapperProps = href ? { href } : {}

	return (
		<Wrapper
			{...(wrapperProps as Record<string, string>)}
			className={cn(
				"flex items-center gap-3 rounded-lg border border-container bg-surface p-3",
				href && "transition-colors hover:bg-surface-3 cursor-pointer",
				className
			)}
		>
			<div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-surface-3 border border-container">
				<Icon className="size-5 text-fg-muted" />
			</div>
			<div className="min-w-0 flex-1">
				<span className="block truncate text-sm font-medium text-fg">{name}</span>
				<span className="text-xs text-fg-muted">{[type, size].filter(Boolean).join(" · ")}</span>
			</div>
			{href && <Download className="size-4 shrink-0 text-fg-muted" />}
		</Wrapper>
	)
}

export const FileCard = withProGuard(FileCardBase, "FileCard")
