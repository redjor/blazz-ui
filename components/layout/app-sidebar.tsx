"use client"

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
	const [openItemId, setOpenItemId] = React.useState<string | null>(null)

	// Vérifie si une URL est active
	const isActive = (url?: string) => {
		if (!pathname || !url) return false
		if (url === "/") return pathname === "/"
		return pathname.startsWith(url)
	}

	// Trouver le parent de l'item actif et l'ouvrir automatiquement
	React.useEffect(() => {
		for (const section of config.navigation) {
			for (const item of section.items) {
				// Si le pathname correspond à ce parent
				if (item.url && pathname.startsWith(item.url) && item.items) {
					setOpenItemId(item.id || item.url)
					return
				}
				// Si le pathname correspond à un sous-item
				if (item.items) {
					for (const subItem of item.items) {
						if (subItem.url && pathname.startsWith(subItem.url)) {
							setOpenItemId(item.id || item.url)
							return
						}
					}
				}
			}
		}
	}, [pathname, config.navigation])

	return (
		<Sidebar collapsible="none" {...props} className="w-[240px] top-[56px]">
			<SidebarContent>
				{config.navigation.map((section) => (
					<NavSection
						key={section.id || section.title}
						section={section}
						isActive={isActive}
						openItemId={openItemId}
						setOpenItemId={setOpenItemId}
					/>
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
	openItemId,
	setOpenItemId,
}: {
	section: NavigationSection
	isActive: (url?: string) => boolean
	openItemId: string | null
	setOpenItemId: (id: string | null) => void
}) {
	return (
		<SidebarGroup>
			{section.title && <SidebarGroupLabel>{section.title}</SidebarGroupLabel>}
			<SidebarGroupContent>
				<SidebarMenu>
					{section.items.map((item) => (
						<NavItem
							key={item.id || item.url || item.title}
							item={item}
							isActive={isActive}
							openItemId={openItemId}
							setOpenItemId={setOpenItemId}
						/>
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
	openItemId,
	setOpenItemId,
}: {
	item: NavigationItem
	isActive: (url?: string) => boolean
	openItemId: string | null
	setOpenItemId: (id: string | null) => void
}) {
	const hasChildren = item.items && item.items.length > 0
	const itemKey = item.id || item.url || item.title
	const isOpen = openItemId === itemKey

	// Item avec sous-items (collapsible)
	if (hasChildren) {
		return (
			<SidebarCollapsible
				open={isOpen}
				onOpenChange={(newOpen) => {
					// Ouvrir uniquement (pas de toggle pour fermer)
					if (newOpen) {
						setOpenItemId(itemKey)
					}
				}}
			>
				<SidebarMenuItem>
					<SidebarMenuCollapsibleTrigger spacing="compact" asChild>
						<Link href={item.url || "#"}>
							{item.icon && <item.icon />}
							<span>{item.title}</span>
						</Link>
					</SidebarMenuCollapsibleTrigger>
					<SidebarCollapsibleContent>
						<SidebarMenuSub>
							{item.items?.map((subItem) => (
								<SidebarMenuSubItem
									key={subItem.id || subItem.url || subItem.title}
									isActive={isActive(subItem.url)}
								>
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
