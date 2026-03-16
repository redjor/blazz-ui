"use client"

import * as React from "react"
import { initialTabsState, isValidTabsState, tabsReducer } from "./tabs-reducer"
import type { Tab, TabsStorage } from "./tabs.types"

export interface TabsContextValue {
  tabs: Tab[]
  activeTabId: string | null
  showTabBar: boolean
  addTab: (payload: { url: string; title: string; icon?: string; deduplicate?: boolean }) => void
  closeTab: (id: string) => void
  activateTab: (id: string) => void
  updateActiveTabUrl: (url: string) => void
  updateTabTitle: (id: string, title: string) => void
}

export const TabsContext = React.createContext<TabsContextValue | undefined>(undefined)

const defaultStorage: TabsStorage =
  typeof window !== "undefined"
    ? {
        getItem: (k) => localStorage.getItem(k),
        setItem: (k, v) => localStorage.setItem(k, v),
      }
    : { getItem: () => null, setItem: () => {} }

interface TabsProviderProps {
  storageKey: string
  storage?: TabsStorage
  defaultTab?: { url: string; title: string; icon?: string }
  /** Show the tab bar even when only one tab is open (default: false) */
  alwaysShowTabBar?: boolean
  children: React.ReactNode
}

export function TabsProvider({
  storageKey,
  storage = defaultStorage,
  defaultTab,
  alwaysShowTabBar = false,
  children,
}: TabsProviderProps) {
  const [state, dispatch] = React.useReducer(tabsReducer, initialTabsState)
  const [hydrated, setHydrated] = React.useState(false)

  // Hydrate once on mount — never re-run when defaultTab reference changes
  const defaultTabRef = React.useRef(defaultTab)
  React.useEffect(() => {
    try {
      const raw = storage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (isValidTabsState(parsed) && parsed.tabs.length > 0) {
          dispatch({ type: "RESTORE", payload: parsed })
          setHydrated(true)
          return
        }
      }
    } catch {
      // ignore corrupt storage
    }
    if (defaultTabRef.current) {
      dispatch({ type: "ADD_TAB", payload: defaultTabRef.current })
    }
    setHydrated(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, storage])

  React.useEffect(() => {
    if (!hydrated) return
    const timer = setTimeout(() => {
      try {
        storage.setItem(storageKey, JSON.stringify(state))
      } catch {
        // ignore storage errors
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [state, hydrated, storageKey, storage])

  const addTab = React.useCallback(
    (payload: { url: string; title: string; icon?: string; deduplicate?: boolean }) => {
      dispatch({ type: "ADD_TAB", payload })
    },
    []
  )

  const closeTab = React.useCallback((id: string) => {
    dispatch({ type: "CLOSE_TAB", payload: { id } })
  }, [])

  const activateTab = React.useCallback((id: string) => {
    dispatch({ type: "ACTIVATE_TAB", payload: { id } })
  }, [])

  const updateActiveTabUrl = React.useCallback((url: string) => {
    dispatch({ type: "UPDATE_ACTIVE_URL", payload: { url } })
  }, [])

  const updateTabTitle = React.useCallback((id: string, title: string) => {
    dispatch({ type: "UPDATE_TAB_TITLE", payload: { id, title } })
  }, [])

  const value = React.useMemo<TabsContextValue>(
    () => ({
      tabs: state.tabs,
      activeTabId: state.activeTabId,
      showTabBar: alwaysShowTabBar ? state.tabs.length >= 1 : state.tabs.length >= 2,
      addTab,
      closeTab,
      activateTab,
      updateActiveTabUrl,
      updateTabTitle,
    }),
    [state, alwaysShowTabBar, addTab, closeTab, activateTab, updateActiveTabUrl, updateTabTitle]
  )

  return <TabsContext.Provider value={value}>{children}</TabsContext.Provider>
}
