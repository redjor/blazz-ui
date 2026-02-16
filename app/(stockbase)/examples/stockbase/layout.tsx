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
import { stockbaseNavigationConfig } from "@/config/stockbase-navigation"
import { titleFromPathname } from "@/lib/tab-utils"
import { useFrameLayout } from "@/lib/use-frame-layout"

function StockBaseLayoutInner({ children }: { children: React.ReactNode }) {
	const { setCommandPaletteOpen } = useFrame()
	const { showTabBar } = useNavigationTabs()
	useFrameLayout()
	useNavigationTabUrlSync(titleFromPathname)

	return (
		<SidebarProvider>
			<AppFrame
				navigation={stockbaseNavigationConfig}
				tabBar={showTabBar ? <TabBar /> : undefined}
				onOpenCommandPalette={() => setCommandPaletteOpen(true)}
				activeSection="stockbase"
			>
				{children}
			</AppFrame>
			<NavigationTabsInterceptor
				excludePaths={["/docs"]}
				titleResolver={titleFromPathname}
			/>
			<CommandPalette navigation={stockbaseNavigationConfig} />
			<Toaster />
		</SidebarProvider>
	)
}

export default function StockBaseLayout({ children }: { children: React.ReactNode }) {
	return (
		<FrameProvider>
			<NavigationTabsProvider storageKey="blazz-stockbase-tabs">
				<StockBaseLayoutInner>{children}</StockBaseLayoutInner>
			</NavigationTabsProvider>
		</FrameProvider>
	)
}
