"use client"

import { useState } from "react"
import { Link } from "@tanstack/react-router"
import { Button } from "@blazz/ui/components/ui/button"
import { Input } from "@blazz/ui/components/ui/input"

const linkGroups = [
	{
		title: "Product",
		links: [
			{ label: "Components", href: "/docs/components" },
			{ label: "Pricing", href: "#pricing" },
		],
	},
	{
		title: "Resources",
		links: [
			{ label: "Documentation", href: "/docs/components" },
			{ label: "GitHub", href: "#" },
			{ label: "Changelog", href: "#" },
		],
	},
	{
		title: "Company",
		links: [
			{ label: "About", href: "#" },
			{ label: "Contact", href: "#" },
			{ label: "Twitter", href: "#" },
		],
	},
]

export function Footer() {
	const [email, setEmail] = useState("")

	return (
		<footer className="py-16 px-6 border-t border-edge">
			<div className="mx-auto max-w-6xl">
				{/* Waitlist */}
				<div className="text-center mb-16">
					<h3 className="text-lg font-semibold text-fg mb-2">
						Join the waitlist
					</h3>
					<p className="text-sm text-fg-muted mb-6">
						Be the first to know when Pro UI Kit launches.
					</p>
					<form
						onSubmit={(e) => e.preventDefault()}
						className="flex gap-2 max-w-sm mx-auto"
					>
						<Input
							type="email"
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
						<Button type="submit" size="default">
							Join waitlist
						</Button>
					</form>
				</div>

				{/* Links grid */}
				<div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-16">
					{linkGroups.map((group) => (
						<div key={group.title}>
							<h4 className="text-xs font-semibold text-fg uppercase tracking-wider mb-4">
								{group.title}
							</h4>
							<ul className="space-y-2">
								{group.links.map((link) => (
									<li key={link.label}>
										<a
											href={link.href}
											className="text-sm text-fg-muted hover:text-fg transition-colors"
										>
											{link.label}
										</a>
									</li>
								))}
							</ul>
						</div>
					))}
				</div>

				{/* Bottom bar */}
				<div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-edge">
					<Link to="/" className="flex items-center gap-2">
						<img
							src="/logo_blazz_white.svg"
							alt="Blazz"
							width={20}
							height={20}
						/>
						<span className="text-xs text-fg-muted">
							&copy; {new Date().getFullYear()} Blazz. All rights reserved.
						</span>
					</Link>
				</div>
			</div>
		</footer>
	)
}
