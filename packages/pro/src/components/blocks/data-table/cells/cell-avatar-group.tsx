"use client"

import { cn } from "@blazz/ui"
import { Avatar, AvatarFallback, AvatarImage } from "@blazz/ui/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipTrigger } from "@blazz/ui/components/ui/tooltip"

export interface AvatarItem {
	name: string
	avatar?: string
}

export interface CellAvatarGroupProps {
	/** List of people to display */
	items: AvatarItem[]
	/** Maximum visible avatars before overflow (default 4) */
	max?: number
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

const sizeClasses = {
	sm: "h-7 w-7 text-[10px]",
	md: "h-9 w-9 text-xs",
} as const

const overlapClasses = {
	sm: "-ml-2",
	md: "-ml-3",
} as const

/**
 * Renders overlapping circular avatars with a +N overflow indicator.
 * Each avatar shows the full name in a tooltip.
 */
export function CellAvatarGroup({ items, max = 4, size = "sm" }: CellAvatarGroupProps) {
	if (!items || items.length === 0) {
		return <span className="text-fg-muted">&mdash;</span>
	}

	const visible = items.slice(0, max)
	const overflow = items.length - max

	return (
		<div className="flex items-center">
			{visible.map((item, index) => (
				<Tooltip key={item.name}>
					<TooltipTrigger>
						<Avatar
							className={cn(
								sizeClasses[size],
								"ring-2 ring-surface",
								index > 0 && overlapClasses[size]
							)}
						>
							{item.avatar && <AvatarImage src={item.avatar} alt={item.name} />}
							<AvatarFallback className={cn(sizeClasses[size])}>
								{getInitials(item.name)}
							</AvatarFallback>
						</Avatar>
					</TooltipTrigger>
					<TooltipContent>{item.name}</TooltipContent>
				</Tooltip>
			))}

			{overflow > 0 && (
				<span
					className={cn(
						"inline-flex items-center justify-center rounded-full ring-2 ring-surface",
						"bg-surface-3 text-fg-muted font-medium",
						sizeClasses[size],
						overlapClasses[size]
					)}
				>
					+{overflow}
				</span>
			)}
		</div>
	)
}
