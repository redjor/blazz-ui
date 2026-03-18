"use client"

import { TabsProvider, useTabs } from "@blazz/tabs"
import { NextTabsInterceptor } from "@blazz/tabs/adapters/next"
import { Frame } from "@blazz/ui/components/patterns/frame"
import { SidebarProvider } from "@blazz/ui/components/ui/sidebar"
import { usePathname } from "next/navigation"
import type { Dispatch, ReactNode, SetStateAction } from "react"
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import { AppFrameSidebar } from "./app-frame-sidebar"
import { AppFrameTabBar, tabClickNavRef } from "./app-frame-tab-bar"
import { AppFrameTopBar } from "./app-frame-top-bar"
import type { AppFrameProps, AppTopBarState, BreadcrumbItem, NavGroup, NavItem } from "./types"
import { flattenNavGroups, toNavGroups } from "./types"

// ---------------------------------------------------------------------------
// Top bar context — pages set breadcrumbs + actions via useAppTopBar
// ---------------------------------------------------------------------------

const AppTopBarCtx = createContext<Dispatch<SetStateAction<AppTopBarState>>>(() => {})

export function useAppTopBar(items: BreadcrumbItem[] | null, actions?: ReactNode) {
	const set = useContext(AppTopBarCtx)
	useEffect(() => {
		set({ breadcrumbs: items, actions: actions ?? null })
		return () => set({ breadcrumbs: null, actions: null })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [set, items, actions])
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

export function makeTitleResolver(navItems: NavItem[]) {
	return (pathname: string) => {
		const flat = navItems.flatMap((item) => [item, ...(item.children ?? [])])
		const match = flat.find((item) => {
			if (item.url === "/") return pathname === "/"
			return pathname.startsWith(item.url)
		})
		if (match) return match.title
		const last = pathname.split("/").filter(Boolean).pop()
		return last ? last.charAt(0).toUpperCase() + last.slice(1) : "Home"
	}
}

// ---------------------------------------------------------------------------
// AppFrame — outer shell, conditionally wraps TabsProvider
// ---------------------------------------------------------------------------

export function AppFrame({
	logo,
	navItems,
	sidebarFooter,
	sidebarCollapsible = "offcanvas",
	tabs,
	rounded: _rounded,
	className,
	children,
}: AppFrameProps) {
	const groups = useMemo(() => toNavGroups(navItems), [navItems])
	const titleResolver = useMemo(() => makeTitleResolver(flattenNavGroups(groups)), [groups])

	if (tabs) {
		return (
			<AppFrameWithTabs
				logo={logo}
				navGroups={groups}
				sidebarFooter={sidebarFooter}
				sidebarCollapsible={sidebarCollapsible}
				tabs={tabs}
				className={className}
				titleResolver={titleResolver}
			>
				{children}
			</AppFrameWithTabs>
		)
	}

	return (
		<AppFrameNoTabs
			logo={logo}
			navGroups={groups}
			sidebarFooter={sidebarFooter}
			sidebarCollapsible={sidebarCollapsible}
			className={className}
		>
			{children}
		</AppFrameNoTabs>
	)
}

// ---------------------------------------------------------------------------
// With tabs — wraps in TabsProvider + uses tabs hooks
// ---------------------------------------------------------------------------

interface AppFrameWithTabsProps extends Omit<AppFrameProps, "tabs" | "rounded" | "navItems"> {
	navGroups: NavGroup[]
	tabs: NonNullable<AppFrameProps["tabs"]>
	titleResolver: (pathname: string) => string
}

function AppFrameWithTabs({
	logo,
	navGroups,
	sidebarFooter,
	sidebarCollapsible,
	tabs,
	className,
	titleResolver,
	children,
}: AppFrameWithTabsProps) {
	const pathname = usePathname()
	// Stable ref — only captures the pathname at first mount
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const defaultTab = useMemo(() => ({ url: pathname, title: titleResolver(pathname) }), [])

	return (
		<TabsProvider
			storageKey={tabs.storageKey}
			alwaysShowTabBar={tabs.alwaysShow}
			defaultTab={defaultTab}
		>
			<AppFrameWithTabsInner
				logo={logo}
				navGroups={navGroups}
				sidebarFooter={sidebarFooter}
				sidebarCollapsible={sidebarCollapsible}
				className={className}
				titleResolver={titleResolver}
			>
				{children}
			</AppFrameWithTabsInner>
		</TabsProvider>
	)
}

interface AppFrameWithTabsInnerProps {
	logo?: ReactNode
	navGroups: NavGroup[]
	sidebarFooter?: ReactNode
	sidebarCollapsible?: "offcanvas" | "icon" | "none"
	className?: string
	titleResolver: (pathname: string) => string
	children: ReactNode
}

function AppFrameWithTabsInner({
	logo,
	navGroups,
	sidebarFooter,
	sidebarCollapsible,
	className,
	titleResolver,
	children,
}: AppFrameWithTabsInnerProps) {
	const pathname = usePathname()
	const { activeTabId, updateActiveTabUrl, updateTabTitle } = useTabs()
	const [topBar, setTopBar] = useState<AppTopBarState>({
		breadcrumbs: null,
		actions: null,
	})

	// Track previous pathname to detect navigation
	const prevPathnameRef = useRef(pathname)

	// --- URL sync: sidebar navigation updates the active tab's URL ---
	useEffect(() => {
		if (!pathname || !activeTabId) return

		// Tab click already handled activation — skip
		if (tabClickNavRef.current) {
			tabClickNavRef.current = false
			return
		}

		// Only update if pathname actually changed (not just a re-render)
		if (pathname !== prevPathnameRef.current) {
			updateActiveTabUrl(pathname)
			updateTabTitle(activeTabId, titleResolver(pathname))
		}
		prevPathnameRef.current = pathname
	}, [pathname, activeTabId, updateActiveTabUrl, updateTabTitle, titleResolver])

	// --- Title sync: only fire when breadcrumbs change ---
	const activeTabIdRef = useRef(activeTabId)
	activeTabIdRef.current = activeTabId

	useEffect(() => {
		const tabId = activeTabIdRef.current
		if (!tabId || !topBar.breadcrumbs || topBar.breadcrumbs.length === 0) return
		const last = topBar.breadcrumbs[topBar.breadcrumbs.length - 1]
		if (last.label) {
			updateTabTitle(tabId, last.label)
		}
	}, [topBar.breadcrumbs, updateTabTitle])

	return (
		<AppTopBarCtx.Provider value={setTopBar}>
			<SidebarProvider>
				<Frame
					navigation={
						<AppFrameSidebar
							logo={logo}
							navGroups={navGroups}
							footer={sidebarFooter}
							collapsible={sidebarCollapsible}
						/>
					}
					tabBar={
						<AppFrameTabBar
							mobileLogo={logo}
							defaultNewTabUrl="/"
							defaultNewTabTitle="Home"
						/>
					}
					header={<AppFrameTopBar state={topBar} />}
					className={className}
				>
					<NextTabsInterceptor titleResolver={titleResolver} />
					{children}
				</Frame>
			</SidebarProvider>
		</AppTopBarCtx.Provider>
	)
}

// ---------------------------------------------------------------------------
// Without tabs — simpler variant, no TabsProvider
// ---------------------------------------------------------------------------

interface AppFrameNoTabsProps {
	logo?: ReactNode
	navGroups: NavGroup[]
	sidebarFooter?: ReactNode
	sidebarCollapsible?: "offcanvas" | "icon" | "none"
	className?: string
	children: ReactNode
}

function AppFrameNoTabs({
	logo,
	navGroups,
	sidebarFooter,
	sidebarCollapsible,
	className,
	children,
}: AppFrameNoTabsProps) {
	const [topBar, setTopBar] = useState<AppTopBarState>({
		breadcrumbs: null,
		actions: null,
	})

	return (
		<AppTopBarCtx.Provider value={setTopBar}>
			<SidebarProvider>
				<Frame
					navigation={
						<AppFrameSidebar
							logo={logo}
							navGroups={navGroups}
							footer={sidebarFooter}
							collapsible={sidebarCollapsible}
						/>
					}
					header={<AppFrameTopBar state={topBar} />}
					className={className}
				>
					{children}
				</Frame>
			</SidebarProvider>
		</AppTopBarCtx.Provider>
	)
}
