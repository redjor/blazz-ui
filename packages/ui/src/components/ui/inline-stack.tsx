import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"
import { cn } from "../../lib/utils"

const inlineStackVariants = cva("flex", {
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
		align: {
			start: "justify-start",
			center: "justify-center",
			end: "justify-end",
			"space-around": "justify-around",
			"space-between": "justify-between",
			"space-evenly": "justify-evenly",
		},
		blockAlign: {
			start: "items-start",
			center: "items-center",
			end: "items-end",
			baseline: "items-baseline",
			stretch: "items-stretch",
		},
		direction: {
			row: "flex-row",
			"row-reverse": "flex-row-reverse",
		},
		wrap: {
			true: "flex-wrap",
			false: "flex-nowrap",
		},
	},
	defaultVariants: {
		gap: "0",
		align: "start",
		blockAlign: "center",
		direction: "row",
		wrap: true,
	},
})

type ElementType = "div" | "span" | "li" | "ol" | "ul"

export interface InlineStackProps extends VariantProps<typeof inlineStackVariants> {
	as?: ElementType
	children?: React.ReactNode
	className?: string
	id?: string
	role?: string
}

export function InlineStack({ as: Component = "div", gap, align, blockAlign, direction, wrap, className, children, id, role }: InlineStackProps) {
	return (
		<Component data-slot="inline-stack" id={id} role={role} className={cn(inlineStackVariants({ gap, align, blockAlign, direction, wrap }), className)}>
			{children}
		</Component>
	)
}
