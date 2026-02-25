"use client"

import * as React from "react"
import { OtpInput } from "@blazz/ui/components/ui/otp-input"

export function ControlledOtpInputDemo() {
	const [otp, setOtp] = React.useState("")

	return (
		<div className="space-y-3">
			<OtpInput
				length={6}
				value={otp}
				onValueChange={setOtp}
				onComplete={(code) => console.log("Complete:", code)}
			/>
			<p className="text-xs text-fg-muted">
				Value: {otp || "(empty)"}
			</p>
		</div>
	)
}
