"use client"

import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TabItemProps {
	title: string
	isActive: boolean
	onClick: () => void
	onClose: () => void
}

export function TabItem({ title, isActive, onClick, onClose }: TabItemProps) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"group relative flex h-9 shrink-0 items-center gap-2 border-b-2 px-3 text-sm transition-colors",
				"max-w-[180px] min-w-[100px]",
				isActive
					? "border-primary text-foreground"
					: "border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50"
			)}
		>
			<span className="truncate">{title}</span>
			<button
				type="button"
				onClick={(e) => {
					e.stopPropagation()
					onClose()
				}}
				onKeyDown={(e) => {
					if (e.key === "Enter" || e.key === " ") {
						e.stopPropagation()
						onClose()
					}
				}}
				className={cn(
					"ml-auto flex h-4 w-4 shrink-0 items-center justify-center rounded-sm transition-colors",
					"hover:bg-muted-foreground/20",
					isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
				)}
				aria-label={`Close ${title}`}
			>
				<X className="h-3 w-3" />
			</button>
		</button>
	)
}
