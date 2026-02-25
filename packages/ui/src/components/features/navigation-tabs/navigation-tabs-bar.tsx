"use client"

import type * as React from "react"
import { Plus } from "lucide-react"
import { cn } from "../../../lib/utils"

interface NavigationTabsBarProps {
	children: React.ReactNode
	onAddTab?: () => void
	addButtonLabel?: string
	className?: string
}

export function NavigationTabsBar({
	children,
	onAddTab,
	addButtonLabel = "Open new tab",
	className,
}: NavigationTabsBarProps) {
	return (
		<div
			className={cn(
				"hidden h-(--tabbar-height) shrink-0 items-center border-t border-(--sidebar-border) rounded-tr-(--main-radius) bg-(--sidebar-background) md:flex",
				className
			)}
		>
			<div className="flex min-w-0 flex-1 items-center gap-0.5 overflow-x-auto px-1">
				{children}
			</div>
			{onAddTab && (
				<button
					type="button"
					onClick={onAddTab}
					className="flex h-(--tabbar-height) w-9 shrink-0 items-center justify-center border-l border-(--sidebar-border) text-(--sidebar-foreground) transition-colors hover:bg-(--sidebar-accent)"
					aria-label={addButtonLabel}
				>
					<Plus className="h-4 w-4" />
				</button>
			)}
		</div>
	)
}
