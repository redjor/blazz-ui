import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textVariants = cva("", {
	variants: {
		variant: {
			"heading-3xl": "text-3xl font-bold leading-tight tracking-tight",
			"heading-2xl": "text-2xl font-bold leading-tight tracking-tight",
			"heading-xl": "text-xl font-semibold leading-snug",
			"heading-lg": "text-lg font-semibold leading-snug",
			"heading-md": "text-base font-semibold",
			"heading-sm": "text-sm font-semibold",
			"heading-xs": "text-xs font-semibold",
			"body-lg": "text-base",
			"body-md": "text-sm",
			"body-sm": "text-xs",
			"body-xs": "text-[11px]",
		},
		tone: {
			default: "text-fg",
			muted: "text-fg-muted",
			subtle: "text-fg-subtle",
			success: "text-positive",
			danger: "text-negative",
			warning: "text-caution",
			info: "text-inform",
			inherit: "text-inherit",
		},
	},
	defaultVariants: {
		variant: "body-md",
		tone: "default",
	},
})

export interface TextProps
	extends React.HTMLAttributes<HTMLElement>,
		VariantProps<typeof textVariants> {
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "strong" | "em" | "dt" | "dd" | "label" | "legend"
	truncate?: boolean
	numeric?: boolean
}

const Text = React.forwardRef<HTMLElement, TextProps>(
	({ as: Component = "span", variant, tone, truncate, numeric, className, ...props }, ref) => {
		return (
			<Component
				ref={ref as any}
				className={cn(
					textVariants({ variant, tone }),
					truncate && "truncate",
					numeric && "font-mono tabular-nums",
					className,
				)}
				{...props}
			/>
		)
	},
)

Text.displayName = "Text"

export { Text, textVariants }
