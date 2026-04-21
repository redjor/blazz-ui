"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"

type BudgetMeterProps = {
	label: string
	used: number
	limit: number
	size?: "sm" | "md"
	tone?: "auto" | "neutral"
}

function thresholdClass(percent: number) {
	if (percent >= 90) return "bg-critical"
	if (percent >= 70) return "bg-caution"
	return "bg-positive"
}

function formatUsd(value: number) {
	return `$${value.toFixed(2)}`
}

export function BudgetMeter({ label, used, limit, size = "md", tone = "auto" }: BudgetMeterProps) {
	const percent = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0
	const barHeight = size === "sm" ? "h-1" : "h-1.5"
	const barColor = tone === "neutral" ? "bg-brand" : thresholdClass(percent)
	const labelClass = size === "sm" ? "text-[11px]" : "text-xs"

	return (
		<BlockStack gap="050">
			<InlineStack align="space-between" blockAlign="center" wrap={false}>
				<span className={`${labelClass} text-fg-muted`}>{label}</span>
				<InlineStack gap="150" blockAlign="center" wrap={false}>
					<span className={`${labelClass} tabular-nums text-fg`}>
						{formatUsd(used)} <span className="text-fg-muted">/ {formatUsd(limit)}</span>
					</span>
					<span className={`${labelClass} tabular-nums font-medium ${percent >= 90 ? "text-critical" : percent >= 70 ? "text-caution" : "text-fg-muted"} w-8 text-right`}>{percent}%</span>
				</InlineStack>
			</InlineStack>
			<div className={`${barHeight} w-full rounded-full bg-muted overflow-hidden`}>
				<div className={`h-full rounded-full transition-all ${barColor}`} style={{ width: `${percent}%` }} />
			</div>
		</BlockStack>
	)
}
