"use client"

import type * as React from "react"
import { CommandPalette } from "@/components/features/command-palette/command-palette"
import { AppFrame } from "@/components/layout/app-frame"
import { FrameProvider, useFrame } from "@/components/layout/frame-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import { navigationConfig } from "@/config/navigation"
import { Toaster } from "sonner"

function FrameLayoutInner({ children }: { children: React.ReactNode }) {
	const { setCommandPaletteOpen } = useFrame()

	return (
		<SidebarProvider>
			<AppFrame onOpenCommandPalette={() => setCommandPaletteOpen(true)}>
				{children}
			</AppFrame>
			<CommandPalette navigation={navigationConfig} />
			<Toaster />
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
