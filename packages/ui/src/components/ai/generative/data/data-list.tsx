"use client"

import { cn } from "../../../../lib/utils"
import { withProGuard } from "../../../../lib/with-pro-guard"
import { Badge } from "../../../ui/badge"

export interface DataListItem {
	label: string
	value: string
	badge?: {
		text: string
		variant?: "default" | "success" | "warning" | "critical"
	}
}

export interface DataListProps {
	title?: string
	items: DataListItem[]
	className?: string
}

const badgeVariantMap = {
	default: "default",
	success: "success",
	warning: "warning",
	critical: "critical",
} as const

function DataListBase({ title, items, className }: DataListProps) {
	return (
		<div className={cn("rounded-lg border border-container bg-surface p-4", className)}>
			{title && <span className="mb-3 block text-sm font-medium text-fg">{title}</span>}
			<div>
				{items.map((item, i) => (
					<div
						key={i}
						className={cn(
							"flex items-center justify-between py-2",
							i < items.length - 1 && "border-b border-edge-subtle"
						)}
					>
						<span className="text-sm text-fg-muted">{item.label}</span>
						<div className="flex items-center gap-2">
							<span className="text-sm text-fg">{item.value}</span>
							{item.badge && (
								<Badge
									variant={badgeVariantMap[item.badge.variant ?? "default"]}
									size="xs"
									fill="subtle"
								>
									{item.badge.text}
								</Badge>
							)}
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

export const DataList = withProGuard(DataListBase, "DataList")
