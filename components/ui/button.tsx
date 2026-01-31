"use client"

import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap transition-all disabled:pointer-events-none disabled:opacity-50 outline-none select-none shrink-0 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 group/button",
	{
		variants: {
			variant: {
				default: [
					"bg-p-fill-brand text-p-text-on-fill",
					"shadow-p-button-primary",
					"hover:bg-p-fill-brand-hover hover:shadow-p-button-primary-hover",
					"active:shadow-p-button-primary-active",
					"rounded-p-lg border-0",
					// Polaris gradient overlay
					"relative before:absolute before:inset-0 before:rounded-p-lg",
					"before:bg-[image:var(--p-color-button-gradient-bg-fill)]",
					"before:pointer-events-none",
					// Focus states
					"focus-visible:ring-[3px] focus-visible:ring-p-border-focus/20 focus-visible:border-p-border-focus",
				],
				outline: [
					"bg-p-bg-surface border border-p-border",
					"shadow-p-button",
					"hover:bg-p-bg-surface-hover hover:shadow-p-button-hover",
					"active:shadow-p-button-active",
					"text-p-text",
					"rounded-p-lg",
					"aria-expanded:bg-p-bg-surface-hover",
					"focus-visible:ring-[3px] focus-visible:ring-p-border-focus/20 focus-visible:border-p-border-focus",
				],
				secondary: [
					"bg-p-fill-secondary text-p-text",
					"shadow-p-button",
					"hover:bg-p-fill-secondary hover:shadow-p-button-hover",
					"active:shadow-p-button-active",
					"rounded-p-lg border-0",
					"aria-expanded:bg-p-fill-secondary",
					"focus-visible:ring-[3px] focus-visible:ring-p-border-focus/20",
				],
				ghost: [
					"hover:bg-p-bg-surface-hover",
					"text-p-text",
					"rounded-p-lg border-0",
					"aria-expanded:bg-p-bg-surface-hover",
					"focus-visible:ring-[3px] focus-visible:ring-p-border-focus/20",
				],
				destructive: [
					"bg-p-critical-fill text-white",
					"shadow-p-button-primary-critical",
					"hover:shadow-p-button-primary-critical-hover",
					"active:shadow-p-button-primary-critical-active",
					"rounded-p-lg border-0",
					"focus-visible:ring-[3px] focus-visible:ring-p-critical-fill/20",
				],
				link: "text-p-text-brand underline-offset-4 hover:underline",
			},
			size: {
				default:
					"h-8 gap-p-1.5 px-p-3 text-p-sm font-p-semibold has-data-[icon=inline-end]:pr-p-2 has-data-[icon=inline-start]:pl-p-2",
				xs: "h-6 gap-p-1 px-p-2 text-p-xs font-p-semibold rounded-p-md in-data-[slot=button-group]:rounded-p-md has-data-[icon=inline-end]:pr-p-1.5 has-data-[icon=inline-start]:pl-p-1.5 [&_svg:not([class*='size-'])]:size-3",
				sm: "h-7 gap-p-1 px-p-2.5 text-p-sm font-p-semibold rounded-p-md in-data-[slot=button-group]:rounded-p-md has-data-[icon=inline-end]:pr-p-1.5 has-data-[icon=inline-start]:pl-p-1.5 [&_svg:not([class*='size-'])]:size-3.5",
				lg: "h-9 gap-p-2 px-p-4 text-p-base font-p-semibold has-data-[icon=inline-end]:pr-p-3 has-data-[icon=inline-start]:pl-p-3",
				icon: "size-8 p-0",
				"icon-xs": "size-6 p-0 rounded-p-md in-data-[slot=button-group]:rounded-p-md [&_svg:not([class*='size-'])]:size-3",
				"icon-sm": "size-7 p-0 rounded-p-md in-data-[slot=button-group]:rounded-p-md",
				"icon-lg": "size-9 p-0",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
)

function Button({
	className,
	variant = "default",
	size = "default",
	...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
	return (
		<ButtonPrimitive
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className }))}
			{...props}
		/>
	)
}

export { Button, buttonVariants }
