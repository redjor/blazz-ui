"use client"

import * as React from "react"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { AppTopBar, type AppTopBarProps } from "@/components/layout/app-top-bar"
import { Frame } from "@/components/layout/frame"
import { MobileSidebarSheet } from "@/components/layout/mobile-sidebar-sheet"
import type { NavigationSection, SidebarConfig } from "@/types/navigation"

export interface AppFrameProps {
	navigation?: NavigationSection[]
	/** Full sidebar config (user, navigation). Required if no navigation prop. */
	sidebarConfig?: SidebarConfig
	children: React.ReactNode
	/** Content rendered at the top of the sidebar (e.g. OrgSwitcher) */
	sidebarHeader?: React.ReactNode
	sidebarFooter?: React.ReactNode
	tabBar?: React.ReactNode
	onOpenCommandPalette?: () => void
	activeSection?: AppTopBarProps["activeSection"]
	/** Hide notifications and user menu in the top bar */
	minimalTopBar?: boolean
}

/**
 * AppFrame
 */
const defaultSidebarConfig: SidebarConfig = {
	user: { name: "", email: "", role: "" },
	navigation: [],
}

export function AppFrame({
	navigation,
	sidebarConfig: sidebarConfigProp,
	children,
	sidebarHeader,
	tabBar,
	onOpenCommandPalette,
	activeSection,
	minimalTopBar,
}: AppFrameProps) {
	// État pour le Sheet mobile
	const [mobileSheetOpen, setMobileSheetOpen] = React.useState(false)

	// Use provided sidebarConfig, merge with navigation override if present
	const config = React.useMemo(() => {
		const base = sidebarConfigProp ?? defaultSidebarConfig
		if (navigation) {
			return { ...base, navigation }
		}
		return base
	}, [navigation, sidebarConfigProp])

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
						minimal={minimalTopBar}
					/>
				}
				navigation={<AppSidebar config={config} header={sidebarHeader} />}
				tabBar={tabBar}
			>
				{children}
			</Frame>
		</>
	)
}
