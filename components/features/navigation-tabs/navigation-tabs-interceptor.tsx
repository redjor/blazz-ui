"use client"

import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef } from "react"
import { useNavigationTabs } from "./use-navigation-tabs"

interface NavigationTabsInterceptorProps {
	excludePaths?: string[]
	titleResolver?: (url: string) => string
}

/**
 * Intercepts Cmd/Ctrl+click on links to open them as new tabs.
 * Also handles Cmd+W to close the active tab.
 * Attaches event listeners on the document (event delegation).
 */
export function NavigationTabsInterceptor({
	excludePaths = [],
	titleResolver,
}: NavigationTabsInterceptorProps) {
	const { addTab, closeTab, activeTabId, tabs } = useNavigationTabs()
	const pathname = usePathname()

	const tabsRef = useRef(tabs)
	tabsRef.current = tabs
	const pathnameRef = useRef(pathname)
	pathnameRef.current = pathname

	const handleClick = useCallback(
		(e: MouseEvent) => {
			if (!e.metaKey && !e.ctrlKey) return

			const anchor = (e.target as HTMLElement).closest("a")
			if (!anchor) return

			const href = anchor.getAttribute("href")
			if (!href) return

			if (!href.startsWith("/")) return
			if (excludePaths.some((path) => href.startsWith(path))) return

			e.preventDefault()
			e.stopPropagation()

			if (tabsRef.current.length === 0 && pathnameRef.current) {
				const currentTitle = titleResolver
					? titleResolver(pathnameRef.current)
					: pathnameRef.current.split("/").pop() || "Tab"
				addTab({ url: pathnameRef.current, title: currentTitle })
			}

			const title = anchor.textContent?.trim() || href.split("/").pop() || "New Tab"
			addTab({ url: href, title })
		},
		[addTab, excludePaths, titleResolver]
	)

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "w") {
				if (activeTabId && tabs.length >= 2) {
					e.preventDefault()
					closeTab(activeTabId)
				}
			}
		},
		[activeTabId, closeTab, tabs.length]
	)

	useEffect(() => {
		document.addEventListener("click", handleClick, true)
		document.addEventListener("keydown", handleKeyDown)
		return () => {
			document.removeEventListener("click", handleClick, true)
			document.removeEventListener("keydown", handleKeyDown)
		}
	}, [handleClick, handleKeyDown])

	return null
}
