"use client"

import * as React from "react"
import { Checkbox, CheckboxGroup } from "@blazz/ui/components/ui/checkbox"
import { Label } from "@blazz/ui/components/ui/label"

export function ControlledCheckboxDemo() {
	const [checked, setChecked] = React.useState(false)

	return (
		<div className="flex items-center gap-2">
			<Checkbox id="controlled" checked={checked} onCheckedChange={setChecked} />
			<Label htmlFor="controlled">{checked ? "Checked" : "Unchecked"}</Label>
		</div>
	)
}

export function ControlledCheckboxGroupDemo() {
	const [value, setValue] = React.useState(["email"])

	return (
		<div className="space-y-3">
			<CheckboxGroup
				label="Notifications"
				description="Choose how you want to be notified."
				options={[
					{ value: "email", label: "Email", description: "Get notified by email" },
					{ value: "sms", label: "SMS", description: "Get notified by text message" },
					{ value: "push", label: "Push", description: "Get notified on your device" },
				]}
				value={value}
				onValueChange={setValue}
			/>
			<p className="text-xs text-fg-muted">
				Selected: {value.length > 0 ? value.join(", ") : "none"}
			</p>
		</div>
	)
}
