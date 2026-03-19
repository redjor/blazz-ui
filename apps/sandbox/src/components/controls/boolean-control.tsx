"use client"

import { Switch } from "@blazz/ui/components/ui/switch"
import type { PropDescriptor } from "~/lib/registry"

interface BooleanControlProps {
	name: string
	value: unknown
	onChange: (value: unknown) => void
	descriptor: PropDescriptor
}

export function BooleanControl({ name, value, onChange, descriptor }: BooleanControlProps) {
	return (
		<div className="flex justify-between items-center gap-2">
			<label className="min-w-[100px] text-xs text-fg-muted" title={descriptor.description}>
				{name}
			</label>
			<Switch size="sm" checked={Boolean(value)} onCheckedChange={(checked) => onChange(checked)} />
		</div>
	)
}
