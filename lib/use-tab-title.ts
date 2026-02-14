"use client"

import { useEffect } from "react"
import { useTabs } from "@/components/layout/tabs-context"

/**
 * Hook for CRM pages to set the title of their active tab.
 * Call this in any page component to update the tab title dynamically.
 *
 * @example
 * useTabTitle(contact.name) // "Marie Dupont"
 */
export function useTabTitle(title: string) {
	const { activeTabId, updateTabTitle } = useTabs()

	useEffect(() => {
		if (activeTabId && title) {
			updateTabTitle(activeTabId, title)
		}
	}, [activeTabId, title, updateTabTitle])
}
