"use client"

import { type FeatureFlag, isEnabled } from "@/lib/features"
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
import { usePathname } from "next/navigation"
import type { Dispatch, ReactNode, SetStateAction } from "react"
import { createContext, useContext, useEffect, useState } from "react"
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

export function OpsFrame({ children }: { children: ReactNode }) {
	const [state, setState] = useState<OpsTopBarState>({
		breadcrumbs: null,
		actions: null,
	})
	return (
		<OpsTopBarCtx.Provider value={setState}>
			<SidebarProvider>
				<Frame
					navigation={<OpsSidebar />}
					tabBar={
						<>
							<MobileHeader />
							<OpsTopBarContent state={state} />
						</>
					}
				>
					{children}
				</Frame>
			</SidebarProvider>
		</OpsTopBarCtx.Provider>
	)
}
