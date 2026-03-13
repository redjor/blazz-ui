import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"
import { cn } from "../../lib/utils"

const inlineGridVariants = cva("grid", {
	variants: {
		gap: {
			"0": "gap-0",
			"050": "gap-0.5",
			"100": "gap-1",
			"150": "gap-1.5",
			"200": "gap-2",
			"300": "gap-3",
			"400": "gap-4",
			"500": "gap-5",
			"600": "gap-6",
			"800": "gap-8",
			"1000": "gap-10",
			"1200": "gap-12",
			"1600": "gap-16",
		},
		alignItems: {
			start: "items-start",
			center: "items-center",
			end: "items-end",
		},
	},
	defaultVariants: {
		gap: "400",
		alignItems: "start",
	},
})

type ColumnValue = number | string | "oneThird" | "oneHalf" | "twoThirds"

const columnValueMap: Record<string, string> = {
	oneThird: "1fr 1fr 1fr",
	oneHalf: "1fr 1fr",
	twoThirds: "2fr 1fr",
}

export interface InlineGridProps extends VariantProps<typeof inlineGridVariants> {
	children?: React.ReactNode
	className?: string
	columns?: ColumnValue | ColumnValue[]
}

export function InlineGrid({ children, className, columns = 2, gap, alignItems }: InlineGridProps) {
	let gridTemplateColumns: string

	if (typeof columns === "number") {
		gridTemplateColumns = `repeat(${columns}, minmax(0, 1fr))`
	} else if (typeof columns === "string" && columnValueMap[columns]) {
		gridTemplateColumns = columnValueMap[columns]
	} else if (Array.isArray(columns)) {
		gridTemplateColumns = columns
			.map((col) => {
				if (typeof col === "number") return `${col}fr`
				if (columnValueMap[col]) return columnValueMap[col]
				return col
			})
			.join(" ")
	} else {
		gridTemplateColumns = columns as string
	}

	return (
		<div
			data-slot="inline-grid"
			className={cn(inlineGridVariants({ gap, alignItems }), className)}
			style={{ gridTemplateColumns }}
		>
			{children}
		</div>
	)
}
