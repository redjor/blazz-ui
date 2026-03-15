"use client"

import type { Table } from "@tanstack/react-table"
import { cn } from "@blazz/ui"
import { Button } from "@blazz/ui"
import { X } from "lucide-react"
import * as React from "react"
import { useDataTableTranslations } from "./data-table.i18n"
import type { BulkAction } from "./data-table.types"

interface DataTableBulkSelectionBarProps<TData> {
	table: Table<TData>
	bulkActions: BulkAction<TData>[]
	locale?: "fr" | "en"
	className?: string
}

/**
 * DataTableBulkSelectionBar - Floating bottom bar for bulk actions
 *
 * Measures the scroll container's bottom edge and positions the bar
 * with JS (fixed position relative to the visible scroll area).
 */
export function DataTableBulkSelectionBar<TData>({
	table,
	bulkActions,
	locale = "fr",
	className,
}: DataTableBulkSelectionBarProps<TData>) {
	const t = useDataTableTranslations(locale)
	const selectedCount = table.getFilteredSelectedRowModel().rows.length
	const anchorRef = React.useRef<HTMLDivElement>(null)
	const [style, setStyle] = React.useState<React.CSSProperties>({ opacity: 0 })

	React.useEffect(() => {
		if (selectedCount === 0 || !anchorRef.current) {
			setStyle({ opacity: 0 })
			return
		}

		function update() {
			const el = anchorRef.current
			if (!el) return

			// Find the scroll container (scroll-area-viewport or nearest overflow parent)
			let scrollParent: HTMLElement | null = el.parentElement
			while (scrollParent) {
				const overflow = getComputedStyle(scrollParent).overflowY
				if (overflow === "auto" || overflow === "scroll") break
				scrollParent = scrollParent.parentElement
			}

			if (!scrollParent) {
				// Fallback to window
				setStyle({
					position: "fixed",
					bottom: 24,
					left: "50%",
					transform: "translateX(-50%)",
					zIndex: 9999,
					opacity: 1,
				})
				return
			}

			const rect = scrollParent.getBoundingClientRect()
			setStyle({
				position: "fixed",
				bottom: window.innerHeight - rect.bottom + 16,
				left: rect.left + rect.width / 2,
				transform: "translateX(-50%)",
				zIndex: 9999,
				opacity: 1,
			})
		}

		update()
		window.addEventListener("resize", update)
		window.addEventListener("scroll", update, true)

		return () => {
			window.removeEventListener("resize", update)
			window.removeEventListener("scroll", update, true)
		}
	}, [selectedCount])

	return (
		<>
			<div ref={anchorRef} className="h-0 w-0 overflow-hidden" />
			{selectedCount > 0 && (
				<div style={style}>
					<div
						className={cn(
							"flex items-center gap-3 rounded-xl border border-edge bg-surface px-4 py-2.5 shadow-lg",
							className
						)}
					>
						<span className="text-sm font-medium text-fg tabular-nums">
							{t.selectedCount(selectedCount)}
						</span>

						<div className="h-4 w-px bg-edge" />

						{bulkActions.map((action) => (
							<Button
								key={action.id}
								variant={action.variant || "outline"}
								size="sm"
								onClick={() => action.handler(table.getFilteredSelectedRowModel().rows)}
								disabled={action.disabled?.(table.getFilteredSelectedRowModel().rows)}
							>
								{action.icon && <action.icon className="size-3.5" />}
								{action.label}
							</Button>
						))}

						<div className="h-4 w-px bg-edge" />

						<button
							type="button"
							onClick={() => table.resetRowSelection()}
							className="flex items-center gap-1 text-xs text-fg-muted hover:text-fg transition-colors"
						>
							<X className="size-3.5" />
						</button>
					</div>
				</div>
			)}
		</>
	)
}
