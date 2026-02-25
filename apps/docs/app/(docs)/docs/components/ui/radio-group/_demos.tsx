"use client"

import * as React from "react"
import { RadioGroup } from "@blazz/ui/components/ui/radio-group"

export function ControlledRadioGroupDemo() {
	const [value, setValue] = React.useState("email")

	return (
		<div className="space-y-3">
			<RadioGroup
				label="Contact method"
				options={[
					{ value: "email", label: "Email" },
					{ value: "sms", label: "SMS" },
					{ value: "push", label: "Push" },
				]}
				value={value}
				onValueChange={setValue}
			/>
			<p className="text-xs text-fg-muted">
				Selected: {value}
			</p>
		</div>
	)
}
