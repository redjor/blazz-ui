"use client"

import type { ReactNode } from "react"
import { Mail, Paperclip } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export interface EmailPreviewProps {
	subject: string
	from: { name: string; email: string; avatar?: string }
	to: { name: string; email: string }[]
	body: string
	date?: string
	attachments?: number
	status?: "draft" | "sent" | "scheduled"
	actions?: ReactNode
	className?: string
}

function getInitials(name: string) {
	return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

const statusConfig = {
	draft: { label: "Draft", variant: "default" as const },
	sent: { label: "Sent", variant: "success" as const },
	scheduled: { label: "Scheduled", variant: "info" as const },
} as const

export function EmailPreview({
	subject,
	from,
	to,
	body,
	date,
	attachments,
	status = "draft",
	actions,
	className,
}: EmailPreviewProps) {
	const config = statusConfig[status]

	return (
		<div className={cn("rounded-lg border border-edge bg-surface p-4", className)}>
			<div className="flex items-start gap-3">
				<div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-raised">
					<Mail className="size-4 text-fg-muted" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="text-sm font-semibold text-fg truncate">{subject}</span>
						<Badge variant={config.variant} size="xs" fill="subtle">
							{config.label}
						</Badge>
					</div>
					{date && <p className="mt-0.5 text-xs text-fg-muted">{date}</p>}
				</div>
			</div>

			<div className="mt-3 space-y-1.5">
				<div className="flex items-center gap-2">
					<span className="text-xs text-fg-muted shrink-0">From:</span>
					<div className="flex items-center gap-1.5 min-w-0">
						<Avatar size="xs">
							{from.avatar && <AvatarImage src={from.avatar} alt={from.name} />}
							<AvatarFallback>{getInitials(from.name)}</AvatarFallback>
						</Avatar>
						<span className="text-xs text-fg truncate">{from.name}</span>
						<span className="text-xs text-fg-muted truncate">&lt;{from.email}&gt;</span>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-xs text-fg-muted shrink-0">To:</span>
					<span className="text-xs text-fg truncate">
						{to.map((t) => t.name).join(", ")}
					</span>
				</div>
			</div>

			<div className="mt-3 rounded-md bg-raised/50 p-3">
				<p className="text-xs text-fg-muted leading-relaxed line-clamp-4 whitespace-pre-line">
					{body}
				</p>
			</div>

			{attachments && attachments > 0 && (
				<div className="mt-2 flex items-center gap-1.5">
					<Paperclip className="size-3 text-fg-muted" />
					<span className="text-xs text-fg-muted">
						{attachments} attachment{attachments > 1 ? "s" : ""}
					</span>
				</div>
			)}

			{actions && (
				<div className="mt-3 flex items-center gap-2 border-t border-edge-subtle pt-3">
					{actions}
				</div>
			)}
		</div>
	)
}
