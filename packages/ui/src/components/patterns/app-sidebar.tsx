"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { cn } from "../../lib/utils"
import type { NavigationItem, NavigationSection, SidebarConfig } from "../../types/navigation"
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
	SidebarRail,
} from "../ui/sidebar"
import { SidebarUserMenu } from "./sidebar-user"

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	config: SidebarConfig
	header?: React.ReactNode
}

/**
 * Trouve l'ID du parent de l'item actif dans la navigation
 */
function findActiveParentItemId(navigation: NavigationSection[], pathname: string): string | null {
	for (const section of navigation) {
		for (const item of section.items) {
			const itemKey = item.id || item.url || null

			// Si le pathname correspond à ce parent et qu'il a des enfants
			if (item.url && pathname.startsWith(item.url) && item.items) {
				return itemKey
			}

			// Si le pathname correspond à un sous-item
			if (item.items) {
				const hasActiveSubItem = item.items.some(
					(subItem) => subItem.url && pathname.startsWith(subItem.url)
				)
				if (hasActiveSubItem) {
					return itemKey
				}
			}
		}
	}
	return null
}

/**
 * AppSidebar - Sidebar simple avec navigation hiérarchique
 */

export function AppSidebar({ config, header, className, ...props }: AppSidebarProps) {
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
		const activeParentId = findActiveParentItemId(config.navigation, pathname)
		if (activeParentId) {
			setOpenItemId(activeParentId)
		}
	}, [pathname, config.navigation])

	return (
		<Sidebar collapsible="none" {...props} className={cn("w-[240px] top-[56px]", className)}>
			{header && (
				<SidebarHeader className="border-b border-edge-subtle pb-2">{header}</SidebarHeader>
			)}
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
			{config.user && (
				<SidebarFooter>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarUserMenu user={config.user} />
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarFooter>
			)}
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

	// Vérifier si un des sous-items est actif
	const hasActiveChild = hasChildren && item.items?.some((subItem) => isActive(subItem.url))
	// Le parent est actif uniquement si on est sur sa page ET qu'aucun enfant n'est actif
	const isParentActive = isActive(item.url) && !hasActiveChild

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
					<SidebarMenuCollapsibleTrigger spacing="compact" asChild isActive={isParentActive}>
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
