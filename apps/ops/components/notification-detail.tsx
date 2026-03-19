"use client"

import { useMutation } from "convex/react"
import { ExternalLink, Archive } from "lucide-react"
import { formatDistanceToNowStrict } from "date-fns"
import { Button } from "@blazz/ui"
import { Badge } from "@blazz/ui"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"

const sourceBadgeVariant: Record<string, "default" | "success" | "info"> = {
	github: "default",
	vercel: "info",
	convex: "success",
}

export function NotificationDetail({ notification }: { notification: Doc<"notifications"> }) {
	const archiveMutation = useMutation(api.notifications.archive)

	const timeAgo = formatDistanceToNowStrict(new Date(notification.createdAt), {
		addSuffix: true,
	})

	return (
		<BlockStack gap="400" className="p-6">
			{/* Header */}
			<BlockStack gap="200">
				<InlineStack gap="200" blockAlign="center">
					<Badge variant={sourceBadgeVariant[notification.source] ?? "default"}>
						{notification.source}
					</Badge>
					<span className="text-xs text-fg-muted">{timeAgo}</span>
				</InlineStack>
				<h2 className="text-lg font-semibold text-fg">{notification.title}</h2>
			</BlockStack>

			{/* Body */}
			<p className="text-sm text-fg-muted leading-relaxed">{notification.description}</p>

			{/* Author */}
			<InlineStack gap="200" blockAlign="center">
				{notification.authorAvatar ? (
					<img
						src={notification.authorAvatar}
						alt={notification.authorName}
						className="size-5 rounded-full"
					/>
				) : (
					<div
						className="flex size-5 items-center justify-center rounded-full text-[9px] font-semibold text-white"
						style={{ backgroundColor: notification.authorColor ?? "#6b7280" }}
					>
						{notification.authorInitials}
					</div>
				)}
				<span className="text-xs text-fg-muted">{notification.authorName}</span>
			</InlineStack>

			{/* Actions */}
			<InlineStack gap="200">
				{notification.url && (
					<Button
						variant="outline"
						size="sm"
						onClick={() => window.open(notification.url!, "_blank")}
					>
						<ExternalLink className="mr-1.5 size-3.5" />
						Open in {notification.source}
					</Button>
				)}
				<Button
					variant="ghost"
					size="sm"
					onClick={() => archiveMutation({ id: notification._id })}
				>
					<Archive className="mr-1.5 size-3.5" />
					Archive
				</Button>
			</InlineStack>
		</BlockStack>
	)
}
