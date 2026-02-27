"use client"

import { useEffect } from "react"
import { createFileRoute, Outlet, useLocation } from "@tanstack/react-router"
import { CommandPalette } from "@blazz/ui/components/features/command-palette/command-palette"
import { AppFrame } from "@blazz/ui/components/layout/app-frame"
import { FrameProvider, useFrame } from "@blazz/ui/components/layout/frame-context"
import { SidebarProvider } from "@blazz/ui/components/ui/sidebar"
import { sidebarConfig, navigationConfig } from "~/config/navigation"
import { useFrameLayout } from "@blazz/ui/lib/use-frame-layout"
import { Toaster } from "sonner"

export const Route = createFileRoute("/_docs")({
  component: DocsLayout,
})

const examplesUrl = import.meta.env.VITE_EXAMPLES_URL ?? ""

const sections = [
  { id: "examples", label: "Examples", href: examplesUrl || "/examples" },
]

function useSyncDocTitle() {
  const { pathname } = useLocation()
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      const h1 = document.querySelector("h1")
      document.title = h1?.textContent
        ? `${h1.textContent} — Blazz UI`
        : "Blazz UI"
    })
    return () => cancelAnimationFrame(frame)
  }, [pathname])
}

function DocsLayoutInner() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useFrame()
  useFrameLayout()
  useSyncDocTitle()

  return (
    <SidebarProvider>
      <AppFrame
        sidebarConfig={sidebarConfig}
        sections={sections}
        onOpenCommandPalette={() => setCommandPaletteOpen(true)}
        activeSection=""
        minimalTopBar
      >
        <Outlet />
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

function DocsLayout() {
  return (
    <FrameProvider>
      <DocsLayoutInner />
    </FrameProvider>
  )
}
