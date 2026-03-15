"use client"

import { useEffect } from "react"
import { useTabs } from "./use-tabs"

export function useTabTitle(title: string) {
  const { activeTabId, updateTabTitle } = useTabs()

  useEffect(() => {
    if (activeTabId && title) {
      updateTabTitle(activeTabId, title)
    }
  }, [activeTabId, title, updateTabTitle])
}
