"use client"

import * as React from "react"
import { TimePicker } from "@blazz/ui/components/ui/time-picker"

export function ControlledTimePickerDemo() {
	const [time, setTime] = React.useState("09:00")

	return (
		<div className="space-y-3">
			<TimePicker
				value={time}
				onValueChange={setTime}
				className="max-w-[180px]"
			/>
			<p className="text-xs text-fg-muted">
				Selected: {time || "none"}
			</p>
		</div>
	)
}
