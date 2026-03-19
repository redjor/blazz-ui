"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { formatDistanceToNow } from "date-fns"
import { fr } from "date-fns/locale"
import { Rss, Star, Youtube } from "lucide-react"
import type { Doc } from "@/convex/_generated/dataModel"

interface FeedItemCardProps {
	item: Doc<"feedItems">
	sourceName?: string
	onToggleFavorite: () => void
	onMarkRead: () => void
}

export function FeedItemCard({ item, sourceName, onToggleFavorite, onMarkRead }: FeedItemCardProps) {
	const SourceIcon = item.type === "youtube" ? Youtube : Rss

	const handleClick = () => {
		window.open(item.url, "_blank", "noopener")
		if (!item.isRead) {
			onMarkRead()
		}
	}

	return (
		<Box
			as="article"
			padding="4"
			background="surface"
			borderWidth="1"
			borderColor="edge"
			borderRadius="lg"
			className="cursor-pointer transition-colors hover:bg-raised"
			onClick={handleClick}
		>
			<BlockStack gap="3">
				{/* Header: source + time + favorite */}
				<InlineStack align="space-between" blockAlign="center">
					<InlineStack gap="2" blockAlign="center">
						<SourceIcon className="size-3.5 text-fg-muted shrink-0" />
						{sourceName && (
							<span className="text-[13px] text-fg-muted font-medium">{sourceName}</span>
						)}
						<span className="text-[13px] text-fg-muted">
							{formatDistanceToNow(new Date(item.publishedAt), {
								addSuffix: true,
								locale: fr,
							})}
						</span>
					</InlineStack>
					<button
						type="button"
						onClick={(e) => {
							e.stopPropagation()
							onToggleFavorite()
						}}
						className="p-1 rounded hover:bg-surface-hover transition-colors"
					>
						<Star
							className={`size-3.5 ${item.isFavorite ? "fill-amber-400 text-amber-400" : "text-fg-muted"}`}
						/>
					</button>
				</InlineStack>

				{/* YouTube thumbnail */}
				{item.type === "youtube" && item.thumbnailUrl && (
					<img
						src={item.thumbnailUrl}
						alt=""
						className="w-full aspect-video object-cover rounded-md"
					/>
				)}

				{/* Title */}
				<h3
					className={`text-sm font-medium leading-snug line-clamp-2 ${
						item.isRead ? "text-fg-muted" : "text-fg"
					}`}
				>
					{item.title}
				</h3>

				{/* AI summary */}
				{item.aiSummary ? (
					<p className="text-[13px] text-fg-muted leading-relaxed line-clamp-2">
						{item.aiSummary}
					</p>
				) : (
					<BlockStack gap="1.5">
						<Skeleton className="h-3 w-full" />
						<Skeleton className="h-3 w-3/4" />
					</BlockStack>
				)}

				{/* AI tags */}
				{item.aiTags && item.aiTags.length > 0 && (
					<InlineStack gap="1.5" wrap>
						{item.aiTags.map((tag) => (
							<Badge key={tag} variant="secondary" className="text-[11px] px-1.5 py-0">
								{tag}
							</Badge>
						))}
					</InlineStack>
				)}
			</BlockStack>
		</Box>
	)
}
