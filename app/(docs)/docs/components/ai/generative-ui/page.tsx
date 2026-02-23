import { ArrowRight, BarChart3, Users } from "lucide-react"
import Link from "next/link"
import { Page } from "@/components/ui/page"

interface GenUICategory {
	id: string
	title: string
	description: string
	items: { title: string; href: string }[]
}

const categories: GenUICategory[] = [
	{
		id: "data",
		title: "Data & Metrics",
		description: "KPIs, charts, tables and progress indicators.",
		items: [
			{ title: "Metric Card", href: "/docs/components/ai/metric-card" },
			{ title: "Stats Row", href: "/docs/components/ai/stats-row" },
			{ title: "Mini Chart", href: "/docs/components/ai/mini-chart" },
			{ title: "Comparison Table", href: "/docs/components/ai/comparison-table" },
			{ title: "Progress Card", href: "/docs/components/ai/progress-card" },
			{ title: "Data List", href: "/docs/components/ai/data-list" },
			{ title: "Data Grid", href: "/docs/components/ai/data-grid" },
		],
	},
	{
		id: "entities",
		title: "People & Entities",
		description: "Profile cards and entity representations.",
		items: [
			{ title: "Candidate Card", href: "/docs/components/ai/candidate-card" },
		],
	},
]

const totalComponents = categories.reduce((sum, cat) => sum + cat.items.length, 0)

export default function GenerativeUiPage() {
	return (
		<Page
			title="Generative UI"
			subtitle={`${totalComponents} structured blocks that render inline in AI chat messages. Browse by category.`}
		>
			<div className="space-y-10">
				{categories.map((category) => (
					<section key={category.id} className="space-y-3">
						<div className="min-w-0">
							<div className="flex items-center gap-2">
								<h2 className="text-sm font-semibold text-fg">
									{category.title}
								</h2>
								<span className="text-xs text-fg-muted tabular-nums">
									{category.items.length}
								</span>
							</div>
							<p className="text-xs text-fg-muted">
								{category.description}
							</p>
						</div>
						<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
							{category.items.map((component) => (
								<Link
									key={component.href}
									href={component.href}
									className="group flex items-center justify-between rounded-lg border border-edge bg-surface px-3.5 py-2.5 transition-colors hover:bg-raised"
								>
									<span className="text-sm text-fg group-hover:text-fg">
										{component.title}
									</span>
									<ArrowRight className="h-3.5 w-3.5 text-fg-muted opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
								</Link>
							))}
						</div>
					</section>
				))}
			</div>
		</Page>
	)
}
