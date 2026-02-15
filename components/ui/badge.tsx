import { mergeProps } from "@base-ui/react/merge-props"
import { useRender } from "@base-ui/react/use-render"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap shrink-0 border-0 transition-colors overflow-hidden [&>svg]:pointer-events-none [&>svg]:size-3! group/badge rounded-full h-5 px-2 gap-1 text-xs font-medium",
	{
		variants: {
			variant: {
				default: "bg-brand text-brand-fg",
				info: "bg-inform/15 text-inform border border-inform/30",
				success: "bg-positive/15 text-positive border border-positive/30",
				warning: "bg-caution/15 text-caution border border-caution/30",
				critical: "bg-negative/15 text-negative border border-negative/30",
				outline: "border border-edge text-fg",
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
