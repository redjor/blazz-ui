"use client"

import * as React from "react"
import { Rating } from "@blazz/ui/components/ui/rating"

export function ControlledRatingDemo() {
	const [value, setValue] = React.useState(3)

	return (
		<div className="space-y-3">
			<Rating value={value} onValueChange={setValue} />
			<p className="text-xs text-fg-muted">
				Rating: {value} / 5
			</p>
		</div>
	)
}
