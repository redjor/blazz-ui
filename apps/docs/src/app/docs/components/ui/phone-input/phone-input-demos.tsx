"use client"

import { PhoneInput } from "@blazz/ui/components/ui/phone-input"
import { useState } from "react"

export function HeroExample() {
	const [value, setValue] = useState("")
	return (
		<div className="w-full max-w-sm">
			<PhoneInput
				value={value}
				onChange={setValue}
				defaultCountry="FR"
				placeholder="06 12 34 56 78"
			/>
		</div>
	)
}

export function DefaultExample() {
	const [value, setValue] = useState("")
	return (
		<div className="space-y-2">
			<PhoneInput
				value={value}
				onChange={setValue}
				defaultCountry="FR"
				placeholder="06 12 34 56 78"
			/>
			<p className="text-xs text-fg-muted font-mono">Value: {value || "(empty)"}</p>
		</div>
	)
}

export function SizesExample() {
	const [v1, setV1] = useState("")
	const [v2, setV2] = useState("")
	const [v3, setV3] = useState("")
	return (
		<div className="space-y-3">
			<PhoneInput
				value={v1}
				onChange={setV1}
				variant="sm"
				defaultCountry="FR"
				placeholder="Small"
			/>
			<PhoneInput value={v2} onChange={setV2} defaultCountry="US" placeholder="Default" />
			<PhoneInput
				value={v3}
				onChange={setV3}
				variant="lg"
				defaultCountry="GB"
				placeholder="Large"
			/>
		</div>
	)
}

export function DisabledExample() {
	return <PhoneInput value="+33612345678" onChange={() => {}} defaultCountry="FR" disabled />
}
