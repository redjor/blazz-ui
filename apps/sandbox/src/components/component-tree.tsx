import { Input } from "@blazz/ui/components/ui/input"
import { Link, useParams } from "@tanstack/react-router"
import { ChevronDown, ChevronRight, Clock, Search } from "lucide-react"
import { useEffect, useMemo, useState } from "react"
import { hasPersistedState } from "~/lib/persistence"
import { getRecents } from "~/lib/recents"
import type { ComponentEntry } from "~/lib/registry"
import { getComponentsByCategory, registry, searchComponents } from "~/lib/registry"

const CATEGORIES = ["ui", "patterns", "blocks", "ai"] as const

export function ComponentTree() {
	const [query, setQuery] = useState("")
	const [collapsed, setCollapsed] = useState<Record<string, boolean>>({
		ui: true,
		patterns: true,
		blocks: true,
		ai: true,
	})
	const params = useParams({ strict: false }) as {
		category?: string
		component?: string
	}

	const recents = useMemo(() => {
		const slugs = getRecents()
		return slugs
			.map((slug) => registry.find((c) => c.slug === slug))
			.filter(Boolean) as ComponentEntry[]
	}, [])

	const isSearching = query.trim().length > 0
	const results = isSearching ? searchComponents(query.trim()) : []

	function toggleCategory(cat: string) {
		setCollapsed((prev) => ({ ...prev, [cat]: !prev[cat] }))
	}

	function isActive(entry: ComponentEntry) {
		return params.category === entry.category && params.component === entry.slug
	}

	return (
		<aside className="w-60 h-screen bg-card border-r border-edge flex flex-col shrink-0">
			{/* Search */}
			<div className="p-3">
				<div className="relative">
					<Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-fg-muted pointer-events-none" />
					<Input
						placeholder="Search components..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						className="pl-8 h-8 text-sm"
						autoFocus
					/>
				</div>
			</div>

			<div className="flex-1 overflow-y-auto pb-4">
				{isSearching ? (
					/* Flat search results */
					<div className="px-1">
						{results.length === 0 ? (
							<p className="px-3 py-2 text-xs text-fg-muted">No results found.</p>
						) : (
							results.map((entry) => (
								<ComponentLink key={entry.slug} entry={entry} active={isActive(entry)} />
							))
						)}
					</div>
				) : (
					<>
						{/* Recents */}
						{recents.length > 0 && (
							<div className="mb-2">
								<div className="px-3 py-2 text-xs font-medium text-fg-muted uppercase tracking-wider flex items-center gap-1.5">
									<Clock className="size-3" />
									Recents
								</div>
								<div className="px-1">
									{recents.map((entry) => (
										<ComponentLink
											key={`recent-${entry.slug}`}
											entry={entry}
											active={isActive(entry)}
										/>
									))}
								</div>
							</div>
						)}

						{/* Category sections */}
						{CATEGORIES.map((cat) => {
							const items = getComponentsByCategory(cat)
							if (items.length === 0) return null
							const isCollapsed = collapsed[cat]

							return (
								<div key={cat} className="mb-1">
									<button
										type="button"
										onClick={() => toggleCategory(cat)}
										className="w-full flex items-center gap-1 px-3 py-2 text-xs font-medium text-fg-muted uppercase tracking-wider hover:text-fg transition-colors"
									>
										{isCollapsed ? (
											<ChevronRight className="size-3" />
										) : (
											<ChevronDown className="size-3" />
										)}
										{cat}
										<span className="ml-auto text-[10px] tabular-nums opacity-60">
											{items.length}
										</span>
									</button>
									{!isCollapsed && (
										<div className="px-1">
											{items.map((entry) => (
												<ComponentLink key={entry.slug} entry={entry} active={isActive(entry)} />
											))}
										</div>
									)}
								</div>
							)
						})}
					</>
				)}
			</div>
		</aside>
	)
}

function ComponentLink({ entry, active }: { entry: ComponentEntry; active: boolean }) {
	const [modified, setModified] = useState(false)

	useEffect(() => {
		setModified(hasPersistedState(entry.slug))
	}, [entry.slug])

	return (
		<Link
			to="/$category/$component"
			params={{ category: entry.category, component: entry.slug }}
			className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md cursor-pointer transition-colors ${
				active ? "bg-brand/10 text-brand" : "text-fg hover:bg-muted"
			}`}
		>
			{entry.name}
			{modified && <span className="size-1.5 rounded-full bg-brand" />}
		</Link>
	)
}
