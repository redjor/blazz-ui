"use client"

import type * as React from "react"
import { Toaster } from "sonner"
import { CommandPalette } from "@/components/features/command-palette/command-palette"
import {
	NavigationTabsProvider,
	NavigationTabsInterceptor,
	useNavigationTabs,
	useNavigationTabUrlSync,
} from "@/components/features/navigation-tabs"
import { AppFrame } from "@/components/layout/app-frame"
import { FrameProvider, useFrame } from "@/components/layout/frame-context"
import { TabBar } from "@/components/layout/tab-bar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { talentflowNavigationConfig } from "@/config/talentflow-navigation"
import { titleFromPathname } from "@/lib/tab-utils"
import { useFrameLayout } from "@/lib/use-frame-layout"

function TalentFlowLayoutInner({ children }: { children: React.ReactNode }) {
	const { commandPaletteOpen, setCommandPaletteOpen } = useFrame()
	const { showTabBar } = useNavigationTabs()
	useFrameLayout()
	useNavigationTabUrlSync(titleFromPathname)

	return (
		<SidebarProvider>
			<AppFrame
				navigation={talentflowNavigationConfig}
				tabBar={showTabBar ? <TabBar /> : undefined}
				onOpenCommandPalette={() => setCommandPaletteOpen(true)}
				activeSection="talentflow"
			>
				{children}
			</AppFrame>
			<NavigationTabsInterceptor
				excludePaths={["/docs"]}
				titleResolver={titleFromPathname}
			/>
			<CommandPalette navigation={talentflowNavigationConfig} open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
			<Toaster />
		</SidebarProvider>
	)
}

export default function TalentFlowLayout({ children }: { children: React.ReactNode }) {
	return (
		<FrameProvider>
			<NavigationTabsProvider storageKey="blazz-talentflow-tabs">
				<TalentFlowLayoutInner>{children}</TalentFlowLayoutInner>
			</NavigationTabsProvider>
		</FrameProvider>
	)
}
