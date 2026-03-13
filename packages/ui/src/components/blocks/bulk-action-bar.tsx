"use client"

import type { LucideIcon } from "lucide-react"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"
import { withProGuard } from "../../lib/with-pro-guard"
import { Button } from "../ui/button"

export interface BulkAction {
	label: string
	onClick: () => void | Promise<void>
	icon?: LucideIcon
	variant?: "default" | "outline" | "destructive"
}

export interface BulkActionBarProps {
	selectedCount: number
	actions: BulkAction[]
	onClearSelection: () => void
	className?: string
}

function BulkActionBarBase({
	selectedCount,
	actions,
	onClearSelection,
	className,
}: BulkActionBarProps) {
	if (selectedCount === 0) return null

	return (
		<div
			className={cn(
				"fixed bottom-6 left-1/2 z-50 -translate-x-1/2",
				"flex items-center gap-3 rounded-lg border bg-surface px-4 py-2.5 shadow-lg",
				className
			)}
		>
			<span className="text-sm font-medium text-fg">
				{selectedCount} sélectionné{selectedCount > 1 ? "s" : ""}
			</span>

			<div className="h-4 w-px bg-border" />

			<div className="flex items-center gap-2">
				{actions.map((action, i) => (
					<Button key={i} variant={action.variant || "outline"} size="sm" onClick={action.onClick}>
						{action.icon && <action.icon className="size-4" data-icon="inline-start" />}
						{action.label}
					</Button>
				))}
			</div>

			<div className="h-4 w-px bg-border" />

			<Button variant="ghost" size="icon-sm" onClick={onClearSelection}>
				<X className="size-4" />
			</Button>
		</div>
	)
}

export const BulkActionBar = withProGuard(BulkActionBarBase, "BulkActionBar")
