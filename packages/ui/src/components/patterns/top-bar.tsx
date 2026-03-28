"use client"

import { PanelLeft } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import { cn } from "../../lib/utils"
import { Breadcrumb, BreadcrumbItem, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb"
import { Button } from "../ui/button"
import { useSidebarSafe } from "../ui/sidebar"

import { type Breadcrumb as BreadcrumbItemType, useFrameSafe } from "./frame-context"

/* ─── TopBar ─────────────────────────────────────────────── */

export interface TopBarProps {
	left?: React.ReactNode
	right?: React.ReactNode
	className?: string
	children?: React.ReactNode
}

/**
 * TopBar — Composable content-area header.
 *
 * Use `left` / `right` slots, or pass `children` for full control.
 * Compound components:
 * - `TopBar.SidebarToggle` — shows when sidebar is collapsed
 * - `TopBar.Breadcrumbs` — renders breadcrumb items
 *
 * @example
 * <TopBar
 *   left={
 *     <>
 *       <TopBar.SidebarToggle />
 *       <TopBar.Breadcrumbs items={[
 *         { label: "Contacts", href: "/contacts" },
 *         { label: "Jean Dupont" },
 *       ]} />
 *     </>
 *   }
 *   right={
 *     <>
 *       <Button variant="outline" size="sm">Exporter</Button>
 *       <Button size="sm">+ Ajouter</Button>
 *     </>
 *   }
 * />
 */
export function TopBar({ left, right, className, children }: TopBarProps) {
	return (
		<header className={cn("flex h-12 shrink-0 items-center gap-2 bg-card px-4", className)}>
			{children ? (
				children
			) : (
				<>
					{left && <div className="flex min-w-0 flex-1 items-center gap-2">{left}</div>}
					{right && <div className="ml-auto flex shrink-0 items-center gap-2">{right}</div>}
				</>
			)}
		</header>
	)
}

/* ─── TopBar.SidebarToggle ───────────────────────────────── */

interface SidebarToggleProps {
	className?: string
}

export function SidebarToggle({ className }: SidebarToggleProps) {
	const sidebar = useSidebarSafe()

	// No sidebar context → nothing to toggle
	if (!sidebar) return null
	// Desktop with expanded sidebar → toggle not needed
	if (!sidebar.isMobile && sidebar.state === "expanded") return null

	return (
		<Button
			variant="ghost"
			size="icon-sm"
			onClick={sidebar.toggleSidebar}
			onMouseEnter={sidebar.startPeek}
			onMouseLeave={sidebar.stopPeek}
			className={cn("shrink-0", className)}
			aria-label="Afficher la sidebar"
		>
			<PanelLeft className="size-4" />
		</Button>
	)
}

SidebarToggle.displayName = "TopBar.SidebarToggle"

/* ─── TopBar.Breadcrumbs ─────────────────────────────────── */

interface TopBarBreadcrumbsProps {
	items?: BreadcrumbItemType[]
	className?: string
}

export function TopBarBreadcrumbs({ items: propItems, className }: TopBarBreadcrumbsProps) {
	const frame = useFrameSafe()
	const items = propItems ?? frame?.breadcrumbs ?? []
	if (!items.length) return null

	return (
		<Breadcrumb className={className}>
			<BreadcrumbList>
				{items.map((item, index) => {
					const isLast = index === items.length - 1

					return (
						<React.Fragment key={`${item.label}-${index}`}>
							<BreadcrumbItem>
								{isLast || !item.href ? (
									<BreadcrumbPage>{item.label}</BreadcrumbPage>
								) : (
									<Link href={item.href} className="transition-colors hover:text-fg">
										{item.label}
									</Link>
								)}
							</BreadcrumbItem>
							{!isLast && <BreadcrumbSeparator />}
						</React.Fragment>
					)
				})}
			</BreadcrumbList>
		</Breadcrumb>
	)
}

TopBarBreadcrumbs.displayName = "TopBar.Breadcrumbs"

/* ─── Compound export ────────────────────────────────────── */

TopBar.SidebarToggle = SidebarToggle
TopBar.Breadcrumbs = TopBarBreadcrumbs
