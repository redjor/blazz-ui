"use client"

import {
	BarChart,
	Calendar,
	FileText,
	Home,
	Inbox,
	Layers,
	Mail,
	Package,
	Settings,
	ShoppingCart,
	Users,
} from "lucide-react"
import type { SidebarConfig } from "@/types/navigation"

export const sidebarConfig: SidebarConfig = {
	searchEnabled: false,
	user: {
		name: "John Doe",
		email: "john@example.com",
		avatar: "/avatars/01.png",
		role: "Admin",
	},
	navigation: [
		{
			id: "main",
			title: "",
			items: [
				{
					id: "dashboard",
					title: "Dashboard",
					url: "/dashboard",
					icon: Home,
				},
				{
					id: "inbox",
					title: "Inbox",
					url: "/inbox",
					icon: Inbox,
				},
				{
					id: "products",
					title: "Products",
					url: "/products",
					icon: Package,
					items: [
						{ title: "All Products", url: "/products" },
						{ title: "Categories", url: "/products/categories" },
						{ title: "Collections", url: "/products/collections" },
						{ title: "Inventory", url: "/products/inventory" },
					],
				},
				{
					id: "orders",
					title: "Orders",
					url: "/orders",
					icon: ShoppingCart,
					items: [
						{ title: "All Orders", url: "/orders" },
						{ title: "Pending", url: "/orders/pending" },
						{ title: "Fulfilled", url: "/orders/fulfilled" },
						{ title: "Archived", url: "/orders/archived" },
					],
				},
				{
					id: "customers",
					title: "Customers",
					url: "/customers",
					icon: Users,
				},
			],
		},
		{
			id: "analytics",
			title: "Analytics & Reports",
			collapsible: true,
			defaultOpen: true,
			items: [
				{
					id: "reports",
					title: "Reports",
					url: "/reports",
					icon: BarChart,
					items: [
						{ title: "Sales Report", url: "/reports/sales" },
						{ title: "Traffic Analysis", url: "/reports/traffic" },
						{ title: "Customer Insights", url: "/reports/customers" },
						{ title: "Revenue", url: "/reports/revenue" },
					],
				},
				{
					id: "calendar",
					title: "Calendar",
					url: "/calendar",
					icon: Calendar,
				},
				{
					id: "documents",
					title: "Documents",
					url: "/documents",
					icon: FileText,
				},
			],
		},
		{
			id: "communication",
			title: "Communication",
			items: [
				{
					id: "mail",
					title: "Mail",
					url: "/mail",
					icon: Mail,
					items: [
						{ title: "Inbox", url: "/mail/inbox" },
						{ title: "Sent", url: "/mail/sent" },
						{ title: "Drafts", url: "/mail/drafts" },
						{ title: "Starred", url: "/mail/starred" },
						{ title: "Trash", url: "/mail/trash" },
					],
				},
			],
		},
		{
			id: "admin",
			title: "Administration",
			collapsible: true,
			items: [
				{
					id: "settings",
					title: "Settings",
					url: "/settings",
					icon: Settings,
					items: [
						{ title: "General", url: "/settings" },
						{ title: "Profile", url: "/settings/profile" },
						{ title: "Billing", url: "/settings/billing" },
						{ title: "Notifications", url: "/settings/notifications" },
					],
				},
				{
					id: "components",
					title: "Components",
					url: "/components",
					icon: Layers,
					items: [
						{ title: "Overview", url: "/components" },
						{ title: "Page Examples", url: "/page-examples" },
						{ title: "UI Components", url: "/components/ui" },
					],
				},
			],
		},
	],
}

// Backward compatibility - export navigationConfig as before
export const navigationConfig = sidebarConfig.navigation
