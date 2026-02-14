"use client"

import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { TabItem } from "@/components/layout/tab-item"
import { useTabs } from "@/components/layout/tabs-context"

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

		// If closing the active tab, navigate to the new active tab
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
		addTab({ url: "/dashboard", title: "Dashboard" })
		router.push("/dashboard")
	}

	return (
		<div className="hidden h-(--tabbar-height) items-center overflow-x-auto border-b border-border bg-(--main-background) md:flex">
			<div className="flex items-center">
				{tabs.map((tab) => (
					<TabItem
						key={tab.id}
						title={tab.title}
						isActive={tab.id === activeTabId}
						onClick={() => handleActivate(tab.id, tab.url)}
						onClose={() => handleClose(tab.id)}
					/>
				))}
			</div>
			<button
				type="button"
				onClick={handleAddTab}
				className="flex h-(--tabbar-height) w-9 shrink-0 items-center justify-center text-muted-foreground transition-colors hover:text-foreground hover:bg-muted/50"
				aria-label="Open new tab"
			>
				<Plus className="h-4 w-4" />
			</button>
		</div>
	)
}
