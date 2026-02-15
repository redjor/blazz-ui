import { Input as InputPrimitive } from "@base-ui/react/input"
import type * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<InputPrimitive
			type={type}
			data-slot="input"
			className={cn(
				"w-full min-w-0 outline-none",
				"bg-surface",
				"hover:bg-raised",
				"border border-edge",
				"hover:border-edge",
				"focus:border-brand",
				"focus:ring-[3px] focus:ring-brand/20",
				"h-8 rounded-md px-2.5 py-1",
				"text-sm text-fg",
				"placeholder:text-fg-subtle",
				"transition-colors duration-150 ease-out",
				"disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
				"aria-invalid:border-negative aria-invalid:ring-[3px] aria-invalid:ring-negative/20",
				"file:inline-flex file:border-0 file:bg-transparent file:h-6 file:text-xs file:font-medium file:text-fg",
				className
			)}
			{...props}
		/>
	)
}

export { Input }
