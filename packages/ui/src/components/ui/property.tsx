import type * as React from "react"
import { cn } from "../../lib/utils"

// ---------------------------------------------------------------------------
// Property
// ---------------------------------------------------------------------------

interface PropertyProps {
	label: string
	/** "vertical" (default) stacks label above value. "horizontal" places them inline. */
	direction?: "vertical" | "horizontal"
	children: React.ReactNode
	className?: string
}

function Property({ label, direction = "vertical", children, className }: PropertyProps) {
	if (direction === "horizontal") {
		return (
			<div className={cn("flex items-baseline gap-1.5 [[data-property-grid]_&]:contents", className)}>
				<span className="text-sm text-fg-muted">{label}</span>
				<span className="text-sm font-semibold text-fg">{children}</span>
			</div>
		)
	}

	return (
		<div className={cn("flex flex-col gap-0.5", className)}>
			<span className="text-xs text-fg-muted">{label}</span>
			<span className="text-sm font-semibold text-fg">{children}</span>
		</div>
	)
}

// ---------------------------------------------------------------------------
// Property.Section
// ---------------------------------------------------------------------------

const sectionGridCols = {
	1: "grid-cols-1",
	2: "grid-cols-1 sm:grid-cols-2",
	3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
	4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
}

interface PropertySectionProps {
	/** Section title */
	title: string
	/** Optional description below the title */
	description?: string
	/** Number of grid columns (responsive, default: 3) */
	columns?: 1 | 2 | 3 | 4
	/** Slot for action buttons (top-right) */
	actions?: React.ReactNode
	children: React.ReactNode
	className?: string
}

function PropertySection({ title, description, columns = 3, actions, children, className }: PropertySectionProps) {
	return (
		<div className={cn("flex flex-col gap-4", className)}>
			<div className="flex items-start justify-between gap-4">
				<div className="flex flex-col gap-0.5">
					<h3 className="text-sm font-semibold text-fg">{title}</h3>
					{description && <p className="text-xs text-fg-muted">{description}</p>}
				</div>
				{actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
			</div>
			<div className="border-t border-edge" />
			<div className={cn("grid gap-x-6 gap-y-4", sectionGridCols[columns])}>{children}</div>
		</div>
	)
}

// ---------------------------------------------------------------------------
// Property.List
// ---------------------------------------------------------------------------

interface PropertyListProps {
	/** "horizontal" renders items in a row. "vertical" stacks them (default). */
	direction?: "vertical" | "horizontal"
	children: React.ReactNode
	className?: string
}

function PropertyList({ direction = "vertical", children, className }: PropertyListProps) {
	return (
		<div
			{...(direction === "vertical" ? { "data-property-grid": "" } : {})}
			className={cn(direction === "horizontal" ? "flex flex-wrap items-baseline gap-x-6 gap-y-2" : "grid grid-cols-[auto_1fr] items-baseline gap-x-4 gap-y-2", className)}
		>
			{children}
		</div>
	)
}

Property.Section = PropertySection
Property.List = PropertyList

export { Property }
