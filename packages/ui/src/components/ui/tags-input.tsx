"use client"

import { X } from "lucide-react"
import * as React from "react"
import { cn } from "../../lib/utils"
import { Badge } from "./badge"
import { Input } from "./input"

export interface TagsInputProps {
	tags: string[]
	onTagsChange: (tags: string[]) => void
	suggestions?: string[]
	placeholder?: string
	className?: string
	maxTags?: number
}

export function TagsInput({
	tags,
	onTagsChange,
	suggestions = [],
	placeholder = "Add a tag...",
	className,
	maxTags,
}: TagsInputProps) {
	const [inputValue, setInputValue] = React.useState("")
	const [showSuggestions, setShowSuggestions] = React.useState(false)
	const inputRef = React.useRef<HTMLInputElement>(null)

	// Filter suggestions based on input
	const filteredSuggestions = suggestions.filter(
		(suggestion) =>
			suggestion.toLowerCase().includes(inputValue.toLowerCase()) && !tags.includes(suggestion)
	)

	const addTag = (tag: string) => {
		const trimmedTag = tag.trim()
		if (trimmedTag && !tags.includes(trimmedTag) && (!maxTags || tags.length < maxTags)) {
			onTagsChange([...tags, trimmedTag])
			setInputValue("")
			setShowSuggestions(false)
		}
	}

	const removeTag = (tagToRemove: string) => {
		onTagsChange(tags.filter((tag) => tag !== tagToRemove))
	}

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") {
			e.preventDefault()
			addTag(inputValue)
		} else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
			removeTag(tags[tags.length - 1])
		}
	}

	return (
		<div className={cn("relative", className)}>
			<div className="flex flex-wrap gap-2 mb-2">
				{tags.map((tag) => (
					<Badge key={tag} variant="secondary" className="gap-1 pr-1">
						<span>{tag}</span>
						<button
							type="button"
							onClick={() => removeTag(tag)}
							className="ml-1 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-brand/20"
						>
							<X className="h-3 w-3" />
						</button>
					</Badge>
				))}
			</div>

			<div className="relative">
				<Input
					ref={inputRef}
					type="text"
					value={inputValue}
					onChange={(e) => {
						setInputValue(e.target.value)
						setShowSuggestions(e.target.value.length > 0)
					}}
					onKeyDown={handleKeyDown}
					onFocus={() => setShowSuggestions(inputValue.length > 0)}
					onBlur={() => {
						// Delay to allow click on suggestion
						setTimeout(() => setShowSuggestions(false), 200)
					}}
					placeholder={placeholder}
					disabled={maxTags !== undefined && tags.length >= maxTags}
				/>

				{showSuggestions && filteredSuggestions.length > 0 && (
					<div className="absolute top-full left-0 right-0 mt-1 bg-surface-4 border border-container rounded-lg shadow-md z-50 max-h-60 overflow-auto">
						{filteredSuggestions.map((suggestion) => (
							<button
								key={suggestion}
								type="button"
								onClick={() => addTag(suggestion)}
								className="w-full text-left px-3 py-2 text-sm hover:bg-surface-3 transition-colors"
							>
								{suggestion}
							</button>
						))}
					</div>
				)}
			</div>
		</div>
	)
}
