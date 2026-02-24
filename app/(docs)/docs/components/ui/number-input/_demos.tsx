"use client"

import * as React from "react"
import { NumberInput } from "@/components/ui/number-input"

export function ControlledNumberInputDemo() {
	const [value, setValue] = React.useState<number | null>(10)

	return (
		<div className="space-y-3">
			<NumberInput
				value={value}
				onValueChange={setValue}
				min={0}
				max={100}
				className="max-w-[180px]"
			/>
			<p className="text-xs text-fg-muted">
				Value: {value ?? "empty"}
			</p>
		</div>
	)
}
