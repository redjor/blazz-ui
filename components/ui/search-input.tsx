"use client"

import * as React from "react"
import { SearchIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export interface SearchInputProps extends Omit<React.ComponentProps<"input">, "type"> {
	/** Callback when the clear button is clicked */
	onClear?: () => void
}

function SearchInput({ className, value, onClear, ...props }: SearchInputProps) {
	const hasValue = value !== undefined ? String(value).length > 0 : false

	return (
		<div className="relative">
			<SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-4 text-fg-muted pointer-events-none" />
			<input
				type="search"
				data-slot="search-input"
				value={value}
				className={cn(
					"w-full min-w-0 outline-none",
					"bg-surface",
					"hover:bg-raised",
					"border border-edge",
					"hover:border-edge",
					"focus:border-brand",
					"focus:ring-[3px] focus:ring-brand/20",
					"h-8 rounded-md pl-8 pr-8 py-1",
					"text-sm text-fg",
					"placeholder:text-fg-subtle",
					"transition-colors duration-150 ease-out",
					"disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
					"[&::-webkit-search-cancel-button]:hidden",
					className
				)}
				{...props}
			/>
			{hasValue && onClear && (
				<button
					type="button"
					tabIndex={-1}
					onClick={onClear}
					className="absolute right-2 top-1/2 -translate-y-1/2 text-fg-muted hover:text-fg transition-colors outline-none"
					aria-label="Clear search"
				>
					<XIcon className="size-4" />
				</button>
			)}
		</div>
	)
}

export { SearchInput }
