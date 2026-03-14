"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { X } from "lucide-react"
import { useRef, useState } from "react"

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
	const inputRef = useRef<HTMLInputElement>(null)

	const filtered = suggestions.filter(
		(s) => s.toLowerCase().includes(input.toLowerCase()) && !value.includes(s.toLowerCase())
	)

	function addTag(tag: string) {
		const trimmed = tag.trim().toLowerCase()
		if (!trimmed || value.includes(trimmed)) return
		onChange([...value, trimmed])
		setInput("")
		setShowSuggestions(false)
	}

	function removeTag(tag: string) {
		onChange(value.filter((t) => t !== tag))
	}

	function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
		if (e.key === "Enter" || e.key === ",") {
			e.preventDefault()
			addTag(input)
		} else if (e.key === "Backspace" && !input && value.length > 0) {
			removeTag(value[value.length - 1])
		}
	}

	return (
		<div className="relative">
			<div
				className="flex flex-wrap gap-1.5 min-h-9 px-3 py-1.5 rounded-md border border-edge bg-surface cursor-text"
				onClick={() => inputRef.current?.focus()}
			>
				{value.map((tag) => (
					<Badge
						key={tag}
						variant="secondary"
						className="text-xs px-1.5 py-0 flex items-center gap-1 h-5"
					>
						{tag}
						<button
							type="button"
							onClick={(e) => {
								e.stopPropagation()
								removeTag(tag)
							}}
							className="text-fg-muted hover:text-fg ml-0.5"
						>
							<X className="size-2.5" />
						</button>
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
					onFocus={() => setShowSuggestions(true)}
					onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
					placeholder={value.length === 0 ? placeholder : ""}
					className="flex-1 min-w-[100px] bg-transparent text-sm text-fg outline-none placeholder:text-fg-muted/60"
				/>
			</div>
			{showSuggestions && filtered.length > 0 && (
				<div className="absolute top-full left-0 right-0 z-50 mt-1 rounded-md border border-edge bg-surface shadow-md">
					{filtered.slice(0, 6).map((s) => (
						<button
							key={s}
							type="button"
							onMouseDown={() => addTag(s)}
							className="w-full px-3 py-1.5 text-left text-sm text-fg hover:bg-surface-3"
						>
							{s}
						</button>
					))}
				</div>
			)}
		</div>
	)
}
