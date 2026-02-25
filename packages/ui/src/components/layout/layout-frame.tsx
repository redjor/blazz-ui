"use client"

import type * as React from "react"
import { cn } from "../../lib/utils"

interface LayoutFrameProps {
	children: React.ReactNode
	topBar: React.ReactNode
	sidebar: React.ReactNode
	className?: string
}

/**
 * LayoutFrame - Flexbox-based layout structure
 *
 * Modern flexbox architecture that automatically adapts to content:
 * - TopBar: flex-shrink-0, fixed height 56px
 * - Content area: flex-1, automatically fills remaining space
 * - Sidebar: flex-shrink-0, scrollable independently
 * - Main: flex-1, scrollable independently
 *
 * Benefits:
 * - No height calculations needed
 * - Automatically fills available space
 * - Clear space allocation
 * - Easy to maintain
 */
export function LayoutFrame({ children, topBar, sidebar, className }: LayoutFrameProps) {
	return (
		<div className="flex flex-col h-screen overflow-hidden bg-gray-50">
			{/* TopBar - fixed at top, never scrolls */}
			<div className="flex-shrink-0">{topBar}</div>

			{/* Content area - flex container taking remaining space */}
			<div className="flex flex-1 overflow-hidden min-h-0">
				{/* Sidebar - flex item with fixed width */}
				<div className="flex-shrink-0 w-[240px] overflow-y-auto">{sidebar}</div>

				{/* Main content - flexible, fills remaining space */}
				<main className={cn("flex-1 overflow-y-auto", className)}>{children}</main>
			</div>
		</div>
	)
}
