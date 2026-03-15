"use client"

import type { ReactNode } from "react"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../../../lib/with-pro-guard"

export interface TimelineItem {
	icon?: ReactNode
	title: string
	description?: string
	time?: string
	variant?: "default" | "success" | "warning" | "critical" | "info"
}

export interface TimelineProps {
	title?: string
	items: TimelineItem[]
	className?: string
}

const dotColor = {
	default: "bg-fg-muted",
	success: "bg-positive",
	warning: "bg-caution",
	critical: "bg-negative",
	info: "bg-inform",
} as const

function TimelineBase({ title, items, className }: TimelineProps) {
	return (
		<div className={cn("rounded-lg border border-container bg-surface p-4", className)}>
			{title && <span className="mb-3 block text-sm font-medium text-fg">{title}</span>}
			<div className="relative space-y-0">
				{items.map((item, i) => {
					const color = dotColor[item.variant ?? "default"]
					const isLast = i === items.length - 1

					return (
						<div key={i} className="relative flex gap-3 pb-4 last:pb-0">
							{/* Line */}
							{!isLast && <div className="absolute left-[7px] top-4 bottom-0 w-px bg-edge" />}
							{/* Dot or icon */}
							<div className="relative z-10 mt-1 flex shrink-0">
								{item.icon ? (
									<span className="flex size-4 items-center justify-center text-fg-muted">
										{item.icon}
									</span>
								) : (
									<span
										className={cn("mt-0.5 size-[9px] rounded-full ring-2 ring-surface", color)}
									/>
								)}
							</div>
							{/* Content */}
							<div className="min-w-0 flex-1">
								<div className="flex items-baseline justify-between gap-2">
									<span className="text-sm text-fg">{item.title}</span>
									{item.time && <span className="shrink-0 text-xs text-fg-muted">{item.time}</span>}
								</div>
								{item.description && (
									<p className="mt-0.5 text-xs text-fg-muted">{item.description}</p>
								)}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

export const Timeline = withProGuard(TimelineBase, "Timeline")
