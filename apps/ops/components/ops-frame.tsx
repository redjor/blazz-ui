"use client"

import type { Dispatch, ReactNode, SetStateAction } from "react"
import { createContext, useContext, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { LayoutDashboard, Sun, Users, Clock, CheckSquare } from "lucide-react"
import { AppFrame } from "@blazz/ui/components/patterns/app-frame"
import { SidebarProvider } from "@blazz/ui/components/ui/sidebar"
import type { SidebarConfig } from "@blazz/ui/types/navigation"
import { OpsBreadcrumb, type BreadcrumbItem } from "./ops-breadcrumb"

const opsSidebarConfig: SidebarConfig = {
	navigation: [
		{
			id: "main",
			items: [
				{ title: "Dashboard", url: "/", icon: LayoutDashboard },
				{ title: "Aujourd'hui", url: "/today", icon: Sun },
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

const OpsTopBarCtx = createContext<Dispatch<SetStateAction<BreadcrumbItem[] | null>>>(() => {})

export function useOpsTopBar(items: BreadcrumbItem[] | null) {
	const set = useContext(OpsTopBarCtx)
	const key = items?.map((i) => `${i.label}|${i.href ?? ""}`).join(",") ?? ""
	useEffect(() => {
		set(items)
		return () => set(null)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [set, key])
}

export function OpsFrame({ children }: { children: ReactNode }) {
	const [items, setItems] = useState<BreadcrumbItem[] | null>(null)
	return (
		<OpsTopBarCtx.Provider value={setItems}>
			<SidebarProvider>
				<AppFrame
					sidebarConfig={opsSidebarConfig}
					noTopBar
					sidebarHeader={sidebarLogo}
					tabBar={items ? <OpsBreadcrumb items={items} /> : undefined}
				>
					{children}
				</AppFrame>
			</SidebarProvider>
		</OpsTopBarCtx.Provider>
	)
}
