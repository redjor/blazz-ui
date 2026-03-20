"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "../../lib/utils"

export interface NavTab {
	/** Display label */
	label: string
	/** Route path (absolute or relative to basePath) */
	href: string
}

export interface NavTabsProps {
	/** Tab definitions */
	tabs: NavTab[]
	/** Base path prepended to each tab href (e.g. "/clients/123/projects/456") */
	basePath?: string
	/** Additional class on the nav container */
	className?: string
}

/**
 * NavTabs — Navigation tabs linked to Next.js routes.
 *
 * Each tab renders a `<Link>` with an active underline indicator.
 * The active tab is determined by matching `usePathname()` against each tab's href.
 *
 * Visual style matches `TabsTrigger` variant="line" from `@blazz/ui`.
 *
 * ```tsx
 * <NavTabs
 *   basePath={`/clients/${id}/projects/${pid}`}
 *   tabs={[
 *     { label: "Overview", href: "" },
 *     { label: "Time", href: "/time" },
 *     { label: "Todos", href: "/todos" },
 *   ]}
 * />
 * ```
 */
export function NavTabs({ tabs, basePath = "", className }: NavTabsProps) {
	const pathname = usePathname()

	function isActive(href: string) {
		const full = basePath + href
		if (href === "") {
			return pathname === full || pathname === full + "/"
		}
		return pathname.startsWith(full)
	}

	return (
		<nav className={cn("border-b border-edge", className)}>
			<div className="flex items-center gap-1 px-6">
				{tabs.map((tab) => {
					const active = isActive(tab.href)
					return (
						<Link
							key={tab.href}
							href={basePath + tab.href}
							className={cn(
								"relative inline-flex items-center px-2.5 py-2 text-sm whitespace-nowrap transition-colors",
								active ? "text-fg font-medium" : "text-fg-muted hover:text-fg",
								"after:absolute after:inset-x-0 after:bottom-0 after:h-0.5 after:bg-fg after:rounded-full after:transition-opacity",
								active ? "after:opacity-100" : "after:opacity-0"
							)}
						>
							{tab.label}
						</Link>
					)
				})}
			</div>
		</nav>
	)
}
