"use client"

import { Check } from "lucide-react"
import { cn } from "../../../../lib/utils"
import { withProGuard } from "../../../../lib/with-pro-guard"
import { Badge } from "../../../ui/badge"

export interface PricingTier {
	name: string
	price: string
	period?: string
	description?: string
	features: string[]
	recommended?: boolean
}

export interface PricingTableProps {
	title?: string
	tiers: PricingTier[]
	className?: string
}

function PricingTableBase({ title, tiers, className }: PricingTableProps) {
	return (
		<div className={cn("rounded-lg border border-container bg-surface p-4", className)}>
			{title && <span className="text-sm font-semibold text-fg">{title}</span>}

			<div
				className={cn(
					"grid gap-3",
					title && "mt-3",
					tiers.length === 2 ? "grid-cols-2" : tiers.length >= 3 ? "grid-cols-3" : "grid-cols-1"
				)}
			>
				{tiers.map((tier) => (
					<div
						key={tier.name}
						className={cn(
							"rounded-md border p-3",
							tier.recommended ? "border-brand bg-brand/5" : "border-edge-subtle bg-surface-3/50"
						)}
					>
						<div className="flex items-center gap-2">
							<span className="text-xs font-semibold text-fg">{tier.name}</span>
							{tier.recommended && (
								<Badge variant="default" size="xs" fill="subtle">
									Recommended
								</Badge>
							)}
						</div>
						<div className="mt-1.5">
							<span className="text-lg font-bold text-fg tabular-nums">{tier.price}</span>
							{tier.period && <span className="text-xs text-fg-muted">/{tier.period}</span>}
						</div>
						{tier.description && <p className="mt-1 text-xs text-fg-muted">{tier.description}</p>}
						<ul className="mt-2 space-y-1">
							{tier.features.map((feature) => (
								<li key={feature} className="flex items-center gap-1.5 text-xs text-fg-muted">
									<Check className="size-3 shrink-0 text-brand" />
									{feature}
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</div>
	)
}

export const PricingTable = withProGuard(PricingTableBase, "PricingTable")
