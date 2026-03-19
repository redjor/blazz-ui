"use client"

import { Input } from "@blazz/ui/components/ui/input"
import type { PropDescriptor } from "~/lib/registry"

interface StringControlProps {
	name: string
	value: unknown
	onChange: (value: unknown) => void
	descriptor: PropDescriptor
}

export function StringControl({ name, value, onChange, descriptor }: StringControlProps) {
	return (
		<div className="flex justify-between items-center gap-2">
			<label className="min-w-[100px] text-xs text-fg-muted" title={descriptor.description}>
				{name}
			</label>
			<Input
				className="h-7 text-xs flex-1 max-w-[180px]"
				value={String(value ?? "")}
				onChange={(e) => onChange(e.target.value)}
			/>
		</div>
	)
}
