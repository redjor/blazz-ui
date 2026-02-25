"use client"

import type { ReactNode } from "react"
import { AlertCircle } from "lucide-react"
import { Badge } from "../../../ui/badge"
import { cn } from "../../../../lib/utils"

export interface ApprovalCardProps {
	title: string
	description?: string
	details?: { label: string; value: string }[]
	status?: "pending" | "approved" | "rejected"
	actions?: ReactNode
	className?: string
}

const statusConfig = {
	pending: { label: "Pending", variant: "warning" as const },
	approved: { label: "Approved", variant: "success" as const },
	rejected: { label: "Rejected", variant: "critical" as const },
} as const

export function ApprovalCard({
	title,
	description,
	details,
	status = "pending",
	actions,
	className,
}: ApprovalCardProps) {
	const config = statusConfig[status]

	return (
		<div className={cn("rounded-lg border border-container bg-surface p-4", className)}>
			<div className="flex items-start gap-3">
				<div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-raised">
					<AlertCircle className="size-4 text-fg-muted" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="text-sm font-semibold text-fg">{title}</span>
						<Badge variant={config.variant} size="xs" fill="subtle">
							{config.label}
						</Badge>
					</div>
					{description && (
						<p className="mt-1 text-xs text-fg-muted">{description}</p>
					)}
				</div>
			</div>

			{details && details.length > 0 && (
				<div className="mt-3 rounded-md bg-raised/50 p-3">
					{details.map((d, i) => (
						<div
							key={i}
							className={cn(
								"flex items-center justify-between py-1.5",
								i < details.length - 1 && "border-b border-edge-subtle",
							)}
						>
							<span className="text-xs text-fg-muted">{d.label}</span>
							<span className="text-xs font-medium text-fg">{d.value}</span>
						</div>
					))}
				</div>
			)}

			{actions && (
				<div className="mt-3 flex items-center gap-2 border-t border-edge-subtle pt-3">
					{actions}
				</div>
			)}
		</div>
	)
}
