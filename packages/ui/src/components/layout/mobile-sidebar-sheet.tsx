"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { ScrollArea } from "../ui/scroll-area"
import { Sheet, SheetContent } from "../ui/sheet"
import {
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
} from "../ui/sidebar"
import type { NavigationItem, NavigationSection, SidebarConfig } from "../../types/navigation"

interface MobileSidebarSheetProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	config: SidebarConfig
}

export function MobileSidebarSheet({ open, onOpenChange, config }: MobileSidebarSheetProps) {
	const pathname = usePathname()
	const [openItemId, setOpenItemId] = React.useState<string | null>(null)

	// Vérifie si une URL est active
	const isActive = (url?: string) => {
		if (!pathname || !url) return false
		if (url === "/") return pathname === "/"
		return pathname.startsWith(url)
	}

	// Ferme le Sheet quand on clique sur un lien
	const handleLinkClick = () => {
		onOpenChange(false)
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
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="left"
				className="w-(--sidebar-width) p-0 bg-surface rounded-(--main-radius)"
				topOffset="var(--topbar-height)"
			>
				<ScrollArea className="h-full">
					<SidebarContent>
						{config.navigation.map((section) => (
							<NavSection
								key={section.id || section.title}
								section={section}
								isActive={isActive}
								onLinkClick={handleLinkClick}
								openItemId={openItemId}
								setOpenItemId={setOpenItemId}
							/>
						))}
					</SidebarContent>
				</ScrollArea>
			</SheetContent>
		</Sheet>
	)
}

/**
 * Section de navigation pour mobile
 */
function NavSection({
	section,
	isActive,
	onLinkClick,
	openItemId,
	setOpenItemId,
}: {
	section: NavigationSection
	isActive: (url?: string) => boolean
	onLinkClick: () => void
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
							onLinkClick={onLinkClick}
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
 * Item de navigation mobile (avec ou sans sous-items)
 */
function NavItem({
	item,
	isActive,
	onLinkClick,
	openItemId,
	setOpenItemId,
}: {
	item: NavigationItem
	isActive: (url?: string) => boolean
	onLinkClick: () => void
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
						<Link href={item.url || "#"} onClick={onLinkClick}>
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
										<Link href={subItem.url || "#"} onClick={onLinkClick}>
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
				<Link href={item.url || "#"} onClick={onLinkClick}>
					{item.icon && <item.icon />}
					<span>{item.title}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
}
