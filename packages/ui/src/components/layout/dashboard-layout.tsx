"use client"

import { cn } from "../../lib/utils/cn"

export interface DashboardLayoutProps {
	navbar?: React.ReactNode
	sidebar?: React.ReactNode
	children: React.ReactNode
	showSidebar?: boolean
	sidebarWidth?: string
	className?: string
	bgColor?: string
}

/**
 * DashboardLayout - Main layout with navbar, optional sidebar, and content area
 *
 * Features:
 * - Shopify-style rounded top border
 * - Flexible sidebar (show/hide, configurable width)
 * - Sticky navbar
 * - Full-height scrollable content
 *
 * Usage:
 * <DashboardLayout
 *   navbar={<Navbar left={...} center={...} right={...} />}
 *   sidebar={<YourSidebar />}
 *   showSidebar={true}
 * >
 *   <YourContent />
 * </DashboardLayout>
 */
export function DashboardLayout({
	navbar,
	sidebar,
	children,
	showSidebar = true,
	sidebarWidth = "20.5rem", // 82 * 0.25rem = 20.5rem
	className,
	bgColor = "bg-bb-dark-green",
}: DashboardLayoutProps) {
	return (
		<div className={cn("flex h-screen flex-col", bgColor, className)}>
			{/* Navbar */}
			{navbar}

			{/* Main content area with rounded top */}
			<div className="flex flex-1 overflow-hidden rounded-t-3xl border-t-4 border-white/10">
				{/* Sidebar (optional) */}
				{showSidebar && sidebar && (
					<aside
						style={{ width: sidebarWidth }}
						className="flex flex-col border-r bg-gray-50 dark:bg-gray-900"
					>
						{sidebar}
					</aside>
				)}

				{/* Main content */}
				<main className="flex-1 overflow-y-auto bg-white dark:bg-gray-950">{children}</main>
			</div>
		</div>
	)
}
