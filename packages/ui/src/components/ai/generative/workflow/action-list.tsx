"use client"

import { ChevronRight } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "../../../../lib/utils"
import { withProGuard } from "../../../../lib/with-pro-guard"

export interface ActionListItem {
	icon?: ReactNode
	label: string
	description?: string
	onClick?: () => void
}

export interface ActionListProps {
	title?: string
	items: ActionListItem[]
	className?: string
}

function ActionListBase({ title, items, className }: ActionListProps) {
	return (
		<div className={cn("rounded-lg border border-container bg-surface", className)}>
			{title && (
				<div className="px-4 pt-3 pb-1">
					<span className="text-sm font-medium text-fg">{title}</span>
				</div>
			)}
			<div className="py-1">
				{items.map((item, i) => (
					<button
						key={i}
						type="button"
						onClick={item.onClick}
						className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-raised cursor-pointer"
					>
						{item.icon && (
							<span className="flex size-8 shrink-0 items-center justify-center rounded-md bg-raised border border-container text-fg-muted">
								{item.icon}
							</span>
						)}
						<div className="min-w-0 flex-1">
							<span className="block text-sm text-fg">{item.label}</span>
							{item.description && (
								<span className="block text-xs text-fg-muted">{item.description}</span>
							)}
						</div>
						<ChevronRight className="size-4 text-fg-muted shrink-0" />
					</button>
				))}
			</div>
		</div>
	)
}

export const ActionList = withProGuard(ActionListBase, "ActionList")
