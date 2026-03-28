"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@blazz/ui/components/ui/collapsible"
import * as React from "react"

export function ControlledCollapsibleDemo() {
	const [open, setOpen] = React.useState(false)
	return (
		<Collapsible open={open} onOpenChange={setOpen}>
			<CollapsibleTrigger render={<Button variant="outline" size="sm" />}>{open ? "Hide" : "Show"} details</CollapsibleTrigger>
			<CollapsibleContent className="mt-2">
				<div className="rounded-md border border-edge px-4 py-3 text-sm text-fg-muted">These are the details that can be toggled on and off.</div>
			</CollapsibleContent>
		</Collapsible>
	)
}
