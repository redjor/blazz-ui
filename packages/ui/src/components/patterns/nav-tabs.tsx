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
 * Pill-style tabs matching DataTable view presets.
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
		<nav className={cn("flex items-center gap-1 px-2 py-1.5", className)}>
			{tabs.map((tab) => {
				const active = isActive(tab.href)
				return (
					<Link
						key={tab.href}
						href={basePath + tab.href}
						className={cn(
							"inline-flex h-7 shrink-0 items-center whitespace-nowrap rounded-md px-2.5 text-xs font-medium transition-colors",
							active ? "bg-muted text-fg" : "text-fg-muted hover:bg-muted/50 hover:text-fg"
						)}
					>
						{tab.label}
					</Link>
				)
			})}
		</nav>
	)
}
