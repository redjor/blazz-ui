"use client"

import * as React from "react"
import { CalloutCard } from "@/components/ui/callout-card"

export function CalloutCardDismissDemo() {
	const [dismissed, setDismissed] = React.useState(false)

	if (dismissed) {
		return (
			<div className="rounded-lg border border-dashed p-8 text-center text-sm text-fg-muted">
				<p>Callout card was dismissed.</p>
				<button
					type="button"
					className="mt-2 text-primary underline"
					onClick={() => setDismissed(false)}
				>
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

export function CalloutCardDefaultDemo() {
	return (
		<CalloutCard
			title="Customize the style of your checkout"
			primaryAction={{
				content: "Customize checkout",
				onAction: () => alert("Customize checkout clicked"),
			}}
		>
			Upload your store's logo, change colors and fonts, and more.
		</CalloutCard>
	)
}

export function CalloutCardSecondaryActionDemo() {
	return (
		<CalloutCard
			title="Set up two-step authentication"
			primaryAction={{
				content: "Enable",
				onAction: () => alert("Enable clicked"),
			}}
			secondaryAction={{
				content: "Learn more",
				variant: "ghost",
				onAction: () => alert("Learn more clicked"),
			}}
		>
			Add an extra layer of security to your account by requiring a code in addition
			to your password.
		</CalloutCard>
	)
}

export function CalloutCardIllustrationDemo() {
	return (
		<CalloutCard
			title="Start selling on Facebook and Instagram"
			illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94514f5cc91768e42bb4e3c3cc3766b54290.svg"
			primaryAction={{
				content: "Connect accounts",
				onAction: () => alert("Connect clicked"),
			}}
			secondaryAction={{
				content: "Learn more",
				variant: "link",
				onAction: () => alert("Learn more clicked"),
			}}
		>
			Reach millions of shoppers and grow your business by selling on social media.
		</CalloutCard>
	)
}
