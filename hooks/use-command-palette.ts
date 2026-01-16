'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import type { NavigationSection } from '@/components/layout/app-sidebar'

export interface CommandItem {
  id: string
  title: string
  url: string
  section?: string
  keywords?: string[]
}

const RECENT_ITEMS_KEY = 'command-palette-recent'
const MAX_RECENT_ITEMS = 5

/**
 * Hook for managing command palette state and functionality
 *
 * Features:
 * - Keyboard shortcut (Cmd/Ctrl + K)
 * - Build searchable items from navigation
 * - Recent items tracking
 * - Navigation handling
 *
 * @example
 * const { isOpen, setIsOpen, items, recentItems, navigate } = useCommandPalette({
 *   navigation: navConfig
 * })
 */
export function useCommandPalette({ navigation }: { navigation: NavigationSection[] }) {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const [recentItems, setRecentItems] = React.useState<CommandItem[]>([])

  // Build searchable items from navigation
  const items = React.useMemo(() => {
    const commandItems: CommandItem[] = []

    navigation.forEach((section) => {
      section.items.forEach((item) => {
        // Add main item
        commandItems.push({
          id: item.url,
          title: item.title,
          url: item.url,
          section: section.title,
        })

        // Add nested items
        if (item.items) {
          item.items.forEach((subItem) => {
            commandItems.push({
              id: subItem.url,
              title: `${item.title} > ${subItem.title}`,
              url: subItem.url,
              section: section.title,
            })
          })
        }
      })
    })

    return commandItems
  }, [navigation])

  // Load recent items from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem(RECENT_ITEMS_KEY)
      if (stored) {
        setRecentItems(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load recent items:', error)
    }
  }, [])

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setIsOpen((open) => !open)
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  // Navigate to a command item
  const navigate = React.useCallback(
    (item: CommandItem) => {
      // Add to recent items
      const newRecent = [
        item,
        ...recentItems.filter((i) => i.id !== item.id),
      ].slice(0, MAX_RECENT_ITEMS)

      setRecentItems(newRecent)
      try {
        localStorage.setItem(RECENT_ITEMS_KEY, JSON.stringify(newRecent))
      } catch (error) {
        console.error('Failed to save recent items:', error)
      }

      // Navigate
      router.push(item.url)
      setIsOpen(false)
    },
    [recentItems, router]
  )

  return {
    isOpen,
    setIsOpen,
    items,
    recentItems,
    navigate,
  }
}
