"use client"

import { ArrowDownLeft, ArrowUpRight, Building2, CreditCard } from "lucide-react"
import type { ReactNode } from "react"
import { cn } from "../../../../lib/utils"
import { withProGuard } from "../../../../lib/with-pro-guard"
import { Badge } from "../../../ui/badge"

export type TransactionType = "incoming" | "outgoing"
export type TransactionStatus = "completed" | "pending" | "failed"

export interface TransactionCardProps {
	title: string
	amount: string
	type?: TransactionType
	status?: TransactionStatus
	method?: string
	date?: string
	reference?: string
	actions?: ReactNode
	className?: string
}

const statusConfig = {
	completed: { label: "Completed", variant: "success" as const },
	pending: { label: "Pending", variant: "warning" as const },
	failed: { label: "Failed", variant: "critical" as const },
} as const

function TransactionCardBase({
	title,
	amount,
	type = "incoming",
	status = "completed",
	method,
	date,
	reference,
	actions,
	className,
}: TransactionCardProps) {
	const sConfig = statusConfig[status]
	const isIncoming = type === "incoming"

	return (
		<div className={cn("rounded-lg border border-container bg-surface p-4", className)}>
			<div className="flex items-start gap-3">
				<div
					className={cn(
						"mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full",
						isIncoming ? "bg-emerald-500/10" : "bg-surface-3"
					)}
				>
					{isIncoming ? (
						<ArrowDownLeft className="size-4 text-emerald-500" />
					) : (
						<ArrowUpRight className="size-4 text-fg-muted" />
					)}
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="text-sm font-semibold text-fg truncate">{title}</span>
						<Badge variant={sConfig.variant} size="xs" fill="subtle">
							{sConfig.label}
						</Badge>
					</div>
					{date && <p className="mt-0.5 text-xs text-fg-muted">{date}</p>}
				</div>
				<span
					className={cn(
						"text-sm font-semibold tabular-nums",
						isIncoming ? "text-emerald-600 dark:text-emerald-400" : "text-fg"
					)}
				>
					{isIncoming ? "+" : "-"}
					{amount}
				</span>
			</div>

			{(method || reference) && (
				<div className="mt-3 flex flex-wrap gap-4">
					{method && (
						<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
							<CreditCard className="size-3" />
							{method}
						</span>
					)}
					{reference && (
						<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
							<Building2 className="size-3" />
							Ref: {reference}
						</span>
					)}
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

export const TransactionCard = withProGuard(TransactionCardBase, "TransactionCard")
