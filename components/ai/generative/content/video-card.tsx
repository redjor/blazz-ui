"use client"

import Link from "next/link"
import { Play, Clock, ExternalLink } from "lucide-react"
import { cn } from "@/lib/utils"

export interface VideoCardProps {
	title: string
	thumbnail?: string
	duration?: string
	channel?: string
	url?: string
	className?: string
}

export function VideoCard({
	title,
	thumbnail,
	duration,
	channel,
	url,
	className,
}: VideoCardProps) {
	const Wrapper = url ? "a" : "div"
	const wrapperProps = url ? { href: url, target: "_blank", rel: "noopener noreferrer" } : {}

	return (
		<Wrapper
			{...(wrapperProps as Record<string, string>)}
			className={cn(
				"block rounded-lg border border-edge bg-surface overflow-hidden",
				url && "transition-colors hover:bg-raised cursor-pointer",
				className,
			)}
		>
			<div className="relative aspect-video bg-raised">
				{thumbnail ? (
					<img
						src={thumbnail}
						alt={title}
						className="h-full w-full object-cover"
					/>
				) : (
					<div className="flex h-full w-full items-center justify-center">
						<Play className="size-10 text-fg-muted/30" />
					</div>
				)}
				<div className="absolute inset-0 flex items-center justify-center">
					<div className="flex size-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
						<Play className="size-5 text-white fill-white" />
					</div>
				</div>
				{duration && (
					<div className="absolute bottom-2 right-2 rounded bg-black/70 px-1.5 py-0.5">
						<span className="text-xs font-medium text-white tabular-nums">{duration}</span>
					</div>
				)}
			</div>

			<div className="p-3">
				<span className="text-sm font-semibold text-fg line-clamp-2">{title}</span>
				{(channel || url) && (
					<div className="mt-1 flex items-center gap-2">
						{channel && (
							<span className="text-xs text-fg-muted">{channel}</span>
						)}
						{url && (
							<ExternalLink className="size-3 text-fg-muted ml-auto" />
						)}
					</div>
				)}
			</div>
		</Wrapper>
	)
}
