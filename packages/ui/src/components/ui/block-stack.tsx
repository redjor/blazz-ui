import { cva, type VariantProps } from "class-variance-authority"
import type * as React from "react"
import { cn } from "../../lib/utils"

const blockStackVariants = cva("flex flex-col w-full", {
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
		inlineAlign: {
			start: "items-start",
			center: "items-center",
			end: "items-end",
			baseline: "items-baseline",
			stretch: "items-stretch",
		},
	},
	defaultVariants: {
		gap: "0",
		align: "start",
		inlineAlign: "stretch",
	},
})

type ElementType = "div" | "span" | "ul" | "ol" | "li" | "fieldset"

export interface BlockStackProps extends VariantProps<typeof blockStackVariants> {
	as?: ElementType
	reverseOrder?: boolean
	children?: React.ReactNode
	className?: string
	id?: string
	role?: string
}

export function BlockStack({
	as: Component = "div",
	gap,
	align,
	inlineAlign,
	reverseOrder = false,
	className,
	children,
	id,
	role,
}: BlockStackProps) {
	return (
		<Component
			data-slot="block-stack"
			id={id}
			role={role}
			className={cn(
				blockStackVariants({ gap, align, inlineAlign }),
				reverseOrder && "flex-col-reverse",
				className
			)}
		>
			{children}
		</Component>
	)
}
