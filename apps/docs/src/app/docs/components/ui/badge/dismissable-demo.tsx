"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { useState } from "react"

export function DismissableDemo() {
	const [tags, setTags] = useState(["React", "TypeScript", "Tailwind", "Next.js"])

	return (
		<div className="flex flex-wrap gap-2">
			{tags.map((tag) => (
				<Badge key={tag} variant="secondary" fill="subtle" onDismiss={() => setTags((t) => t.filter((v) => v !== tag))}>
					{tag}
				</Badge>
			))}
			{tags.length === 0 && (
				<button type="button" className="text-xs text-fg-muted hover:text-fg transition-colors" onClick={() => setTags(["React", "TypeScript", "Tailwind", "Next.js"])}>
					Reset tags
				</button>
			)}
		</div>
	)
}
