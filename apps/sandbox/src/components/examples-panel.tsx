"use client"

import type { ComponentExample } from "~/lib/registry"

interface ExamplesPanelProps {
	examples: ComponentExample[]
	onSelect: (code: string) => void
}

export function ExamplesPanel({ examples, onSelect }: ExamplesPanelProps) {
	if (examples.length === 0) {
		return (
			<div className="flex items-center justify-center h-full">
				<p className="text-sm text-fg-muted">No examples available.</p>
			</div>
		)
	}

	return (
		<div className="p-3 space-y-2 overflow-y-auto h-full">
			{examples.map((example) => {
				const previewLines = example.code.split("\n").slice(0, 3).join("\n")

				return (
					<button
						key={example.name}
						type="button"
						onClick={() => onSelect(example.code)}
						className="w-full text-left border border-edge rounded-md p-3 hover:border-brand/50 hover:bg-muted cursor-pointer transition-colors"
					>
						<p className="text-sm font-medium">{example.name}</p>
						<pre className="mt-1 text-xs text-fg-muted font-mono overflow-hidden max-h-[3.6em] leading-[1.2em]">{previewLines}</pre>
					</button>
				)
			})}
		</div>
	)
}
