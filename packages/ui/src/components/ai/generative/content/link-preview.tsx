"use client"

import { ExternalLink } from "lucide-react"
import { cn } from "../../../../lib/utils"
import { withProGuard } from "../../../../lib/with-pro-guard"

export interface LinkPreviewProps {
	url: string
	title: string
	description?: string
	image?: string
	domain?: string
	className?: string
}

function LinkPreviewBase({ url, title, description, image, domain, className }: LinkPreviewProps) {
	const displayDomain = domain ?? new URL(url).hostname.replace("www.", "")

	return (
		<a
			href={url}
			target="_blank"
			rel="noopener noreferrer"
			className={cn(
				"group flex overflow-hidden rounded-lg border border-container bg-surface transition-colors hover:bg-raised",
				className
			)}
		>
			{image && (
				<div className="hidden sm:block w-32 shrink-0 bg-raised">
					<img src={image} alt="" className="size-full object-cover" />
				</div>
			)}
			<div className="min-w-0 flex-1 p-3">
				<div className="flex items-center gap-1.5">
					<span className="text-xs text-fg-muted">{displayDomain}</span>
					<ExternalLink className="size-3 text-fg-muted opacity-0 transition-opacity group-hover:opacity-100" />
				</div>
				<span className="mt-1 block truncate text-sm font-medium text-fg">{title}</span>
				{description && <p className="mt-0.5 line-clamp-2 text-xs text-fg-muted">{description}</p>}
			</div>
		</a>
	)
}

export const LinkPreview = withProGuard(LinkPreviewBase, "LinkPreview")
