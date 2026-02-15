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
import { crmNavigationConfig } from "@/config/crm-navigation"
import { titleFromPathname } from "@/lib/tab-utils"
import { useFrameLayout } from "@/lib/use-frame-layout"

function CrmLayoutInner({ children }: { children: React.ReactNode }) {
	const { setCommandPaletteOpen } = useFrame()
	const { showTabBar } = useNavigationTabs()
	useFrameLayout()
	useNavigationTabUrlSync(titleFromPathname)

	return (
		<SidebarProvider>
			<AppFrame
				navigation={crmNavigationConfig}
				tabBar={showTabBar ? <TabBar /> : undefined}
				onOpenCommandPalette={() => setCommandPaletteOpen(true)}
				activeSection="crm"
			>
				{children}
			</AppFrame>
			<NavigationTabsInterceptor
				excludePaths={["/docs", "/showcase"]}
				titleResolver={titleFromPathname}
			/>
			<CommandPalette navigation={crmNavigationConfig} />
			<Toaster />
		</SidebarProvider>
	)
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<FrameProvider>
			<NavigationTabsProvider storageKey="blazz-crm-tabs">
				<CrmLayoutInner>{children}</CrmLayoutInner>
			</NavigationTabsProvider>
		</FrameProvider>
	)
}
