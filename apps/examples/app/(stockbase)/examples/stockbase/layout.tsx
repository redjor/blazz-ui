"use client"

import type * as React from "react"
import { Toaster } from "sonner"
import { CommandPalette } from "@blazz/ui/components/patterns/command-palette/command-palette"
import {
	NavigationTabsProvider,
	NavigationTabsInterceptor,
	useNavigationTabs,
	useNavigationTabUrlSync,
} from "@blazz/ui/components/patterns/navigation-tabs"
import { AppFrame } from "@blazz/ui/components/patterns/app-frame"
import { FrameProvider, useFrame } from "@blazz/ui/components/patterns/frame-context"
import { TabBar } from "@blazz/ui/components/patterns/tab-bar"
import { SidebarProvider } from "@blazz/ui/components/ui/sidebar"
import { stockbaseSidebarConfig, stockbaseNavigationConfig } from "@/config/stockbase-navigation"
import { titleFromPathname } from "@blazz/ui/lib/tab-utils"
import { useFrameLayout } from "@blazz/ui/lib/use-frame-layout"

const docsUrl = process.env.NEXT_PUBLIC_DOCS_URL ?? ""

const sections = [
	{ id: "docs", label: "Docs", href: `${docsUrl}/docs/components` },
	{ id: "crm", label: "CRM", href: "/examples/crm/dashboard" },
	{ id: "talentflow", label: "TalentFlow", href: "/examples/talentflow/dashboard" },
	{ id: "stockbase", label: "StockBase", href: "/examples/stockbase/dashboard" },
]

function StockBaseLayoutInner({ children }: { children: React.ReactNode }) {
	const { commandPaletteOpen, setCommandPaletteOpen } = useFrame()
	const { showTabBar } = useNavigationTabs()
	useFrameLayout()
	useNavigationTabUrlSync(titleFromPathname)

	return (
		<SidebarProvider>
			<AppFrame
				sidebarConfig={stockbaseSidebarConfig}
				navigation={stockbaseNavigationConfig}
				tabBar={showTabBar ? <TabBar /> : undefined}
				onOpenCommandPalette={() => setCommandPaletteOpen(true)}
				sections={sections}
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
