"use client"

import * as React from "react"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

export function ControlledSwitchDemo() {
	const [enabled, setEnabled] = React.useState(false)

	return (
		<div className="flex items-center gap-2">
			<Switch id="controlled" checked={enabled} onCheckedChange={setEnabled} />
			<Label htmlFor="controlled">{enabled ? "Enabled" : "Disabled"}</Label>
		</div>
	)
}
