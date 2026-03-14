"use client"

import type * as React from "react"
import { cn } from "../../lib/utils"
import { ScrollArea } from "../ui/scroll-area"

export interface FrameProps {
	topBar?: React.ReactNode
	navigation: React.ReactNode
	tabBar?: React.ReactNode
	children: React.ReactNode
	className?: string
}

/**
 * Frame - Application layout structure
 *
 * The navigation slot (Sidebar) is placed directly in the flex container.
 * The Sidebar's built-in spacer div handles the width allocation automatically —
 * no manual padding-left needed. Collapse, resize, and peek all work natively.
 *
 * @example
 * <Frame
 *   topBar={<AppTopBar />}
 *   navigation={<AppSidebar />}
 * >
 *   <YourPageContent />
 * </Frame>
 */
export function Frame({ topBar, navigation, tabBar, children, className }: FrameProps) {
	const hasTopBar = Boolean(topBar)

	return (
		<div className={cn("h-screen w-full bg-surface-0", className)}>
			{hasTopBar && (
				<div className="fixed top-0 left-0 right-0 z-20 h-(--topbar-height)">{topBar}</div>
			)}

			<div className={cn("flex h-screen overflow-hidden", hasTopBar && "pt-(--topbar-height)")}>
				{navigation}

				<main className="flex-1 min-w-0">
					<div className="flex h-full flex-col">
						{tabBar}
						<ScrollArea className={cn("min-h-0 w-full flex-1 bg-surface-1")}>{children}</ScrollArea>
					</div>
				</main>
			</div>
		</div>
	)
}
