"use client"

import { CommandPalette } from "@blazz/ui/components/patterns/command-palette/command-palette"
import { NavbarTab, NavbarTabs } from "@blazz/ui/components/patterns/navbar"
import { Kbd, KbdGroup } from "@blazz/ui/components/ui/kbd"
import { SidebarProvider } from "@blazz/ui/components/ui/sidebar"
import { Toaster } from "@blazz/ui/components/ui/toast"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, Search } from "lucide-react"
import { type ReactNode, useEffect, useState } from "react"
import { DocsMobileSheet } from "~/components/docs/docs-mobile-sheet"
import { DocsSidebar } from "~/components/docs/docs-sidebar"
import { ThemeToggle } from "~/components/theme-toggle"
import { getSectionForPathname, navigationConfig, sectionTabs } from "~/config/navigation"

function useSyncDocTitle() {
	const pathname = usePathname()
	useEffect(() => {
		const frame = requestAnimationFrame(() => {
			const h1 = document.querySelector("h1")
			document.title = h1?.textContent ? `${h1.textContent} — Blazz UI` : "Blazz UI"
		})
		return () => cancelAnimationFrame(frame)
	}, [pathname])
}

export default function DocsLayout({ children }: { children: ReactNode }) {
	const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
	const pathname = usePathname()
	const activeSectionId = getSectionForPathname(pathname)
	useSyncDocTitle()

	return (
		<div className="flex h-screen flex-col overflow-hidden bg-app">
			<header className="h-14 shrink-0 bg-app z-50">
				<div className="flex h-full items-center px-4">
					<div className="flex items-center gap-2">
						<button
							type="button"
							onClick={() => setMobileMenuOpen(true)}
							className="inline-flex items-center justify-center rounded-md p-2 text-fg-muted hover:text-fg hover:bg-muted transition-colors lg:hidden"
							aria-label="Ouvrir le menu"
						>
							<Menu className="size-5" />
						</button>
						<Link href="/" className="hidden lg:flex items-center">
							<img src="/logo_blazz_white.svg" alt="Blazz UI" className="hidden h-6 dark:block" />
							<img src="/logo_blazz_black.svg" alt="Blazz UI" className="block h-6 dark:hidden" />
						</Link>
					</div>

					<NavbarTabs value={activeSectionId} className="hidden lg:flex ml-6">
						{sectionTabs.map((tab) => (
							<NavbarTab key={tab.id} value={tab.id}>
								<Link href={tab.defaultUrl}>{tab.label}</Link>
							</NavbarTab>
						))}
					</NavbarTabs>

					<div className="flex-1" />

					<div className="flex items-center gap-1">
						<button
							type="button"
							onClick={() => setCommandPaletteOpen(true)}
							className="inline-flex items-center gap-2 rounded-md p-2 text-fg-muted hover:text-fg hover:bg-muted transition-colors"
						>
							<Search className="size-4" />
							<KbdGroup className="hidden sm:inline-flex">
								<Kbd>⌘</Kbd>
								<Kbd>K</Kbd>
							</KbdGroup>
						</button>
						<ThemeToggle />
					</div>
				</div>
			</header>

			<SidebarProvider style={{ minHeight: 0 }} className="flex-1 gap-2 px-2 pb-2">
				<DocsSidebar sectionId={activeSectionId} />
				<main className="flex-1 overflow-y-auto min-w-0 bg-card rounded-lg border border-container">
					{children}
				</main>
				<DocsMobileSheet
					open={mobileMenuOpen}
					onOpenChange={setMobileMenuOpen}
					sectionId={activeSectionId}
				/>
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
