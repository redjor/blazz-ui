'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight, type LucideIcon } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'

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

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  navigation: NavigationSection[]
  header?: React.ReactNode
  footer?: React.ReactNode
}

/**
 * AppSidebar - Custom sidebar implementation using shadcn primitives
 *
 * Features:
 * - Sectioned navigation with titles
 * - Nested collapsible submenus
 * - Active state highlighting
 * - Badge/count indicators
 * - Icon support
 * - Shopify Polaris-inspired design
 *
 * @example
 * <AppSidebar
 *   navigation={[
 *     {
 *       title: 'Main',
 *       items: [
 *         { title: 'Dashboard', url: '/', icon: Home },
 *         {
 *           title: 'Products',
 *           url: '/products',
 *           icon: Package,
 *           badge: 12,
 *           items: [
 *             { title: 'All Products', url: '/products' },
 *             { title: 'Categories', url: '/products/categories' },
 *           ],
 *         },
 *       ],
 *     },
 *   ]}
 * />
 */
export function AppSidebar({ navigation, header, footer, ...props }: AppSidebarProps) {
  const pathname = usePathname()

  // Helper to check if a path is active
  const isActive = (url: string) => {
    if (url === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(url)
  }

  // Helper to check if a menu item has an active child
  const hasActiveChild = (items?: NavigationItem[]): boolean => {
    if (!items) return false
    return items.some((item) => isActive(item.url) || hasActiveChild(item.items))
  }

  return (
    <Sidebar collapsible="icon" {...props}>
      {/* Header */}
      {header && <SidebarHeader>{header}</SidebarHeader>}

      {/* Content */}
      <SidebarContent>
        {navigation.map((section) => (
          <SidebarGroup key={section.title}>
            <SidebarGroupLabel>{section.title}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {section.items.map((item) => (
                  <MenuItem
                    key={item.url}
                    item={item}
                    isActive={isActive}
                    hasActiveChild={hasActiveChild}
                  />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {/* Footer */}
      {footer && <SidebarFooter>{footer}</SidebarFooter>}
    </Sidebar>
  )
}

interface MenuItemProps {
  item: NavigationItem
  isActive: (url: string) => boolean
  hasActiveChild: (items?: NavigationItem[]) => boolean
}

function MenuItem({ item, isActive, hasActiveChild }: MenuItemProps) {
  const active = isActive(item.url)
  const hasChildren = item.items && item.items.length > 0
  const childIsActive = hasChildren && hasActiveChild(item.items)

  // Item with nested children
  if (hasChildren) {
    return (
      <SidebarMenuItem>
        <Collapsible defaultOpen={childIsActive} className="group/collapsible">
          <SidebarMenuButton asChild isActive={active}>
            <CollapsibleTrigger className="w-full">
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              {item.badge !== undefined && (
                <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-md bg-sidebar-primary/10 px-1 text-xs font-medium text-sidebar-primary">
                  {item.badge}
                </span>
              )}
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </CollapsibleTrigger>
          </SidebarMenuButton>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items?.map((subItem) => (
                <SidebarMenuSubItem key={subItem.url}>
                  <SidebarMenuSubButton asChild isActive={isActive(subItem.url)}>
                    <Link href={subItem.url}>
                      {subItem.icon && <subItem.icon />}
                      <span>{subItem.title}</span>
                      {subItem.badge !== undefined && (
                        <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded bg-sidebar-primary/10 px-1 text-xs font-medium text-sidebar-primary">
                          {subItem.badge}
                        </span>
                      )}
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      </SidebarMenuItem>
    )
  }

  // Simple item without children
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild tooltip={item.title} isActive={active}>
        <Link href={item.url}>
          {item.icon && <item.icon />}
          <span>{item.title}</span>
          {item.badge !== undefined && (
            <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-md bg-sidebar-primary/10 px-1 text-xs font-medium text-sidebar-primary">
              {item.badge}
            </span>
          )}
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  )
}
