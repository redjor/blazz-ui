"use client"

import { Textarea } from "@blazz/ui/components/ui/textarea"
import { useState } from "react"
import type { PropDescriptor } from "~/lib/registry"

interface JsonControlProps {
	name: string
	value: unknown
	onChange: (value: unknown) => void
	descriptor: PropDescriptor
}

export function JsonControl({ name, value, onChange, descriptor }: JsonControlProps) {
	const [raw, setRaw] = useState(() => JSON.stringify(value, null, 2))
	const [isValid, setIsValid] = useState(true)

	function handleChange(text: string) {
		setRaw(text)
		try {
			const parsed = JSON.parse(text)
			setIsValid(true)
			onChange(parsed)
		} catch {
			setIsValid(false)
		}
	}

	return (
		<div className="flex flex-col gap-1.5">
			<label className="min-w-[100px] text-xs text-fg-muted" title={descriptor.description}>
				{name}
			</label>
			<Textarea className={`text-xs font-mono min-h-[60px] resize-y ${!isValid ? "border-negative ring-negative/20 ring-2" : ""}`} value={raw} onChange={(e) => handleChange(e.target.value)} />
		</div>
	)
}
