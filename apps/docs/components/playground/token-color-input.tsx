"use client"

import { useCallback, useRef, useState } from "react"
import type { OklchColor } from "@/components/docs/theme-editor/theme-presets"
import { oklchToString } from "@/components/docs/theme-editor/theme-presets"
import { hexToOklch, oklchToHex, parseOklchString } from "./color-utils"

// ---------------------------------------------------------------------------
// TokenColorInput — Swatch + editable oklch text input, kept in sync.
// Used by PlaygroundSidebar to edit individual color tokens.
// ---------------------------------------------------------------------------

interface TokenColorInputProps {
	label: string // token name like "bg-app"
	color: OklchColor // current color value
	onChange: (color: OklchColor) => void // called when user changes color
}

export function TokenColorInput({ label, color, onChange }: TokenColorInputProps) {
	// Hidden <input type="color"> ref
	const inputRef = useRef<HTMLInputElement>(null)
	// Local text state for when user is typing
	const [textValue, setTextValue] = useState(() => oklchToString(color))
	const [isFocused, setIsFocused] = useState(false)

	// Show local text when focused (user typing), canonical form otherwise
	const displayText = isFocused ? textValue : oklchToString(color)

	// When native color picker changes: convert hex->oklch, preserve alpha if original had one
	const handlePickerChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const newColor = hexToOklch(e.target.value)
			if (color.a !== undefined) newColor.a = color.a
			onChange(newColor)
			setTextValue(oklchToString(newColor))
		},
		[color.a, onChange],
	)

	// When text input changes: parse oklch string, update if valid
	const handleTextChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const raw = e.target.value
			setTextValue(raw)
			const parsed = parseOklchString(raw)
			if (parsed) onChange(parsed)
		},
		[onChange],
	)

	// On blur: reset to canonical form
	const handleTextBlur = useCallback(() => {
		setIsFocused(false)
		setTextValue(oklchToString(color))
	}, [color])

	return (
		<div className="flex items-center gap-2 group">
			{/* Color swatch — click opens native picker */}
			<button
				type="button"
				className="size-6 shrink-0 rounded border border-edge cursor-pointer hover:ring-2 hover:ring-brand/30 transition-shadow"
				style={{ backgroundColor: oklchToString(color) }}
				onClick={() => inputRef.current?.click()}
				aria-label={`Pick color for ${label}`}
			/>
			{/* Hidden native color picker */}
			<input
				ref={inputRef}
				type="color"
				value={oklchToHex(color)}
				onChange={handlePickerChange}
				className="sr-only"
				tabIndex={-1}
			/>
			{/* Token name */}
			<span className="w-24 shrink-0 truncate text-xs font-mono text-fg-muted">
				{label}
			</span>
			{/* Editable oklch value */}
			<input
				type="text"
				value={displayText}
				onChange={handleTextChange}
				onFocus={() => {
					setIsFocused(true)
					setTextValue(oklchToString(color))
				}}
				onBlur={handleTextBlur}
				className="flex-1 min-w-0 rounded border border-edge-subtle bg-transparent px-1.5 py-0.5 text-2xs font-mono text-fg-subtle focus:border-brand focus:text-fg focus:outline-none transition-colors"
				spellCheck={false}
			/>
		</div>
	)
}
