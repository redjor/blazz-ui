"use client"

import type { LucideIcon } from "lucide-react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TabItemProps {
	title: string
	icon?: LucideIcon
	isActive: boolean
	isLast: boolean
	onClick: () => void
	onClose: () => void
}

export function TabItem({ title, icon: Icon, isActive, isLast, onClick, onClose }: TabItemProps) {
	return (
		<div
			className={cn(
				"group relative flex h-(--tabbar-height) shrink-0 items-center text-xs transition-colors",
				!isLast && "border-r border-white/10",
				isActive ? "bg-white/10 text-white" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
			)}
		>
			<button
				type="button"
				onClick={onClick}
				className="flex h-full cursor-pointer items-center gap-2 truncate pl-3 pr-1"
			>
				{Icon && <Icon className="h-3.5 w-3.5 shrink-0 text-gray-400" />}
				<span className="truncate">{title}</span>
			</button>
			<button
				type="button"
				onClick={onClose}
				className={cn(
					"mr-2 flex h-4 w-4 shrink-0 items-center justify-center rounded-sm transition-colors",
					"hover:bg-white/20",
					isActive ? "text-gray-400 opacity-100" : "text-gray-500 opacity-0 group-hover:opacity-100"
				)}
				aria-label={`Close ${title}`}
			>
				<X className="h-3 w-3" />
			</button>
		</div>
	)
}
