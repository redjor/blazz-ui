"use client"

import type * as React from "react"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../lib/with-pro-guard"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@blazz/ui"

// ---------------------------------------------------------------------------
// PropertyCard
// ---------------------------------------------------------------------------

export interface PropertyCardProps {
	/** Section title */
	title: string
	/** Optional description below the title */
	description?: string
	/** Number of grid columns (responsive) */
	columns?: 1 | 2 | 3 | 4
	/** Slot for action buttons (top-right) */
	actions?: React.ReactNode
	children: React.ReactNode
	className?: string
}

const gridCols = {
	1: "grid-cols-1",
	2: "grid-cols-1 sm:grid-cols-2",
	3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
	4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
}

function PropertyCardBase({
	title,
	description,
	columns = 3,
	actions,
	children,
	className,
}: PropertyCardProps) {
	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
				{description && <CardDescription>{description}</CardDescription>}
				{actions && <CardAction>{actions}</CardAction>}
			</CardHeader>
			<CardContent>
				<div className={cn("grid gap-x-6 gap-y-4", gridCols[columns])}>{children}</div>
			</CardContent>
		</Card>
	)
}

// ---------------------------------------------------------------------------
// PropertyCard.Item
// ---------------------------------------------------------------------------

export interface PropertyCardItemProps {
	/** Label displayed above the value */
	label: string
	/** Value content — text, Badge, link, or any ReactNode */
	value?: React.ReactNode
	/** Number of columns to span */
	span?: number
	className?: string
}

function PropertyCardItem({ label, value, span, className }: PropertyCardItemProps) {
	return (
		<div
			className={cn("min-w-0", className)}
			style={span ? { gridColumn: `span ${span}` } : undefined}
		>
			<dt className="text-[13px] text-fg-muted">{label}</dt>
			<dd className="mt-0.5 text-sm font-medium text-fg">{value ?? "—"}</dd>
		</div>
	)
}

export const PropertyCard = Object.assign(withProGuard(PropertyCardBase, "PropertyCard"), {
	Item: PropertyCardItem,
})
