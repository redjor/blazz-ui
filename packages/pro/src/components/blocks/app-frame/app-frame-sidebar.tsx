"use client"

import {
	Sidebar,
	SidebarCollapsible,
	SidebarCollapsibleContent,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuCollapsibleTrigger,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarResizeHandle,
} from "@blazz/ui/components/ui/sidebar"
import { Badge } from "@blazz/ui"
import Link from "next/link"
import { usePathname } from "next/navigation"
import type { ReactNode } from "react"
import type { NavGroup, NavItem } from "./types"

interface AppFrameSidebarProps {
	logo?: ReactNode
	navGroups: NavGroup[]
	footer?: ReactNode
	collapsible?: "offcanvas" | "icon" | "none"
}

export function AppFrameSidebar({
	logo,
	navGroups,
	footer,
	collapsible = "offcanvas",
}: AppFrameSidebarProps) {
	const pathname = usePathname()

	const isActive = (url?: string) => {
		if (!pathname || !url) return false
		if (url === "/") return pathname === "/"
		return pathname.startsWith(url)
	}

	const hasActiveChild = (items?: { url?: string }[]) =>
		items?.some((sub) => isActive(sub.url)) ?? false

	const renderItem = (item: NavItem) => {
		if (item.children?.length) {
			const isParentActive =
				isActive(item.url) && !hasActiveChild(item.children)
			return (
				<SidebarCollapsible
					key={item.url}
					open={isActive(item.url) || hasActiveChild(item.children)}
				>
					<SidebarMenuItem>
						<SidebarMenuCollapsibleTrigger
							spacing="compact"
							asChild
							isActive={isParentActive}
						>
							<Link href={item.url}>
								{item.icon && <item.icon />}
								<span>{item.title}</span>
							</Link>
						</SidebarMenuCollapsibleTrigger>
						<SidebarCollapsibleContent>
							<SidebarMenuSub>
								{item.children.map((sub) => (
									<SidebarMenuSubItem
										key={sub.url}
										isActive={isActive(sub.url)}
									>
										<SidebarMenuSubButton
											asChild
											isActive={isActive(sub.url)}
										>
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
						{item.icon && <item.icon />}
						<span className="flex-1">{item.title}</span>
						{item.badge != null && (
							<Badge variant="default" className="ml-auto text-[10px]">
								{item.badge}
							</Badge>
						)}
					</Link>
				</SidebarMenuButton>
			</SidebarMenuItem>
		)
	}

	return (
		<Sidebar collapsible={collapsible} className="gap-2">
			{logo && (
				<SidebarHeader className="h-12 justify-center px-5">
					<Link href="/" className="flex items-center">
						{logo}
					</Link>
				</SidebarHeader>
			)}
			<SidebarContent>
				{navGroups.map((group, i) => (
					<SidebarGroup key={group.label ?? `group-${i}`}>
						{group.label && <SidebarGroupLabel>{group.label}</SidebarGroupLabel>}
						<SidebarGroupContent>
							<SidebarMenu>
								{group.items.map(renderItem)}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				))}
			</SidebarContent>
			{footer && <SidebarFooter>{footer}</SidebarFooter>}
			<SidebarResizeHandle />
		</Sidebar>
	)
}
