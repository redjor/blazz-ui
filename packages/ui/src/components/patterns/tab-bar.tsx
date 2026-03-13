"use client"

import type { LucideIcon } from "lucide-react"
import {
	BarChart3,
	Building2,
	FileText,
	Handshake,
	LayoutDashboard,
	Package,
	Settings,
	Users,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { NavigationTabsBar, NavigationTabsItem, useNavigationTabs } from "./navigation-tabs"

/**
 * Maps a CRM URL to its entity icon and section label.
 * Used to display "Section > Title" in tabs.
 */
const routeMap: { prefix: string; icon: LucideIcon; label: string }[] = [
	{ prefix: "/examples/crm/dashboard", icon: LayoutDashboard, label: "CRM" },
	{ prefix: "/examples/crm/companies", icon: Building2, label: "Entreprises" },
	{ prefix: "/examples/crm/contacts", icon: Users, label: "Contacts" },
	{ prefix: "/examples/crm/deals", icon: Handshake, label: "Pipeline" },
	{ prefix: "/examples/crm/quotes", icon: FileText, label: "Devis" },
	{ prefix: "/examples/crm/products", icon: Package, label: "Produits" },
	{ prefix: "/examples/crm/reports", icon: BarChart3, label: "Rapports" },
	{ prefix: "/examples/crm/settings", icon: Settings, label: "Paramètres" },
]

function getRouteInfo(url: string): { icon: LucideIcon; label: string } {
	const match = routeMap.find((r) => url.startsWith(r.prefix))
	return match ?? { icon: LayoutDashboard, label: "CRM" }
}

export function TabBar() {
	const { tabs, activeTabId, activateTab, closeTab, addTab } = useNavigationTabs()
	const router = useRouter()

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
		addTab({ url: "/examples/crm/dashboard", title: "Tableau de bord" })
		router.push("/examples/crm/dashboard")
	}

	return (
		<NavigationTabsBar onAddTab={handleAddTab}>
			{tabs.map((tab) => {
				const { icon, label } = getRouteInfo(tab.url)
				const displayTitle = tab.title === label ? label : `${label} > ${tab.title}`
				return (
					<NavigationTabsItem
						key={tab.id}
						title={displayTitle}
						icon={icon}
						isActive={tab.id === activeTabId}
						onClick={() => handleActivate(tab.id, tab.url)}
						onClose={() => handleClose(tab.id)}
					/>
				)
			})}
		</NavigationTabsBar>
	)
}
