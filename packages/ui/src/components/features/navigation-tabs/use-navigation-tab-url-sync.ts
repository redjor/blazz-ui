"use client"

import { usePathname } from "next/navigation"
import { useEffect, useRef } from "react"
import { useNavigationTabs } from "./use-navigation-tabs"

/**
 * Syncs the current URL (pathname) with the active tab.
 * When the user navigates within a tab (e.g., from /contacts to /contacts/123),
 * the active tab's URL and title are updated to reflect the new page.
 *
 * Also handles direct URL access: if the URL matches an existing tab, activate it.
 *
 * @param titleResolver - Function that derives a tab title from a pathname
 */
export function useNavigationTabUrlSync(titleResolver: (pathname: string) => string) {
	const pathname = usePathname()
	const { tabs, activeTabId, updateActiveTabUrl, updateTabTitle, activateTab } = useNavigationTabs()
	const isInitialMount = useRef(true)

	const tabsRef = useRef(tabs)
	tabsRef.current = tabs
	const activeTabIdRef = useRef(activeTabId)
	activeTabIdRef.current = activeTabId

	useEffect(() => {
		if (!pathname) return

		const currentTabs = tabsRef.current
		const currentActiveTabId = activeTabIdRef.current

		if (isInitialMount.current) {
			isInitialMount.current = false
			const existing = currentTabs.find((t) => t.url === pathname)
			if (existing && existing.id !== currentActiveTabId) {
				activateTab(existing.id)
			}
			return
		}

		const existing = currentTabs.find((t) => t.url === pathname)
		if (existing) {
			if (existing.id !== currentActiveTabId) {
				activateTab(existing.id)
			}
			return
		}

		if (currentActiveTabId) {
			updateActiveTabUrl(pathname)
			updateTabTitle(currentActiveTabId, titleResolver(pathname))
		}
	}, [pathname, activateTab, updateActiveTabUrl, updateTabTitle, titleResolver])
}
