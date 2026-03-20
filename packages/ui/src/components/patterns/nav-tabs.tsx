"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef, useState } from "react"
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
 * Each tab renders a `<Link>` with a sliding underline indicator
 * that animates between the active tabs.
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
	const containerRef = useRef<HTMLDivElement>(null)
	const tabRefs = useRef<Map<string, HTMLAnchorElement>>(new Map())
	const [indicator, setIndicator] = useState<{ left: number; width: number } | null>(null)
	const hasAnimated = useRef(false)

	function isActive(href: string) {
		const full = basePath + href
		if (href === "") {
			return pathname === full || pathname === full + "/"
		}
		return pathname.startsWith(full)
	}

	const updateIndicator = useCallback(() => {
		const container = containerRef.current
		if (!container) return

		const activeTab = Array.from(tabRefs.current.entries()).find(([href]) => isActive(href))
		if (!activeTab) {
			setIndicator(null)
			return
		}

		const el = activeTab[1]
		const containerRect = container.getBoundingClientRect()
		const tabRect = el.getBoundingClientRect()

		setIndicator({
			left: tabRect.left - containerRect.left,
			width: tabRect.width,
		})
	}, [pathname, basePath])

	useEffect(() => {
		updateIndicator()
		hasAnimated.current = true
	}, [updateIndicator])

	const setTabRef = useCallback((href: string, el: HTMLAnchorElement | null) => {
		if (el) {
			tabRefs.current.set(href, el)
		} else {
			tabRefs.current.delete(href)
		}
	}, [])

	return (
		<nav className={cn("border-b border-edge", className)}>
			<div ref={containerRef} className="relative flex items-center gap-1 px-6">
				{tabs.map((tab) => {
					const active = isActive(tab.href)
					return (
						<Link
							key={tab.href}
							ref={(el) => setTabRef(tab.href, el)}
							href={basePath + tab.href}
							className={cn(
								"relative inline-flex items-center px-2.5 py-2 text-sm whitespace-nowrap transition-colors",
								active ? "text-fg font-medium" : "text-fg-muted hover:text-fg",
							)}
						>
							{tab.label}
						</Link>
					)
				})}
				{indicator && (
					<span
						className="absolute bottom-0 h-0.5 bg-fg rounded-full"
						style={{
							left: indicator.left,
							width: indicator.width,
							transition: hasAnimated.current ? "left 150ms ease-out, width 150ms ease-out" : "none",
						}}
					/>
				)}
			</div>
		</nav>
	)
}
