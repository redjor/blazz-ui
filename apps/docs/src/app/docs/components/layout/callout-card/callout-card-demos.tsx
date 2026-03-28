"use client"

import { CalloutCard } from "@blazz/ui/components/ui/callout-card"
import * as React from "react"

export function CalloutCardDismissDemo() {
	const [dismissed, setDismissed] = React.useState(false)

	if (dismissed) {
		return (
			<div className="rounded-lg border border-dashed p-8 text-center text-sm text-fg-muted">
				<p>Callout card was dismissed.</p>
				<button type="button" className="mt-2 text-primary underline" onClick={() => setDismissed(false)}>
					Show again
				</button>
			</div>
		)
	}

	return (
		<CalloutCard
			title="Try the new inventory management"
			primaryAction={{
				content: "Get started",
				onAction: () => alert("Get started clicked"),
			}}
			onDismiss={() => setDismissed(true)}
		>
			Track your inventory across multiple locations with our new tools.
		</CalloutCard>
	)
}
