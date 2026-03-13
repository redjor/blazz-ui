"use client"

import type { SidebarConfig } from "@blazz/ui/types/navigation"
import { Briefcase, LayoutDashboard, Users } from "lucide-react"

export const talentflowSidebarConfig: SidebarConfig = {
	user: {
		name: "Marie Dubois",
		email: "marie.dubois@talentflow.io",
		role: "Responsable RH",
	},
	searchEnabled: true,
	searchPlaceholder: "Rechercher...",
	navigation: [
		{
			id: "recrutement",
			title: "Recrutement",
			items: [
				{
					id: "dashboard",
					title: "Tableau de bord",
					url: "/examples/talentflow/dashboard",
					icon: LayoutDashboard,
				},
				{
					id: "candidates",
					title: "Candidats",
					url: "/examples/talentflow/candidates",
					icon: Users,
				},
				{
					id: "jobs",
					title: "Offres d'emploi",
					url: "/examples/talentflow/jobs",
					icon: Briefcase,
				},
			],
		},
	],
}

export const talentflowNavigationConfig = talentflowSidebarConfig.navigation
