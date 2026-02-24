"use client"

import * as React from "react"
import { SearchInput } from "@/components/ui/search-input"

export function SearchInputWithClearDemo() {
	const [value, setValue] = React.useState("design tokens")

	return (
		<div className="max-w-sm space-y-2">
			<SearchInput
				placeholder="Search..."
				value={value}
				onChange={(e) => setValue(e.target.value)}
				onClear={() => setValue("")}
			/>
			<p className="text-xs text-fg-muted">
				Value: {value || "(empty)"}
			</p>
		</div>
	)
}
