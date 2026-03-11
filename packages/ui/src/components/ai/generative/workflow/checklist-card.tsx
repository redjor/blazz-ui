"use client"

import { useState } from "react"
import { CheckSquare, Square } from "lucide-react"
import { withProGuard } from "../../../../lib/with-pro-guard"
import { cn } from "../../../../lib/utils"

export interface ChecklistItem {
	label: string
	checked?: boolean
}

export interface ChecklistCardProps {
	title?: string
	items: ChecklistItem[]
	className?: string
}

function ChecklistCardBase({
	title,
	items: initialItems,
	className,
}: ChecklistCardProps) {
	const [items, setItems] = useState(initialItems)

	const doneCount = items.filter((i) => i.checked).length
	const progress = items.length > 0 ? (doneCount / items.length) * 100 : 0

	function toggle(index: number) {
		setItems((prev) =>
			prev.map((item, i) =>
				i === index ? { ...item, checked: !item.checked } : item,
			),
		)
	}

	return (
		<div className={cn("rounded-lg border border-container bg-surface p-4", className)}>
			{title && (
				<div className="flex items-center justify-between">
					<span className="text-sm font-semibold text-fg">{title}</span>
					<span className="text-xs text-fg-muted tabular-nums">
						{doneCount}/{items.length}
					</span>
				</div>
			)}

			<div className="mt-2 h-1.5 rounded-full bg-raised overflow-hidden">
				<div
					className="h-full rounded-full bg-brand transition-all duration-300"
					style={{ width: `${progress}%` }}
				/>
			</div>

			<div className="mt-3 space-y-0.5">
				{items.map((item, i) => (
					<button
						key={i}
						type="button"
						onClick={() => toggle(i)}
						className="flex w-full items-center gap-2.5 rounded-md px-1.5 py-1.5 text-left transition-colors hover:bg-raised"
					>
						{item.checked ? (
							<CheckSquare className="size-4 shrink-0 text-brand" />
						) : (
							<Square className="size-4 shrink-0 text-fg-muted" />
						)}
						<span
							className={cn(
								"text-xs",
								item.checked ? "text-fg-muted line-through" : "text-fg",
							)}
						>
							{item.label}
						</span>
					</button>
				))}
			</div>
		</div>
	)
}

export const ChecklistCard = withProGuard(ChecklistCardBase, "ChecklistCard")
