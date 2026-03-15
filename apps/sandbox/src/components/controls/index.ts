"use client"

import type { PropDescriptor } from "~/lib/registry"
import { BooleanControl } from "./boolean-control"
import { StringControl } from "./string-control"
import { NumberControl } from "./number-control"
import { UnionControl } from "./union-control"
import { JsonControl } from "./json-control"

export { BooleanControl } from "./boolean-control"
export { StringControl } from "./string-control"
export { NumberControl } from "./number-control"
export { UnionControl } from "./union-control"
export { JsonControl } from "./json-control"

interface ControlRendererProps {
	descriptor: PropDescriptor
	value: unknown
	onChange: (value: unknown) => void
}

export function ControlRenderer({
	descriptor,
	value,
	onChange,
}: ControlRendererProps) {
	const { name, type } = descriptor

	// Slot type — edited in Code tab
	if (type === "slot") {
		return (
			<div className="flex justify-between items-center gap-2">
				<span className="min-w-[100px] text-xs text-fg-muted">{name}</span>
				<span className="text-xs text-fg-muted italic">Edit in Code tab &rarr;</span>
			</div>
		)
	}

	// Function type — read-only indicator
	if (type === "function") {
		return (
			<div className="flex justify-between items-center gap-2">
				<span className="min-w-[100px] text-xs text-fg-muted">{name}</span>
				<span className="text-xs text-fg-muted italic">&rarr; logged to preview</span>
			</div>
		)
	}

	// Boolean
	if (type === "boolean") {
		return (
			<BooleanControl
				name={name}
				value={value}
				onChange={onChange}
				descriptor={descriptor}
			/>
		)
	}

	// String
	if (type === "string") {
		return (
			<StringControl
				name={name}
				value={value}
				onChange={onChange}
				descriptor={descriptor}
			/>
		)
	}

	// Number
	if (type === "number") {
		return (
			<NumberControl
				name={name}
				value={value}
				onChange={onChange}
				descriptor={descriptor}
			/>
		)
	}

	// Union or Enum — both use select
	if (type === "union" || type === "enum") {
		return (
			<UnionControl
				name={name}
				value={value}
				onChange={onChange}
				descriptor={descriptor}
			/>
		)
	}

	// Object or Array — JSON editor
	if (type === "object" || type === "array") {
		return (
			<JsonControl
				name={name}
				value={value}
				onChange={onChange}
				descriptor={descriptor}
			/>
		)
	}

	// Fallback: unknown type
	return (
		<div className="flex justify-between items-center gap-2">
			<span className="min-w-[100px] text-xs text-fg-muted">{name}</span>
			<span className="text-xs text-fg-muted italic">unsupported type: {type}</span>
		</div>
	)
}
