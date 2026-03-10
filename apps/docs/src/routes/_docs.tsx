import { useState, useEffect } from "react"
import { createFileRoute, Outlet, useLocation, Link } from "@tanstack/react-router"
import { Menu, Search } from "lucide-react"
import { CommandPalette } from "@blazz/ui/components/patterns/command-palette/command-palette"
import { NavbarTabs, NavbarTab } from "@blazz/ui/components/patterns/navbar"
import { SidebarProvider } from "@blazz/ui/components/ui/sidebar"
import { DocsSidebar } from "~/components/docs/docs-sidebar"
import { DocsMobileSheet } from "~/components/docs/docs-mobile-sheet"
import { ThemeToggle } from "~/components/theme-toggle"
import { navigationConfig, sectionTabs, getSectionForPathname } from "~/config/navigation"
import { Toaster } from "@blazz/ui/components/ui/toast"
import { Kbd, KbdGroup } from "@blazz/ui/components/ui/kbd"

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { pathname } = useLocation()
  const activeSectionId = getSectionForPathname(pathname)
  useSyncDocTitle()

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-app">
      {/* Topbar */}
      <header className="h-14 shrink-0 bg-app z-50">
        <div className="flex h-full items-center px-4">
          {/* Left: hamburger mobile + logo desktop */}
          <div className="flex items-center gap-2">
            {/* Hamburger — visible uniquement en mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="inline-flex items-center justify-center rounded-md p-2 text-fg-muted hover:text-fg hover:bg-raised transition-colors lg:hidden"
              aria-label="Ouvrir le menu"
            >
              <Menu className="size-5" />
            </button>

            {/* Logo — caché en mobile */}
            <Link to="/" className="hidden lg:flex items-center">
              <img src="/logo_blazz_white.svg" alt="Blazz UI" className="hidden h-6 dark:block" />
              <img src="/logo_blazz_black.svg" alt="Blazz UI" className="block h-6 dark:hidden" />
            </Link>
          </div>

          {/* Section tabs — desktop only */}
          <NavbarTabs value={activeSectionId} className="hidden lg:flex ml-6">
            {sectionTabs.map((tab) => (
              <NavbarTab key={tab.id} value={tab.id}>
                <Link to={tab.defaultUrl}>{tab.label}</Link>
              </NavbarTab>
            ))}
          </NavbarTabs>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions right */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="inline-flex items-center gap-2 rounded-md p-2 text-fg-muted hover:text-fg hover:bg-raised transition-colors"
            >
              <Search className="size-4" />
              <KbdGroup className="hidden sm:inline-flex">
                <Kbd>⌘</Kbd>
                <Kbd>K</Kbd>
              </KbdGroup>
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

      {/* Body */}
      <SidebarProvider style={{ minHeight: 0 }} className="flex-1 gap-2 px-2 pb-2">
        <DocsSidebar sectionId={activeSectionId} />
        <main className="flex-1 overflow-y-auto min-w-0 bg-surface rounded-lg border border-container">
          <Outlet />
        </main>
        {/* Mobile sheet — à l'intérieur du SidebarProvider car il utilise des composants Sidebar */}
        <DocsMobileSheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} sectionId={activeSectionId} />
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
