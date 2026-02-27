import { useState, useEffect } from "react"
import { createFileRoute, Outlet, useLocation, Link } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { CommandPalette } from "@blazz/ui/components/patterns/command-palette/command-palette"
import { SidebarProvider } from "@blazz/ui/components/ui/sidebar"
import { DocsSidebar } from "~/components/docs/docs-sidebar"
import { ThemeToggle } from "~/components/theme-toggle"
import { navigationConfig } from "~/config/navigation"
import { Toaster } from "sonner"

export const Route = createFileRoute("/_docs")({
  component: DocsLayout,
})

const examplesUrl = import.meta.env.VITE_EXAMPLES_URL ?? ""

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

function DocsLayout() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  useSyncDocTitle()

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Topbar — h-14 fixes the reference for the sidebar height */}
      <header className="h-14 shrink-0 border-b bg-surface z-50">
        <div className="flex h-full items-center justify-between px-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <img src="/logo_blazz_white.svg" alt="Blazz UI" className="hidden h-6 dark:block" />
            <img src="/logo_blazz_gold.svg" alt="Blazz UI" className="block h-6 dark:hidden" />
          </Link>

          {/* Actions droite */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="inline-flex items-center gap-2 rounded-md border bg-raised px-3 py-1.5 text-sm text-fg-muted hover:text-fg transition-colors"
            >
              <Search className="size-3.5" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden sm:inline-flex items-center gap-0.5 rounded border bg-surface px-1.5 py-0.5 text-xs font-mono text-fg-muted">
                ⌘K
              </kbd>
            </button>
            <ThemeToggle />
            <a
              href={examplesUrl || "/examples"}
              className="inline-flex items-center rounded-md px-3 py-1.5 text-sm text-fg-muted hover:text-fg hover:bg-raised transition-colors"
            >
              Examples
            </a>
          </div>
        </div>
      </header>

      {/* Body: SidebarProvider override minHeight pour ne pas déborder du flex-col */}
      <SidebarProvider style={{ minHeight: 0 }} className="flex-1">
        <DocsSidebar />
        <main className="flex-1 overflow-y-auto min-w-0">
          <Outlet />
        </main>
      </SidebarProvider>

      <CommandPalette
        navigation={navigationConfig}
        open={commandPaletteOpen}
        onOpenChange={setCommandPaletteOpen}
      />
      <Toaster />
    </div>
  )
}
