"use client"

import { useCallback, useEffect, useRef } from "react"
import { useTabs } from "./use-tabs"

interface TabsInterceptorProps {
  pathname: string
  onNavigate?: (url: string) => void
  excludePaths?: string[]
  titleResolver?: (url: string) => string
}

export function TabsInterceptor({
  pathname,
  onNavigate,
  excludePaths = [],
  titleResolver,
}: TabsInterceptorProps) {
  const { addTab, closeTab, activeTabId, tabs } = useTabs()

  const tabsRef = useRef(tabs)
  tabsRef.current = tabs
  const pathnameRef = useRef(pathname)
  pathnameRef.current = pathname

  const handleClick = useCallback(
    (e: MouseEvent) => {
      if (!e.metaKey && !e.ctrlKey) return
      // Ignore non-primary clicks (middle, right)
      if (e.button !== 0) return
      if (e.defaultPrevented) return

      const anchor = (e.target as HTMLElement).closest("a")
      if (!anchor) return

      // Respect download links and external targets
      if (anchor.hasAttribute("download")) return
      if (anchor.target === "_blank" || anchor.target === "_external") return

      const href = anchor.getAttribute("href")
      if (!href || !href.startsWith("/")) return
      if (excludePaths.some((path) => href.startsWith(path))) return

      e.preventDefault()
      e.stopPropagation()

      if (tabsRef.current.length === 0 && pathnameRef.current) {
        const currentTitle = titleResolver
          ? titleResolver(pathnameRef.current)
          : pathnameRef.current.split("/").pop() || "Tab"
        addTab({ url: pathnameRef.current, title: currentTitle })
      }

      const title = anchor.textContent?.trim() || href.split("/").pop() || "New Tab"
      addTab({ url: href, title })

      onNavigate?.(href)
    },
    [addTab, excludePaths, titleResolver, onNavigate]
  )

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "w") {
        // Don't intercept when focus is in an editable element
        const active = document.activeElement
        if (
          active instanceof HTMLInputElement ||
          active instanceof HTMLTextAreaElement ||
          (active instanceof HTMLElement && active.isContentEditable)
        ) {
          return
        }

        if (activeTabId && tabs.length >= 2) {
          e.preventDefault()
          const index = tabsRef.current.findIndex((t) => t.id === activeTabId)
          const remaining = tabsRef.current.filter((t) => t.id !== activeTabId)
          closeTab(activeTabId)
          if (onNavigate && remaining.length > 0) {
            const nextTab = index > 0 ? remaining[index - 1] : remaining[0]
            onNavigate(nextTab.url)
          }
        }
      }
    },
    [activeTabId, closeTab, tabs.length, onNavigate]
  )

  useEffect(() => {
    document.addEventListener("click", handleClick, true)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("click", handleClick, true)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [handleClick, handleKeyDown])

  return null
}
