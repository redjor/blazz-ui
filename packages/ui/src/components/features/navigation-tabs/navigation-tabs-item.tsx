"use client"

import type { LucideIcon } from "lucide-react"
import { X } from "lucide-react"
import { cn } from "../../../lib/utils"

interface NavigationTabsItemProps {
	title: string
	icon?: LucideIcon
	isActive: boolean
	onClick: () => void
	onClose: () => void
}

export function NavigationTabsItem({ title, icon: Icon, isActive, onClick, onClose }: NavigationTabsItemProps) {
	return (
		<div
			className={cn(
				"group relative flex shrink-0 items-center rounded-lg text-xs transition-colors",
				isActive
					? "bg-(--sidebar-accent) text-(--sidebar-accent-foreground) font-semibold"
					: "text-(--sidebar-foreground) hover:bg-(--sidebar-accent)/50"
			)}
		>
			<button
				type="button"
				onClick={onClick}
				className="flex h-7 cursor-pointer items-center gap-1.5 truncate pl-2 pr-1"
			>
				{Icon && <Icon className="h-3.5 w-3.5 shrink-0 opacity-60" />}
				<span className="truncate">{title}</span>
			</button>
			<button
				type="button"
				onClick={onClose}
				className={cn(
					"mr-1.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm transition-colors",
					"hover:bg-(--sidebar-border)",
					isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
				)}
				aria-label={`Close ${title}`}
			>
				<X className="h-3 w-3" />
			</button>
		</div>
	)
}
