"use client"

import { useState, useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { Search, Github } from "lucide-react"
import { ThemeToggle } from "~/components/theme-toggle"
import { Kbd, KbdGroup } from "@blazz/ui/components/ui/kbd"
import { Button } from "@blazz/ui/components/ui/button"

const examplesUrl = import.meta.env.VITE_EXAMPLES_URL ?? ""

const navLinks = [
	{ label: "Components", href: "/docs/components" },
	{ label: "Blocks", href: "/docs/blocks" },
	{ label: "AI", href: "/docs/ai" },
]

export function Navbar() {
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 8)
		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	return (
		<header
			className={`sticky top-0 z-50 h-14 shrink-0 transition-[background-color,border-color] duration-200 ${
				scrolled
					? "bg-app/95 backdrop-blur-md border-b border-edge/50"
					: "bg-app border-b border-transparent"
			}`}
		>
			<div className="mx-auto flex h-full max-w-6xl items-center gap-6 px-6">
				{/* Logo */}
				<Link to="/" className="flex items-center gap-2.5 shrink-0">
					<img src="/logo_blazz_white.svg" alt="Blazz UI" className="hidden h-5 dark:block" />
					<img src="/logo_blazz_black.svg" alt="Blazz UI" className="block h-5 dark:hidden" />
					<span className="text-sm font-semibold text-fg">Blazz UI</span>
				</Link>

				{/* Nav links */}
				<nav className="hidden md:flex items-center gap-1">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							to={link.href}
							className="px-3 py-1.5 text-[13px] text-fg-muted hover:text-fg rounded-md hover:bg-raised transition-colors"
						>
							{link.label}
						</Link>
					))}
				</nav>

				{/* Spacer */}
				<div className="flex-1" />

				{/* Right actions */}
				<div className="flex items-center gap-1">
					<ThemeToggle />
					<Link
						to="/docs/components"
						className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-fg-muted hover:text-fg hover:bg-raised transition-colors"
					>
						<Search className="size-3.5" />
						<KbdGroup className="hidden sm:inline-flex">
							<Kbd>⌘</Kbd>
							<Kbd>K</Kbd>
						</KbdGroup>
					</Link>
					<a href={`${examplesUrl}/examples/crm/dashboard`}>
						<Button size="sm">Try demo</Button>
					</a>
				</div>
			</div>
		</header>
	)
}
