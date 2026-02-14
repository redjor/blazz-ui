"use client"

import { useEffect, useRef } from "react"
import { usePathname } from "next/navigation"
import { useTabs } from "@/components/layout/tabs-context"

/**
 * Syncs the current URL (pathname) with the active tab.
 * When the user navigates within a tab (e.g., from /contacts to /contacts/123),
 * the active tab's URL is updated to reflect the new page.
 *
 * Also handles direct URL access: if the URL matches an existing tab, activate it.
 * If no tab exists for the URL and there are tabs open, create one.
 */
export function useTabUrlSync() {
	const pathname = usePathname()
	const { tabs, activeTabId, updateActiveTabUrl, activateTab } = useTabs()
	const isInitialMount = useRef(true)

	// Keep refs for values we read but don't want to trigger re-runs
	const tabsRef = useRef(tabs)
	tabsRef.current = tabs
	const activeTabIdRef = useRef(activeTabId)
	activeTabIdRef.current = activeTabId

	useEffect(() => {
		if (!pathname) return

		const currentTabs = tabsRef.current
		const currentActiveTabId = activeTabIdRef.current

		// On initial mount with restored tabs, just activate the matching tab
		if (isInitialMount.current) {
			isInitialMount.current = false
			const existing = currentTabs.find((t) => t.url === pathname)
			if (existing && existing.id !== currentActiveTabId) {
				activateTab(existing.id)
			}
			return
		}

		// Check if the new URL matches an existing tab
		const existing = currentTabs.find((t) => t.url === pathname)
		if (existing) {
			if (existing.id !== currentActiveTabId) {
				activateTab(existing.id)
			}
			return
		}

		// Otherwise update the active tab's URL
		if (currentActiveTabId) {
			updateActiveTabUrl(pathname)
		}
	}, [pathname, activateTab, updateActiveTabUrl])
}
