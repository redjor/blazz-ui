"use client"

import { useContext } from "react"
import { NavigationTabsContext } from "./navigation-tabs-provider"
import type { NavigationTabsContextValue } from "./navigation-tabs-provider"

export type { NavigationTabsContextValue }

export function useNavigationTabs(): NavigationTabsContextValue {
	const context = useContext(NavigationTabsContext)
	if (context === undefined) {
		throw new Error("useNavigationTabs must be used within a NavigationTabsProvider")
	}
	return context
}
