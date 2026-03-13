import { useLocation } from "@tanstack/react-router"
import { navigationConfig } from "~/config/navigation"
import { DocToc, type TocItem } from "./doc-toc"

function getCategoryForPath(pathname: string): string | undefined {
	for (const group of navigationConfig) {
		for (const category of group.items) {
			if (category.items?.some((item) => item.url === pathname)) {
				return category.title
			}
		}
	}
}

interface DocPageProps {
	title: string
	subtitle: string
	category?: string
	toc?: TocItem[]
	children: React.ReactNode
}

export function DocPage({ title, subtitle, category, toc, children }: DocPageProps) {
	const { pathname } = useLocation()
	const resolvedCategory = category ?? getCategoryForPath(pathname)

	return (
		<div className="mx-auto w-full max-w-5xl px-6">
			{/* Header */}
			<div className="space-y-2 pt-8 pb-6">
				{resolvedCategory && <p className="text-sm font-medium text-brand">{resolvedCategory}</p>}
				<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">{title}</h1>
				<p className="text-base text-fg-muted">{subtitle}</p>
			</div>

			{/* Content + TOC */}
			<div className="flex gap-10">
				<div className="min-w-0 flex-1 space-y-12 pb-16">{children}</div>
				{toc && toc.length > 0 && (
					<div className="hidden w-48 shrink-0 lg:block">
						<DocToc items={toc} />
					</div>
				)}
			</div>
		</div>
	)
}
