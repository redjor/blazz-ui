"use client"

import { Link } from "@tanstack/react-router"

const linkGroups = [
	{
		title: "Product",
		links: [
			{ label: "Components", href: "/docs/components" },
			{ label: "Patterns", href: "/docs/patterns" },
			{ label: "Blocks", href: "/docs/blocks" },
			{ label: "AI", href: "/docs/ai" },
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
	return (
		<footer className="px-6 pt-4 pb-8">
			<div className="mx-auto max-w-6xl rounded-xl border border-container bg-surface px-8 py-10 sm:px-12">
				<div className="flex flex-col md:flex-row gap-10">
					{/* Brand */}
					<div className="md:w-1/3">
						<Link to="/" className="flex items-center gap-2 mb-3">
							<img
								src="/logo_blazz_white.svg"
								alt="Blazz"
								className="hidden h-4 dark:block"
							/>
							<img
								src="/logo_blazz_black.svg"
								alt="Blazz"
								className="block h-4 dark:hidden"
							/>
							<span className="text-[13px] font-semibold text-fg">Blazz UI</span>
						</Link>
						<p className="text-xs text-fg-muted leading-relaxed max-w-xs">
							The React component kit for data-heavy professional applications.
							Built for teams who ship fast.
						</p>
					</div>

					{/* Links */}
					<div className="flex-1 grid grid-cols-3 gap-6">
						{linkGroups.map((group) => (
							<div key={group.title}>
								<h4 className="text-2xs font-semibold text-fg-muted uppercase tracking-wider mb-3">
									{group.title}
								</h4>
								<ul className="space-y-1.5">
									{group.links.map((link) => (
										<li key={link.label}>
											<a
												href={link.href}
												className="text-xs text-fg-muted hover:text-fg transition-colors"
											>
												{link.label}
											</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				{/* Bottom */}
				<div className="mt-8 pt-6 border-t border-edge/40">
					<span className="text-2xs text-fg-subtle">
						&copy; {new Date().getFullYear()} Blazz. All rights reserved.
					</span>
				</div>
			</div>
		</footer>
	)
}
