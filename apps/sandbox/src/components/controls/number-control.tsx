"use client"

import { Input } from "@blazz/ui/components/ui/input"
import { Slider } from "@blazz/ui/components/ui/slider"
import type { PropDescriptor } from "~/lib/registry"

interface NumberControlProps {
	name: string
	value: unknown
	onChange: (value: unknown) => void
	descriptor: PropDescriptor
}

export function NumberControl({
	name,
	value,
	onChange,
	descriptor,
}: NumberControlProps) {
	const numValue = Number(value ?? 0)
	const min = descriptor.options?.[0] != null ? Number(descriptor.options[0]) : 0
	const max = descriptor.options?.[1] != null ? Number(descriptor.options[1]) : 100

	return (
		<div className="flex flex-col gap-1.5">
			<div className="flex justify-between items-center gap-2">
				<label className="min-w-[100px] text-xs text-fg-muted" title={descriptor.description}>
					{name}
				</label>
				<Input
					type="number"
					className="h-7 text-xs w-16 text-right"
					value={numValue}
					onChange={(e) => {
						const parsed = Number.parseFloat(e.target.value)
						if (!Number.isNaN(parsed)) onChange(parsed)
					}}
				/>
			</div>
			<Slider
				value={numValue}
				onValueChange={(v) => {
					const val = Array.isArray(v) ? v[0] : v
					onChange(val)
				}}
				min={min}
				max={max}
				step={1}
			/>
		</div>
	)
}
