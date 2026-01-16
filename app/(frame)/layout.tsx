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
				sidebarFooter={
					<div className="flex items-center gap-2 text-xs text-sidebar-foreground">
						<kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-sidebar-border bg-sidebar px-1.5 font-mono text-[10px] font-medium">
							<span className="text-xs">⌘</span>K
						</kbd>
						<span>to search</span>
					</div>
				}
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
