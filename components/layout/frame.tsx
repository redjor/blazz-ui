"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"
import { ScrollArea } from "@/components/ui/scroll-area"

export interface FrameProps {
	topBar: React.ReactNode
	navigation: React.ReactNode
	children: React.ReactNode
	className?: string
}

/**
 * Frame - Application layout structure
 *
 * Provides a simplified layout with fixed positioning and responsive padding:
 * - Fixed top bar spanning full width (z-20)
 * - Fixed sidebar on desktop, mobile handled by MobileSidebarSheet in app-frame.tsx
 * - Scrollable main content with responsive padding
 *
 * Layout approach:
 * - TopBar: fixed top-0, full width, height 56px
 * - Sidebar: fixed left-0 on desktop (hidden on mobile)
 * - Main: margin-top 56px, padding-left 240px on desktop
 *
 * @example
 * <Frame
 *   topBar={<AppTopBar />}
 *   navigation={<AppSidebar />}
 * >
 *   <YourPageContent />
 * </Frame>
 */
export function Frame({ topBar, navigation, children, className }: FrameProps) {
	return (
		<div className={cn("h-screen w-full bg-black", className)}>
			{/* Top Bar - Fixed en haut, pleine largeur, z-20 */}
			<div className="fixed top-0 left-0 right-0 z-20 h-[56px]">{topBar}</div>

			{/* Container pour Sidebar + Main (nécessaire pour le spacer de Shadcn Sidebar) */}
			<div className="flex h-screen overflow-hidden">
				{/* Navigation desktop uniquement - Mobile géré par MobileSidebarSheet dans app-frame.tsx */}
				<div className="fixed left-0 z-10 h-screen overflow-y-auto top-[56px] hidden md:block rounded-tl-[10px]">
					{navigation}
				</div>

				{/* Main Content - Prend l'espace restant */}
				<main className="flex-1  mt-[56px] md:pl-[240px]">
					<ScrollArea className="h-full w-full rounded-tr-[10px] bg-[#f1f1f1]">
						{children}
					</ScrollArea>
				</main>
			</div>
		</div>
	)
}
