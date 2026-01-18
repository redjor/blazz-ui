"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent } from "@/components/ui/sheet"
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
} from "@/components/ui/sidebar"
import type { NavigationItem, NavigationSection, SidebarConfig } from "@/types/navigation"

interface MobileSidebarSheetProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	config: SidebarConfig
}

export function MobileSidebarSheet({ open, onOpenChange, config }: MobileSidebarSheetProps) {
	const pathname = usePathname()

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

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="left"
				className="w-[240px] p-0 bg-sidebar rounded-t-[10px]"
				topOffset="56px"
			>
				<ScrollArea className="h-full">
					<SidebarContent>
						{config.navigation.map((section) => (
							<NavSection
								key={section.id || section.title}
								section={section}
								isActive={isActive}
								onLinkClick={handleLinkClick}
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
}: {
	section: NavigationSection
	isActive: (url?: string) => boolean
	onLinkClick: () => void
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
}: {
	item: NavigationItem
	isActive: (url?: string) => boolean
	onLinkClick: () => void
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
