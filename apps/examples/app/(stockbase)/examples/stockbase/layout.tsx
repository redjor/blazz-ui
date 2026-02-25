"use client"

import type * as React from "react"
import { Toaster } from "sonner"
import { CommandPalette } from "@blazz/ui/components/features/command-palette/command-palette"
import {
	NavigationTabsProvider,
	NavigationTabsInterceptor,
	useNavigationTabs,
	useNavigationTabUrlSync,
} from "@blazz/ui/components/features/navigation-tabs"
import { AppFrame } from "@blazz/ui/components/layout/app-frame"
import { FrameProvider, useFrame } from "@blazz/ui/components/layout/frame-context"
import { TabBar } from "@blazz/ui/components/layout/tab-bar"
import { SidebarProvider } from "@blazz/ui/components/ui/sidebar"
import { stockbaseNavigationConfig } from "@/config/stockbase-navigation"
import { titleFromPathname } from "@blazz/ui/lib/tab-utils"
import { useFrameLayout } from "@blazz/ui/lib/use-frame-layout"

function StockBaseLayoutInner({ children }: { children: React.ReactNode }) {
	const { commandPaletteOpen, setCommandPaletteOpen } = useFrame()
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
			<CommandPalette navigation={stockbaseNavigationConfig} open={commandPaletteOpen} onOpenChange={setCommandPaletteOpen} />
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
