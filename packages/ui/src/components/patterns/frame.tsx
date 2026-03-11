"use client"

import type * as React from "react"
import { ScrollArea } from "../ui/scroll-area"
import { cn } from "../../lib/utils"

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
		<div className={cn("h-screen w-full bg-(--top-background)", className)}>
			{hasTopBar && (
				<div className="fixed top-0 left-0 right-0 z-20 h-(--topbar-height)">{topBar}</div>
			)}

			<div className="flex h-screen overflow-hidden">
				<aside
					className={cn(
						"fixed left-0 z-10 h-screen overflow-y-auto max-md:contents md:block rounded-tl-(--main-radius)",
						hasTopBar ? "top-(--topbar-height)" : "top-0",
					)}
				>
					{navigation}
				</aside>

				<main
					className={cn(
						"flex-1 min-w-0 md:pl-(--sidebar-width)",
						hasTopBar && "mt-(--topbar-height)",
					)}
				>
					<div className="flex h-full flex-col">
						{tabBar}
						<ScrollArea
							className={cn(
								"min-h-0 w-full flex-1 bg-(--main-background)",
								!tabBar && "rounded-tr-(--main-radius)",
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
