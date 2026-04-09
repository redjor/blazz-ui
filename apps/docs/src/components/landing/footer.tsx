"use client"

import { Button } from "@blazz/ui/components/ui/button"
import { ArrowRight, Github, Sparkles } from "lucide-react"
import Link from "next/link"

const githubUrl = "https://github.com/redjor/blazz-ui"

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
			{ label: "Documentation", href: "/docs" },
			{ label: "Licensing", href: "/license" },
			{ label: "GitHub", href: githubUrl },
			{ label: "Changelog", href: `${githubUrl}/blob/main/CHANGELOG.md` },
		],
	},
	{
		title: "Company",
		links: [
			{ label: "Contact", href: `${githubUrl}/issues/new` },
			{ label: "Docs", href: "/docs/components" },
		],
	},
]

export function Footer() {
	return (
		<footer className="px-6 pb-12 pt-8">
			<div className="mx-auto max-w-6xl">
				{/* CTA strip */}
				<div className="relative mb-20 overflow-hidden rounded-3xl border border-brand/50 bg-[oklch(0.18_0.015_275)] px-8 py-16 text-center sm:px-12 md:py-20">
					{/* Radial glow */}
					<div aria-hidden className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_oklch(0.585_0.22_275/0.35)_0%,_transparent_60%)]" />
					{/* Grid pattern */}
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:44px_44px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]"
					/>
					{/* Top fade edge */}
					<div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />

					<div className="mx-auto flex max-w-2xl flex-col items-center gap-7">
						<div className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[11px] font-medium text-white/80 backdrop-blur">
							<Sparkles className="size-3 text-brand-fg" />
							Ship your next pro app in days, not months
						</div>

						<h2 className="text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl md:text-5xl leading-[1.05]">
							Ready to build <span className="bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent">serious software?</span>
						</h2>

						<p className="max-w-lg text-sm leading-relaxed text-white/65 md:text-base">
							Start free with the open-source core. Upgrade to Pro when you're ready for blocks, AI and the full enterprise package.
						</p>

						<div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
							<Link href="/docs">
								<Button size="lg" className="gap-2 bg-white text-[oklch(0.18_0.015_275)] hover:bg-white/90">
									Browse docs
									<ArrowRight className="size-4" />
								</Button>
							</Link>
							<a href={githubUrl} target="_blank" rel="noreferrer">
								<Button variant="outline" size="lg" className="gap-2 border-white/20 bg-white/5 text-white hover:bg-white/10 hover:text-white">
									<Github className="size-4" />
									Star on GitHub
								</Button>
							</a>
						</div>

						<div className="mt-1 flex items-center gap-4 text-[11px] text-white/50">
							<span className="inline-flex items-center gap-1.5">
								<span className="size-1.5 rounded-full bg-positive" />
								MIT core
							</span>
							<span className="inline-flex items-center gap-1.5">
								<span className="size-1.5 rounded-full bg-white/40" />
								One-time €249
							</span>
							<span className="inline-flex items-center gap-1.5">
								<span className="size-1.5 rounded-full bg-white/40" />
								No lock-in
							</span>
						</div>
					</div>
				</div>

				{/* Footer columns */}
				<div className="flex flex-col gap-10 border-t border-edge/40 pt-12 md:flex-row">
					<div className="md:w-1/3">
						<Link href="/" className="mb-4 flex items-center gap-2">
							<img src="/logo_blazz_white.svg" alt="Blazz" className="hidden h-4 dark:block" />
							<img src="/logo_blazz_black.svg" alt="Blazz" className="block h-4 dark:hidden" />
						</Link>
						<p className="max-w-xs text-xs leading-relaxed text-fg-muted">
							The React component kit for data-heavy professional applications. Designed for teams shipping CRM, ATS, inventory and internal tools.
						</p>
					</div>

					<div className="grid flex-1 grid-cols-3 gap-6">
						{linkGroups.map((group) => (
							<div key={group.title}>
								<h4 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.14em] text-fg-subtle">{group.title}</h4>
								<ul className="space-y-2">
									{group.links.map((link) => (
										<li key={link.label}>
											<a href={link.href} className="text-xs text-fg-muted transition-colors hover:text-fg">
												{link.label}
											</a>
										</li>
									))}
								</ul>
							</div>
						))}
					</div>
				</div>

				<div className="mt-10 flex items-center justify-between border-t border-edge/40 pt-6">
					<span className="text-[11px] text-fg-subtle">&copy; {new Date().getFullYear()} Blazz. All rights reserved.</span>
					<span className="text-[11px] text-fg-subtle">Made for people who ship.</span>
				</div>
			</div>
		</footer>
	)
}
