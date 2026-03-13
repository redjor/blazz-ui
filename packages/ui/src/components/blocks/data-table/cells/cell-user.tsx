"use client"

import { cn } from "../../../../lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar"

export interface CellUserProps {
	/** User display name */
	name: string
	/** URL of the avatar image */
	avatar?: string
	/** Gray subtitle below the name (e.g. email, role) */
	subtitle?: string
	/** Avatar size */
	size?: "sm" | "md"
}

function getInitials(name: string): string {
	return name
		.split(" ")
		.map((part) => part[0])
		.join("")
		.slice(0, 2)
		.toUpperCase()
}

const avatarSizeClasses = {
	sm: "h-8 w-8 text-[10px]",
	md: "h-10 w-10 text-xs",
} as const

/**
 * Renders a user avatar + name with optional subtitle.
 */
export function CellUser({ name, avatar, subtitle, size = "sm" }: CellUserProps) {
	if (!name) {
		return <span className="text-fg-muted">&mdash;</span>
	}

	return (
		<div className="flex items-center gap-2.5">
			<Avatar className={cn(avatarSizeClasses[size])}>
				{avatar && <AvatarImage src={avatar} alt={name} />}
				<AvatarFallback className={cn(avatarSizeClasses[size])}>{getInitials(name)}</AvatarFallback>
			</Avatar>
			<div className="flex flex-col">
				<span className="text-body-md text-fg">{name}</span>
				{subtitle && <span className="text-body-sm text-fg-muted">{subtitle}</span>}
			</div>
		</div>
	)
}
