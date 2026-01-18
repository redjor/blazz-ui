"use client"

import type * as React from "react"
import { CommandPalette } from "@/components/features/command-palette/command-palette"
import { AppFrame } from "@/components/layout/app-frame"
import { FrameProvider, useFrame } from "@/components/layout/frame-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import { navigationConfig } from "@/config/navigation"

function FrameLayoutInner({ children }: { children: React.ReactNode }) {
	const { setCommandPaletteOpen } = useFrame()

	return (
		<SidebarProvider>
			<AppFrame
				navigation={navigationConfig}
				onOpenCommandPalette={() => setCommandPaletteOpen(true)}
			>
				{children}
			</AppFrame>
			<CommandPalette navigation={navigationConfig} />
		</SidebarProvider>
	)
}

export default function FrameLayout({ children }: { children: React.ReactNode }) {
	return (
		<FrameProvider>
			<FrameLayoutInner>{children}</FrameLayoutInner>
		</FrameProvider>
	)
}
