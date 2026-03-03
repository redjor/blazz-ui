"use client"

import type { ReactNode } from "react"
import Image from "next/image"
import Link from "next/link"
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

const sidebarLogo = (
	<Link href="/" className="flex items-center px-2 py-3">
		<Image src="/logo_blazz_white.svg" alt="Blazz" width={87} height={24} />
	</Link>
)

interface OpsFrameProps {
	children: ReactNode
	topBar?: ReactNode
}

export function OpsFrame({ children, topBar }: OpsFrameProps) {
	return (
		<SidebarProvider>
			<AppFrame sidebarConfig={opsSidebarConfig} noTopBar sidebarHeader={sidebarLogo} tabBar={topBar}>
				{children}
			</AppFrame>
		</SidebarProvider>
	)
}
