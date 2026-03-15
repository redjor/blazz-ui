"use client"

import { cn } from "@blazz/ui"
import { Badge } from "@blazz/ui"
import { Popover, PopoverContent, PopoverTrigger } from "@blazz/ui"

export interface CellTagsProps {
	/** List of tag strings to display */
	items: string[]
	/** Map tag values to Badge variant names */
	colorMap?: Record<string, string>
	/** Maximum visible tags before overflow (default 3) */
	max?: number
	/** Display style: badge or colored dot */
	variant?: "badge" | "dot"
}

/**
 * Renders a list of tags as inline badges with overflow popover.
 * Empty arrays display a dash.
 */
export function CellTags({ items, colorMap, max = 3, variant = "badge" }: CellTagsProps) {
	if (!items || items.length === 0) {
		return <span className="text-fg-muted">&mdash;</span>
	}

	const visible = items.slice(0, max)
	const overflow = items.slice(max)

	return (
		<div className="flex items-center gap-1">
			{visible.map((tag) => {
				const badgeVariant =
					(colorMap?.[tag] as
						| "default"
						| "secondary"
						| "outline"
						| "critical"
						| "success"
						| "warning"
						| "info") ?? "secondary"

				return (
					<Badge key={tag} variant={badgeVariant} size="xs" dot={variant === "dot"}>
						{tag}
					</Badge>
				)
			})}

			{overflow.length > 0 && (
				<Popover>
					<PopoverTrigger>
						<button
							type="button"
							className={cn(
								"inline-flex h-4 items-center justify-center rounded-full px-1.5 text-[10px] font-medium",
								"bg-surface-3 text-fg-muted hover:bg-surface-3/80 transition-colors"
							)}
						>
							+{overflow.length}
						</button>
					</PopoverTrigger>
					<PopoverContent className="w-auto max-w-64 p-2">
						<div className="flex flex-wrap gap-1">
							{overflow.map((tag) => {
								const badgeVariant =
									(colorMap?.[tag] as
										| "default"
										| "secondary"
										| "outline"
										| "critical"
										| "success"
										| "warning"
										| "info") ?? "secondary"

								return (
									<Badge key={tag} variant={badgeVariant} size="xs" dot={variant === "dot"}>
										{tag}
									</Badge>
								)
							})}
						</div>
					</PopoverContent>
				</Popover>
			)}
		</div>
	)
}
