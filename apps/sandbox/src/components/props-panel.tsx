"use client"

import { RotateCcw } from "lucide-react"
import { Button } from "@blazz/ui/components/ui/button"
import type { PropDescriptor, PropGroup } from "~/lib/registry"
import { ControlRenderer } from "~/components/controls"

interface PropsPanelProps {
	props: PropDescriptor[]
	values: Record<string, unknown>
	onChange: (name: string, value: unknown) => void
	onReset: () => void
}

const GROUP_ORDER: PropGroup[] = ["main", "style", "slots", "callbacks"]

const GROUP_LABELS: Record<PropGroup, string> = {
	main: "MAIN",
	style: "STYLE",
	slots: "SLOTS",
	callbacks: "CALLBACKS",
}

export function PropsPanel({ props, values, onChange, onReset }: PropsPanelProps) {
	// Group props by descriptor.group
	const grouped = props.reduce<Record<PropGroup, PropDescriptor[]>>(
		(acc, prop) => {
			const group = prop.group ?? "main"
			if (!acc[group]) acc[group] = []
			acc[group].push(prop)
			return acc
		},
		{ main: [], style: [], slots: [], callbacks: [] },
	)

	return (
		<div className="overflow-y-auto max-h-full p-3 space-y-4">
			{/* Header with reset button */}
			<div className="flex items-center justify-between">
				<span className="text-xs font-medium text-fg-muted">Controls</span>
				<Button variant="ghost" size="xs" onClick={onReset} title="Reset to defaults">
					<RotateCcw className="size-3" />
				</Button>
			</div>

			{/* Grouped controls */}
			{GROUP_ORDER.map((group) => {
				const groupProps = grouped[group]
				if (!groupProps || groupProps.length === 0) return null

				return (
					<div key={group} className="space-y-2">
						<h3 className="text-xs text-fg-muted font-medium tracking-wider uppercase">
							{GROUP_LABELS[group]}
						</h3>
						{groupProps.map((descriptor) => (
							<ControlRenderer
								key={descriptor.name}
								descriptor={descriptor}
								value={values[descriptor.name]}
								onChange={(v) => onChange(descriptor.name, v)}
							/>
						))}
					</div>
				)
			})}

			{/* Empty state */}
			{props.length === 0 && (
				<p className="text-xs text-fg-muted text-center py-4">
					No configurable props
				</p>
			)}
		</div>
	)
}
