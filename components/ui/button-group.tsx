import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode
}

export function ButtonGroup({ className, children, ...props }: ButtonGroupProps) {
	return (
		<div
			data-slot="button-group"
			className={cn("inline-flex -space-x-px rounded-lg shadow-sm", className)}
			{...props}
		>
			{children}
		</div>
	)
}
