"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FormSectionProps {
	title: string
	description?: string
	defaultOpen?: boolean
	children: React.ReactNode
	className?: string
}

export function FormSection({
	title,
	description,
	defaultOpen = true,
	children,
	className,
}: FormSectionProps) {
	const [open, setOpen] = useState(defaultOpen)

	return (
		<div className={cn("rounded-lg border", className)}>
			<button
				type="button"
				className="flex w-full items-center justify-between px-4 py-3 text-left"
				onClick={() => setOpen(!open)}
			>
				<div>
					<h3 className="text-sm font-semibold text-foreground">{title}</h3>
					{description && (
						<p className="text-sm text-muted-foreground">{description}</p>
					)}
				</div>
				<ChevronDown
					className={cn(
						"size-4 text-muted-foreground transition-transform",
						open && "rotate-180"
					)}
				/>
			</button>
			{open && <div className="border-t px-4 py-4">{children}</div>}
		</div>
	)
}
