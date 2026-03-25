"use client"

import { Page } from "@blazz/ui/components/ui/page"
import {
	ArrowRight,
	Blocks,
	Box,
	Cpu,
	Eye,
	Layers,
	LayoutGrid,
	Puzzle,
	Sparkles,
	Zap,
} from "lucide-react"
import Link from "next/link"

const sections = [
	{
		id: "components",
		title: "Components",
		description: "72+ primitives — buttons, inputs, dialogs, tables, and more.",
		href: "/docs/components",
		icon: LayoutGrid,
	},
	{
		id: "blocks",
		title: "Blocks",
		description: "38+ business blocks — data tables, kanban, charts, stats grids.",
		href: "/docs/blocks",
		icon: Blocks,
	},
	{
		id: "ai",
		title: "AI",
		description: "52+ generative components — chat, reasoning, entity cards.",
		href: "/docs/ai",
		icon: Sparkles,
	},
	{
		id: "guide",
		title: "Guide",
		description: "Design tokens, typography, spacing concepts, and tools.",
		href: "/docs/guide",
		icon: Eye,
	},
]

export default function IntroductionPage() {
	return (
		<Page>
			{/* Hero */}
			<div className="relative -mx-6 -mt-6 overflow-hidden rounded-b-2xl border-b border-edge bg-muted/40 bg-cover bg-center px-6 py-16 text-center">
				<div
					className="pointer-events-none absolute inset-0 opacity-40"
					style={{
						backgroundImage: "radial-gradient(circle, var(--border-default) 1px, transparent 1px)",
						backgroundSize: "24px 24px",
					}}
				/>
				<div className="relative z-10 mx-auto max-w-2xl space-y-3">
					<h1 className="text-4xl font-bold tracking-tight text-fg">Blazz UI</h1>
					<p className="text-base text-fg-muted">
						A React component kit for shipping serious business apps. CRM, ATS, inventory, internal
						tools — the parts teams usually build from scratch.
					</p>
				</div>
			</div>

			{/* Content */}
			<div className="space-y-12 py-10">
				{/* Vision */}
				<section className="space-y-3">
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted border border-edge">
							<Zap className="h-4 w-4 text-fg-muted" />
						</div>
						<h2 className="text-sm font-semibold text-fg">Vision</h2>
					</div>
					<div className="space-y-2 pl-11 text-sm leading-relaxed text-fg-secondary">
						<p>
							Companies pay Salesforce, SAP, or HubSpot hundreds per user per month for software
							that barely fits their workflow. A senior engineer with the right building blocks can
							ship something better in weeks — tailored exactly to how their team works.
						</p>
						<p>
							Blazz UI provides those building blocks. Not a template. Not a boilerplate. A
							production-grade component library designed for data-heavy applications where users
							spend 8 hours a day.
						</p>
					</div>
				</section>

				{/* Approach */}
				<section className="space-y-3">
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted border border-edge">
							<Puzzle className="h-4 w-4 text-fg-muted" />
						</div>
						<h2 className="text-sm font-semibold text-fg">Approach</h2>
					</div>
					<div className="space-y-2 pl-11 text-sm leading-relaxed text-fg-secondary">
						<p>
							Every component follows three principles: composition over configuration, information
							density without clutter, and AI-native from day one.
						</p>
						<div className="grid gap-3 pt-1 sm:grid-cols-3">
							<div className="space-y-1 rounded-lg border border-edge bg-card px-3.5 py-2.5">
								<div className="flex items-center gap-2">
									<Layers className="h-3.5 w-3.5 text-fg-muted" />
									<span className="text-xs font-medium text-fg">Composition</span>
								</div>
								<p className="text-xs text-fg-muted">
									Small, focused components that combine freely. No monolithic props APIs.
								</p>
							</div>
							<div className="space-y-1 rounded-lg border border-edge bg-card px-3.5 py-2.5">
								<div className="flex items-center gap-2">
									<Box className="h-3.5 w-3.5 text-fg-muted" />
									<span className="text-xs font-medium text-fg">Density</span>
								</div>
								<p className="text-xs text-fg-muted">
									13px tables, 32px inputs, 40px rows. Enterprise-grade information density.
								</p>
							</div>
							<div className="space-y-1 rounded-lg border border-edge bg-card px-3.5 py-2.5">
								<div className="flex items-center gap-2">
									<Cpu className="h-3.5 w-3.5 text-fg-muted" />
									<span className="text-xs font-medium text-fg">AI-native</span>
								</div>
								<p className="text-xs text-fg-muted">
									MCP server, structured docs, and 52 generative UI components.
								</p>
							</div>
						</div>
					</div>
				</section>

				{/* Foundations */}
				<section className="space-y-3">
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted border border-edge">
							<Layers className="h-4 w-4 text-fg-muted" />
						</div>
						<h2 className="text-sm font-semibold text-fg">Foundations</h2>
					</div>
					<div className="space-y-2 pl-11 text-sm leading-relaxed text-fg-secondary">
						<p>
							Built on Base UI for headless accessibility, Tailwind v4 for styling, and 25 oklch
							design tokens for theming. Three layers stack to cover any use case:
						</p>
						<div className="grid gap-x-6 gap-y-3 pt-1 sm:grid-cols-3">
							<div className="space-y-0.5">
								<span className="text-2xl font-semibold text-fg tabular-nums">72+</span>
								<p className="text-xs text-fg-muted">
									Primitives — buttons, inputs, dialogs, cards, and layout components.
								</p>
							</div>
							<div className="space-y-0.5">
								<span className="text-2xl font-semibold text-fg tabular-nums">38+</span>
								<p className="text-xs text-fg-muted">
									Blocks — data tables, kanban boards, charts, stats grids, and pipelines.
								</p>
							</div>
							<div className="space-y-0.5">
								<span className="text-2xl font-semibold text-fg tabular-nums">52+</span>
								<p className="text-xs text-fg-muted">
									AI components — chat interfaces, reasoning, entity cards, and workflows.
								</p>
							</div>
						</div>
						<p className="pt-1">
							Three full demo apps (CRM, ATS, inventory) show every component in a real context you
							can fork and adapt.
						</p>
					</div>
				</section>

				{/* Quick links */}
				<section className="space-y-3 border-t border-edge pt-8">
					<h2 className="text-sm font-semibold text-fg">Explore the docs</h2>
					<div className="grid gap-2 sm:grid-cols-2">
						{sections.map((section) => (
							<Link
								key={section.id}
								href={section.href}
								className="group flex items-center gap-3 rounded-lg border border-edge bg-card px-3.5 py-3 transition-colors hover:bg-muted"
							>
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted border border-edge">
									<section.icon className="h-4 w-4 text-fg-muted" />
								</div>
								<div className="min-w-0 flex-1">
									<span className="text-sm font-medium text-fg">{section.title}</span>
									<p className="text-xs text-fg-muted">{section.description}</p>
								</div>
								<ArrowRight className="h-3.5 w-3.5 text-fg-muted opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
							</Link>
						))}
					</div>
				</section>
			</div>
		</Page>
	)
}
