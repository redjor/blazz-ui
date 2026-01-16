import {
	Home,
	Settings,
	Users,
	Package,
	BarChart,
	FileText,
	type LucideIcon,
} from "lucide-react"

export interface NavigationItem {
	title: string
	url: string
	icon?: LucideIcon
	badge?: number | string
	badgeVariant?: "default" | "destructive" | "outline" | "secondary"
	items?: NavigationItem[]
}

export interface NavigationGroup {
	title: string
	items: NavigationItem[]
}

export interface SidebarConfig {
	logo?: {
		src: string
		alt: string
	}
	navigation: NavigationGroup[]
	user?: {
		name: string
		email: string
		avatar: string
	}
	searchEnabled?: boolean
}

/**
 * Mock navigation configuration for sidebar components
 */
export const mockNavigationConfig: SidebarConfig = {
	logo: {
		src: "/logo.svg",
		alt: "Blazz UI",
	},
	navigation: [
		{
			title: "Dashboard",
			items: [
				{
					title: "Overview",
					url: "/dashboard",
					icon: Home,
				},
				{
					title: "Analytics",
					url: "/analytics",
					icon: BarChart,
					badge: "New",
					badgeVariant: "secondary",
				},
			],
		},
		{
			title: "Management",
			items: [
				{
					title: "Users",
					url: "/users",
					icon: Users,
					badge: 5,
					badgeVariant: "destructive",
				},
				{
					title: "Products",
					url: "/products",
					icon: Package,
					items: [
						{
							title: "All Products",
							url: "/products/all",
						},
						{
							title: "Categories",
							url: "/products/categories",
						},
						{
							title: "Inventory",
							url: "/products/inventory",
							badge: 12,
						},
					],
				},
				{
					title: "Reports",
					url: "/reports",
					icon: FileText,
				},
			],
		},
		{
			title: "Settings",
			items: [
				{
					title: "General",
					url: "/settings/general",
					icon: Settings,
				},
			],
		},
	],
	user: {
		name: "John Doe",
		email: "john@example.com",
		avatar: "https://i.pravatar.cc/150?u=john",
	},
	searchEnabled: true,
}
