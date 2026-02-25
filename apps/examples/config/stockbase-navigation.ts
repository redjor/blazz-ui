"use client"

import { ArrowLeftRight, LayoutDashboard, Package } from "lucide-react"
import type { SidebarConfig } from "@blazz/ui/types/navigation"

export const stockbaseSidebarConfig: SidebarConfig = {
	user: {
		name: "Pierre Martin",
		email: "stockbase@demo.io",
		role: "Responsable Logistique",
	},
	searchEnabled: true,
	searchPlaceholder: "Rechercher...",
	navigation: [
		{
			id: "inventaire",
			title: "Inventaire",
			items: [
				{
					id: "dashboard",
					title: "Tableau de bord",
					url: "/examples/stockbase/dashboard",
					icon: LayoutDashboard,
				},
				{
					id: "inventory",
					title: "Stock",
					url: "/examples/stockbase/inventory",
					icon: Package,
				},
				{
					id: "movements",
					title: "Mouvements",
					url: "/examples/stockbase/movements",
					icon: ArrowLeftRight,
				},
			],
		},
	],
}

export const stockbaseNavigationConfig = stockbaseSidebarConfig.navigation
