import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textVariants = cva("", {
	variants: {
		tone: {
			base: "text-p-text",
			subdued: "text-p-text-secondary",
			disabled: "text-p-text-disabled",
			success: "text-p-success-text",
			critical: "text-p-critical-text",
			caution: "text-p-caution-text",
			warning: "text-p-warning-text",
			info: "text-p-info-text",
			"text-inverse": "text-p-text-on-fill",
			inherit: "text-inherit",
		},
		alignment: {
			start: "text-left",
			center: "text-center",
			end: "text-right",
			justify: "text-justify",
		},
		fontWeight: {
			regular: "font-[weight:var(--p-font-weight-regular)]",
			medium: "font-[weight:var(--p-font-weight-medium)]",
			semibold: "font-[weight:var(--p-font-weight-semibold)]",
			bold: "font-[weight:var(--p-font-weight-bold)]",
		},
		textDecorationLine: {
			"line-through": "line-through",
		},
	},
	defaultVariants: {
		tone: "base",
	},
})

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
	/**
	 * The HTML element to render
	 * @default "span"
	 */
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "strong" | "em" | "dt" | "dd" | "legend"

	/**
	 * The typographic style variant to apply
	 * @default "body-md"
	 */
	variant?: TypographyVariant

	/**
	 * Truncate text with ellipsis
	 */
	truncate?: boolean

	/**
	 * Break long words to prevent overflow
	 */
	breakWord?: boolean

	/**
	 * Use monospace font for numeric values
	 */
	numeric?: boolean

	/**
	 * Visually hide the element but keep it accessible to screen readers
	 */
	visuallyHidden?: boolean
}

/**
 * Text component for displaying text content with consistent typography.
 *
 * Based on Shopify Polaris design system, provides semantic HTML elements
 * with predefined typographic styles and tones.
 *
 * @example
 * ```tsx
 * <Text variant="heading-lg" as="h1">Welcome</Text>
 * <Text variant="body-md" tone="subdued">Optional description</Text>
 * <Text as="p" truncate>Long text that will be truncated...</Text>
 * <Text numeric>$1,234.56</Text>
 * ```
 */
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
			style,
			children,
			...props
		},
		ref
	) => {
		// Get typography styles from CSS variables
		const typographyStyle: React.CSSProperties = variant ? {
			fontFamily: `var(--p-text-${variant}-font-family)`,
			fontSize: `var(--p-text-${variant}-font-size)`,
			fontWeight: fontWeight ? `var(--p-font-weight-${fontWeight})` : `var(--p-text-${variant}-font-weight)`,
			letterSpacing: `var(--p-text-${variant}-font-letter-spacing)`,
			lineHeight: `var(--p-text-${variant}-font-line-height)`,
		} : {}

		return (
			<Component
				ref={ref as any}
				className={cn(
					textVariants({ tone, alignment, textDecorationLine }),
					{
						"truncate": truncate,
						"break-words": breakWord,
						"font-mono tabular-nums": numeric,
						"sr-only": visuallyHidden,
					},
					className
				)}
				style={{ ...typographyStyle, ...style }}
				{...props}
			>
				{children}
			</Component>
		)
	}
)

Text.displayName = "Text"
