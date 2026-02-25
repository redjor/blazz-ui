"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Calendar, Clock, MapPin, Users } from "lucide-react"
import { Avatar, AvatarImage, AvatarFallback } from "../../../ui/avatar"
import { AvatarGroup, AvatarGroupCount } from "../../../ui/avatar"
import { Badge } from "../../../ui/badge"
import { cn } from "../../../../lib/utils"

export interface EventParticipant {
	name: string
	avatar?: string
}

export type EventType = "meeting" | "call" | "task" | "deadline"

const typeConfig = {
	meeting: { label: "Meeting", variant: "info" as const },
	call: { label: "Call", variant: "success" as const },
	task: { label: "Task", variant: "default" as const },
	deadline: { label: "Deadline", variant: "warning" as const },
} as const

function getInitials(name: string) {
	return name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2)
}

export interface EventCardProps {
	title: string
	type?: EventType
	date: string
	time?: string
	location?: string
	participants?: EventParticipant[]
	href?: string
	actions?: ReactNode
	className?: string
}

export function EventCard({
	title,
	type,
	date,
	time,
	location,
	participants,
	href,
	actions,
	className,
}: EventCardProps) {
	const config = type ? typeConfig[type] : null
	const Wrapper = href ? Link : "div"
	const wrapperProps = href ? { href } : {}

	return (
		<Wrapper
			{...(wrapperProps as Record<string, string>)}
			className={cn(
				"block rounded-lg border border-container bg-surface p-4",
				href && "transition-colors hover:bg-raised cursor-pointer",
				className,
			)}
		>
			<div className="flex items-center gap-2">
				<span className="text-sm font-semibold text-fg">{title}</span>
				{config && (
					<Badge variant={config.variant} size="xs" fill="subtle">{config.label}</Badge>
				)}
			</div>

			<div className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
				<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
					<Calendar className="size-3" />
					{date}
				</span>
				{time && (
					<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
						<Clock className="size-3" />
						{time}
					</span>
				)}
				{location && (
					<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
						<MapPin className="size-3" />
						{location}
					</span>
				)}
			</div>

			{participants && participants.length > 0 && (
				<div className="mt-3 flex items-center gap-2">
					<Users className="size-3 text-fg-muted" />
					<AvatarGroup>
						{participants.slice(0, 4).map((p) => (
							<Avatar key={p.name} size="sm">
								{p.avatar && <AvatarImage src={p.avatar} alt={p.name} />}
								<AvatarFallback>{getInitials(p.name)}</AvatarFallback>
							</Avatar>
						))}
						{participants.length > 4 && (
							<AvatarGroupCount>+{participants.length - 4}</AvatarGroupCount>
						)}
					</AvatarGroup>
					<span className="text-xs text-fg-muted">
						{participants.length} participant{participants.length > 1 ? "s" : ""}
					</span>
				</div>
			)}

			{actions && (
				<div className="mt-3 flex items-center gap-2 border-t border-edge-subtle pt-3">
					{actions}
				</div>
			)}
		</Wrapper>
	)
}
