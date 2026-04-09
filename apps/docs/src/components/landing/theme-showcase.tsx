"use client"

import { motion } from "motion/react"
import { SectionShell } from "./section-shell"

const tokens = [
	{ name: "--surface", hint: "page", light: "oklch(0.99 0 0)", dark: "oklch(0.17 0.007 265)" },
	{ name: "--card", hint: "raised", light: "oklch(0.98 0 0)", dark: "oklch(0.20 0.007 265)" },
	{ name: "--fg", hint: "text", light: "oklch(0.20 0.01 265)", dark: "oklch(0.97 0 0)" },
	{ name: "--brand", hint: "accent", light: "oklch(0.50 0.22 275)", dark: "oklch(0.585 0.22 275)" },
	{ name: "--positive", hint: "success", light: "oklch(0.62 0.17 148)", dark: "oklch(0.70 0.17 148)" },
	{ name: "--warning", hint: "warning", light: "oklch(0.75 0.17 75)", dark: "oklch(0.82 0.17 75)" },
]

export function ThemeShowcase() {
	return (
		<SectionShell eyebrow="Design system" title="Built on 25 oklch tokens" description="A perceptually-uniform color system in light and dark — every shade is deliberate, every token lives in CSS.">
			<motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="grid gap-6 lg:grid-cols-2">
				{/* Light panel */}
				<div className="overflow-hidden rounded-xl border border-container shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)]">
					<div className="flex items-center justify-between border-b border-black/[0.08] bg-[oklch(0.99_0_0)] px-4 py-2.5">
						<span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[oklch(0.45_0.01_265)]">Light theme</span>
						<span className="text-[11px] text-[oklch(0.55_0.01_265)]">blazz/dashboard</span>
					</div>
					<div className="bg-[oklch(0.98_0_0)] p-5">
						<img src="/thumbnails/light/stats-grid.png" alt="Stats grid in light theme" className="w-full rounded-lg border border-black/[0.08]" />
					</div>
				</div>

				{/* Dark panel */}
				<div className="overflow-hidden rounded-xl border border-container shadow-[0_20px_60px_-30px_rgba(0,0,0,0.45)]">
					<div className="flex items-center justify-between border-b border-white/[0.08] bg-[oklch(0.17_0.007_265)] px-4 py-2.5">
						<span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[oklch(0.70_0.01_265)]">Dark theme</span>
						<span className="text-[11px] text-[oklch(0.60_0.01_265)]">blazz/dashboard</span>
					</div>
					<div className="bg-[oklch(0.20_0.007_265)] p-5">
						<img src="/thumbnails/dark/stats-grid.png" alt="Stats grid in dark theme" className="w-full rounded-lg border border-white/[0.08]" />
					</div>
				</div>
			</motion.div>

			{/* Token strip */}
			<motion.div
				initial={{ opacity: 0, y: 12 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.3, delay: 0.1 }}
				className="mt-10 rounded-xl border border-edge/50 bg-muted/30 p-6"
			>
				<p className="mb-5 text-xs font-medium uppercase tracking-[0.14em] text-fg-subtle">Sample tokens</p>
				<div className="grid grid-cols-2 gap-x-6 gap-y-5 sm:grid-cols-3 lg:grid-cols-6">
					{tokens.map((token) => (
						<div key={token.name} className="flex items-center gap-3">
							<div className="flex size-9 shrink-0 overflow-hidden rounded-md ring-1 ring-edge/60">
								<div className="h-full w-1/2" style={{ backgroundColor: token.light }} />
								<div className="h-full w-1/2" style={{ backgroundColor: token.dark }} />
							</div>
							<div className="min-w-0">
								<p className="truncate font-mono text-[11px] text-fg">{token.name}</p>
								<p className="text-[11px] text-fg-subtle">{token.hint}</p>
							</div>
						</div>
					))}
				</div>
			</motion.div>
		</SectionShell>
	)
}
