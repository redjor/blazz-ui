import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap shrink-0 border-0 transition-colors overflow-hidden [&>svg]:pointer-events-none [&>svg]:size-3! has-data-[icon=inline-end]:pr-p-1.5 has-data-[icon=inline-start]:pl-p-1.5 group/badge",
	{
		variants: {
			variant: {
				default: [
					"bg-p-fill-brand text-p-text-on-fill",
					"rounded-p-full",
					"h-5 px-p-2 gap-p-1",
					"text-p-xs font-p-medium",
				],
				info: [
					"bg-p-info-surface text-p-info-text border border-p-info-border",
					"rounded-p-full",
					"h-5 px-p-2 gap-p-1",
					"text-p-xs font-p-medium",
				],
				success: [
					"bg-p-success-surface text-p-success-text border border-p-success-border",
					"rounded-p-full",
					"h-5 px-p-2 gap-p-1",
					"text-p-xs font-p-medium",
				],
				warning: [
					"bg-p-warning-surface text-p-warning-text border border-p-warning-border",
					"rounded-p-full",
					"h-5 px-p-2 gap-p-1",
					"text-p-xs font-p-medium",
				],
				critical: [
					"bg-p-critical-surface text-p-critical-text border border-p-critical-border",
					"rounded-p-full",
					"h-5 px-p-2 gap-p-1",
					"text-p-xs font-p-medium",
				],
				outline: [
					"border border-p-border text-p-text",
					"rounded-p-full",
					"h-5 px-p-2 gap-p-1",
					"text-p-xs font-p-medium",
				],
			},
		},
		defaultVariants: {
			variant: "default",
		},
	}
)

function Badge({
	className,
	variant = "default",
	render,
	...props
}: useRender.ComponentProps<"span"> & VariantProps<typeof badgeVariants>) {
	return useRender({
		defaultTagName: "span",
		props: mergeProps<"span">(
			{
				className: cn(badgeVariants({ className, variant })),
			},
			props
		),
		render,
		state: {
			slot: "badge",
			variant,
		},
	})
}

export { Badge, badgeVariants }
