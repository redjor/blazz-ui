"use client"

import { useState, useEffect } from "react"
import { Link } from "@tanstack/react-router"
import { Button } from "@blazz/ui/components/ui/button"
import { cn } from "@blazz/ui/lib/utils"

const examplesUrl = import.meta.env.VITE_EXAMPLES_URL ?? ""

const navLinks = [
	{ label: "Features", href: "#features" },
	{ label: "Apps", href: "#apps" },
	{ label: "Pricing", href: "#pricing" },
	{ label: "FAQ", href: "#faq" },
]

export function Navbar() {
	const [scrolled, setScrolled] = useState(false)

	useEffect(() => {
		const onScroll = () => setScrolled(window.scrollY > 20)
		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [])

	return (
		<nav
			className={cn(
				"fixed top-0 left-0 right-0 z-50 transition-all duration-300",
				scrolled
					? "bg-app/80 backdrop-blur-xl border-b border-edge/50"
					: "bg-transparent"
			)}
		>
			<div className="mx-auto max-w-6xl flex items-center justify-between px-6 h-16">
				<Link to="/" className="flex items-center gap-2">
					<img
						src="/logo_blazz_white.svg"
						alt="Blazz"
						width={28}
						height={28}
					/>
					<span className="text-fg font-semibold text-lg">Pro UI Kit</span>
				</Link>

				<div className="hidden md:flex items-center gap-8">
					{navLinks.map((link) => (
						<a
							key={link.href}
							href={link.href}
							className="text-fg-muted hover:text-fg text-sm transition-colors"
						>
							{link.label}
						</a>
					))}
				</div>

				<a href={`${examplesUrl}/examples/crm/dashboard`}>
					<Button size="sm">Try the demo</Button>
				</a>
			</div>
		</nav>
	)
}
