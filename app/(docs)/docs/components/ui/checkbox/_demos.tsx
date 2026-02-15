"use client"

import * as React from "react"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export function ControlledCheckboxDemo() {
	const [checked, setChecked] = React.useState(false)

	return (
		<div className="flex items-center gap-2">
			<Checkbox id="controlled" checked={checked} onCheckedChange={setChecked} />
			<Label htmlFor="controlled">{checked ? "Checked" : "Unchecked"}</Label>
		</div>
	)
}
