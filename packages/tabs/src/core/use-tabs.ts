"use client"

import { useContext } from "react"
import type { TabsContextValue } from "./tabs-provider"
import { TabsContext } from "./tabs-provider"

export type { TabsContextValue }

export function useTabs(): TabsContextValue {
  const context = useContext(TabsContext)
  if (context === undefined) {
    throw new Error("useTabs must be used within a TabsProvider")
  }
  return context
}
