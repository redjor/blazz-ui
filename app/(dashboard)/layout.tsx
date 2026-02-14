"use client"

import type * as React from "react"
import { CommandPalette } from "@/components/features/command-palette/command-palette"
import { AppFrame } from "@/components/layout/app-frame"
import { FrameProvider, useFrame } from "@/components/layout/frame-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import { crmNavigationConfig } from "@/config/crm-navigation"
import { useFrameLayout } from "@/lib/use-frame-layout"
import { Toaster } from "sonner"

function CrmLayoutInner({ children }: { children: React.ReactNode }) {
	const { setCommandPaletteOpen } = useFrame()
	useFrameLayout()

	return (
		<SidebarProvider>
			<AppFrame
				navigation={crmNavigationConfig}
				onOpenCommandPalette={() => setCommandPaletteOpen(true)}
				activeSection="crm"
			>
				{children}
			</AppFrame>
			<CommandPalette navigation={crmNavigationConfig} />
			<Toaster />
		</SidebarProvider>
	)
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
	return (
		<FrameProvider>
			<CrmLayoutInner>{children}</CrmLayoutInner>
		</FrameProvider>
	)
}
