"use client"

import { useMutation } from "convex/react"
import { ExternalLink, Archive, ArrowRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatDistanceToNowStrict } from "date-fns"
import { Button } from "@blazz/ui"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Card, CardContent, CardFooter } from "@blazz/ui/components/ui/card"
import { Divider } from "@blazz/ui/components/ui/divider"
import { api } from "@/convex/_generated/api"
import type { Doc } from "@/convex/_generated/dataModel"

const sourceConfig: Record<string, { label: string; logo?: string }> = {
	github: { label: "GitHub", logo: "/logos/github.svg" },
	vercel: { label: "Vercel", logo: "/logos/vercel.svg" },
	convex: { label: "Convex", logo: "/logos/convex.svg" },
}

function getSourceForNotification(n: Doc<"notifications">) {
	// Agent notifications use source "convex" but actionType "mission_complete"
	if (n.actionType === "mission_complete" || n.actionType === "mission_error") {
		return { label: n.authorName, logo: n.authorAvatar }
	}
	return sourceConfig[n.source] ?? { label: n.source }
}

export function NotificationDetail({ notification }: { notification: Doc<"notifications"> }) {
	const router = useRouter()
	const archiveMutation = useMutation(api.notifications.archive)

	const timeAgo = formatDistanceToNowStrict(new Date(notification.createdAt), {
		addSuffix: true,
	})

	const source = getSourceForNotification(notification)
	const sourceLabel = source.label
	const isAgent = notification.actionType === "mission_complete" || notification.actionType === "mission_error"

	return (
		<div className="flex h-full items-center justify-center p-8">
			<Card
				elevated
				className="w-full max-w-[520px] animate-in fade-in slide-in-from-bottom-2 duration-200"
			>
				<CardContent>
					{/* Source strip */}
					<InlineStack gap="200" align="space-between" blockAlign="center">
						<InlineStack gap="200" blockAlign="center">
							{source?.logo ? (
								<img
									src={source.logo}
									alt={sourceLabel}
									className="size-5"
								/>
							) : (
								<span className="text-[9px] font-semibold uppercase text-fg-muted">
									{notification.source.slice(0, 2)}
								</span>
							)}
							<span className="text-xs font-medium text-fg">{sourceLabel}</span>
						</InlineStack>
						<span className="text-2xs text-fg-subtle">{timeAgo}</span>
					</InlineStack>

					{/* Body */}
					<BlockStack gap="400" className="pt-5">
						<BlockStack gap="100">
							<h2 className="text-lg font-semibold tracking-tight text-fg leading-snug">
								{notification.title}
							</h2>
							<p className="text-sm text-fg-muted leading-relaxed">
								{notification.description}
							</p>
						</BlockStack>

						{/* Author — hidden when same as source */}
						{notification.authorName.toLowerCase() !== notification.source.toLowerCase() && (
							<>
								<Divider />
								<InlineStack gap="200" blockAlign="center">
									{notification.authorAvatar ? (
										<img
											src={notification.authorAvatar}
											alt={notification.authorName}
											className="size-7 rounded-full"
										/>
									) : (
										<div
											className="flex size-7 items-center justify-center rounded-full text-[10px] font-semibold text-white"
											style={{ backgroundColor: notification.authorColor ?? "#6b7280" }}
										>
											{notification.authorInitials}
										</div>
									)}
									<span className="text-xs font-medium text-fg">{notification.authorName}</span>
									<span className="text-2xs text-fg-subtle">Author</span>
								</InlineStack>
							</>
						)}
					</BlockStack>
				</CardContent>

				{/* Actions */}
				<CardFooter className="gap-2">
					{notification.url && isAgent && (
						<Button
							size="sm"
							onClick={() => router.push(notification.url!)}
						>
							<ArrowRight className="mr-1.5 size-3.5" />
							Voir la mission
						</Button>
					)}
					{notification.url && !isAgent && (
						<Button
							size="sm"
							onClick={() => window.open(notification.url!, "_blank")}
						>
							<ExternalLink className="mr-1.5 size-3.5" />
							Open in {sourceLabel}
						</Button>
					)}
					<Button
						variant="outline"
						size="sm"
						onClick={() => archiveMutation({ id: notification._id })}
					>
						<Archive className="mr-1.5 size-3.5" />
						Archive
					</Button>
				</CardFooter>
			</Card>
		</div>
	)
}
