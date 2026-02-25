"use client"

import type * as React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

export interface FrameProps {
	topBar: React.ReactNode
	navigation: React.ReactNode
	tabBar?: React.ReactNode
	children: React.ReactNode
	className?: string
}

/**
 * Frame - Application layout structure
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
	return (
		<div className={cn("h-screen w-full bg-(--top-background)", className)}>
			<div className="fixed top-0 left-0 right-0 z-20 h-(--topbar-height)">{topBar}</div>

			<div className="flex h-screen overflow-hidden">
				<aside className="fixed left-0 z-10 h-screen overflow-y-auto top-(--topbar-height) hidden md:block rounded-tl-(--main-radius)">
					{navigation}
				</aside>

				<main className="flex-1 min-w-0 mt-(--topbar-height) md:pl-(--sidebar-width)">
					<div className="flex h-full flex-col">
						{tabBar}
						<ScrollArea
						className={cn(
							"min-h-0 w-full flex-1 bg-(--main-background)",
							!tabBar && "rounded-tr-(--main-radius)"
						)}
					>
						{children}
					</ScrollArea>
					</div>
				</main>
			</div>
		</div>
	)
}
