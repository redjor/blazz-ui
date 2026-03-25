"use client"

import type { Table } from "@tanstack/react-table"
import { cn } from "@blazz/ui"
import { Button } from "@blazz/ui"
import { ButtonGroup } from "@blazz/ui"
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

export function DataTableBulkSelectionBar<TData>({
	table,
	bulkActions,
	locale = "fr",
	className,
}: DataTableBulkSelectionBarProps<TData>) {
	const t = useDataTableTranslations(locale)
	const selectedCount = table.getFilteredSelectedRowModel().rows.length
	const anchorRef = React.useRef<HTMLDivElement>(null)
	const [posStyle, setPosStyle] = React.useState<React.CSSProperties>({})
	const [visible, setVisible] = React.useState(false)
	const [shouldRender, setShouldRender] = React.useState(false)

	// Enter/exit animation
	React.useEffect(() => {
		if (selectedCount > 0) {
			setShouldRender(true)
			// Delay to allow mount before transition
			requestAnimationFrame(() => {
				requestAnimationFrame(() => setVisible(true))
			})
		} else {
			setVisible(false)
			const timer = setTimeout(() => setShouldRender(false), 200)
			return () => clearTimeout(timer)
		}
	}, [selectedCount])

	// Position calculation
	React.useEffect(() => {
		if (!shouldRender || !anchorRef.current) return

		function update() {
			const el = anchorRef.current
			if (!el) return

			let scrollParent: HTMLElement | null = el.parentElement
			while (scrollParent) {
				const overflow = getComputedStyle(scrollParent).overflowY
				if (overflow === "auto" || overflow === "scroll") break
				scrollParent = scrollParent.parentElement
			}

			if (!scrollParent) {
				setPosStyle({
					position: "fixed",
					bottom: 24,
					left: "50%",
					transform: "translateX(-50%)",
					zIndex: 9999,
				})
				return
			}

			const rect = scrollParent.getBoundingClientRect()
			setPosStyle({
				position: "fixed",
				bottom: window.innerHeight - rect.bottom + 16,
				left: rect.left + rect.width / 2,
				transform: "translateX(-50%)",
				zIndex: 9999,
			})
		}

		update()
		window.addEventListener("resize", update)
		window.addEventListener("scroll", update, true)
		return () => {
			window.removeEventListener("resize", update)
			window.removeEventListener("scroll", update, true)
		}
	}, [shouldRender])

	const normalActions = bulkActions.filter((a) => a.variant !== "destructive")
	const destructiveActions = bulkActions.filter((a) => a.variant === "destructive")

	return (
		<>
			<div ref={anchorRef} className="h-0 w-0 overflow-hidden" />
			{shouldRender && (
				<div
					style={{
						...posStyle,
						transform: `translateX(-50%) translateY(${visible ? "0" : "100%"})`,
						transition: "transform 200ms ease-out",
					}}
				>
					<div
						className={cn(
							"flex items-center gap-3 rounded-xl border border-edge bg-card px-4 py-2.5 shadow-lg",
							className
						)}
					>
						<span className="text-sm font-medium text-fg tabular-nums">
							{t.selectedCount(selectedCount)}
						</span>

						<div className="h-4 w-px bg-edge" />

						{normalActions.length > 0 && (
							<ButtonGroup>
								{normalActions.map((action) => (
									<Button
										key={action.id}
										variant="outline"
										size="sm"
										onClick={() => action.handler(table.getFilteredSelectedRowModel().rows)}
										disabled={action.disabled?.(table.getFilteredSelectedRowModel().rows)}
									>
										{action.icon && <action.icon className="size-3.5" />}
										{action.label}
									</Button>
								))}
							</ButtonGroup>
						)}

						{destructiveActions.map((action) => (
							<Button
								key={action.id}
								variant="destructive"
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
