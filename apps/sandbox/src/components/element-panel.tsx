"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@blazz/ui/components/ui/input"
import { Button } from "@blazz/ui/components/ui/button"
import { X } from "lucide-react"
import type { InspectedElement } from "./element-inspector"

// ── Slot name → component display name ──────────

function slotToComponentName(slot: string): string {
	return slot
		.split("-")
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join("")
}

// ── Element Panel ───────────────────────────────

interface ElementPanelProps {
	element: InspectedElement
	code: string
	onCodeChange: (code: string) => void
	onDeselect: () => void
}

export function ElementPanel({
	element,
	code,
	onCodeChange,
	onDeselect,
}: ElementPanelProps) {
	const componentName = slotToComponentName(element.slot)
	const [textValue, setTextValue] = useState(element.textContent)

	// Sync when selection changes
	useEffect(() => {
		setTextValue(element.textContent)
	}, [element])

	const handleTextChange = useCallback(
		(newText: string) => {
			setTextValue(newText)

			// Try to find and replace the text content in the code
			if (element.textContent && newText) {
				const updatedCode = code.replace(element.textContent, newText)
				if (updatedCode !== code) {
					onCodeChange(updatedCode)
				}
			}
		},
		[code, element.textContent, onCodeChange],
	)

	return (
		<div className="p-3 space-y-3 overflow-y-auto h-full">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-xs font-mono bg-brand/10 text-brand px-1.5 py-0.5 rounded">
						{element.slot}
					</span>
					<span className="text-sm font-medium">{componentName}</span>
				</div>
				<Button
					variant="ghost"
					size="icon-xs"
					onClick={onDeselect}
					aria-label="Deselect"
				>
					<X className="size-3" />
				</Button>
			</div>

			{/* Text content editor */}
			{element.textContent && (
				<div className="space-y-1">
					<label className="text-xs text-fg-muted">Text content</label>
					<Input
						value={textValue}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							handleTextChange(e.target.value)
						}
					/>
				</div>
			)}

			{/* Element info */}
			<div className="space-y-1.5">
				<p className="text-xs text-fg-muted font-medium">Element info</p>
				<div className="text-xs space-y-1 text-fg-muted">
					<div className="flex justify-between">
						<span>Tag</span>
						<span className="font-mono">
							{element.element.tagName.toLowerCase()}
						</span>
					</div>
					<div className="flex justify-between">
						<span>Size</span>
						<span className="font-mono">
							{Math.round(element.rect.width)} x{" "}
							{Math.round(element.rect.height)}
						</span>
					</div>
					{element.element.className && (
						<div>
							<span>Classes</span>
							<div className="mt-1 flex flex-wrap gap-1">
								{element.element.className
									.split(" ")
									.filter(Boolean)
									.slice(0, 10)
									.map((cls) => (
										<span
											key={cls}
											className="bg-surface-3 px-1 py-0.5 rounded text-[10px] font-mono"
										>
											{cls}
										</span>
									))}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}
