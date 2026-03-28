"use client"

import { Page } from "@blazz/ui/components/ui/page"
import { ArrowRight, Circle } from "lucide-react"
import Link from "next/link"
import { getSectionNavigation } from "~/config/navigation"

const section = getSectionNavigation("guide")
const categories = section?.items ?? []
const totalItems = categories.reduce((sum, cat) => sum + (cat.items?.length ?? 0), 0)

export default function GuidePage() {
	return (
		<Page>
			<div className="relative -mx-6 -mt-6 overflow-hidden rounded-b-2xl border-b border-edge bg-muted/40 bg-cover bg-center px-6 py-16 text-center">
				<div
					className="pointer-events-none absolute inset-0 opacity-40"
					style={{
						backgroundImage: "radial-gradient(circle, var(--border-default) 1px, transparent 1px)",
						backgroundSize: "24px 24px",
					}}
				/>
				<div className="relative z-10 mx-auto max-w-2xl space-y-3">
					<h1 className="text-4xl font-bold tracking-tight text-fg">Guide</h1>
					<p className="text-base text-fg-muted">{totalItems} resources — design tokens, concepts, outils et utilitaires.</p>
				</div>
			</div>
			<div className="space-y-10 py-8">
				{categories.map((category) => {
					const Icon = category.icon ?? Circle
					return (
						<section key={category.id ?? category.title} className="space-y-3">
							<div className="flex items-center gap-3">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted border border-edge">
									<Icon className="h-4 w-4 text-fg-muted" />
								</div>
								<div className="min-w-0">
									<div className="flex items-center gap-2">
										<h2 className="text-sm font-semibold text-fg">{category.title}</h2>
										<span className="text-xs text-fg-muted tabular-nums">{category.items?.length ?? 0}</span>
									</div>
								</div>
							</div>
							<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
								{category.items?.map((item) => (
									<Link key={item.url} href={item.url ?? "/"} className="group flex items-center justify-between rounded-lg border border-edge bg-card px-3.5 py-2.5 transition-colors hover:bg-muted">
										<span className="text-sm text-fg group-hover:text-fg">{item.title}</span>
										<ArrowRight className="h-3.5 w-3.5 text-fg-muted opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
									</Link>
								))}
							</div>
						</section>
					)
				})}
			</div>
		</Page>
	)
}
