"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { useCallback, useEffect, useRef, useState } from "react"

interface TagInputProps {
	value: string[]
	onChange: (tags: string[]) => void
	suggestions?: string[]
	placeholder?: string
}

export function TagInput({
	value,
	onChange,
	suggestions = [],
	placeholder = "Ajouter un tag...",
}: TagInputProps) {
	const [input, setInput] = useState("")
	const [showSuggestions, setShowSuggestions] = useState(false)
	const [highlightedIndex, setHighlightedIndex] = useState(-1)
	const inputRef = useRef<HTMLInputElement>(null)
	const containerRef = useRef<HTMLDivElement>(null)
	const suggestionsRef = useRef<HTMLDivElement>(null)

	const filtered = suggestions
		.filter(
			(s) => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s.toLowerCase())
		)
		.slice(0, 8)

	const addTag = useCallback(
		(tag: string) => {
			const trimmed = tag.trim().toLowerCase()
			if (!trimmed || value.includes(trimmed)) return
			onChange([...value, trimmed])
			setInput("")
			setShowSuggestions(false)
			setHighlightedIndex(-1)
		},
		[value, onChange]
	)

	function removeTag(tag: string) {
		onChange(value.filter((t) => t !== tag))
		inputRef.current?.focus()
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault()
			if (highlightedIndex >= 0 && highlightedIndex < filtered.length) {
				addTag(filtered[highlightedIndex])
			} else {
				addTag(input)
			}
		} else if (e.key === "Backspace" && !input && value.length > 0) {
			removeTag(value[value.length - 1])
		} else if (e.key === "ArrowDown") {
			e.preventDefault()
			if (!showSuggestions && filtered.length > 0) {
				setShowSuggestions(true)
			}
			setHighlightedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : 0))
		} else if (e.key === "ArrowUp") {
			e.preventDefault()
			setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filtered.length - 1))
		} else if (e.key === "Escape") {
			setShowSuggestions(false)
			setHighlightedIndex(-1)
		}
	}

	// Click outside to close suggestions
	useEffect(() => {
		function handleClickOutside(e: MouseEvent) {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setShowSuggestions(false)
				setHighlightedIndex(-1)
			}
		}
		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	// Reset highlighted index when filtered list changes
	useEffect(() => {
		setHighlightedIndex(-1)
	}, [input])

	// Scroll highlighted suggestion into view
	useEffect(() => {
		if (highlightedIndex >= 0 && suggestionsRef.current) {
			const items = suggestionsRef.current.children
			if (items[highlightedIndex]) {
				;(items[highlightedIndex] as HTMLElement).scrollIntoView({
					block: "nearest",
				})
			}
		}
	}, [highlightedIndex])

	return (
		<div ref={containerRef} className="relative">
			<div
				className="flex flex-wrap items-center gap-1.5 min-h-8 px-3 py-1.5 rounded-md border border-edge bg-card text-sm cursor-text transition-colors duration-150 ease-out focus-within:border-brand focus-within:ring-2 focus-within:ring-brand/20"
				onClick={() => inputRef.current?.focus()}
			>
				{value.map((tag) => (
					<Badge
						key={tag}
						variant="secondary"
						size="xs"
						fill="subtle"
						onDismiss={() => removeTag(tag)}
					>
						{tag}
					</Badge>
				))}
				<input
					ref={inputRef}
					value={input}
					onChange={(e) => {
						setInput(e.target.value)
						setShowSuggestions(true)
					}}
					onKeyDown={handleKeyDown}
					onFocus={() => {
						if (input || filtered.length > 0) {
							setShowSuggestions(true)
						}
					}}
					placeholder={value.length === 0 ? placeholder : ""}
					className="flex-1 min-w-[100px] bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted/60"
				/>
			</div>
			{showSuggestions && filtered.length > 0 && (
				<div
					ref={suggestionsRef}
					className="absolute top-full left-0 right-0 z-50 mt-1 max-h-[220px] overflow-y-auto rounded-md border border-edge bg-card shadow-md transition-opacity duration-150 ease-out"
				>
					{filtered.map((s, i) => (
						<button
							key={s}
							type="button"
							onMouseDown={(e) => {
								e.preventDefault()
								addTag(s)
							}}
							onMouseEnter={() => setHighlightedIndex(i)}
							className={`w-full px-3 py-1.5 text-left text-sm transition-colors duration-150 ease-out ${
								i === highlightedIndex
									? "bg-brand/10 text-brand"
									: "text-fg hover:bg-brand/10 hover:text-brand"
							}`}
						>
							{s}
						</button>
					))}
				</div>
			)}
		</div>
	)
}
