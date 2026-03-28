"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { Dialog, DialogContent } from "@blazz/ui/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@blazz/ui/components/ui/dropdown-menu"
import { Archive, BookmarkPlus, Globe, MoreVertical, Pencil, Pin, PinOff, Play, Trash2, X } from "lucide-react"
import { useState } from "react"
import type { Doc } from "@/convex/_generated/dataModel"

const TYPE_CONFIG: Record<string, { label: string; color: string }> = {
	tweet: { label: "Tweet", color: "bg-sky-500/10 text-sky-600 dark:text-sky-400" },
	youtube: { label: "YouTube", color: "bg-red-500/10 text-red-600 dark:text-red-400" },
	image: { label: "Image", color: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
	video: { label: "Vidéo", color: "bg-purple-500/10 text-purple-600 dark:text-purple-400" },
	link: { label: "Lien", color: "bg-blue-500/10 text-blue-600 dark:text-blue-400" },
}

interface BookmarkCardProps {
	bookmark: Doc<"bookmarks">
	tags?: { _id: string; name: string; color: string }[]
	onEdit: () => void
	onArchive: () => void
	onDelete: () => void
	onPin: () => void
	onReadLater?: () => void
}

function YouTubePlayerDialog({ open, onOpenChange, embedUrl, title }: { open: boolean; onOpenChange: (open: boolean) => void; embedUrl: string; title?: string }) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent size="full" showCloseButton={false} className="!max-w-[90vw] p-0 overflow-hidden bg-black border-none ring-0">
				<div className="relative">
					<Button size="icon-sm" variant="ghost" className="absolute top-2 right-2 z-10 text-white hover:bg-white/20" onClick={() => onOpenChange(false)}>
						<X className="size-4" />
					</Button>
					<div className="aspect-video w-full">
						{open && (
							<iframe
								src={`${embedUrl}?autoplay=1`}
								title={title ?? "YouTube video"}
								className="size-full"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							/>
						)}
					</div>
				</div>
			</DialogContent>
		</Dialog>
	)
}

function ThumbnailArea({ bookmark }: { bookmark: Doc<"bookmarks"> }) {
	const { type, thumbnailUrl } = bookmark

	if (type === "youtube" && thumbnailUrl) {
		return (
			<div className="relative aspect-video overflow-hidden rounded-t-lg bg-card">
				<img src={thumbnailUrl} alt="" className="size-full object-cover" />
				<div className="absolute inset-0 flex items-center justify-center bg-black/20">
					<div className="flex size-10 items-center justify-center rounded-full bg-black/60 text-white">
						<Play className="size-5 ml-0.5" />
					</div>
				</div>
			</div>
		)
	}

	if (type === "image" && thumbnailUrl) {
		return (
			<div className="relative aspect-video overflow-hidden rounded-t-lg bg-card">
				<img src={thumbnailUrl} alt="" className="size-full object-cover" />
			</div>
		)
	}

	if (type === "video" && thumbnailUrl) {
		return (
			<div className="relative aspect-video overflow-hidden rounded-t-lg bg-card">
				<img src={thumbnailUrl} alt="" className="size-full object-cover" />
				<div className="absolute inset-0 flex items-center justify-center bg-black/20">
					<div className="flex size-10 items-center justify-center rounded-full bg-black/60 text-white">
						<Play className="size-5 ml-0.5" />
					</div>
				</div>
			</div>
		)
	}

	if (type === "tweet") {
		return (
			<div className="relative aspect-video overflow-hidden rounded-t-lg bg-gradient-to-br from-sky-500/20 to-blue-600/20 flex items-center justify-center">
				{thumbnailUrl ? (
					<img src={thumbnailUrl} alt="" className="size-full object-cover" />
				) : (
					<svg className="size-8 text-sky-500/60" viewBox="0 0 24 24" fill="currentColor">
						<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
					</svg>
				)}
			</div>
		)
	}

	// link or fallback
	if (thumbnailUrl) {
		return (
			<div className="relative aspect-video overflow-hidden rounded-t-lg bg-card">
				<img src={thumbnailUrl} alt="" className="size-full object-cover" />
			</div>
		)
	}

	return (
		<div className="relative aspect-video overflow-hidden rounded-t-lg bg-gradient-to-br from-brand/10 to-brand/5 flex items-center justify-center">
			<Globe className="size-8 text-fg-muted/40" />
		</div>
	)
}

