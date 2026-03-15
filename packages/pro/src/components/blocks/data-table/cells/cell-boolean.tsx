"use client"

import { Check, X } from "lucide-react"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Checkbox } from "@blazz/ui/components/ui/checkbox"

export interface CellBooleanProps {
	/** The boolean value to render */
	value: boolean
	/** Display style */
	variant?: "checkbox" | "badge" | "icon"
	/** Custom labels for true/false states */
	labels?: { true: string; false: string }
}

/**
 * Renders a boolean value as a checkbox, badge, or icon.
 */
export function CellBoolean({ value, variant = "icon", labels }: CellBooleanProps) {
	const trueLabel = labels?.true ?? "Yes"
	const falseLabel = labels?.false ?? "No"

	switch (variant) {
		case "checkbox":
			return <Checkbox checked={value} disabled />

		case "badge":
			return (
				<Badge variant={value ? "success" : "secondary"} size="xs">
					{value ? trueLabel : falseLabel}
				</Badge>
			)
		default:
			return value ? (
				<Check className="size-4 text-green-500" />
			) : (
				<X className="size-4 text-fg-muted/50" />
			)
	}
}
