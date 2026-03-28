import type * as React from "react"
import { cn } from "../../lib/utils"

type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl"

export interface GridProps {
	children?: React.ReactNode
	className?: string
	columns?: Partial<Record<Breakpoint, number>>
	gap?: Partial<Record<Breakpoint, string>>
}

const defaultColumns: Partial<Record<Breakpoint, number>> = {
	xs: 6,
	sm: 6,
	md: 12,
	lg: 12,
	xl: 12,
}

export function Grid({ children, className, columns = defaultColumns, gap }: GridProps) {
	const style: React.CSSProperties = {
		display: "grid",
	}

	// Use CSS custom properties for responsive behavior
	const gridCols = columns.lg || columns.md || columns.sm || columns.xs || 12

	return (
		<div
			data-slot="grid"
			className={cn(
				"grid",
				gap?.xs && `gap-${gap.xs}`,
				gap?.sm && `sm:gap-${gap.sm}`,
				gap?.md && `md:gap-${gap.md}`,
				gap?.lg && `lg:gap-${gap.lg}`,
				gap?.xl && `xl:gap-${gap.xl}`,
				!gap && "gap-4",
				className
			)}
			style={{
				...style,
				gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
			}}
		>
			{children}
		</div>
	)
}

export interface GridCellProps {
	children?: React.ReactNode
	className?: string
	columnSpan?: Partial<Record<Breakpoint, number>>
}

function GridCell({ children, className, columnSpan }: GridCellProps) {
	const xsSpan = columnSpan?.xs || 6
	const smSpan = columnSpan?.sm || columnSpan?.xs || 6
	const mdSpan = columnSpan?.md || columnSpan?.sm || columnSpan?.xs || 6
	const lgSpan = columnSpan?.lg || columnSpan?.md || columnSpan?.sm || columnSpan?.xs || 6
	const xlSpan = columnSpan?.xl || columnSpan?.lg || columnSpan?.md || columnSpan?.sm || columnSpan?.xs || 6

	return (
		<div
			data-slot="grid-cell"
			className={cn(`col-span-${xsSpan}`, `sm:col-span-${smSpan}`, `md:col-span-${mdSpan}`, `lg:col-span-${lgSpan}`, `xl:col-span-${xlSpan}`, className)}
			style={{
				gridColumn: `span ${lgSpan} / span ${lgSpan}`,
			}}
		>
			{children}
		</div>
	)
}

Grid.Cell = GridCell
