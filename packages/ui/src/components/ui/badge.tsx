import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { X } from "lucide-react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../../lib/utils"

const badgeVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap shrink-0 transition-colors [&>svg]:pointer-events-none group/badge rounded-[var(--badge-radius)] font-medium",
	{
		variants: {
			variant: {
				default: "",
				secondary: "",
				info: "",
				success: "",
				warning: "",
				critical: "",
				outline: "border border-container text-fg",
			},
			size: {
				xs: "h-4 px-1 gap-0.5 text-[10px] [&>svg]:size-2.5!",
				sm: "h-5 px-1.5 gap-1 text-xs [&>svg]:size-3!",
				md: "h-6 px-2 gap-1 text-xs [&>svg]:size-3.5!",
			},
			fill: {
				subtle: "",
				solid: "",
			},
		},
		compoundVariants: [
			// Default
			{ variant: "default", fill: "solid", className: "bg-brand text-brand-fg" },
			{ variant: "default", fill: "subtle", className: "bg-brand/15 text-brand border border-brand/30" },
			// Secondary
			{ variant: "secondary", fill: "solid", className: "bg-fg-muted text-surface" },
			{ variant: "secondary", fill: "subtle", className: "bg-raised text-fg-muted" },
			// Info
			{ variant: "info", fill: "solid", className: "bg-inform text-white" },
			{ variant: "info", fill: "subtle", className: "bg-inform/15 text-inform border border-inform/30" },
			// Success
			{ variant: "success", fill: "solid", className: "bg-positive text-white" },
			{ variant: "success", fill: "subtle", className: "bg-positive/15 text-positive border border-positive/30" },
			// Warning
			{ variant: "warning", fill: "solid", className: "bg-caution text-white" },
			{ variant: "warning", fill: "subtle", className: "bg-caution/15 text-caution border border-caution/30" },
			// Critical
			{ variant: "critical", fill: "solid", className: "bg-negative text-white" },
			{ variant: "critical", fill: "subtle", className: "bg-negative/15 text-negative border border-negative/30" },
		],
		defaultVariants: {
			variant: "default",
			size: "sm",
			fill: "solid",
		},
	}
)

const dotColorMap: Record<string, string> = {
	default: "bg-brand-fg",
	secondary: "bg-fg-muted",
	info: "bg-current",
	success: "bg-current",
	warning: "bg-current",
	critical: "bg-current",
	outline: "bg-fg-muted",
}

const dotSolidColorMap: Record<string, string> = {
	default: "bg-brand-fg",
	secondary: "bg-surface",
	info: "bg-white",
	success: "bg-white",
	warning: "bg-white",
	critical: "bg-white",
	outline: "bg-fg-muted",
}

const dotSizeMap: Record<string, string> = {
	xs: "size-1.5",
	sm: "size-1.5",
	md: "size-2",
}

interface BadgeProps
	extends useRender.ComponentProps<"span">,
		VariantProps<typeof badgeVariants> {
	dot?: boolean
	onDismiss?: () => void
}

function Badge({
	className,
	variant = "default",
	size = "sm",
	fill = "solid",
	dot,
	onDismiss,
	children,
	render,
	...props
}: BadgeProps) {
	const variantKey = variant ?? "default"
	const sizeKey = size ?? "sm"
	const fillKey = fill ?? "solid"

	return useRender({
		defaultTagName: "span",
		props: mergeProps<"span">(
			{
				className: cn(badgeVariants({ className, variant, size, fill })),
			},
			{
				...props,
				children: (
					<>
						{dot && (
							<span
								className={cn(
									"shrink-0 rounded-full",
									dotSizeMap[sizeKey],
									fillKey === "solid"
										? dotSolidColorMap[variantKey]
										: dotColorMap[variantKey]
								)}
							/>
						)}
						{children}
						{onDismiss && (
							<button
								type="button"
								onClick={(e) => {
									e.stopPropagation()
									onDismiss()
								}}
								className="shrink-0 cursor-pointer rounded-full opacity-60 transition-opacity hover:opacity-100"
								aria-label="Remove"
							>
								<X className="size-3!" />
							</button>
						)}
					</>
				),
			}
		),
		render,
		state: {
			slot: "badge",
			variant,
			size,
			fill,
		},
	})
}

export { Badge, badgeVariants }
export type { BadgeProps }
