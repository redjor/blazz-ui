"use client"

import type * as React from "react"
import { CommandPalette } from "@blazz/ui/components/features/command-palette/command-palette"
import { AppFrame } from "@blazz/ui/components/layout/app-frame"
import { FrameProvider, useFrame } from "@blazz/ui/components/layout/frame-context"
import { SidebarProvider } from "@blazz/ui/components/ui/sidebar"
import { navigationConfig } from "@/config/navigation"
import { useFrameLayout } from "@blazz/ui/lib/use-frame-layout"
import { Toaster } from "sonner"

function FrameLayoutInner({ children }: { children: React.ReactNode }) {
	const { commandPaletteOpen, setCommandPaletteOpen } = useFrame()
	useFrameLayout()

	return (
		<SidebarProvider>
			<AppFrame
				onOpenCommandPalette={() => setCommandPaletteOpen(true)}
				activeSection="docs"
				minimalTopBar
			>
				{children}
			</AppFrame>
			<CommandPalette
				navigation={navigationConfig}
				open={commandPaletteOpen}
				onOpenChange={setCommandPaletteOpen}
			/>
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
