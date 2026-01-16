import type { LucideIcon } from "lucide-react"

/**
 * Types for navigation items
 */

export type NavigationItemType = "link" | "button" | "dropdown" | "separator" | "label"

export interface NavigationItemAction {
	icon: LucideIcon
	label: string
	onClick: (item: NavigationItem) => void
}

export interface NavigationItem {
	id?: string
	type?: NavigationItemType
	title: string
	url?: string
	icon?: LucideIcon
	badge?: string | number
	badgeVariant?: "default" | "destructive" | "outline" | "secondary"
	items?: NavigationItem[]
	actions?: NavigationItemAction[]
	disabled?: boolean
	onClick?: () => void
	metadata?: Record<string, any>
}

export interface NavigationSection {
	id?: string
	title?: string
	collapsible?: boolean
	defaultOpen?: boolean
	items: NavigationItem[]
}

export interface SidebarUser {
	name: string
	email: string
	avatar?: string
	role?: string
}

export interface SidebarConfig {
	navigation: NavigationSection[]
	user?: SidebarUser
	searchEnabled?: boolean
	searchPlaceholder?: string
	logo?: {
		src: string
		alt: string
		href?: string
	}
	footer?: React.ReactNode
}
