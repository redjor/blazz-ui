"use client"

import { cn } from "@blazz/ui/lib/utils"
import { usePathname } from "next/navigation"
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
	const pathname = usePathname()
	const resolvedCategory = category ?? getCategoryForPath(pathname)
	const hasToc = Boolean(toc && toc.length > 0)

	return (
		<div className={cn("mx-auto w-full px-6", hasToc ? "max-w-[88rem] xl:px-8" : "max-w-5xl")}>
			{/* Header */}
			<div className={cn("space-y-2 pt-8 pb-6", hasToc && "max-w-4xl")}>
				{resolvedCategory && <p className="text-sm font-medium text-brand">{resolvedCategory}</p>}
				<h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-fg">{title}</h1>
				<p className="text-base text-fg-muted">{subtitle}</p>
			</div>

			{/* Content + TOC */}
			<div className={cn("flex items-start", hasToc ? "gap-8 xl:gap-14 2xl:gap-20" : "gap-10")}>
				<div className={cn("min-w-0 space-y-12 pb-16", hasToc ? "flex-1 max-w-4xl" : "flex-1")}>
					{children}
				</div>
				{toc && toc.length > 0 && (
					<div className="hidden w-52 shrink-0 xl:w-56 2xl:w-64 lg:block">
						<DocToc items={toc} />
					</div>
				)}
			</div>
		</div>
	)
}
