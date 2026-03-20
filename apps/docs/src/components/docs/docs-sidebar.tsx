"use client"

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
} from "@blazz/ui/components/ui/sidebar"
import type { NavigationItem, NavigationSection } from "@blazz/ui/types/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import type { SectionId } from "~/config/navigation"
import { getSectionNavigation } from "~/config/navigation"

function findActiveParentItemId(navigation: NavigationSection[], pathname: string): string | null {
	for (const section of navigation) {
		for (const item of section.items) {
			const itemKey = item.id ?? item.url ?? null
			if (item.url && pathname.startsWith(item.url) && item.items) {
				return itemKey
			}
			if (item.items) {
				const hasActiveSubItem = item.items.some(
					(subItem) => subItem.url && pathname.startsWith(subItem.url)
				)
				if (hasActiveSubItem) return itemKey
			}
		}
	}
	return null
}

export function DocsSidebar({ sectionId }: { sectionId: SectionId }) {
	const pathname = usePathname()
	const [openItemId, setOpenItemId] = React.useState<string | null>(null)
	const section = getSectionNavigation(sectionId)

	const isActive = (url?: string) => {
		if (!url) return false
		if (url === "/") return pathname === "/"
		return pathname.startsWith(url)
	}

	React.useEffect(() => {
		if (!section) return
		const activeParentId = findActiveParentItemId([section], pathname)
		if (activeParentId) setOpenItemId(activeParentId)
	}, [pathname, section])

	if (!section) return null

	return (
		<Sidebar
			collapsible="none"
			className="hidden lg:flex rounded-lg overflow-hidden border border-container"
		>
			<SidebarContent>
				<NavSection
					section={{ ...section, title: undefined }}
					isActive={isActive}
					openItemId={openItemId}
					setOpenItemId={setOpenItemId}
				/>
			</SidebarContent>
		</Sidebar>
	)
}

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
							key={item.id ?? item.url ?? item.title}
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
						<Link href={item.url ?? "/"}>
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
										<Link href={sub.url ?? "/"}>
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
				<Link href={item.url ?? "/"}>
					{item.icon && <item.icon />}
					<span>{item.title}</span>
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
}
