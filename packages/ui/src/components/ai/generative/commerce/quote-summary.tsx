"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { FileText, Clock, Hash } from "lucide-react"
import { Badge } from "../../../ui/badge"
import { withProGuard } from "../../../../lib/with-pro-guard"
import { cn } from "../../../../lib/utils"

export type QuoteStatus = "draft" | "sent" | "accepted" | "declined" | "expired"

export interface QuoteSummaryProps {
	number: string
	client: string
	total: string
	status?: QuoteStatus
	validUntil?: string
	itemCount?: number
	href?: string
	actions?: ReactNode
	className?: string
}

const statusConfig = {
	draft: { label: "Draft", variant: "default" as const },
	sent: { label: "Sent", variant: "info" as const },
	accepted: { label: "Accepted", variant: "success" as const },
	declined: { label: "Declined", variant: "critical" as const },
	expired: { label: "Expired", variant: "warning" as const },
} as const

function QuoteSummaryBase({
	number,
	client,
	total,
	status = "draft",
	validUntil,
	itemCount,
	href,
	actions,
	className,
}: QuoteSummaryProps) {
	const config = statusConfig[status]
	const Wrapper = href ? Link : "div"
	const wrapperProps = href ? { href } : {}

	return (
		<Wrapper
			{...(wrapperProps as Record<string, string>)}
			className={cn(
				"block rounded-lg border border-container bg-surface p-4",
				href && "transition-colors hover:bg-raised cursor-pointer",
				className,
			)}
		>
			<div className="flex items-start gap-3">
				<div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-raised">
					<FileText className="size-4 text-fg-muted" />
				</div>
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="text-sm font-semibold text-fg">{number}</span>
						<Badge variant={config.variant} size="xs" fill="subtle">
							{config.label}
						</Badge>
					</div>
					<p className="mt-0.5 text-xs text-fg-muted">{client}</p>
				</div>
				<span className="text-sm font-semibold text-fg tabular-nums">{total}</span>
			</div>

			<div className="mt-3 flex flex-wrap gap-4">
				{validUntil && (
					<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
						<Clock className="size-3" />
						Valid until {validUntil}
					</span>
				)}
				{itemCount !== undefined && (
					<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
						<Hash className="size-3" />
						{itemCount} line item{itemCount !== 1 ? "s" : ""}
					</span>
				)}
			</div>

			{actions && (
				<div className="mt-3 flex items-center gap-2 border-t border-edge-subtle pt-3">
					{actions}
				</div>
			)}
		</Wrapper>
	)
}

export const QuoteSummary = withProGuard(QuoteSummaryBase, "QuoteSummary")
