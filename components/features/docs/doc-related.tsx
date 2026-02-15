import Link from "next/link"
import { cn } from "@/lib/utils"

export interface DocRelatedItem {
	title: string
	href: string
	description: string
}

interface DocRelatedProps {
	items: DocRelatedItem[]
	className?: string
}

export function DocRelated({ items, className }: DocRelatedProps) {
	return (
		<div className={cn("grid gap-3 sm:grid-cols-2 lg:grid-cols-3", className)}>
			{items.map((item) => (
				<Link
					key={item.href}
					href={item.href}
					className="group rounded-lg border border-edge px-4 py-3 transition-colors hover:bg-raised/50"
				>
					<p className="text-sm font-medium text-fg group-hover:text-brand transition-colors">
						{item.title}
					</p>
					<p className="mt-0.5 text-xs text-fg-muted line-clamp-1">{item.description}</p>
				</Link>
			))}
		</div>
	)
}
