"use client"

import { Menu } from "lucide-react"
import Link from "next/link"
import * as React from "react"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "../ui/breadcrumb"
import { cn } from "../../lib/utils"
import { type Breadcrumb as BreadcrumbItemType, useFrame } from "./frame-context"

export interface TopBarProps {
	breadcrumbs?: BreadcrumbItemType[]
	actions?: React.ReactNode
	title?: string
	className?: string
	onToggleSidebar?: () => void
}

/**
 * TopBar - Shopify Polaris-inspired header for content area
 *
 * Features:
 * - Sidebar toggle button
 * - Breadcrumb navigation
 * - Optional title
 * - Action buttons on the right
 *
 * @example
 * <TopBar
 *   breadcrumbs={[
 *     { label: 'Products', href: '/products' },
 *     { label: 'Product Detail' }
 *   ]}
 *   actions={
 *     <>
 *       <Button variant="outline">Export</Button>
 *       <Button>Create</Button>
 *     </>
 *   }
 * />
 */
export function TopBar({
	breadcrumbs: propBreadcrumbs,
	actions,
	title,
	className,
	onToggleSidebar,
}: TopBarProps) {
	const { breadcrumbs: contextBreadcrumbs } = useFrame()

	// Use prop breadcrumbs if provided, otherwise use context breadcrumbs
	const breadcrumbs = propBreadcrumbs || contextBreadcrumbs

	return (
		<header
			className={cn(
				"flex h-14 shrink-0 items-center gap-4 border-b border-gray-200 bg-white px-6 shadow-sm",
				className
			)}
		>
			{/* Sidebar Toggle - visible sur mobile */}
			{onToggleSidebar && (
				<button
					type="button"
					onClick={onToggleSidebar}
					className="flex h-8 w-8 items-center justify-center rounded-lg hover:bg-gray-100 md:hidden"
					aria-label="Toggle sidebar"
				>
					<Menu className="h-5 w-5 text-gray-600" />
				</button>
			)}

			{/* Breadcrumbs */}
			{breadcrumbs.length > 0 && (
				<Breadcrumb>
					<BreadcrumbList>
						{breadcrumbs.map((breadcrumb, index) => {
							const isLast = index === breadcrumbs.length - 1

							return (
								<React.Fragment key={index}>
									<BreadcrumbItem>
										{isLast || !breadcrumb.href ? (
											<BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
										) : (
											<Link
												href={breadcrumb.href}
												className="transition-colors hover:text-fg"
											>
												{breadcrumb.label}
											</Link>
										)}
									</BreadcrumbItem>
									{!isLast && <BreadcrumbSeparator />}
								</React.Fragment>
							)
						})}
					</BreadcrumbList>
				</Breadcrumb>
			)}

			{/* Title (if no breadcrumbs) */}
			{!breadcrumbs.length && title && <h1 className="text-lg font-semibold">{title}</h1>}

			{/* Actions */}
			{actions && <div className="ml-auto flex items-center gap-2">{actions}</div>}
		</header>
	)
}
