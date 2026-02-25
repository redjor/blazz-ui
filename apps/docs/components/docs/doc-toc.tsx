"use client"

import * as React from "react"
import { cn } from "@blazz/ui/lib/utils"

export interface TocItem {
	id: string
	title: string
}

interface DocTocProps {
	items: TocItem[]
}

export function DocToc({ items }: DocTocProps) {
	const [activeId, setActiveId] = React.useState<string>("")

	React.useEffect(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id)
					}
				}
			},
			{ rootMargin: "-80px 0px -60% 0px", threshold: 0 }
		)

		for (const item of items) {
			const el = document.getElementById(item.id)
			if (el) observer.observe(el)
		}

		return () => observer.disconnect()
	}, [items])

	if (items.length === 0) return null

	return (
		<nav className="sticky top-20 hidden lg:block" aria-label="Table of contents">
			<p className="mb-3 text-xs font-semibold uppercase tracking-wider text-fg-muted">
				On this page
			</p>
			<ul className="space-y-1.5 border-l border-separator pl-3">
				{items.map((item) => (
					<li key={item.id}>
						<a
							href={`#${item.id}`}
							className={cn(
								"block text-[13px] leading-snug transition-colors",
								activeId === item.id
									? "font-medium text-brand"
									: "text-fg-muted hover:text-fg"
							)}
						>
							{item.title}
						</a>
					</li>
				))}
			</ul>
		</nav>
	)
}
