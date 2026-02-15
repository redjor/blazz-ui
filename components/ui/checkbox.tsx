"use client"

import { Checkbox as CheckboxPrimitive } from "@base-ui/react/checkbox"
import { CheckIcon } from "lucide-react"
import { cn } from "@/lib/utils"

function Checkbox({ className, ...props }: CheckboxPrimitive.Root.Props) {
	return (
		<CheckboxPrimitive.Root
			data-slot="checkbox"
			className={cn(
				"border-edge data-checked:bg-brand data-checked:text-brand-fg data-checked:border-brand",
				"aria-invalid:border-negative aria-invalid:ring-negative/20",
				"focus-visible:border-brand focus-visible:ring-brand/20",
				"flex size-4 items-center justify-center rounded-[4px] border transition-colors",
				"group-has-disabled/field:opacity-50 focus-visible:ring-[3px] aria-invalid:ring-[3px]",
				"peer relative shrink-0 outline-none",
				"after:absolute after:-inset-x-3 after:-inset-y-2",
				"disabled:cursor-not-allowed disabled:opacity-50",
				className
			)}
			{...props}
		>
			<CheckboxPrimitive.Indicator
				data-slot="checkbox-indicator"
				className="[&>svg]:size-3.5 grid place-content-center text-current transition-none"
			>
				<CheckIcon />
			</CheckboxPrimitive.Indicator>
		</CheckboxPrimitive.Root>
	)
}

export { Checkbox }
