import type { ComponentType, ReactNode } from "react"

export interface NavItem {
	title: string
	url: string
	icon?: ComponentType<{ className?: string }>
	children?: NavItem[]
	badge?: string | number
}

export interface NavGroup {
	label?: string
	items: NavItem[]
}

export interface TabsConfig {
	storageKey: string
	alwaysShow?: boolean
	defaultTab: { url: string; title: string }
}

export interface AppFrameProps {
	logo?: ReactNode
	navItems: NavItem[] | NavGroup[]
	sidebarFooter?: ReactNode
	sidebarCollapsible?: "offcanvas" | "icon" | "none"
	tabs?: TabsConfig
	rounded?: boolean
	className?: string
	children: ReactNode
}

export interface BreadcrumbItem {
	label: string
	href?: string
}

export interface AppTopBarState {
	breadcrumbs: BreadcrumbItem[] | null
	actions: ReactNode
}

/** Type guard: is the array a NavGroup[] (vs NavItem[])? */
export function isNavGroups(items: NavItem[] | NavGroup[]): items is NavGroup[] {
	return items.length > 0 && "items" in items[0]
}

/** Normalize NavItem[] | NavGroup[] → NavGroup[] */
export function toNavGroups(items: NavItem[] | NavGroup[]): NavGroup[] {
	if (isNavGroups(items)) return items
	return [{ items }]
}

/** Flatten NavGroup[] → NavItem[] (for title resolution etc.) */
export function flattenNavGroups(groups: NavGroup[]): NavItem[] {
	return groups.flatMap((g) => g.items)
}
