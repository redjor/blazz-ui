"use client"

import type * as React from "react"
import { CommandPalette } from "@/components/features/command-palette/command-palette"
import { AppFrame } from "@/components/layout/app-frame"
import { FrameProvider, useFrame } from "@/components/layout/frame-context"
import { SidebarProvider } from "@/components/ui/sidebar"
import { navigationConfig } from "@/config/navigation"
import { useFrameLayout } from "@/lib/use-frame-layout"
import { Toaster } from "sonner"

// Filter navigation to only include component docs (no page examples)
const docsNavigation = navigationConfig.filter((section) => section.id === "components")

function FrameLayoutInner({ children }: { children: React.ReactNode }) {
	const { setCommandPaletteOpen } = useFrame()
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
			<CommandPalette navigation={docsNavigation} />
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
