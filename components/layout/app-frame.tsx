"use client"

import * as React from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppTopBar, type AppTopBarProps } from "@/components/layout/app-top-bar"
import { Frame } from "@/components/layout/frame"
import { MobileSidebarSheet } from "@/components/layout/mobile-sidebar-sheet"
import { sidebarConfig } from "@/config/navigation"
import type { NavigationSection } from "@/types/navigation"

export interface AppFrameProps {
	navigation?: NavigationSection[]
	children: React.ReactNode
	sidebarHeader?: React.ReactNode
	sidebarFooter?: React.ReactNode
	onOpenCommandPalette?: () => void
	activeSection?: AppTopBarProps["activeSection"]
}

/**
 * AppFrame
 */
export function AppFrame({ navigation, children, onOpenCommandPalette, activeSection }: AppFrameProps) {
	// État pour le Sheet mobile
	const [mobileSheetOpen, setMobileSheetOpen] = React.useState(false)

	// Utiliser sidebarConfig par défaut, ou le merger avec navigation si fourni
	const config = React.useMemo(() => {
		if (navigation) {
			return {
				...sidebarConfig,
				navigation,
			}
		}
		return sidebarConfig
	}, [navigation])

	return (
		<>
			{/* Sheet mobile via Portal */}
			<MobileSidebarSheet
				open={mobileSheetOpen}
				onOpenChange={setMobileSheetOpen}
				config={config}
			/>

			<Frame
				topBar={
					<AppTopBar
						onOpenCommandPalette={onOpenCommandPalette}
						onOpenMobileMenu={() => setMobileSheetOpen((prev) => !prev)}
						activeSection={activeSection}
					/>
				}
				navigation={<AppSidebar config={config} />}
			>
				{children}
			</Frame>
		</>
	)
}
