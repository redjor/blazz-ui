import { createFileRoute, Link } from "@tanstack/react-router"
import { getComponentsByCategory, registry } from "~/lib/registry"

export const Route = createFileRoute("/")({
	component: HomePage,
})

const QUICK_LINKS = [
	{ name: "Button", path: "/ui/button" },
	{ name: "Input", path: "/ui/input" },
	{ name: "Card", path: "/ui/card" },
	{ name: "Select", path: "/ui/select" },
	{ name: "Tabs", path: "/ui/tabs" },
] as const

const CATEGORIES = ["ui", "patterns", "blocks", "ai"] as const

function HomePage() {
	const categoryCounts = CATEGORIES.map((cat) => ({
		label: cat.charAt(0).toUpperCase() + cat.slice(1),
		count: getComponentsByCategory(cat).length,
	}))

	return (
		<div className="flex h-screen flex-col items-center justify-center gap-8">
			<div className="text-center">
				<h1 className="text-2xl font-semibold">Blazz Sandbox</h1>
				<p className="text-fg-muted mt-1">Explore {registry.length} components</p>
			</div>

			{/* Category counts */}
			<div className="flex gap-4">
				{categoryCounts.map(({ label, count }) => (
					<div key={label} className="text-center px-4 py-2 rounded-lg bg-muted">
						<div className="text-lg font-semibold tabular-nums">{count}</div>
						<div className="text-xs text-fg-muted">{label}</div>
					</div>
				))}
			</div>

			{/* Quick links */}
			<div className="space-y-3">
				<p className="text-xs font-medium text-fg-muted uppercase tracking-wider text-center">Popular components</p>
				<div className="flex gap-2">
					{QUICK_LINKS.map(({ name, path }) => (
						<Link key={path} to={path} className="px-4 py-2 text-sm border border-edge rounded-lg hover:bg-muted hover:border-brand/30 transition-colors">
							{name}
						</Link>
					))}
				</div>
			</div>
		</div>
	)
}
