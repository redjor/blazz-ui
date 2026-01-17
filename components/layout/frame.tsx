"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

export interface FrameProps {
	topBar: React.ReactNode
	navigation: React.ReactNode
	children: React.ReactNode
	className?: string
}

/**
 * Frame - Application layout structure
 *
 * Provides a modern CSS Grid-based layout for applications with:
 * - Fixed top bar spanning full width
 * - Collapsible navigation sidebar
 * - Scrollable main content area
 *
 * Uses CSS custom properties for flexible sizing:
 * - --frame-top-bar-height: Height of the top bar (default: 56px)
 * - --frame-navigation-width: Width of the navigation sidebar (default: 240px)
 *
 * @example
 * <Frame
 *   topBar={<AppTopBar />}
 *   navigation={<Navigation />}
 * >
 *   <YourPageContent />
 * </Frame>
 */
export function Frame({ topBar, navigation, children, className }: FrameProps) {
	return (
		<div
			className={cn(
				"frame-container",
				"grid h-screen w-full overflow-hidden bg-black",
				'[grid-template-areas:"topbar_topbar"_"nav_main"] grid-rows-[var(--frame-top-bar-height,56px)_1fr] grid-cols-[var(--frame-navigation-width,240px)_1fr]',
				className
			)}
			style={
				{
					"--frame-top-bar-height": "56px",
					"--frame-navigation-width": "240px",
				} as React.CSSProperties
			}
		>
			{/* Top Bar - Fixed at top, spans full width */}
			<div className="[grid-area:topbar] z-20">{topBar}</div>

			{/* Navigation - Left sidebar */}
			<div className="[grid-area:nav] z-10 overflow-y-auto rounded-tl-lg">{navigation}</div>

			{/* Main Content - Scrollable area */}
			<main
				className="[grid-area:main] overflow-y-auto rounded-tr-lg"
				style={{ backgroundColor: "#f1f1f1" }}
			>
				{children}
			</main>
		</div>
	)
}
