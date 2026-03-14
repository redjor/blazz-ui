"use client"

import { ScrollArea } from "@blazz/ui/components/ui/scroll-area"
import { Sheet, SheetContent } from "@blazz/ui/components/ui/sheet"
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
} from "@blazz/ui/components/ui/sidebar"
import { cn } from "@blazz/ui/lib/utils"
import type { NavigationItem, NavigationSection } from "@blazz/ui/types/navigation"
import { Link, useLocation } from "@tanstack/react-router"
import * as React from "react"
import type { SectionId } from "~/config/navigation"
import { getSectionNavigation, sectionTabs } from "~/config/navigation"

interface DocsMobileSheetProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	sectionId: SectionId
}

export function DocsMobileSheet({ open, onOpenChange, sectionId }: DocsMobileSheetProps) {
	const { pathname } = useLocation()
	const [openItemId, setOpenItemId] = React.useState<string | null>(null)
	const section = getSectionNavigation(sectionId)

	const isActive = (url?: string) => {
		if (!url) return false
		if (url === "/") return pathname === "/"
		return pathname.startsWith(url)
	}

	const handleLinkClick = () => onOpenChange(false)

	React.useEffect(() => {
		if (!section) return
		for (const item of section.items) {
			if (item.url && pathname.startsWith(item.url) && item.items) {
				setOpenItemId(item.id ?? item.url ?? null)
				return
			}
			if (item.items) {
				for (const sub of item.items) {
					if (sub.url && pathname.startsWith(sub.url)) {
						setOpenItemId(item.id ?? item.url ?? null)
						return
					}
				}
			}
		}
	}, [pathname, section])

	return (
		<Sheet open={open} onOpenChange={onOpenChange}>
			<SheetContent
				side="left"
				className="w-(--sidebar-width) p-0 bg-surface"
				topOffset="var(--topbar-height)"
			>
				<ScrollArea className="h-full">
					{/* Section tabs for mobile */}
					<div className="flex gap-1 p-3 border-b border-container">
						{sectionTabs.map((tab) => (
							<Link
								key={tab.id}
								to={tab.defaultUrl}
								onClick={handleLinkClick}
								className={cn(
									"px-3 py-1.5 text-sm rounded-md transition-colors whitespace-nowrap",
									sectionId === tab.id
										? "text-fg font-medium bg-surface-3"
										: "text-fg-muted hover:text-fg"
								)}
							>
								{tab.label}
							</Link>
						))}
					</div>
					{/* Filtered sidebar content */}
					{section && (
						<SidebarContent>
							<NavSection
								section={{ ...section, title: undefined }}
								isActive={isActive}
								onLinkClick={handleLinkClick}
								openItemId={openItemId}
								setOpenItemId={setOpenItemId}
							/>
						</SidebarContent>
					)}
				</ScrollArea>
			</SheetContent>
		</Sheet>
	)
}

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
							key={item.id ?? item.url ?? item.title}
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
	const hasChildren = (item.items?.length ?? 0) > 0
	const itemKey = item.id ?? item.url ?? item.title
	const isOpen = openItemId === itemKey
	const hasActiveChild = hasChildren && item.items?.some((sub) => isActive(sub.url))
	const isParentActive = isActive(item.url) && !hasActiveChild

	if (hasChildren) {
		return (
			<SidebarCollapsible
				open={isOpen}
				onOpenChange={(newOpen) => {
					if (newOpen) setOpenItemId(itemKey)
				}}
			>
				<SidebarMenuItem>
					<SidebarMenuCollapsibleTrigger spacing="compact" asChild isActive={isParentActive}>
						<Link to={item.url ?? "/"} onClick={onLinkClick}>
							{item.icon && <item.icon />}
							<span>{item.title}</span>
						</Link>
					</SidebarMenuCollapsibleTrigger>
					<SidebarCollapsibleContent>
						<SidebarMenuSub>
							{item.items?.map((sub) => (
								<SidebarMenuSubItem
									key={sub.id ?? sub.url ?? sub.title}
									isActive={isActive(sub.url)}
								>
									<SidebarMenuSubButton asChild isActive={isActive(sub.url)}>
										<Link to={sub.url ?? "/"} onClick={onLinkClick}>
											{sub.icon && <sub.icon />}
											<span>{sub.title}</span>
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

	return (
		<SidebarMenuItem>
			<SidebarMenuButton asChild isActive={isActive(item.url)}>
				<Link to={item.url ?? "/"} onClick={onLinkClick}>
					{item.icon && <item.icon />}
					<span>{item.title}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
}
