import { Page } from "@blazz/ui/components/ui/page"
import { createFileRoute, Link } from "@tanstack/react-router"
import { ArrowRight } from "lucide-react"
import { componentsNavigation } from "~/config/components-navigation"

export const Route = createFileRoute("/_docs/docs/components/")({
	component: ComponentsPage,
})

const totalComponents = componentsNavigation.reduce((sum, cat) => sum + cat.items.length, 0)

function ComponentsPage() {
	return (
		<Page>
			{/* Hero — ready for bg-image via bg-[url(...)] or inline style */}
			<div className="relative -mx-6 -mt-6 overflow-hidden rounded-b-2xl border-b border-edge bg-surface-3/40 bg-cover bg-center px-6 py-16 text-center">
				{/* Dot grid overlay — will sit behind a future bg image if needed */}
				<div
					className="pointer-events-none absolute inset-0 opacity-40"
					style={{
						backgroundImage: "radial-gradient(circle, var(--border-default) 1px, transparent 1px)",
						backgroundSize: "24px 24px",
					}}
				/>
				<div className="relative z-10 mx-auto max-w-2xl space-y-3">
					<h1 className="text-4xl font-bold tracking-tight text-fg">Components</h1>
					<p className="text-base text-fg-muted">
						{totalComponents} components across {componentsNavigation.length} categories. Browse by
						category or search for a specific component.
					</p>
				</div>
			</div>
			<div className="space-y-10 py-8">
				{componentsNavigation.map((category) => (
					<section key={category.id} className="space-y-3">
						<div className="flex items-center gap-3">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-surface-3 border border-edge">
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
									to={component.href}
									className="group flex items-center justify-between rounded-lg border border-edge bg-surface px-3.5 py-2.5 transition-colors hover:bg-surface-3"
								>
									<span className="text-sm text-fg group-hover:text-fg">{component.title}</span>
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
