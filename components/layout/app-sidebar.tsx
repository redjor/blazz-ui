"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import {
	Sidebar,
	SidebarCollapsible,
	SidebarCollapsibleContent,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuCollapsibleTrigger,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
} from "@/components/ui/sidebar"
import type { NavigationItem, NavigationSection, SidebarConfig } from "@/types/navigation"

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	config: SidebarConfig
}

/**
 * AppSidebar - Sidebar simple avec navigation hiérarchique
 */

export function AppSidebar({ config, ...props }: AppSidebarProps) {
	const pathname = usePathname()

	// Vérifie si une URL est active
	const isActive = (url?: string) => {
		if (!pathname || !url) return false
		if (url === "/") return pathname === "/"
		return pathname.startsWith(url)
	}

	return (
		<Sidebar collapsible="none" {...props} className="w-[240px] top-[56px]">
			<SidebarContent>
				{config.navigation.map((section) => (
					<NavSection key={section.id || section.title} section={section} isActive={isActive} />
				))}
			</SidebarContent>
			<SidebarRail />
		</Sidebar>
	)
}

/**
 * Section de navigation
 */
function NavSection({
	section,
	isActive,
}: {
	section: NavigationSection
	isActive: (url?: string) => boolean
}) {
	// Section simple
	return (
		<SidebarGroup>
			{section.title && <SidebarGroupLabel>{section.title}</SidebarGroupLabel>}
			<SidebarGroupContent>
				<SidebarMenu>
					{section.items.map((item) => (
						<NavItem key={item.id || item.url || item.title} item={item} isActive={isActive} />
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}

/**
 * Item de navigation (avec ou sans sous-items)
 */
function NavItem({
	item,
	isActive,
}: {
	item: NavigationItem
	isActive: (url?: string) => boolean
}) {
	const hasChildren = item.items && item.items.length > 0
	const [open, setOpen] = React.useState(false)

	// Item avec sous-items (collapsible)
	if (hasChildren) {
		return (
			<SidebarCollapsible open={open} onOpenChange={setOpen}>
				<SidebarMenuItem>
					<SidebarMenuCollapsibleTrigger spacing="compact">
						{item.icon && <item.icon />}
						<span>{item.title}</span>
						<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
					</SidebarMenuCollapsibleTrigger>
					<SidebarCollapsibleContent>
						<SidebarMenuSub>
							{item.items?.map((subItem) => (
								<SidebarMenuSubItem key={subItem.id || subItem.url || subItem.title}>
									<SidebarMenuSubButton asChild isActive={isActive(subItem.url)}>
										<Link href={subItem.url || "#"}>
											{subItem.icon && <subItem.icon />}
											<span>{subItem.title}</span>
										</Link>
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>
							))}
						</SidebarMenuSub>
					</SidebarCollapsibleContent>
				</SidebarMenuItem>
			</SidebarCollapsible>
		)
	}

	// Item simple (sans sous-items)
	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild isActive={isActive(item.url)} disabled={item.disabled}>
				<Link href={item.url || "#"}>
					{item.icon && <item.icon />}
					<span>{item.title}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
}
