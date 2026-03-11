"use client"

import type { ReactNode } from "react"
import { ArrowRight } from "lucide-react"
import { Badge } from "../../../ui/badge"
import { withProGuard } from "../../../../lib/with-pro-guard"
import { cn } from "../../../../lib/utils"

export interface StatusUpdateProps {
	title: string
	description?: string
	from?: string
	to?: string
	fromVariant?: "default" | "success" | "warning" | "critical" | "info" | "secondary"
	toVariant?: "default" | "success" | "warning" | "critical" | "info" | "secondary"
	time?: string
	icon?: ReactNode
	className?: string
}

function StatusUpdateBase({
	title,
	description,
	from,
	to,
	fromVariant = "secondary",
	toVariant = "success",
	time,
	icon,
	className,
}: StatusUpdateProps) {
	return (
		<div className={cn("rounded-lg border border-container bg-surface p-4", className)}>
			<div className="flex items-baseline justify-between gap-2">
				<div className="flex items-center gap-2">
					{icon && <span className="text-fg-muted">{icon}</span>}
					<span className="text-sm font-medium text-fg">{title}</span>
				</div>
				{time && <span className="shrink-0 text-xs text-fg-muted">{time}</span>}
			</div>

			{(from || to) && (
				<div className="mt-2 flex items-center gap-2">
					{from && (
						<Badge variant={fromVariant} size="xs" fill="subtle">{from}</Badge>
					)}
					{from && to && <ArrowRight className="size-3 text-fg-muted" />}
					{to && (
						<Badge variant={toVariant} size="xs" fill="subtle">{to}</Badge>
					)}
				</div>
			)}

			{description && (
				<p className="mt-2 text-xs text-fg-muted">{description}</p>
			)}
		</div>
	)
}

export const StatusUpdate = withProGuard(StatusUpdateBase, "StatusUpdate")
