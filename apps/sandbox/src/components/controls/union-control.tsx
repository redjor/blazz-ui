"use client"

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"
import type { PropDescriptor } from "~/lib/registry"

interface UnionControlProps {
	name: string
	value: unknown
	onChange: (value: unknown) => void
	descriptor: PropDescriptor
}

export function UnionControl({ name, value, onChange, descriptor }: UnionControlProps) {
	const items = descriptor.options?.map((o) => ({ value: o, label: o })) ?? []

	return (
		<div className="flex justify-between items-center gap-2">
			<label className="min-w-[100px] text-xs text-fg-muted" title={descriptor.description}>
				{name}
			</label>
			<Select value={String(value ?? "")} onValueChange={(v) => onChange(v)} items={items}>
				<SelectTrigger size="sm" className="h-7 text-xs min-w-[120px]">
					<SelectValue placeholder="Select..." />
				</SelectTrigger>
				<SelectContent>
					{items.map((item) => (
						<SelectItem key={item.value} value={item.value}>
							{item.label}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
		</div>
	)
}
