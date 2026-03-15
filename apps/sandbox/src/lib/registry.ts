import { registry } from "./registry-data"

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type PropType =
	| "boolean"
	| "string"
	| "number"
	| "union"
	| "enum"
	| "slot"
	| "function"
	| "object"
	| "array"

export type PropGroup = "main" | "style" | "slots" | "callbacks"

export interface PropDescriptor {
	name: string
	type: PropType
	options?: string[]
	default?: unknown
	group: PropGroup
	description?: string
}

export interface ComponentExample {
	name: string
	code: string
}

export interface ComponentEntry {
	name: string
	slug: string
	category: "ui" | "patterns" | "blocks" | "ai"
	importPath: string
	props: PropDescriptor[]
	defaultCode: string
	examples?: ComponentExample[]
}

export type Registry = ComponentEntry[]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function getComponent(slug: string): ComponentEntry | undefined {
	return registry.find((c) => c.slug === slug)
}

export function getComponentsByCategory(
	category: ComponentEntry["category"],
): ComponentEntry[] {
	return registry.filter((c) => c.category === category)
}

export function searchComponents(query: string): ComponentEntry[] {
	const q = query.toLowerCase()
	return registry.filter(
		(c) =>
			c.name.toLowerCase().includes(q) ||
			c.slug.toLowerCase().includes(q) ||
			c.category.toLowerCase().includes(q),
	)
}

export { registry }
