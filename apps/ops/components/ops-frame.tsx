"use client"

import { type FeatureFlag, isEnabled } from "@/lib/features"
import { TabsProvider, useTabs } from "@blazz/tabs"
import { NextTabsInterceptor } from "@blazz/tabs/adapters/next"
import { TabsBar, TabsItem } from "@blazz/tabs/ui"
import { Frame } from "@blazz/ui/components/patterns/frame"
import { TopBar } from "@blazz/ui/components/patterns/top-bar"
import {
	Sidebar,
	useSidebar,
	SidebarCollapsible,
	SidebarCollapsibleContent,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuCollapsibleTrigger,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarResizeHandle,
	SidebarTrigger,
} from "@blazz/ui/components/ui/sidebar"
import {
	Banknote,
	CheckSquare,
	Clock,
	FolderOpen,
	Key,
	LayoutDashboard,
	MessageSquare,
	Package,
	Sun,
	Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { Dispatch, ReactNode, SetStateAction } from "react"
import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react"
import type { BreadcrumbItem } from "./ops-breadcrumb"
import { OpsUserMenu } from "./ops-user-menu"

const navItems: Array<{
	title: string
	url: string
	icon: React.ComponentType
	flag?: FeatureFlag
	items?: Array<{ title: string; url: string; flag?: FeatureFlag }>
}> = [
	{ title: "Dashboard", url: "/", icon: LayoutDashboard, flag: "dashboard" },
	{ title: "Aujourd'hui", url: "/today", icon: Sun, flag: "today" },
	{ title: "Projets", url: "/projects", icon: FolderOpen, flag: "projects" },
	{ title: "Clients", url: "/clients", icon: Users, flag: "clients" },
	{
		title: "Suivi de temps",
		url: "/time",
		icon: Clock,
		flag: "time",
		items: [{ title: "Récapitulatif", url: "/recap", flag: "recap" }],
	},
	{ title: "Finances", url: "/finances", icon: Banknote, flag: "finances" },
	{ title: "Todos", url: "/todos", icon: CheckSquare, flag: "todos" },
	{ title: "Chat", url: "/chat", icon: MessageSquare, flag: "chat" },
	{ title: "Packages", url: "/packages", icon: Package, flag: "packages" },
	{ title: "Licences", url: "/licenses", icon: Key, flag: "licenses" },
]

function OpsSidebar() {
	const pathname = usePathname()

	const isActive = (url?: string) => {
		if (!pathname || !url) return false
		if (url === "/") return pathname === "/"
		return pathname.startsWith(url)
	}

	const hasActiveChild = (items?: { url?: string }[]) =>
		items?.some((sub) => isActive(sub.url)) ?? false

	return (
		<Sidebar collapsible="offcanvas" className="border-r border-edge-subtle gap-2">
			<SidebarHeader className="h-12 justify-center px-5">
				<Link href="/" className="flex items-center">
					<Image src="/logo_blazz_white.svg" alt="Blazz" width={64} height={24} />
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems
								.filter((item) => !item.flag || isEnabled(item.flag))
								.map((item) => {
									const filteredItems = item.items?.filter(
										(sub) => !sub.flag || isEnabled(sub.flag)
									)
									const current = filteredItems?.length
										? { ...item, items: filteredItems }
										: { ...item, items: undefined }

									if (current.items) {
										const isParentActive = isActive(current.url) && !hasActiveChild(current.items)
										return (
											<SidebarCollapsible
												key={current.url}
												open={isActive(current.url) || hasActiveChild(current.items)}
											>
												<SidebarMenuItem>
													<SidebarMenuCollapsibleTrigger
														spacing="compact"
														asChild
														isActive={isParentActive}
													>
														<Link href={current.url}>
															<current.icon />
															<span>{current.title}</span>
														</Link>
													</SidebarMenuCollapsibleTrigger>
													<SidebarCollapsibleContent>
														<SidebarMenuSub>
															{current.items.map((sub) => (
																<SidebarMenuSubItem key={sub.url} isActive={isActive(sub.url)}>
																	<SidebarMenuSubButton asChild isActive={isActive(sub.url)}>
																		<Link href={sub.url}>{sub.title}</Link>
																	</SidebarMenuSubButton>
																</SidebarMenuSubItem>
															))}
														</SidebarMenuSub>
													</SidebarCollapsibleContent>
												</SidebarMenuItem>
											</SidebarCollapsible>
										)
									}
									return (
										<SidebarMenuItem key={current.url}>
											<SidebarMenuButton asChild isActive={isActive(current.url)}>
												<Link href={current.url}>
													<current.icon />
													<span>{current.title}</span>
												</Link>
											</SidebarMenuButton>
										</SidebarMenuItem>
									)
								})}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
			</SidebarContent>
			<SidebarFooter>
				<OpsUserMenu />
			</SidebarFooter>
			<SidebarResizeHandle />
		</Sidebar>
	)
}

// ---------------------------------------------------------------------------
// Top bar state (breadcrumbs + actions) — set by each page via useOpsTopBar
// ---------------------------------------------------------------------------

