"use client"

import {
	BarChart,
	Calendar,
	FileText,
	Layers,
	Mail,
	Package,
	Settings,
	ShoppingCart,
	Users,
} from "lucide-react"
import type { SidebarConfig } from "@/types/navigation"

export const sidebarConfig: SidebarConfig = {
	navigation: [
		{
			id: "main",
			title: "",
			items: [
				{
					id: "products",
					title: "Produits",
					url: "/products",
					icon: Package,
					items: [
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
						{ title: "Pending", url: "/orders/pending" },
						{ title: "Fulfilled", url: "/orders/fulfilled" },
						{ title: "Archived", url: "/orders/archived" },
					],
				},
				{
					id: "clients",
					title: "Clients",
					url: "/clients",
					icon: Users,
				},
			],
		},
		{
			id: "analytics",
			title: "Analytics & Reports",
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
