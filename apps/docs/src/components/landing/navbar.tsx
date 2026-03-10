"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { Kbd, KbdGroup } from "@blazz/ui/components/ui/kbd"
import { Link } from "@tanstack/react-router"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { ThemeToggle } from "~/components/theme-toggle"

const examplesUrl = import.meta.env.VITE_EXAMPLES_URL ?? ""
const demoHref = examplesUrl ? `${examplesUrl}/examples/crm/dashboard` : "/docs/components"

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
			className={`sticky top-0 z-50 h-13 shrink-0 transition-[background-color,border-color] duration-200 ${
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
				</Link>

				{/* Nav links */}
				<nav className="hidden md:flex items-center gap-1">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							to={link.href}
							className="rounded-md px-3 py-1.5 text-[13px] text-fg-muted transition-colors hover:text-fg hover:bg-raised"
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
						className="inline-flex items-center gap-2 rounded-md px-2.5 py-1.5 text-[13px] text-fg-muted transition-colors hover:text-fg hover:bg-raised"
					>
						<Search className="size-3.5" />
						<KbdGroup className="hidden sm:inline-flex">
							<Kbd>⌘</Kbd>
							<Kbd>K</Kbd>
						</KbdGroup>
					</Link>
					<a href={demoHref}>
						<Button size="sm">Open demo</Button>
					</a>
				</div>
			</div>
		</header>
	)
}
