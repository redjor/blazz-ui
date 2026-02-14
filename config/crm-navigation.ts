"use client"

import {
	BarChart3,
	Building2,
	FileText,
	LayoutDashboard,
	Package,
	Settings,
	Upload,
	Users,
	Handshake,
} from "lucide-react"
import type { SidebarConfig } from "@/types/navigation"

export const crmSidebarConfig: SidebarConfig = {
	user: {
		name: "Sophie Martin",
		email: "sophie.martin@forge-crm.com",
		role: "Directrice Commerciale",
	},
	searchEnabled: true,
	searchPlaceholder: "Rechercher...",
	navigation: [
		{
			id: "crm",
			title: "CRM",
			items: [
				{
					id: "dashboard",
					title: "Tableau de bord",
					url: "/dashboard",
					icon: LayoutDashboard,
				},
				{
					id: "companies",
					title: "Entreprises",
					url: "/companies",
					icon: Building2,
				},
				{
					id: "contacts",
					title: "Contacts",
					url: "/contacts",
					icon: Users,
					items: [
						{ title: "Tous les contacts", url: "/contacts" },
						{ title: "Importer", url: "/contacts/import" },
					],
				},
				{
					id: "deals",
					title: "Pipeline",
					url: "/deals",
					icon: Handshake,
				},
				{
					id: "quotes",
					title: "Devis",
					url: "/quotes",
					icon: FileText,
				},
				{
					id: "products",
					title: "Produits",
					url: "/products",
					icon: Package,
				},
			],
		},
		{
			id: "analytics",
			title: "Analytics",
			items: [
				{
					id: "reports",
					title: "Rapports",
					url: "/reports",
					icon: BarChart3,
				},
			],
		},
		{
			id: "system",
			title: "Système",
			items: [
				{
					id: "settings",
					title: "Paramètres",
					url: "/settings",
					icon: Settings,
				},
			],
		},
	],
}

export const crmNavigationConfig = crmSidebarConfig.navigation
