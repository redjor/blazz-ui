import { cn } from "@blazz/ui/lib/utils"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

export interface BreadcrumbItem {
	label: string
	href?: string
}

interface OpsBreadcrumbProps {
	items: BreadcrumbItem[]
	className?: string
}

export function OpsBreadcrumb({ items, className }: OpsBreadcrumbProps) {
	return (
		<nav
			aria-label="breadcrumb"
			className={cn(
				"flex h-10 items-center gap-1.5 border-b border-edge-subtle bg-surface-3 px-6 rounded-tr-(--main-radius)",
				className
			)}
		>
			<ol className="flex items-center gap-1.5">
				{items.map((item, index) => {
					const isLast = index === items.length - 1
					return (
						<li key={item.href ?? item.label} className="flex items-center gap-1.5">
							{index > 0 && (
								<ChevronRight aria-hidden="true" className="h-3.5 w-3.5 text-fg-muted shrink-0" />
							)}
							{isLast || !item.href ? (
								<span
									aria-current={isLast ? "page" : undefined}
									className={cn("text-sm", isLast ? "font-medium text-fg" : "text-fg-subtle")}
								>
									{item.label}
								</span>
							) : (
								<Link
									href={item.href}
									className="text-sm text-fg-subtle transition-colors hover:text-fg hover:underline"
								>
									{item.label}
								</Link>
							)}
						</li>
					)
				})}
			</ol>
		</nav>
	)
}
