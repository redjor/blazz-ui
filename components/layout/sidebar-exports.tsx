/**
 * Sidebar Exports
 *
 * This file exports both versions of the sidebar for easy migration.
 *
 * AppSidebar - Original version (backward compatible)
 * AppSidebarV2 - New version with full features
 */

export { AppSidebar } from './app-sidebar'
export { AppSidebarV2 } from './app-sidebar-v2'
export { SidebarSearch } from './sidebar-search'
export { SidebarUserMenu } from './sidebar-user'

// Re-export types
export type { NavigationItem, NavigationSection, SidebarConfig, SidebarUser } from '@/types/navigation'
