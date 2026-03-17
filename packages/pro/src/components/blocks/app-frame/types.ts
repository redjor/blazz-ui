import type { ComponentType, ReactNode } from "react"

export interface NavItem {
	title: string
	url: string
	icon?: ComponentType<{ className?: string }>
	children?: NavItem[]
	badge?: string | number
}

export interface TabsConfig {
	storageKey: string
	alwaysShow?: boolean
	defaultTab: { url: string; title: string }
}

export interface AppFrameProps {
	logo?: ReactNode
	navItems: NavItem[]
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
