"use client"

import type { SidebarConfig } from "@blazz/ui/types/navigation"
import {
	BarChart3,
	Building2,
	ClipboardList,
	FileText,
	Handshake,
	LayoutDashboard,
	Package,
	Settings,
	Users,
} from "lucide-react"

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
					url: "/examples/crm/dashboard",
					icon: LayoutDashboard,
				},
				{
					id: "companies",
					title: "Entreprises",
					url: "/examples/crm/companies",
					icon: Building2,
				},
				{
					id: "contacts",
					title: "Contacts",
					url: "/examples/crm/contacts",
					icon: Users,
					items: [
						{ title: "Tous les contacts", url: "/examples/crm/contacts" },
						{ title: "Importer", url: "/examples/crm/contacts/import" },
					],
				},
				{
					id: "deals",
					title: "Pipeline",
					url: "/examples/crm/deals",
					icon: Handshake,
				},
				{
					id: "quotes",
					title: "Devis",
					url: "/examples/crm/quotes",
					icon: FileText,
				},
				{
					id: "products",
					title: "Produits",
					url: "/examples/crm/products",
					icon: Package,
				},
				{
					id: "inventory",
					title: "Inventaire",
					url: "/examples/crm/inventory",
					icon: ClipboardList,
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
					url: "/examples/crm/reports",
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
					url: "/examples/crm/settings",
					icon: Settings,
				},
			],
		},
	],
}

export const crmNavigationConfig = crmSidebarConfig.navigation
