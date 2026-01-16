'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface NavigationItem {
  title: string
  url: string
  icon?: LucideIcon
  badge?: string | number
  items?: NavigationItem[]
}

export interface NavigationSection {
  title: string
  items: NavigationItem[]
}

interface LayoutSidebarProps {
  navigation: NavigationSection[]
  header?: React.ReactNode
  footer?: React.ReactNode
}

export function LayoutSidebar({ navigation, header, footer }: LayoutSidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = React.useState<Set<string>>(new Set())

  const isActive = (url: string) => {
    if (url === '/dashboard') return pathname === '/dashboard'
    return pathname.startsWith(url) && url !== '/'
  }

  const hasActiveChild = (items?: NavigationItem[]): boolean => {
    if (!items) return false
    return items.some(item => isActive(item.url) || hasActiveChild(item.items))
  }

  const toggleItem = (url: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(url)) {
      newExpanded.delete(url)
    } else {
      newExpanded.add(url)
    }
    setExpandedItems(newExpanded)
  }

  // Auto-expand active items
  React.useEffect(() => {
    const newExpanded = new Set<string>()
    navigation.forEach(section => {
      section.items.forEach(item => {
        if (item.items && hasActiveChild(item.items)) {
          newExpanded.add(item.url)
        }
      })
    })
    setExpandedItems(newExpanded)
  }, [pathname])

  return (
    <aside className="relative flex h-full flex-col bg-sidebar">
      {/* Header */}
      {header && (
        <div className="flex h-12 flex-shrink-0 items-center border-b border-sidebar-border px-4">
          {header}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4">
        {navigation.map((section) => (
          <div key={section.title} className="mb-6">
            {/* Section Header */}
            <h3 className="mb-2 px-4 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/60">
              {section.title}
            </h3>

            {/* Section Items */}
            <ul className="space-y-1 px-2">
              {section.items.map((item) => {
                const active = isActive(item.url)
                const hasChildren = item.items && item.items.length > 0
                const isExpanded = expandedItems.has(item.url)
                const childActive = hasChildren && hasActiveChild(item.items)

                return (
                  <li key={item.url}>
                    {hasChildren ? (
                      <>
                        <button
                          onClick={() => toggleItem(item.url)}
                          className={cn(
                            'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                            'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                            (active || childActive) && 'bg-sidebar-accent text-sidebar-accent-foreground',
                            !active && !childActive && 'text-sidebar-foreground'
                          )}
                        >
                          {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" strokeWidth={2} />}
                          <span className="flex-1 text-left">{item.title}</span>
                          {item.badge !== undefined && (
                            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-md bg-sidebar-primary/10 px-2 text-xs font-medium text-sidebar-primary">
                              {item.badge}
                            </span>
                          )}
                          <ChevronRight
                            className={cn(
                              'h-4 w-4 transition-transform',
                              isExpanded && 'rotate-90'
                            )}
                          />
                        </button>
                        {isExpanded && (
                          <ul className="ml-7 mt-1 space-y-1">
                            {item.items?.map((subItem) => {
                              const subActive = isActive(subItem.url)
                              return (
                                <li key={subItem.url}>
                                  <Link
                                    href={subItem.url}
                                    className={cn(
                                      'flex w-full items-center gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
                                      'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                                      subActive && 'bg-sidebar-accent text-sidebar-accent-foreground',
                                      !subActive && 'text-sidebar-foreground/70'
                                    )}
                                  >
                                    {subItem.icon && <subItem.icon className="h-4 w-4 flex-shrink-0" strokeWidth={2} />}
                                    <span>{subItem.title}</span>
                                    {subItem.badge !== undefined && (
                                      <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded bg-sidebar-primary/10 px-1.5 text-xs font-medium text-sidebar-primary">
                                        {subItem.badge}
                                      </span>
                                    )}
                                  </Link>
                                </li>
                              )
                            })}
                          </ul>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.url}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
                          active && 'bg-sidebar-accent text-sidebar-accent-foreground',
                          !active && 'text-sidebar-foreground'
                        )}
                      >
                        {item.icon && <item.icon className="h-5 w-5 flex-shrink-0" strokeWidth={2} />}
                        <span>{item.title}</span>
                        {item.badge !== undefined && (
                          <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-md bg-sidebar-primary/10 px-2 text-xs font-medium text-sidebar-primary">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )}
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer */}
      {footer && (
        <div className="flex-shrink-0 border-t border-sidebar-border p-3">
          {footer}
        </div>
      )}
    </aside>
  )
}
