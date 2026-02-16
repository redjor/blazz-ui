"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import * as React from "react"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { componentsNavigation, type ComponentNavCategory } from "@/config/components-navigation"
import { ScrollArea } from "@/components/ui/scroll-area"

export function ComponentsSidebar() {
	const pathname = usePathname()
	const [openCategories, setOpenCategories] = React.useState<string[]>([])

	// Auto-open category containing active item
	React.useEffect(() => {
		const activeCategory = componentsNavigation.find((category) =>
			category.items.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"))
		)
		if (activeCategory && !openCategories.includes(activeCategory.id)) {
			setOpenCategories((prev) => [...prev, activeCategory.id])
		}
	}, [pathname])

	const toggleCategory = (categoryId: string) => {
		setOpenCategories((prev) =>
			prev.includes(categoryId)
				? prev.filter((id) => id !== categoryId)
				: [...prev, categoryId]
		)
	}

	const isItemActive = (href: string) => {
		return pathname === href || pathname.startsWith(href + "/")
	}

	return (
		<aside className="sticky top-14 hidden h-[calc(100vh-3.5rem)] w-64 shrink-0 border-r bg-surface lg:block">
			<ScrollArea className="h-full py-6">
				<div className="px-4 pb-4">
					<Link
						href="/components"
						className={cn(
							"text-sm font-semibold hover:text-fg",
							pathname === "/components" ? "text-fg" : "text-fg-muted"
						)}
					>
						Components
					</Link>
				</div>
				<nav className="space-y-1 px-2">
					{componentsNavigation.map((category) => (
						<CategoryItem
							key={category.id}
							category={category}
							isOpen={openCategories.includes(category.id)}
							onToggle={() => toggleCategory(category.id)}
							isItemActive={isItemActive}
						/>
					))}
				</nav>
			</ScrollArea>
		</aside>
	)
}

function CategoryItem({
	category,
	isOpen,
	onToggle,
	isItemActive,
}: {
	category: ComponentNavCategory
	isOpen: boolean
	onToggle: () => void
	isItemActive: (href: string) => boolean
}) {
	const hasActiveItem = category.items.some((item) => isItemActive(item.href))

	return (
		<div>
			<button
				type="button"
				onClick={onToggle}
				className={cn(
					"flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-raised",
					hasActiveItem ? "text-fg" : "text-fg-muted"
				)}
			>
				<ChevronRight
					className={cn(
						"h-4 w-4 shrink-0 transition-transform duration-200",
						isOpen && "rotate-90"
					)}
				/>
				<category.icon className="h-4 w-4 shrink-0" />
				<span className="truncate">{category.title}</span>
			</button>
			{isOpen && (
				<div className="ml-4 mt-1 space-y-0.5 border-l pl-4">
					{category.items.map((item) => (
						<Link
							key={item.href}
							href={item.href}
							className={cn(
								"block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-raised",
								isItemActive(item.href)
									? "bg-raised font-medium text-fg"
									: "text-fg-muted hover:text-fg"
							)}
						>
							{item.title}
						</Link>
					))}
				</div>
			)}
		</div>
	)
}

// Mobile version for smaller screens
export function ComponentsSidebarMobile() {
	const pathname = usePathname()
	const [open, setOpen] = React.useState(false)
	const [openCategories, setOpenCategories] = React.useState<string[]>([])

	React.useEffect(() => {
		const activeCategory = componentsNavigation.find((category) =>
			category.items.some((item) => pathname === item.href || pathname.startsWith(item.href + "/"))
		)
		if (activeCategory && !openCategories.includes(activeCategory.id)) {
			setOpenCategories((prev) => [...prev, activeCategory.id])
		}
	}, [pathname])

	const toggleCategory = (categoryId: string) => {
		setOpenCategories((prev) =>
			prev.includes(categoryId)
				? prev.filter((id) => id !== categoryId)
				: [...prev, categoryId]
		)
	}

	const isItemActive = (href: string) => {
		return pathname === href || pathname.startsWith(href + "/")
	}

	// Find current component name
	const currentComponent = componentsNavigation
		.flatMap((cat) => cat.items)
		.find((item) => isItemActive(item.href))

	return (
		<div className="lg:hidden">
			<button
				type="button"
				onClick={() => setOpen(!open)}
				className="flex w-full items-center justify-between rounded-lg border bg-surface px-4 py-2 text-sm font-medium"
			>
				<span>{currentComponent?.title || "Components"}</span>
				<ChevronRight
					className={cn(
						"h-4 w-4 transition-transform duration-200",
						open && "rotate-90"
					)}
				/>
			</button>
			{open && (
				<div className="mt-2 rounded-lg border bg-surface p-2">
					<nav className="space-y-1">
						{componentsNavigation.map((category) => (
							<div key={category.id}>
								<button
									type="button"
									onClick={() => toggleCategory(category.id)}
									className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm font-medium text-fg-muted hover:bg-raised hover:text-fg"
								>
									<ChevronRight
										className={cn(
											"h-4 w-4 shrink-0 transition-transform duration-200",
											openCategories.includes(category.id) && "rotate-90"
										)}
									/>
									<category.icon className="h-4 w-4 shrink-0" />
									<span>{category.title}</span>
								</button>
								{openCategories.includes(category.id) && (
									<div className="ml-4 mt-1 space-y-0.5 border-l pl-4">
										{category.items.map((item) => (
											<Link
												key={item.href}
												href={item.href}
												onClick={() => setOpen(false)}
												className={cn(
													"block rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-raised",
													isItemActive(item.href)
														? "bg-raised font-medium text-fg"
														: "text-fg-muted hover:text-fg"
												)}
											>
												{item.title}
											</Link>
										))}
									</div>
								)}
							</div>
						))}
					</nav>
				</div>
			)}
		</div>
	)
}
