"use client"

import * as React from "react"
import { CurrencyInput } from "@/components/ui/currency-input"

export function ControlledCurrencyInputDemo() {
	const [value, setValue] = React.useState<number | null>(99.99)

	return (
		<div className="space-y-3">
			<CurrencyInput
				value={value}
				onValueChange={setValue}
				currency="EUR"
				className="max-w-xs"
			/>
			<p className="text-xs text-fg-muted">
				Value: {value !== null ? value : "null"}
			</p>
		</div>
	)
}
