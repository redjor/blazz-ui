"use client"

import { Link, useLocation } from "@tanstack/react-router"
import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@blazz/ui/lib/utils"
import { ScrollArea } from "@blazz/ui/components/ui/scroll-area"
import { sidebarConfig } from "~/config/navigation"
import type { NavigationItem, NavigationSection } from "@blazz/ui/types/navigation"

export function DocsSidebar() {
	const { pathname } = useLocation()
	const [openItems, setOpenItems] = React.useState<Set<string>>(() => new Set())

	const isActive = (url?: string) => {
		if (!url) return false
		return pathname === url || pathname.startsWith(url + "/")
	}

	// Auto-open category containing the active item on route change
	React.useEffect(() => {
		for (const section of sidebarConfig.navigation) {
			for (const item of section.items) {
				if (item.items?.some((sub) => isActive(sub.url))) {
					const key = item.id ?? item.url ?? item.title
					setOpenItems((prev) => {
						if (prev.has(key)) return prev
						const next = new Set(prev)
						next.add(key)
						return next
					})
				}
			}
		}
	}, [pathname])

	const toggleItem = (key: string) => {
		setOpenItems((prev) => {
			const next = new Set(prev)
			if (next.has(key)) {
				next.delete(key)
			} else {
				next.add(key)
			}
			return next
		})
	}

	return (
		<aside className="hidden h-full w-60 shrink-0 border-r bg-surface lg:block">
			<ScrollArea className="h-full">
				<div className="py-4">
					{sidebarConfig.navigation.map((section) => (
						<NavSection
							key={section.id ?? section.title}
							section={section}
							openItems={openItems}
							onToggle={toggleItem}
							isActive={isActive}
						/>
					))}
				</div>
			</ScrollArea>
		</aside>
	)
}

function NavSection({
	section,
	openItems,
	onToggle,
	isActive,
}: {
	section: NavigationSection
	openItems: Set<string>
	onToggle: (key: string) => void
	isActive: (url?: string) => boolean
}) {
	return (
		<div className="mb-4">
			{section.title && (
				<p className="mb-1 px-4 text-xs font-semibold uppercase tracking-wider text-fg-muted">
					{section.title}
				</p>
			)}
			<div className="space-y-0.5 px-2">
				{section.items.map((item) => (
					<NavItem
						key={item.id ?? item.url ?? item.title}
						item={item}
						openItems={openItems}
						onToggle={onToggle}
						isActive={isActive}
					/>
				))}
			</div>
		</div>
	)
}

function NavItem({
	item,
	openItems,
	onToggle,
	isActive,
}: {
	item: NavigationItem
	openItems: Set<string>
	onToggle: (key: string) => void
	isActive: (url?: string) => boolean
}) {
	const key = item.id ?? item.url ?? item.title
	const hasChildren = (item.items?.length ?? 0) > 0
	const isOpen = openItems.has(key)
	const hasActiveChild = item.items?.some((sub) => isActive(sub.url))
	const isParentActive = isActive(item.url) && !hasActiveChild

	if (!hasChildren) {
		return (
			<Link
				to={item.url ?? "/"}
				className={cn(
					"flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-raised",
					isParentActive
						? "bg-raised font-medium text-fg"
						: "text-fg-muted hover:text-fg"
				)}
			>
				{item.icon && <item.icon className="size-4 shrink-0" />}
				<span className="truncate">{item.title}</span>
			</Link>
		)
	}

	return (
		<div>
			<button
				type="button"
				onClick={() => onToggle(key)}
				className={cn(
					"flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-raised",
					hasActiveChild || isParentActive ? "text-fg font-medium" : "text-fg-muted"
				)}
			>
				<ChevronRight
					className={cn(
						"size-3.5 shrink-0 transition-transform duration-150",
						isOpen && "rotate-90"
					)}
				/>
				{item.icon && <item.icon className="size-4 shrink-0" />}
				<span className="truncate">{item.title}</span>
			</button>

			{isOpen && item.items && (
				<div className="ml-6 mt-0.5 space-y-0.5 border-l pl-3">
					{item.items.map((sub) => (
						<Link
							key={sub.url ?? sub.title}
							to={sub.url ?? "/"}
							className={cn(
								"block rounded-md px-2 py-1 text-sm transition-colors hover:bg-raised",
								isActive(sub.url)
									? "bg-raised font-medium text-fg"
									: "text-fg-muted hover:text-fg"
							)}
						>
							{sub.title}
						</Link>
					))}
				</div>
			)}
		</div>
	)
}
