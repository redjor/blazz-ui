"use client"

import { useCallback, useEffect } from "react"
import { useTabs } from "@/components/layout/tabs-context"

/**
 * Intercepts Cmd/Ctrl+click on links within the CRM to open them as new tabs.
 * Also handles Cmd+W to close the active tab.
 * Attaches event listeners on the document (event delegation).
 */
export function TabLinkInterceptor() {
	const { addTab, closeTab, activeTabId, tabs } = useTabs()

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
