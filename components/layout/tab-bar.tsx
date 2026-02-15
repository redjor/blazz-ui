"use client"

import type { LucideIcon } from "lucide-react"
import {
	BarChart3,
	Building2,
	FileText,
	Handshake,
	LayoutDashboard,
	Package,
	Plus,
	Settings,
	Users,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { TabItem } from "@/components/layout/tab-item"
import { useTabs } from "@/components/layout/tabs-context"

/**
 * Maps a CRM URL to its entity icon and section label.
 * Used to display "Section > Title" in tabs.
 */
const routeMap: { prefix: string; icon: LucideIcon; label: string }[] = [
	{ prefix: "/dashboard", icon: LayoutDashboard, label: "CRM" },
	{ prefix: "/companies", icon: Building2, label: "Entreprises" },
	{ prefix: "/contacts", icon: Users, label: "Contacts" },
	{ prefix: "/deals", icon: Handshake, label: "Pipeline" },
	{ prefix: "/quotes", icon: FileText, label: "Devis" },
	{ prefix: "/products", icon: Package, label: "Produits" },
	{ prefix: "/reports", icon: BarChart3, label: "Rapports" },
	{ prefix: "/settings", icon: Settings, label: "Paramètres" },
]

function getRouteInfo(url: string): { icon: LucideIcon; label: string } {
	const match = routeMap.find((r) => url.startsWith(r.prefix))
	return match ?? { icon: LayoutDashboard, label: "CRM" }
}

export function TabBar() {
	const { tabs, activeTabId, showTabBar, activateTab, closeTab, addTab } = useTabs()
	const router = useRouter()

	if (!showTabBar) return null

	function handleActivate(tabId: string, url: string) {
		activateTab(tabId)
		router.push(url)
	}

	function handleClose(tabId: string) {
		const isActive = tabId === activeTabId

		closeTab(tabId)

		if (isActive) {
			const index = tabs.findIndex((t) => t.id === tabId)
			const remaining = tabs.filter((t) => t.id !== tabId)
			if (remaining.length > 0) {
				const nextTab = index > 0 ? remaining[index - 1] : remaining[0]
				router.push(nextTab.url)
			}
		}
	}

	function handleAddTab() {
		addTab({ url: "/dashboard", title: "Tableau de bord" })
		router.push("/dashboard")
	}

	return (
		<div className="hidden h-(--tabbar-height) shrink-0 items-center overflow-x-auto border-b border-(--sidebar-border) bg-(--sidebar-background) md:flex">
			<div className="flex flex-1 items-center">
				{tabs.map((tab, index) => {
					const { icon, label } = getRouteInfo(tab.url)
					const displayTitle = `${label} > ${tab.title}`
					return (
						<TabItem
							key={tab.id}
							title={displayTitle}
							icon={icon}
							isActive={tab.id === activeTabId}
							isLast={index === tabs.length - 1}
							onClick={() => handleActivate(tab.id, tab.url)}
							onClose={() => handleClose(tab.id)}
						/>
					)
				})}
			</div>
			<button
				type="button"
				onClick={handleAddTab}
				className="flex h-(--tabbar-height) w-9 shrink-0 items-center justify-center border-l border-(--sidebar-border) text-(--sidebar-foreground) transition-colors hover:bg-(--sidebar-accent)"
				aria-label="Open new tab"
			>
				<Plus className="h-4 w-4" />
			</button>
		</div>
	)
}
