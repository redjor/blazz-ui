import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "../../lib/utils"

const textVariants = cva("", {
	variants: {
		variant: {
			"heading-3xl": "text-3xl font-bold leading-tight tracking-tight",
			"heading-2xl": "text-2xl font-bold leading-tight tracking-tight",
			"heading-xl": "text-xl font-semibold leading-snug",
			"heading-lg": "text-lg font-semibold leading-snug",
			"heading-md": "text-base font-semibold leading-snug",
			"heading-sm": "text-sm font-semibold leading-5",
			"heading-xs": "text-xs font-semibold leading-snug",
			"body-lg": "text-base leading-normal",
			"body-md": "text-sm leading-5",
			"body-sm": "text-xs leading-snug",
			"body-xs": "text-2xs leading-4",
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

type TextVariant = NonNullable<VariantProps<typeof textVariants>["variant"]>

const variantElementMap: Record<TextVariant, React.ElementType> = {
	"heading-3xl": "h1",
	"heading-2xl": "h2",
	"heading-xl": "h3",
	"heading-lg": "h4",
	"heading-md": "h5",
	"heading-sm": "h6",
	"heading-xs": "h6",
	"body-lg": "p",
	"body-md": "p",
	"body-sm": "span",
	"body-xs": "span",
}

type PolymorphicRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>["ref"]

export interface TextProps<T extends React.ElementType = "span"> extends VariantProps<typeof textVariants> {
	as?: T
	className?: string
	children?: React.ReactNode
	truncate?: boolean
	numeric?: boolean
}

function TextInner<T extends React.ElementType = "span">(
	{ as, variant, tone, truncate, numeric, className, ...props }: TextProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof TextProps<T>>,
	ref: PolymorphicRef<T>
) {
	const Component = as || variantElementMap[variant ?? "body-md"]

	return <Component ref={ref} className={cn(textVariants({ variant, tone }), truncate && "truncate", numeric && "tabular-nums", className)} {...props} />
}

export const Text = React.forwardRef(TextInner as any) as unknown as <T extends React.ElementType = "span">(
	props: TextProps<T> &
		Omit<React.ComponentPropsWithoutRef<T>, keyof TextProps<T>> & {
			ref?: PolymorphicRef<T>
		}
) => React.ReactElement | null

;(Text as React.FC).displayName = "Text"

export { textVariants }
