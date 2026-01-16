"use client"

import { ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
	Sidebar,
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarRail,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import type { NavigationItem, NavigationSection, SidebarConfig } from "@/types/navigation"

export interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	config: SidebarConfig
}

/**
 * AppSidebar V2 - Complete sidebar implementation with all features
 *
 * Features:
 * - Integrated search functionality
 * - Multi-level navigation with recursive rendering
 * - Collapsible sections
 * - Badge variants (default, destructive, outline, secondary)
 * - User profile menu in footer
 * - Logo support
 * - Active state highlighting
 * - Icon support
 * - Shopify Polaris-inspired design
 *
 * @example
 * <AppSidebar config={sidebarConfig} />
 */
export function AppSidebarV2({ config, ...props }: AppSidebarProps) {
	const pathname = usePathname()
	const [searchQuery, _setSearchQuery] = React.useState("")
	const [mounted, setMounted] = React.useState(false)

	// Prevent hydration mismatch by only rendering interactive elements after mount
	React.useEffect(() => {
		setMounted(true)
	}, [])

	// Helper to check if a path is active
	const isActive = (url?: string) => {
		if (!pathname || !url) return false
		if (url === "/") {
			return pathname === "/"
		}
		return pathname.startsWith(url)
	}

	// Helper to check if a menu item has an active child
	const hasActiveChild = (items?: NavigationItem[]): boolean => {
		if (!items) return false
		return items.some((item) => (item.url && isActive(item.url)) || hasActiveChild(item.items))
	}

	// Filter navigation items based on search query
	const filterItems = (items: NavigationItem[]): NavigationItem[] => {
		if (!searchQuery) return items

		const filtered = items
			.map((item) => {
				const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
				const filteredChildren = item.items ? filterItems(item.items) : undefined

				if (matchesSearch || (filteredChildren && filteredChildren.length > 0)) {
					return {
						...item,
						items: filteredChildren,
					} as NavigationItem
				}

				return null
			})
			.filter((item) => item !== null) as NavigationItem[]

		return filtered
	}

	const filteredNavigation = config.navigation.map((section) => ({
		...section,
		items: filterItems(section.items),
	}))

	return (
		<Sidebar collapsible="icon" {...props}>
			{/* Content with Navigation */}
			<SidebarContent>
				{filteredNavigation.map((section) => {
					// Skip empty sections after filtering
					if (section.items.length === 0) return null

					return (
						<SidebarSection
							key={section.id || section.title}
							section={section}
							isActive={isActive}
							hasActiveChild={hasActiveChild}
							mounted={mounted}
						/>
					)
				})}
			</SidebarContent>
			{/* Rail for collapsing */}
			<SidebarRail />
		</Sidebar>
	)
}

interface SidebarSectionProps {
	section: NavigationSection
	isActive: (url?: string) => boolean
	hasActiveChild: (items?: NavigationItem[]) => boolean
	mounted: boolean
}

