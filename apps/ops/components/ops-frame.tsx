"use client"

import type { ReactNode } from "react"
import { LayoutDashboard, Users, Clock, CheckSquare } from "lucide-react"
import { AppFrame } from "@blazz/ui/components/patterns/app-frame"
import { SidebarProvider } from "@blazz/ui/components/ui/sidebar"
import type { SidebarConfig } from "@blazz/ui/types/navigation"

const opsSidebarConfig: SidebarConfig = {
	navigation: [
		{
			id: "main",
			items: [
				{ title: "Dashboard", url: "/", icon: LayoutDashboard },
				{ title: "Clients", url: "/clients", icon: Users },
				{
					title: "Suivi de temps",
					url: "/time",
					icon: Clock,
					items: [{ title: "Récapitulatif", url: "/recap" }],
				},
				{ title: "Todos", url: "/todos", icon: CheckSquare },
			],
		},
	],
}

export function OpsFrame({ children }: { children: ReactNode }) {
	return (
		<SidebarProvider>
			<AppFrame sidebarConfig={opsSidebarConfig} minimalTopBar>
				{children}
			</AppFrame>
		</SidebarProvider>
	)
}
