"use client"

import { Loader2 } from "lucide-react"
import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils/cn"
import { useNavigationContextSafe } from "@/providers/navigation-provider"

export interface NavTab {
	label: string
	href: string
	icon: React.ReactNode
	badge?: number | "loading"
	disabled?: boolean
}

export interface NavTabsProps {
	tabs: NavTab[]
	preserveQueryParams?: boolean
	className?: string
}

/**
 * NavTabs - Shopify-style navigation tabs for the navbar
 * Features:
 * - Centered pill-style tabs with rounded-full design
 * - Active state with white background
 * - Badge system for counts or loading states
 * - URL parameter preservation (optional)
 * - Navigation blocking awareness
 */
export function NavTabs({ tabs, preserveQueryParams = true, className }: NavTabsProps) {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const navigationContext = useNavigationContextSafe()
	const isBlocked = navigationContext?.isNavigationBlocked ?? false

	// Preserve URL parameters during navigation
	const queryString = preserveQueryParams ? searchParams?.toString() : ""
	const buildHref = (basePath: string) => (queryString ? `${basePath}?${queryString}` : basePath)

	return (
		<div
			className={cn(
				"flex items-center gap-1 rounded-full bg-white/10 p-1 transition-opacity",
				isBlocked && "pointer-events-none opacity-50",
				className
			)}
		>
			{tabs.map((tab) => {
				// Extract base path (without query params) for comparison
				const basePath = tab.href.split("?")[0]
				const isActive = basePath === "/" ? pathname === "/" : pathname?.startsWith(basePath)

				const isDisabled = isBlocked || tab.disabled

				const finalHref = preserveQueryParams ? buildHref(tab.href) : tab.href

				return (
					<Link
						key={tab.href}
						href={finalHref}
						aria-disabled={isDisabled}
						tabIndex={isDisabled ? -1 : undefined}
						onClick={(e) => {
							if (isDisabled) {
								e.preventDefault()
							}
						}}
						className={cn(
							"flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-200",
							isActive
								? "bg-white text-bb-dark-green shadow-sm"
								: "text-white/80 hover:bg-white/10 hover:text-white",
							isDisabled && "pointer-events-none opacity-50"
						)}
					>
						{tab.icon}
						<span>{tab.label}</span>

						{/* Badge for counts or loading */}
						{tab.badge === "loading" && (
							<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-bb-light-green px-1">
								<Loader2 className="h-3 w-3 animate-spin text-white" />
							</span>
						)}
						{typeof tab.badge === "number" && tab.badge > 0 && (
							<span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-bb-light-green px-1 text-xs font-bold text-white">
								{tab.badge > 9 ? "9+" : tab.badge}
							</span>
						)}
					</Link>
				)
			})}
		</div>
	)
}
