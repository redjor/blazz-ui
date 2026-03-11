"use client"

import type { ReactNode } from "react"
import { MessageSquare, Phone, Mail, Hash } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "../../../ui/avatar"
import { withProGuard } from "../../../../lib/with-pro-guard"
import { cn } from "../../../../lib/utils"

export type MessagePlatform = "sms" | "whatsapp" | "slack" | "email"

export interface MessagePreviewProps {
	platform: MessagePlatform
	from: { name: string; avatar?: string }
	content: string
	time?: string
	channel?: string
	actions?: ReactNode
	className?: string
}

function getInitials(name: string) {
	return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

const platformConfig = {
	sms: { label: "SMS", icon: Phone, color: "text-emerald-500" },
	whatsapp: { label: "WhatsApp", icon: MessageSquare, color: "text-green-500" },
	slack: { label: "Slack", icon: Hash, color: "text-purple-500" },
	email: { label: "Email", icon: Mail, color: "text-blue-500" },
} as const

function MessagePreviewBase({
	platform,
	from,
	content,
	time,
	channel,
	actions,
	className,
}: MessagePreviewProps) {
	const config = platformConfig[platform]
	const PlatformIcon = config.icon

	return (
		<div className={cn("rounded-lg border border-container bg-surface p-4", className)}>
			<div className="flex items-center gap-2">
				<PlatformIcon className={cn("size-4", config.color)} />
				<span className="text-xs font-medium text-fg-muted">{config.label}</span>
				{channel && (
					<span className="text-xs text-fg-muted">#{channel}</span>
				)}
				{time && (
					<span className="ml-auto text-xs text-fg-muted">{time}</span>
				)}
			</div>

			<div className="mt-3 flex items-start gap-2.5">
				<Avatar size="sm">
					{from.avatar && <AvatarImage src={from.avatar} alt={from.name} />}
					<AvatarFallback>{getInitials(from.name)}</AvatarFallback>
				</Avatar>
				<div className="min-w-0 flex-1">
					<span className="text-xs font-semibold text-fg">{from.name}</span>
					<p className="mt-0.5 text-xs text-fg-muted leading-relaxed line-clamp-3">
						{content}
					</p>
				</div>
			</div>

			{actions && (
				<div className="mt-3 flex items-center gap-2 border-t border-edge-subtle pt-3">
					{actions}
				</div>
			)}
		</div>
	)
}

export const MessagePreview = withProGuard(MessagePreviewBase, "MessagePreview")
