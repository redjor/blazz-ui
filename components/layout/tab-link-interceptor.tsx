"use client"

import { usePathname } from "next/navigation"
import { useCallback, useEffect, useRef } from "react"
import { useTabs } from "@/components/layout/tabs-context"

/**
 * Derives a short page title from a CRM pathname.
 * e.g. "/contacts" → "Contacts", "/deals/123" → "deals/123", "/dashboard" → "Dashboard"
 */
function titleFromPathname(pathname: string): string {
	const segment = pathname.split("/").filter(Boolean)[0] || "Dashboard"
	return segment.charAt(0).toUpperCase() + segment.slice(1)
}

/**
 * Intercepts Cmd/Ctrl+click on links within the CRM to open them as new tabs.
 * Also handles Cmd+W to close the active tab.
 * Attaches event listeners on the document (event delegation).
 */
export function TabLinkInterceptor() {
	const { addTab, closeTab, activeTabId, tabs } = useTabs()
	const pathname = usePathname()

	// Use refs to avoid recreating callbacks on every state change
	const tabsRef = useRef(tabs)
	tabsRef.current = tabs
	const pathnameRef = useRef(pathname)
	pathnameRef.current = pathname

	const handleClick = useCallback(
		(e: MouseEvent) => {
			// Only intercept Cmd+click (Mac) or Ctrl+click (Win/Linux)
			if (!e.metaKey && !e.ctrlKey) return

			// Find the closest <a> tag
			const anchor = (e.target as HTMLElement).closest("a")
			if (!anchor) return

			const href = anchor.getAttribute("href")
			if (!href) return

			// Only intercept internal CRM links
			if (!href.startsWith("/") || href.startsWith("/docs") || href.startsWith("/showcase")) return

			// Prevent default navigation
			e.preventDefault()
			e.stopPropagation()

			// If no tabs exist yet, first create a tab for the current page
			if (tabsRef.current.length === 0 && pathnameRef.current) {
				addTab({ url: pathnameRef.current, title: titleFromPathname(pathnameRef.current) })
			}

			// Derive a title from the link text or URL
			const title = anchor.textContent?.trim() || href.split("/").pop() || "New Tab"

			addTab({ url: href, title })
		},
		[addTab]
	)

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			// Cmd+W or Ctrl+W to close active tab
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
		document.addEventListener("click", handleClick, true) // capture phase
		document.addEventListener("keydown", handleKeyDown)
		return () => {
			document.removeEventListener("click", handleClick, true)
			document.removeEventListener("keydown", handleKeyDown)
		}
	}, [handleClick, handleKeyDown])

	return null
}
