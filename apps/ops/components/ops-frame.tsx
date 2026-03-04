"use client"

import type { Dispatch, ReactNode, SetStateAction } from "react"
import { createContext, useContext, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Sun, Users, Clock, CheckSquare } from "lucide-react"
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	SidebarRail,
	SidebarCollapsible,
	SidebarCollapsibleContent,
	SidebarMenuCollapsibleTrigger,
} from "@blazz/ui/components/ui/sidebar"
import { OpsBreadcrumb, type BreadcrumbItem } from "./ops-breadcrumb"
import { OpsUserMenu } from "./ops-user-menu"
import { Frame } from "@blazz/ui/components/patterns/frame"

const navItems = [
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
		<Sidebar collapsible="none" className="w-[240px] top-0">
			<SidebarHeader className="border-b border-edge-subtle pb-2">
				<Link href="/" className="flex items-center p-2">
					<Image src="/logo_blazz_white.svg" alt="Blazz" width={87} height={24} />
				</Link>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{navItems.map((item) => {
								if (item.items) {
									const isParentActive = isActive(item.url) && !hasActiveChild(item.items)
									return (
										<SidebarCollapsible
											key={item.url}
											open={isActive(item.url) || hasActiveChild(item.items)}
										>
											<SidebarMenuItem>
												<SidebarMenuCollapsibleTrigger spacing="compact" asChild isActive={isParentActive}>
													<Link href={item.url}>
														<item.icon />
														<span>{item.title}</span>
													</Link>
												</SidebarMenuCollapsibleTrigger>
												<SidebarCollapsibleContent>
													<SidebarMenuSub>
														{item.items.map((sub) => (
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
									<SidebarMenuItem key={item.url}>
										<SidebarMenuButton asChild isActive={isActive(item.url)}>
											<Link href={item.url}>
												<item.icon />
												<span>{item.title}</span>
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
				<SidebarMenu>
					<SidebarMenuItem>
						<OpsUserMenu />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	)
}

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
				<Frame
					navigation={<OpsSidebar />}
					tabBar={items ? <OpsBreadcrumb items={items} /> : undefined}
				>
					{children}
				</Frame>
			</SidebarProvider>
		</OpsTopBarCtx.Provider>
	)
}
