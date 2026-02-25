"use client"

import Link from "next/link"
import { Avatar, AvatarImage, AvatarFallback } from "../../../ui/avatar"
import { Badge } from "../../../ui/badge"
import { cn } from "../../../../lib/utils"

export interface UserCardProps {
	name: string
	avatar?: string
	role?: string
	department?: string
	status?: "online" | "offline" | "busy" | "away"
	href?: string
	className?: string
}

const statusConfig = {
	online: { label: "Online", variant: "success" as const },
	offline: { label: "Offline", variant: "secondary" as const },
	busy: { label: "Busy", variant: "critical" as const },
	away: { label: "Away", variant: "warning" as const },
} as const

function getInitials(name: string) {
	return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

export function UserCard({
	name,
	avatar,
	role,
	department,
	status,
	href,
	className,
}: UserCardProps) {
	const Wrapper = href ? Link : "div"
	const wrapperProps = href ? { href } : {}
	const config = status ? statusConfig[status] : null

	return (
		<Wrapper
			{...(wrapperProps as Record<string, string>)}
			className={cn(
				"flex items-center gap-3 rounded-lg border border-container bg-surface p-3",
				href && "transition-colors hover:bg-raised cursor-pointer",
				className,
			)}
		>
			<Avatar>
				{avatar && <AvatarImage src={avatar} alt={name} />}
				<AvatarFallback>{getInitials(name)}</AvatarFallback>
			</Avatar>
			<div className="min-w-0 flex-1">
				<div className="flex items-center gap-2">
					<span className="truncate text-sm font-medium text-fg">{name}</span>
					{config && (
						<Badge variant={config.variant} size="xs" fill="subtle">{config.label}</Badge>
					)}
				</div>
				{(role || department) && (
					<p className="truncate text-xs text-fg-muted">
						{[role, department].filter(Boolean).join(" · ")}
					</p>
				)}
			</div>
		</Wrapper>
	)
}
