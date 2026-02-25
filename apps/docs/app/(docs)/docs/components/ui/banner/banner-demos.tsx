"use client"

import * as React from "react"
import { Banner } from "@blazz/ui/components/ui/banner"
import { Button } from "@blazz/ui/components/ui/button"

export function InfoBannerDemo() {
	const [show, setShow] = React.useState(true)

	return show ? (
		<Banner
			tone="info"
			title="Update Available"
			onDismiss={() => setShow(false)}
		>
			A new version of the app is available. Update to get the latest features.
		</Banner>
	) : (
		<Button variant="outline" onClick={() => setShow(true)}>
			Show Info Banner
		</Button>
	)
}

export function SuccessBannerDemo() {
	const [show, setShow] = React.useState(true)

	return show ? (
		<Banner
			tone="success"
			title="Changes Saved"
			onDismiss={() => setShow(false)}
		>
			Your settings have been saved successfully.
		</Banner>
	) : (
		<Button variant="outline" onClick={() => setShow(true)}>
			Show Success Banner
		</Button>
	)
}

export function WarningBannerDemo() {
	const [show, setShow] = React.useState(true)

	return show ? (
		<Banner
			tone="warning"
			title="Limited Functionality"
			onDismiss={() => setShow(false)}
		>
			Some features are temporarily unavailable due to maintenance.
		</Banner>
	) : (
		<Button variant="outline" onClick={() => setShow(true)}>
			Show Warning Banner
		</Button>
	)
}

export function CriticalBannerDemo() {
	const [show, setShow] = React.useState(true)

	return show ? (
		<Banner
			tone="critical"
			title="Payment Failed"
			onDismiss={() => setShow(false)}
		>
			Your payment could not be processed. Please update your payment method.
		</Banner>
	) : (
		<Button variant="outline" onClick={() => setShow(true)}>
			Show Critical Banner
		</Button>
	)
}

export function WithActionsBannerDemo() {
	return (
		<Banner
			tone="info"
			title="New Features Available"
			action={{
				content: "Learn More",
				url: "/features",
			}}
			secondaryAction={{
				content: "Dismiss",
				onAction: () => console.log("Dismissed"),
			}}
		>
			Check out the latest features added to your dashboard.
		</Banner>
	)
}

export function AsyncActionBannerDemo() {
	const [loading, setLoading] = React.useState(false)

	const handleAsyncAction = async () => {
		setLoading(true)
		await new Promise(resolve => setTimeout(resolve, 2000))
		setLoading(false)
	}

	return (
		<Banner
			tone="warning"
			title="Confirm Action"
			action={{
				content: "Confirm",
				onAction: handleAsyncAction,
				loading: loading,
			}}
		>
			This action requires confirmation. Click confirm to proceed.
		</Banner>
	)
}
