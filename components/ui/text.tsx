import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const textVariants = cva("", {
	variants: {
		variant: {
			// Heading variants
			"heading-3xl": [
				"font-[family:var(--p-text-heading-3xl-font-family)]",
				"text-[length:var(--p-text-heading-3xl-font-size)]",
				"font-[weight:var(--p-text-heading-3xl-font-weight)]",
				"tracking-[var(--p-text-heading-3xl-font-letter-spacing)]",
				"leading-[var(--p-text-heading-3xl-font-line-height)]",
			],
			"heading-2xl": [
				"font-[family:var(--p-text-heading-2xl-font-family)]",
				"text-[length:var(--p-text-heading-2xl-font-size)]",
				"font-[weight:var(--p-text-heading-2xl-font-weight)]",
				"tracking-[var(--p-text-heading-2xl-font-letter-spacing)]",
				"leading-[var(--p-text-heading-2xl-font-line-height)]",
			],
			"heading-xl": [
				"font-[family:var(--p-text-heading-xl-font-family)]",
				"text-[length:var(--p-text-heading-xl-font-size)]",
				"font-[weight:var(--p-text-heading-xl-font-weight)]",
				"tracking-[var(--p-text-heading-xl-font-letter-spacing)]",
				"leading-[var(--p-text-heading-xl-font-line-height)]",
			],
			"heading-lg": [
				"font-[family:var(--p-text-heading-lg-font-family)]",
				"text-[length:var(--p-text-heading-lg-font-size)]",
				"font-[weight:var(--p-text-heading-lg-font-weight)]",
				"tracking-[var(--p-text-heading-lg-font-letter-spacing)]",
				"leading-[var(--p-text-heading-lg-font-line-height)]",
			],
			"heading-md": [
				"font-[family:var(--p-text-heading-md-font-family)]",
				"text-[length:var(--p-text-heading-md-font-size)]",
				"font-[weight:var(--p-text-heading-md-font-weight)]",
				"tracking-[var(--p-text-heading-md-font-letter-spacing)]",
				"leading-[var(--p-text-heading-md-font-line-height)]",
			],
			"heading-sm": [
				"font-[family:var(--p-text-heading-sm-font-family)]",
				"text-[length:var(--p-text-heading-sm-font-size)]",
				"font-[weight:var(--p-text-heading-sm-font-weight)]",
				"tracking-[var(--p-text-heading-sm-font-letter-spacing)]",
				"leading-[var(--p-text-heading-sm-font-line-height)]",
			],
			"heading-xs": [
				"font-[family:var(--p-text-heading-xs-font-family)]",
				"text-[length:var(--p-text-heading-xs-font-size)]",
				"font-[weight:var(--p-text-heading-xs-font-weight)]",
				"tracking-[var(--p-text-heading-xs-font-letter-spacing)]",
				"leading-[var(--p-text-heading-xs-font-line-height)]",
			],
			// Body variants
			"body-lg": [
				"font-[family:var(--p-text-body-lg-font-family)]",
				"text-[length:var(--p-text-body-lg-font-size)]",
				"font-[weight:var(--p-text-body-lg-font-weight)]",
				"tracking-[var(--p-text-body-lg-font-letter-spacing)]",
				"leading-[var(--p-text-body-lg-font-line-height)]",
			],
			"body-md": [
				"font-[family:var(--p-text-body-md-font-family)]",
				"text-[length:var(--p-text-body-md-font-size)]",
				"font-[weight:var(--p-text-body-md-font-weight)]",
				"tracking-[var(--p-text-body-md-font-letter-spacing)]",
				"leading-[var(--p-text-body-md-font-line-height)]",
			],
			"body-sm": [
				"font-[family:var(--p-text-body-sm-font-family)]",
				"text-[length:var(--p-text-body-sm-font-size)]",
				"font-[weight:var(--p-text-body-sm-font-weight)]",
				"tracking-[var(--p-text-body-sm-font-letter-spacing)]",
				"leading-[var(--p-text-body-sm-font-line-height)]",
			],
			"body-xs": [
				"font-[family:var(--p-text-body-xs-font-family)]",
				"text-[length:var(--p-text-body-xs-font-size)]",
				"font-[weight:var(--p-text-body-xs-font-weight)]",
				"tracking-[var(--p-text-body-xs-font-letter-spacing)]",
				"leading-[var(--p-text-body-xs-font-line-height)]",
			],
		},
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
		variant: "body-md",
		tone: "base",
	},
})

export interface TextProps
	extends React.HTMLAttributes<HTMLElement>,
		VariantProps<typeof textVariants> {
	/**
	 * The HTML element to render
	 * @default "span"
	 */
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span" | "strong" | "em" | "dt" | "dd" | "legend"

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
			variant,
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
					textVariants({ variant, tone, alignment, fontWeight, textDecorationLine }),
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
