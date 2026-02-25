"use client"

import type { ReactNode } from "react"
import Link from "next/link"
import { Calendar, Building2, TrendingUp } from "lucide-react"
import { Badge } from "../../../ui/badge"
import { cn } from "../../../../lib/utils"

const stageVariantMap = {
	prospecting: { variant: "secondary" as const, label: "Prospecting" },
	qualification: { variant: "info" as const, label: "Qualification" },
	proposal: { variant: "info" as const, label: "Proposal" },
	negotiation: { variant: "warning" as const, label: "Negotiation" },
	"closed-won": { variant: "success" as const, label: "Closed Won" },
	"closed-lost": { variant: "critical" as const, label: "Closed Lost" },
} as const

export type DealStage = keyof typeof stageVariantMap

export interface DealCardProps {
	title: string
	amount: string
	stage: DealStage
	probability?: number
	company?: string
	closeDate?: string
	owner?: string
	href?: string
	actions?: ReactNode
	className?: string
}

export function DealCard({
	title,
	amount,
	stage,
	probability,
	company,
	closeDate,
	owner,
	href,
	actions,
	className,
}: DealCardProps) {
	const stageConfig = stageVariantMap[stage]
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
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0 flex-1">
					<div className="flex items-center gap-2">
						<span className="truncate text-sm font-semibold text-fg">{title}</span>
						<Badge variant={stageConfig.variant} size="xs" fill="subtle">
							{stageConfig.label}
						</Badge>
					</div>
					{company && (
						<span className="mt-0.5 inline-flex items-center gap-1.5 text-xs text-fg-muted">
							<Building2 className="size-3" />
							{company}
						</span>
					)}
				</div>
				<div className="text-right shrink-0">
					<span className="text-lg font-semibold text-fg">{amount}</span>
					{probability !== undefined && (
						<span className="block text-xs text-fg-muted">{probability}% prob.</span>
					)}
				</div>
			</div>

			{(closeDate || owner) && (
				<div className="mt-3 flex flex-wrap gap-x-4 gap-y-1">
					{closeDate && (
						<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
							<Calendar className="size-3" />
							Close: {closeDate}
						</span>
					)}
					{owner && (
						<span className="inline-flex items-center gap-1.5 text-xs text-fg-muted">
							<TrendingUp className="size-3" />
							Owner: {owner}
						</span>
					)}
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