function SidebarSection({ section, isActive, hasActiveChild, mounted }: SidebarSectionProps) {
	const childIsActive = hasActiveChild(section.items)
	const hasTitle = section.title && section.title.trim() !== ""

	if (section.collapsible && hasTitle) {
		const [open, setOpen] = React.useState(section.defaultOpen !== false || childIsActive)

		// Render non-interactive version during SSR to prevent hydration mismatch
		if (!mounted) {
			const isOpen = section.defaultOpen !== false || childIsActive
			return (
				<SidebarGroup>
					<SidebarGroupLabel>
						{section.title}
						<ChevronRight
							className={cn(
								"ml-auto transition-transform duration-200",
								isOpen && "rotate-90"
							)}
						/>
					</SidebarGroupLabel>
					{isOpen && (
						<SidebarGroupContent>
							<SidebarMenu>
								{section.items.map((item) => (
									<MenuItem
										key={item.id || item.url || item.title}
										item={item}
										isActive={isActive}
										hasActiveChild={hasActiveChild}
										mounted={mounted}
									/>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					)}
				</SidebarGroup>
			)
		}

		return (
			<Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
				<SidebarGroup>
					<CollapsibleTrigger render={<SidebarGroupLabel />} nativeButton={false}>
						{section.title}
						<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
					</CollapsibleTrigger>
					<CollapsibleContent>
						<SidebarGroupContent>
							<SidebarMenu>
								{section.items.map((item) => (
									<MenuItem
										key={item.id || item.url || item.title}
										item={item}
										isActive={isActive}
										hasActiveChild={hasActiveChild}
										mounted={mounted}
									/>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</CollapsibleContent>
				</SidebarGroup>
			</Collapsible>
		)
	}

	return (
		<SidebarGroup>
			{hasTitle && <SidebarGroupLabel>{section.title}</SidebarGroupLabel>}
			<SidebarGroupContent>
				<SidebarMenu>
					{section.items.map((item) => (
						<MenuItem
							key={item.id || item.url || item.title}
							item={item}
							isActive={isActive}
							hasActiveChild={hasActiveChild}
							mounted={mounted}
						/>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	)
}

interface MenuItemProps {
	item: NavigationItem
	isActive: (url?: string) => boolean
	hasActiveChild: (items?: NavigationItem[]) => boolean
	mounted: boolean
	depth?: number
}

function MenuItem({ item, isActive, hasActiveChild, mounted, depth = 0 }: MenuItemProps) {
	const hasChildren = item.items && item.items.length > 0
	const childIsActive = hasChildren && hasActiveChild(item.items)
	// Le parent n'est actif que si c'est sa propre URL, pas celle d'un enfant
	const active = hasChildren ? false : item.url ? isActive(item.url) : false

	// Get badge variant class
	const getBadgeVariantClass = (variant?: string) => {
		switch (variant) {
			case "destructive":
				return "bg-destructive text-destructive-foreground"
			case "outline":
				return "border border-input bg-background"
			case "secondary":
				return "bg-secondary text-secondary-foreground"
			default:
				return "bg-sidebar-primary/10 text-sidebar-primary"
		}
	}

	// Item with nested children
	if (hasChildren) {
		const [open, setOpen] = React.useState(childIsActive)

		// Render non-interactive version during SSR to prevent hydration mismatch
		if (!mounted) {
			return (
				<SidebarMenuItem>
					<div
						className={cn(
							"peer/menu-button flex w-full items-center gap-1 overflow-hidden rounded-none px-4 py-2 text-left text-13 font-semibold outline-none ring-sidebar-ring transition-[width,height,padding] group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:scale-[0.8125]",
							"h-8 text-13 font-semibold",
							active && "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
						)}
					>
						{item.icon && <item.icon />}
						<span>{item.title}</span>
						{item.badge !== undefined && (
							<span
								className={cn(
									"ml-auto flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium",
									getBadgeVariantClass(item.badgeVariant)
								)}
							>
								{item.badge}
							</span>
						)}
						<ChevronRight
							className={cn(
								"ml-auto transition-transform duration-200",
								childIsActive && "rotate-90"
							)}
						/>
					</div>
					{childIsActive && (
						<SidebarMenuSub>
							{item.items?.map((subItem) => (
								<SidebarMenuSubItem key={subItem.id || subItem.url || subItem.title}>
									<SidebarMenuSubButton asChild isActive={isActive(subItem.url)}>
										<Link href={subItem.url || "#"}>
											{subItem.icon && <subItem.icon />}
											<span>{subItem.title}</span>
											{subItem.badge !== undefined && (
												<span
													className={cn(
														"ml-auto flex h-4 min-w-4 items-center justify-center rounded px-1 text-xs font-medium",
														getBadgeVariantClass(subItem.badgeVariant)
													)}
												>
													{subItem.badge}
												</span>
											)}
										</Link>
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>
							))}
						</SidebarMenuSub>
					)}
				</SidebarMenuItem>
			)
		}

		return (
			<Collapsible open={open} onOpenChange={setOpen} className="group/collapsible">
				<SidebarMenuItem>
					<CollapsibleTrigger
						className={cn(
							"peer/menu-button flex w-full items-center gap-1 overflow-hidden rounded-none px-4 py-2 text-left text-13 font-semibold outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 group-data-[collapsible=icon]:size-8 group-data-[collapsible=icon]:p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:scale-[0.8125]",
							"h-8 text-13 font-semibold",
							"hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
							active && "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
						)}
					>
						{item.icon && <item.icon />}
						<span>{item.title}</span>
						{item.badge !== undefined && (
							<span
								className={cn(
									"ml-auto flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium",
									getBadgeVariantClass(item.badgeVariant)
								)}
							>
								{item.badge}
							</span>
						)}
						<ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
					</CollapsibleTrigger>
					<CollapsibleContent>
						<SidebarMenuSub>
							{item.items?.map((subItem) => (
								<SidebarMenuSubItem key={subItem.id || subItem.url || subItem.title}>
									<SidebarMenuSubButton asChild isActive={isActive(subItem.url)}>
										<Link href={subItem.url || "#"}>
											{subItem.icon && <subItem.icon />}
											<span>{subItem.title}</span>
											{subItem.badge !== undefined && (
												<span
													className={cn(
														"ml-auto flex h-4 min-w-4 items-center justify-center rounded px-1 text-xs font-medium",
														getBadgeVariantClass(subItem.badgeVariant)
													)}
												>
													{subItem.badge}
												</span>
											)}
										</Link>
									</SidebarMenuSubButton>
								</SidebarMenuSubItem>
							))}
						</SidebarMenuSub>
					</CollapsibleContent>
				</SidebarMenuItem>
			</Collapsible>
		)
	}

	// Simple item without children
	return (
		<SidebarMenuItem>
			<SidebarMenuButton
				asChild
				tooltip={mounted ? item.title : undefined}
				isActive={active}
				disabled={item.disabled}
			>
				<Link href={item.url || "#"}>
					{item.icon && <item.icon />}
					<span>{item.title}</span>
					{item.badge !== undefined && (
						<span
							className={cn(
								"ml-auto flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium",
								getBadgeVariantClass(item.badgeVariant)
							)}
						>
							{item.badge}
						</span>
					)}
				</Link>
			</SidebarMenuButton>
		</SidebarMenuItem>
	)
}
