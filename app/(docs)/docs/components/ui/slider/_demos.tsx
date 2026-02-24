"use client"

import * as React from "react"
import { Slider } from "@/components/ui/slider"

export function ControlledSliderDemo() {
	const [value, setValue] = React.useState(50)

	return (
		<div className="max-w-sm space-y-3">
			<Slider
				value={value}
				onValueChange={(v) => setValue(v as number)}
			/>
			<p className="text-xs text-fg-muted">
				Value: {value}
			</p>
		</div>
	)
}
