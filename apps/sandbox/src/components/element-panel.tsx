"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { Input } from "@blazz/ui/components/ui/input"
import { Plus, RotateCcw, X } from "lucide-react"
import { useCallback, useEffect, useRef, useState } from "react"
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

export function ElementPanel({ element, code, onCodeChange, onDeselect }: ElementPanelProps) {
	const componentName = slotToComponentName(element.slot)
	const [textValue, setTextValue] = useState(element.textContent)
	const [classInput, setClassInput] = useState("")
	const originalClassesRef = useRef<string>("")

	// Sync when selection changes
	useEffect(() => {
		setTextValue(element.textContent)
		originalClassesRef.current = element.element.className
	}, [element])

	const handleTextChange = useCallback(
		(newText: string) => {
			setTextValue(newText)
			if (element.textContent && newText) {
				const updatedCode = code.replace(element.textContent, newText)
				if (updatedCode !== code) {
					onCodeChange(updatedCode)
				}
			}
		},
		[code, element.textContent, onCodeChange]
	)

	// ── Class manipulation (live on the DOM element) ──

	const addClass = useCallback(
		(cls: string) => {
			const trimmed = cls.trim()
			if (!trimmed) return
			// Add multiple space-separated classes
			const classes = trimmed.split(/\s+/)
			for (const c of classes) {
				element.element.classList.add(c)
			}
			setClassInput("")
		},
		[element.element]
	)

	const removeClass = useCallback(
		(cls: string) => {
			element.element.classList.remove(cls)
			// Force re-render by updating a dummy state
			setClassInput((prev) => prev)
		},
		[element.element]
	)

	const resetClasses = useCallback(() => {
		element.element.className = originalClassesRef.current
		setClassInput("")
	}, [element.element])

	// Current classes (read from live DOM)
	const currentClasses = element.element.className.split(" ").filter(Boolean)

	// Detect added/removed vs original
	const originalSet = new Set(originalClassesRef.current.split(" ").filter(Boolean))

	return (
		<div className="p-3 space-y-3 overflow-y-auto h-full">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<span className="text-xs font-mono bg-brand/10 text-brand px-1.5 py-0.5 rounded">{element.slot}</span>
					<span className="text-sm font-medium">{componentName}</span>
				</div>
				<Button variant="ghost" size="icon-xs" onClick={onDeselect} aria-label="Deselect">
					<X className="size-3" />
				</Button>
			</div>

			{/* Text content editor */}
			{element.textContent && (
				<div className="space-y-1">
					<label className="text-xs text-fg-muted">Text content</label>
					<Input value={textValue} onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleTextChange(e.target.value)} />
				</div>
			)}

			{/* Classes editor */}
			<div className="space-y-1.5">
				<div className="flex items-center justify-between">
					<label className="text-xs text-fg-muted font-medium">Classes</label>
					<Button variant="ghost" size="icon-xs" onClick={resetClasses} aria-label="Reset classes">
						<RotateCcw className="size-2.5" />
					</Button>
				</div>

				{/* Add class input */}
				<div className="flex gap-1">
					<Input
						value={classInput}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) => setClassInput(e.target.value)}
						onKeyDown={(e: React.KeyboardEvent) => {
							if (e.key === "Enter") {
								e.preventDefault()
								addClass(classInput)
							}
						}}
						placeholder="Add class (e.g. bg-red-500)"
						className="text-xs h-7"
					/>
					<Button variant="ghost" size="icon-xs" onClick={() => addClass(classInput)} disabled={!classInput.trim()}>
						<Plus className="size-3" />
					</Button>
				</div>

				{/* Class list */}
				<div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
					{currentClasses.map((cls, i) => {
						const isAdded = !originalSet.has(cls)
						return (
							<button
								key={`${cls}-${i}`}
								type="button"
								onClick={() => removeClass(cls)}
								className={`group flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors cursor-pointer ${
									isAdded ? "bg-brand/15 text-brand border border-brand/30" : "bg-muted text-fg-muted hover:bg-negative/10 hover:text-negative"
								}`}
								title={`Click to remove "${cls}"`}
							>
								{cls}
								<X className="size-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
							</button>
						)
					})}
				</div>
			</div>

			{/* Element info */}
			<div className="space-y-1.5">
				<p className="text-xs text-fg-muted font-medium">Element info</p>
				<div className="text-xs space-y-1 text-fg-muted">
					<div className="flex justify-between">
						<span>Tag</span>
						<span className="font-mono">{element.element.tagName.toLowerCase()}</span>
					</div>
					<div className="flex justify-between">
						<span>Size</span>
						<span className="font-mono">
							{Math.round(element.rect.width)} x {Math.round(element.rect.height)}
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}