export function BookmarkCard({ bookmark, tags: allTags, onEdit, onArchive, onDelete, onPin, onReadLater }: BookmarkCardProps) {
	const config = TYPE_CONFIG[bookmark.type] ?? TYPE_CONFIG.link
	const [playerOpen, setPlayerOpen] = useState(false)

	const tagDocs = bookmark.tags?.map((id) => allTags?.find((t) => t._id === id)).filter(Boolean) as { _id: string; name: string; color: string }[] | undefined

	const isYouTubePlayable = bookmark.type === "youtube" && bookmark.embedUrl

	const handleThumbnailClick = (e: React.MouseEvent) => {
		if (isYouTubePlayable) {
			e.preventDefault()
			setPlayerOpen(true)
		}
	}

	return (
		<Card className="group relative overflow-hidden transition-shadow hover:shadow-md">
			<a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="block cursor-pointer" onClick={handleThumbnailClick}>
				<ThumbnailArea bookmark={bookmark} />
			</a>

			{/* YouTube player modal */}
			{isYouTubePlayable && <YouTubePlayerDialog open={playerOpen} onOpenChange={setPlayerOpen} embedUrl={bookmark.embedUrl!} title={bookmark.title ?? undefined} />}

			{/* 3-dot menu */}
			<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
				<DropdownMenu>
					<DropdownMenuTrigger render={<Button size="icon-sm" variant="secondary" className="size-7 shadow-sm" />}>
						<MoreVertical className="size-3.5" />
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={onPin}>
							{bookmark.pinned ? <PinOff className="size-4 mr-2" /> : <Pin className="size-4 mr-2" />}
							{bookmark.pinned ? "Désépingler" : "Épingler"}
						</DropdownMenuItem>
						{onReadLater && (
							<DropdownMenuItem onClick={onReadLater}>
								<BookmarkPlus className="size-4 mr-2" />
								Read Later
							</DropdownMenuItem>
						)}
						<DropdownMenuItem onClick={onEdit}>
							<Pencil className="size-4 mr-2" />
							Modifier
						</DropdownMenuItem>
						<DropdownMenuItem onClick={onArchive}>
							<Archive className="size-4 mr-2" />
							Archiver
						</DropdownMenuItem>
						<DropdownMenuItem onClick={onDelete} className="text-red-600 dark:text-red-400">
							<Trash2 className="size-4 mr-2" />
							Supprimer
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			{/* Pin indicator */}
			{bookmark.pinned && (
				<div className="absolute top-2 left-2">
					<div className="flex size-6 items-center justify-center rounded-full bg-brand/90 text-white shadow-sm">
						<Pin className="size-3" />
					</div>
				</div>
			)}

			<CardContent className="p-3 space-y-1.5">
				<div className="flex items-center gap-1.5">
					<span className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${config.color}`}>{config.label}</span>
				</div>

				<a href={bookmark.url} target="_blank" rel="noopener noreferrer" className="block">
					<p className="text-sm font-medium text-fg line-clamp-2 hover:underline">{bookmark.title || bookmark.url}</p>
				</a>

				{bookmark.type === "link" && bookmark.description && <p className="text-xs text-fg-muted line-clamp-2">{bookmark.description}</p>}

				{bookmark.type === "tweet" && (
					<>
						{(bookmark.author || bookmark.siteName) && <p className="text-xs text-fg-muted truncate">{bookmark.author || bookmark.siteName}</p>}
						{bookmark.description && <p className="text-xs text-fg-muted line-clamp-2">{bookmark.description}</p>}
					</>
				)}

				{bookmark.type !== "tweet" && (bookmark.author || bookmark.siteName) && <p className="text-xs text-fg-muted truncate">{bookmark.author || bookmark.siteName}</p>}

				{tagDocs && tagDocs.length > 0 && (
					<div className="flex flex-wrap gap-1 pt-0.5">
						{tagDocs.map((tag) => (
							<Badge key={tag._id} variant="secondary" size="xs" fill="subtle">
								{tag.name}
							</Badge>
						))}
					</div>
				)}
			</CardContent>
		</Card>
	)
}
