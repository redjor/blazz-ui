"use client"

import * as React from "react"
import { ColorPicker } from "@/components/ui/color-picker"

export function ControlledColorPickerDemo() {
	const [color, setColor] = React.useState("#3b82f6")

	return (
		<div className="space-y-3">
			<ColorPicker value={color} onValueChange={setColor} />
			<p className="text-xs text-fg-muted">
				Selected: {color || "none"}
			</p>
		</div>
	)
}
