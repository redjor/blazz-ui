"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Receipt } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type InvoiceStatus = "draft" | "sent" | "paid" | "overdue" | "cancelled"

export interface InvoiceLineItem {
	description: string
	amount: string
}

export interface InvoiceCardProps {
	number: string
	client: string
	amount: string
	status?: InvoiceStatus
	dueDate?: string
	issuedDate?: string
	items?: InvoiceLineItem[]
	href?: string
	actions?: ReactNode
	className?: string
}

const statusConfig = {
	draft: { label: "Draft", variant: "default" as const },
	sent: { label: "Sent", variant: "info" as const },
	paid: { label: "Paid", variant: "success" as const },
	overdue: { label: "Overdue", variant: "critical" as const },
	cancelled: { label: "Cancelled", variant: "default" as const },
} as const

export function InvoiceCard({
	number,
	client,
	amount,
	status = "draft",
	dueDate,
	issuedDate,
	items,
	href,
	actions,
	className,
}: InvoiceCardProps) {
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
					<Receipt className="size-4 text-fg-muted" />
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
				<span className="text-sm font-semibold text-fg tabular-nums">{amount}</span>
			</div>

			{(issuedDate || dueDate) && (
				<div className="mt-3 flex gap-4">
					{issuedDate && (
						<div>
							<span className="text-xs text-fg-muted">Issued</span>
							<p className="text-xs font-medium text-fg">{issuedDate}</p>
						</div>
					)}
					{dueDate && (
						<div>
							<span className="text-xs text-fg-muted">Due</span>
							<p className="text-xs font-medium text-fg">{dueDate}</p>
						</div>
					)}
				</div>
			)}

			{items && items.length > 0 && (
				<div className="mt-3 rounded-md bg-raised/50 p-3">
					{items.map((item, i) => (
						<div
							key={i}
							className={cn(
								"flex items-center justify-between py-1.5",
								i < items.length - 1 && "border-b border-edge-subtle",
							)}
						>
							<span className="text-xs text-fg-muted">{item.description}</span>
							<span className="text-xs font-medium text-fg tabular-nums">{item.amount}</span>
						</div>
					))}
				</div>
			)}

			{actions && (
				<div className="mt-3 flex items-center gap-2 border-t border-edge-subtle pt-3">
					{actions}
				</div>
			)}
		</Wrapper>
	)
}
