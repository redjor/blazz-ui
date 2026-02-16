import type * as React from "react"
import { cn } from "@/lib/utils"

export interface FieldGridProps {
	columns?: 1 | 2 | 3 | 4
	children: React.ReactNode
	className?: string
}

export function FieldGrid({ columns = 3, children, className }: FieldGridProps) {
	const gridCols = {
		1: "grid-cols-1",
		2: "grid-cols-1 sm:grid-cols-2",
		3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
		4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
	}

	return (
		<div className={cn("grid gap-x-6 gap-y-4", gridCols[columns], className)}>
			{children}
		</div>
	)
}

export interface FieldProps {
	label: string
	value: React.ReactNode
	span?: number
	className?: string
}

export function Field({ label, value, span, className }: FieldProps) {
	return (
		<div
			className={cn("min-w-0", className)}
			style={span ? { gridColumn: `span ${span}` } : undefined}
		>
			<dt className="text-sm text-fg-muted">{label}</dt>
			<dd className="mt-0.5 text-sm font-medium text-fg">
				{value ?? "—"}
			</dd>
		</div>
	)
}
