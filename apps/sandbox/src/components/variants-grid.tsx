"use client"

import { useMemo } from "react"
import { runCode } from "~/lib/code-runner"
import type { ComponentEntry } from "~/lib/registry"

interface VariantsGridProps {
	entry: ComponentEntry
	extraScope?: Record<string, unknown>
}

function generateVariantCode(entry: ComponentEntry, propName: string, value: string): string {
	const regex = new RegExp(`${propName}="[^"]*"`)
	if (regex.test(entry.defaultCode)) {
		return entry.defaultCode.replace(regex, `${propName}="${value}"`)
	}
	// If prop not in defaultCode, add it after the component name
	const componentName = entry.name
	return entry.defaultCode.replace(`<${componentName}`, `<${componentName} ${propName}="${value}"`)
}

export function VariantsGrid({ entry, extraScope }: VariantsGridProps) {
	// Find the first union-type prop
	const unionProp = useMemo(() => entry.props.find((p) => p.type === "union" && p.options?.length), [entry.props])

	const variants = useMemo(() => {
		if (!unionProp?.options) return []
		return unionProp.options.map((option) => {
			const code = generateVariantCode(entry, unionProp.name, option)
			const result = runCode(code, extraScope)
			return { option, ...result }
		})
	}, [entry, unionProp, extraScope])

	if (!unionProp) {
		return <div className="flex items-center justify-center h-full text-sm text-fg-muted">No variant props available</div>
	}

	return (
		<div className="h-full overflow-auto">
			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
				{variants.map(({ option, element, error }) => (
					<div key={option}>
						<div className="text-xs text-fg-muted font-mono mb-2">{option}</div>
						<div className="p-4 border border-edge rounded-md bg-card flex items-center justify-center min-h-[80px]">{error ? <span className="text-xs text-negative">{error}</span> : element}</div>
					</div>
				))}
			</div>
		</div>
	)
}
