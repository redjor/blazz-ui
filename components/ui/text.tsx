import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textVariants = cva("", {
	variants: {
		tone: {
			base: "text-fg",
			subdued: "text-fg-muted",
			disabled: "text-fg-subtle",
			success: "text-positive",
			critical: "text-negative",
			caution: "text-caution",
			warning: "text-caution",
			info: "text-inform",
			"text-inverse": "text-brand-fg",
			inherit: "text-inherit",
		},
		alignment: {
			start: "text-left",
			center: "text-center",
			end: "text-right",
			justify: "text-justify",
		},
		fontWeight: {
			regular: "font-normal",
			medium: "font-medium",
			semibold: "font-semibold",
			bold: "font-bold",
		},
		textDecorationLine: {
			"line-through": "line-through",
		},
	},
	defaultVariants: {
		tone: "base",
	},
})

const variantSizeMap: Record<string, string> = {
	"heading-3xl": "text-3xl leading-tight",
	"heading-2xl": "text-2xl leading-tight",
	"heading-xl": "text-xl leading-snug",
	"heading-lg": "text-lg leading-snug",
	"heading-md": "text-base leading-normal",
	"heading-sm": "text-sm leading-normal",
	"heading-xs": "text-xs leading-normal",
	"body-lg": "text-base leading-normal",
	"body-md": "text-sm leading-normal",
	"body-sm": "text-xs leading-normal",
	"body-xs": "text-[11px] leading-normal",
}

type TypographyVariant =
	| "heading-3xl"
	| "heading-2xl"
	| "heading-xl"
	| "heading-lg"
	| "heading-md"
	| "heading-sm"
	| "heading-xs"
	| "body-lg"
	| "body-md"
	| "body-sm"
	| "body-xs"

export interface TextProps
	extends React.HTMLAttributes<HTMLElement>,
		VariantProps<typeof textVariants> {
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "strong" | "em" | "dt" | "dd" | "legend"
	variant?: TypographyVariant
	truncate?: boolean
	breakWord?: boolean
	numeric?: boolean
	visuallyHidden?: boolean
}

export const Text = React.forwardRef<HTMLElement, TextProps>(
	(
		{
			as: Component = "span",
			variant = "body-md",
			tone,
			alignment,
			fontWeight,
			textDecorationLine,
			truncate,
			breakWord,
			numeric,
			visuallyHidden,
			className,
			children,
			...props
		},
		ref
	) => {
		return (
			<Component
				ref={ref as any}
				className={cn(
					variantSizeMap[variant] ?? "",
					textVariants({ tone, alignment, fontWeight, textDecorationLine }),
					{
						"truncate": truncate,
						"break-words": breakWord,
						"font-mono tabular-nums": numeric,
						"sr-only": visuallyHidden,
					},
					className
				)}
				{...props}
			>
				{children}
			</Component>
		)
	}
)

Text.displayName = "Text"
