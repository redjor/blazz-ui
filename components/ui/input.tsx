import { Input as InputPrimitive } from "@base-ui/react/input"
import type * as React from "react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
	return (
		<InputPrimitive
			type={type}
			data-slot="input"
			className={cn(
				// Base styles
				"w-full min-w-0 outline-none",
				// Input surface
				"bg-p-input-bg-surface",
				"hover:bg-p-input-bg-surface-hover",
				// Borders
				"border border-p-input-border",
				"hover:border-p-input-border-hover",
				"focus:border-p-border-focus",
				// Inset shadow on focus
				"focus:shadow-p-inset",
				// Focus ring
				"focus:ring-[3px] focus:ring-p-border-focus/20",
				// Sizing and spacing
				"h-8 rounded-p-lg px-p-2.5 py-p-1",
				// Typography
				"text-p-base text-p-text",
				"placeholder:text-p-text-secondary",
				// Transitions
				"transition-all duration-p-150 ease-p-ease",
				// Disabled state
				"disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
				// Invalid state
				"aria-invalid:border-p-critical-border aria-invalid:ring-[3px] aria-invalid:ring-p-critical-fill/20",
				// File input styling
				"file:inline-flex file:border-0 file:bg-transparent file:h-6 file:text-p-sm file:font-p-medium file:text-p-text",
				className
			)}
			{...props}
		/>
	)
}

export { Input }
