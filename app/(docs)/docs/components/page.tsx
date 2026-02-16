import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Page } from "@/components/ui/page"
import { componentsNavigation } from "@/config/components-navigation"

const totalComponents = componentsNavigation.reduce((sum, cat) => sum + cat.items.length, 0)

export default function ComponentsPage() {
	return (
		<Page
			title="Components"
			subtitle={`${totalComponents} components across ${componentsNavigation.length} categories. Browse by category or search for a specific component.`}
		>
			<div className="space-y-10">
				{componentsNavigation.map((category) => (
					<section key={category.id} className="space-y-3">
						<div className="flex items-center gap-3">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-raised border border-edge">
								<category.icon className="h-4 w-4 text-fg-muted" />
							</div>
							<div className="min-w-0">
								<div className="flex items-center gap-2">
									<h2 className="text-sm font-semibold text-fg">{category.title}</h2>
									<span className="text-xs text-fg-muted tabular-nums">
										{category.items.length}
									</span>
								</div>
								<p className="text-xs text-fg-muted">{category.description}</p>
							</div>
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