interface OpsTopBarState {
	breadcrumbs: BreadcrumbItem[] | null
	actions: ReactNode
}

const OpsTopBarCtx = createContext<Dispatch<SetStateAction<OpsTopBarState>>>(() => {})

export function useOpsTopBar(items: BreadcrumbItem[] | null, actions?: ReactNode) {
	const set = useContext(OpsTopBarCtx)
	useEffect(() => {
		set({ breadcrumbs: items, actions: actions ?? null })
		return () => set({ breadcrumbs: null, actions: null })
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [set, items, actions])
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const titleFromPathname = (pathname: string) => {
	const flat = navItems.flatMap((item) => [item, ...(item.items ?? [])])
	const match = flat.find((item) => {
		if (item.url === "/") return pathname === "/"
		return pathname.startsWith(item.url)
	})
	if (match) return match.title
	const last = pathname.split("/").filter(Boolean).pop()
	return last ? last.charAt(0).toUpperCase() + last.slice(1) : "Dashboard"
}

/** Set to true when a tab click triggers navigation — prevents URL sync from interfering */
const tabClickNavRef = { current: false }

// ---------------------------------------------------------------------------
// Tab bar UI
// ---------------------------------------------------------------------------

function OpsTabBar() {
	const { tabs, activeTabId, showTabBar, activateTab, closeTab, addTab } = useTabs()
	const router = useRouter()

	if (!showTabBar) return null

	return (
		<TabsBar
			className="border-t-0 border-b border-edge-subtle bg-surface-0"
			onAddTab={() => {
				addTab({ url: "/", title: "Dashboard", deduplicate: false })
				router.push("/")
			}}
		>
			{tabs.map((tab) => (
				<TabsItem
					key={tab.id}
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
					className="bg-surface-1 text-fg-secondary hover:bg-surface-2 hover:text-fg"
					activeClassName="bg-surface-2 text-fg"
				/>
			))}
		</TabsBar>
	)
}

// ---------------------------------------------------------------------------
// Mobile header
// ---------------------------------------------------------------------------

function MobileHeader() {
	return (
		<div className="flex md:hidden h-10 items-center gap-2 border-b border-edge-subtle bg-surface-3 px-3">
			<SidebarTrigger />
			<Link href="/">
				<Image src="/logo_blazz_white.svg" alt="Blazz" width={64} height={24} />
			</Link>
		</div>
	)
}

// ---------------------------------------------------------------------------
// Top bar content (breadcrumbs + actions)
// ---------------------------------------------------------------------------

function OpsTopBarContent({ state }: { state: OpsTopBarState }) {
	const sidebar = useSidebar()
	const sidebarCollapsed = sidebar.state === "collapsed"

	if (!state.breadcrumbs) {
		if (!sidebarCollapsed) return null
		return (
			<div className="flex h-10 items-center px-3">
				<TopBar.SidebarToggle />
			</div>
		)
	}

	return (
		<TopBar
			className="bg-surface-1 border-b border-edge-subtle"
			left={
				<>
					<TopBar.SidebarToggle />
					<TopBar.Breadcrumbs items={state.breadcrumbs} />
				</>
			}
			right={state.actions}
		/>
	)
}

// ---------------------------------------------------------------------------
// OpsFrame — outer shell wraps TabsProvider, inner shell has tabs + breadcrumbs
// ---------------------------------------------------------------------------

export function OpsFrame({ children }: { children: ReactNode }) {
	const pathname = usePathname()
	// Stable ref — only captures the pathname at first mount
	// eslint-disable-next-line react-hooks/exhaustive-deps
	const defaultTab = useMemo(() => ({ url: pathname, title: titleFromPathname(pathname) }), [])
	return (
		<TabsProvider storageKey="ops-tabs" alwaysShowTabBar defaultTab={defaultTab}>
			<OpsFrameInner>{children}</OpsFrameInner>
		</TabsProvider>
	)
}

function OpsFrameInner({ children }: { children: ReactNode }) {
	const pathname = usePathname()
	const { activeTabId, updateActiveTabUrl, updateTabTitle } = useTabs()
	const [topBar, setTopBar] = useState<OpsTopBarState>({
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
			// Set title from pathname immediately — breadcrumbs will override if the page sets them
			updateTabTitle(activeTabId, titleFromPathname(pathname))
		}
		prevPathnameRef.current = pathname
	}, [pathname, activeTabId, updateActiveTabUrl, updateTabTitle])

	// --- Title sync: only fire when breadcrumbs change, NOT when active tab changes ---
	// Reading activeTabId from a ref prevents the effect from firing on tab switch,
	// which would apply stale breadcrumbs (from the previous page) to the newly active tab.
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
		<OpsTopBarCtx.Provider value={setTopBar}>
			<SidebarProvider>
				<Frame
					navigation={<OpsSidebar />}
					tabBar={
						<>
							<MobileHeader />
							<OpsTabBar />
							<OpsTopBarContent state={topBar} />
						</>
					}
				>
					<NextTabsInterceptor titleResolver={titleFromPathname} />
					{children}
				</Frame>
			</SidebarProvider>
		</OpsTopBarCtx.Provider>
	)
}
