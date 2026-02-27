"use client"

import { useEffect } from "react"
import { useNavigationTabs } from "./use-navigation-tabs"

/**
 * Hook to set the title of the active tab dynamically.
 * Call this in any page component to update the tab title.
 *
 * @example
 * useNavigationTabTitle(contact.name) // "Marie Dupont"
 */
export function useNavigationTabTitle(title: string) {
	const { activeTabId, updateTabTitle } = useNavigationTabs()

	useEffect(() => {
		if (activeTabId && title) {
			updateTabTitle(activeTabId, title)
		}
	}, [activeTabId, title, updateTabTitle])
}
