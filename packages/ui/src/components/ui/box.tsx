import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"
import { cn } from "../../lib/utils"

const boxVariants = cva("", {
	variants: {
		padding: {
			"0": "p-0",
			"2": "p-2",
			"4": "p-4",
			inset: "p-inset",
			"6": "p-6",
			"8": "p-8",
		},
		background: {
			transparent: "bg-transparent",
			app: "bg-app",
			surface: "bg-card",
			raised: "bg-muted",
			overlay: "bg-overlay",
			accent: "bg-brand/10",
		},
		border: {
			none: "border-0",
			default: "border border-container",
		},
		borderRadius: {
			none: "rounded-none",
			sm: "rounded-sm",
			md: "rounded-md",
			lg: "rounded-lg",
			xl: "rounded-xl",
		},
		shadow: {
			none: "shadow-none",
			sm: "shadow-sm",
			md: "shadow-md",
			lg: "shadow-lg",
			card: "shadow-card",
			"card-elevated": "shadow-card-elevated",
		},
	},
	defaultVariants: {
		padding: "inset",
		background: "transparent",
		border: "none",
		borderRadius: "none",
		shadow: "none",
	},
})

export interface BoxProps<T extends React.ElementType = "div"> extends VariantProps<typeof boxVariants> {
	as?: T
	className?: string
	children?: React.ReactNode
}

type PolymorphicRef<T extends React.ElementType> = React.ComponentPropsWithRef<T>["ref"]

function BoxInner<T extends React.ElementType = "div">(
	{ as, padding, background, border, borderRadius, shadow, className, children, ...props }: BoxProps<T> & Omit<React.ComponentPropsWithoutRef<T>, keyof BoxProps<T>>,
	ref: PolymorphicRef<T>
) {
	const Component = as || "div"

	return (
		<Component ref={ref} className={cn(boxVariants({ padding, background, border, borderRadius, shadow }), className)} {...props}>
			{children}
		</Component>
	)
}

export const Box = React.forwardRef(BoxInner as any) as unknown as <T extends React.ElementType = "div">(
	props: BoxProps<T> &
		Omit<React.ComponentPropsWithoutRef<T>, keyof BoxProps<T>> & {
			ref?: PolymorphicRef<T>
		}
) => React.ReactElement | null

;(Box as React.FC).displayName = "Box"
