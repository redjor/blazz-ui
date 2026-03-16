"use client"

import { useEffect, useRef } from "react"
import { useTabs } from "./use-tabs"

export function useTabUrlSync(pathname: string, titleResolver: (pathname: string) => string) {
  const { tabs, activeTabId, updateActiveTabUrl, updateTabTitle, activateTab } = useTabs()
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
      if (existing) {
        if (existing.id !== currentActiveTabId) {
          activateTab(existing.id)
        }
        return
      }
      // Deep-link: URL not in any tab — update active tab to match
      if (currentActiveTabId) {
        updateActiveTabUrl(pathname)
        updateTabTitle(currentActiveTabId, titleResolver(pathname))
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
