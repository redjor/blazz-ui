"use client"

import type * as React from "react"
import { Toaster } from "sonner"
import { CommandPalette } from "@/components/features/command-palette/command-palette"
import { AppFrame } from "@/components/layout/app-frame"
import { FrameProvider, useFrame } from "@/components/layout/frame-context"
import { TabBar } from "@/components/layout/tab-bar"
import { TabLinkInterceptor } from "@/components/layout/tab-link-interceptor"
import { TabsProvider } from "@/components/layout/tabs-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import { crmNavigationConfig } from "@/config/crm-navigation"
import { useFrameLayout } from "@/lib/use-frame-layout"
import { useTabUrlSync } from "@/lib/use-tab-url-sync"

function CrmLayoutInner({ children }: { children: React.ReactNode }) {
	const { setCommandPaletteOpen } = useFrame()
	useFrameLayout()
	useTabUrlSync()

	return (
		<SidebarProvider>
			<AppFrame
				navigation={crmNavigationConfig}
				tabBar={<TabBar />}
				onOpenCommandPalette={() => setCommandPaletteOpen(true)}
				activeSection="crm"
			>
				{children}
			</AppFrame>
			<TabLinkInterceptor />
			<CommandPalette navigation={crmNavigationConfig} />
			<Toaster />
		</SidebarProvider>
	)
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<FrameProvider>
			<TabsProvider>
				<CrmLayoutInner>{children}</CrmLayoutInner>
			</TabsProvider>
		</FrameProvider>
	)
}
