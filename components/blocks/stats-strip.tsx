"use client"

import { useRef, useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StatsStripItem {
	/** Metric label */
	label: string
	/** Formatted value (e.g. "39", "0 €", "12.5 %") */
	value: string | number
	/** Sparkline data points (optional) — array of numbers */
	chart?: number[]
}

export interface StatsStripProps {
	stats: StatsStripItem[]
	loading?: boolean
	className?: string
}

// ---------------------------------------------------------------------------
// Sparkline (inline SVG, no dependencies)
// ---------------------------------------------------------------------------

function Sparkline({ data, className }: { data: number[]; className?: string }) {
	if (data.length < 2) return null

	const width = 48
	const height = 20
	const padding = 2
	const min = Math.min(...data)
	const max = Math.max(...data)
	const range = max - min || 1

	const points = data.map((v, i) => {
		const x = padding + (i / (data.length - 1)) * (width - padding * 2)
		const y = height - padding - ((v - min) / range) * (height - padding * 2)
		return `${x},${y}`
	})

	return (
		<svg
			width={width}
			height={height}
			viewBox={`0 0 ${width} ${height}`}
			className={cn("shrink-0", className)}
		>
			<polyline
				points={points.join(" ")}
				fill="none"
				stroke="currentColor"
				strokeWidth={1.5}
				strokeLinecap="round"
				strokeLinejoin="round"
			/>
		</svg>
	)
}

// ---------------------------------------------------------------------------
// StatsStrip
// ---------------------------------------------------------------------------

export function StatsStrip({ stats, loading = false, className }: StatsStripProps) {
	const scrollRef = useRef<HTMLDivElement>(null)
	const [canScrollLeft, setCanScrollLeft] = useState(false)
	const [canScrollRight, setCanScrollRight] = useState(false)

	const updateScrollState = useCallback(() => {
		const el = scrollRef.current
		if (!el) return
		setCanScrollLeft(el.scrollLeft > 1)
		setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1)
	}, [])

	useEffect(() => {
		const el = scrollRef.current
		if (!el) return
		updateScrollState()
		el.addEventListener("scroll", updateScrollState, { passive: true })
		const ro = new ResizeObserver(updateScrollState)
		ro.observe(el)
		return () => {
			el.removeEventListener("scroll", updateScrollState)
			ro.disconnect()
		}
	}, [updateScrollState])

	const scroll = (direction: "left" | "right") => {
		const el = scrollRef.current
		if (!el) return
		const amount = el.clientWidth * 0.6
		el.scrollBy({
			left: direction === "left" ? -amount : amount,
			behavior: "smooth",
		})
	}

	const showArrows = canScrollLeft || canScrollRight

	if (loading) {
		return (
			<Card className={cn("flex items-center divide-x divide-edge overflow-hidden", className)}>
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className="flex min-w-48 flex-1 flex-col gap-2 px-4 py-3">
						<Skeleton className="h-3.5 w-24" />
						<div className="flex items-end justify-between">
							<Skeleton className="h-5 w-12" />
							<Skeleton className="h-5 w-12" />
						</div>
					</div>
				))}
			</Card>
		)
	}

	return (
		<Card className={cn("relative flex items-center overflow-hidden", className)}>
			{/* Scrollable content */}
			<div
				ref={scrollRef}
				className="flex w-full divide-x divide-edge overflow-x-auto"
				style={{ scrollbarWidth: "none" }}
			>
				{stats.map((stat, i) => (
					<div
						key={i}
						className="flex min-w-48 flex-1 shrink-0 flex-col gap-1 px-4 py-3"
					>
						<span className="truncate text-[13px] text-fg-muted" title={stat.label}>
							{stat.label}
						</span>
						<div className="flex items-end justify-between gap-3">
							<span className="text-base font-semibold tabular-nums text-fg">
								{stat.value}
							</span>
							{stat.chart && stat.chart.length >= 2 && (
								<Sparkline data={stat.chart} className="text-fg-muted" />
							)}
						</div>
					</div>
				))}
			</div>

			{/* Navigation arrows */}
			{showArrows && (
				<div className="absolute right-2 top-2 flex items-center gap-0.5">
					<button
						type="button"
						onClick={() => scroll("left")}
						disabled={!canScrollLeft}
						className="flex size-6 items-center justify-center rounded border border-edge bg-surface transition-colors duration-150 ease-out hover:bg-raised disabled:opacity-30 disabled:pointer-events-none"
						aria-label="Défiler à gauche"
					>
						<ChevronLeft className="size-3.5" />
					</button>
					<button
						type="button"
						onClick={() => scroll("right")}
						disabled={!canScrollRight}
						className="flex size-6 items-center justify-center rounded border border-edge bg-surface transition-colors duration-150 ease-out hover:bg-raised disabled:opacity-30 disabled:pointer-events-none"
						aria-label="Défiler à droite"
					>
						<ChevronRight className="size-3.5" />
					</button>
				</div>
			)}
		</Card>
	)
}
