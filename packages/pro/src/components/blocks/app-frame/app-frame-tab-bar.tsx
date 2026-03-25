"use client"

import { useTabs } from "@blazz/tabs"
import { TabsBar, TabsItem, TabsItemOverlay } from "@blazz/tabs/ui"
import { SidebarTrigger, useSidebar } from "@blazz/ui/components/ui/sidebar"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type { ReactNode } from "react"

/** Shared mutable ref — set to true when a tab click triggers navigation */
export const tabClickNavRef = { current: false }

interface AppFrameTabBarProps {
	mobileLogo?: ReactNode
	defaultNewTabUrl?: string
	defaultNewTabTitle?: string
}

export function AppFrameTabBar({
	mobileLogo,
	defaultNewTabUrl = "/",
	defaultNewTabTitle = "Home",
}: AppFrameTabBarProps) {
	const { tabs, activeTabId, showTabBar, activateTab, closeTab, addTab, reorderTabs } = useTabs()
	const sidebar = useSidebar()
	const router = useRouter()

	return (
		<>
			{/* Mobile header */}
			<div className="flex md:hidden h-10 items-center gap-2 border-b border-edge-subtle bg-muted px-3">
				<SidebarTrigger />
				{mobileLogo && (
					<Link href="/">
						{mobileLogo}
					</Link>
				)}
			</div>

			{/* Tab bar */}
			{showTabBar && (
				<div className="flex items-center">
					{sidebar.state === "collapsed" && (
						<SidebarTrigger className="ml-1 mr-1 shrink-0" />
					)}
					<TabsBar
						className="flex-1 border-t-0"
						tabIds={tabs.map((t) => t.id)}
						onReorder={reorderTabs}
						renderDragOverlay={(dragId) => {
							const tab = tabs.find((t) => t.id === dragId)
							if (!tab) return null
							return (
								<TabsItemOverlay
									title={tab.title}
									isActive={tab.id === activeTabId}
									className="bg-background text-fg-secondary"
									activeClassName="bg-card text-fg"
								/>
							)
						}}
						onAddTab={() => {
							const activeTab = tabs.find((t) => t.id === activeTabId)
							const url = activeTab?.url ?? defaultNewTabUrl
							const title = activeTab?.title ?? defaultNewTabTitle
							addTab({ url, title, deduplicate: false })
							router.push(url)
						}}
					>
						{tabs.map((tab) => (
							<TabsItem
								key={tab.id}
								id={tab.id}
								title={tab.title}
								isActive={tab.id === activeTabId}
								onClick={() => {
									tabClickNavRef.current = true
									activateTab(tab.id)
									router.push(tab.url)
								}}
								onClose={tabs.length > 1 ? () => {
									const index = tabs.findIndex((t) => t.id === tab.id)
									const remaining = tabs.filter((t) => t.id !== tab.id)
									closeTab(tab.id)
									if (tab.id === activeTabId && remaining.length > 0) {
										const next = index > 0 ? remaining[index - 1] : remaining[0]
										tabClickNavRef.current = true
										router.push(next.url)
									}
								} : undefined}
								className="bg-background text-fg-secondary hover:bg-card hover:text-fg"
								activeClassName="bg-card text-fg"
							/>
						))}
					</TabsBar>
				</div>
			)}
		</>
	)
}
