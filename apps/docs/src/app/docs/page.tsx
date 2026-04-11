"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { Page } from "@blazz/ui/components/ui/page"
import { ArrowRight, Blocks, BookOpen, Box, Cpu, Eye, Github, Layers, LayoutGrid, Sparkles, Zap } from "lucide-react"
import Link from "next/link"

const githubUrl = "https://github.com/redjor/blazz-ui"

const principles = [
	{
		icon: Layers,
		title: "Composition",
		description: "Small, focused components that combine freely. No monolithic props APIs, no black boxes.",
	},
	{
		icon: Box,
		title: "Density",
		description: "13px tables, 32px inputs, 40px rows. Enterprise-grade information density tuned for 8-hour sessions.",
	},
	{
		icon: Cpu,
		title: "AI-native",
		description: "MCP server, structured docs, and 52 generative UI components so AI assistants write correct code.",
	},
]

const foundations = [
	{
		value: "72+",
		label: "Primitives",
		description: "Buttons, inputs, dialogs, cards, and layout components.",
	},
	{
		value: "38+",
		label: "Blocks",
		description: "Data tables, kanban boards, charts, stats grids, pipelines.",
	},
	{
		value: "52+",
		label: "AI components",
		description: "Chat interfaces, reasoning, entity cards, workflows.",
	},
]

const previews = [
	{ slug: "data-table", label: "DataTable", category: "Block" },
	{ slug: "kanban-board", label: "Kanban board", category: "Block" },
	{ slug: "stats-grid", label: "Stats grid", category: "Block" },
	{ slug: "chart-card", label: "Chart card", category: "Block" },
	{ slug: "form-field", label: "Form field", category: "Pattern" },
	{ slug: "page-header", label: "Page header", category: "Block" },
]

const sections = [
	{
		id: "components",
		title: "Components",
		description: "72+ primitives — buttons, inputs, dialogs, tables, and more.",
		href: "/docs/components",
		icon: LayoutGrid,
		count: "72+",
	},
	{
		id: "blocks",
		title: "Blocks",
		description: "38+ business blocks — data tables, kanban, charts, stats grids.",
		href: "/docs/blocks",
		icon: Blocks,
		count: "38+",
	},
	{
		id: "ai",
		title: "AI",
		description: "52+ generative components — chat, reasoning, entity cards.",
		href: "/docs/ai",
		icon: Sparkles,
		count: "52+",
	},
	{
		id: "guide",
		title: "Guide",
		description: "Design tokens, typography, spacing, density, and tools.",
		href: "/docs/guide",
		icon: Eye,
		count: "Read",
	},
]

export default function IntroductionPage() {
	return (
		<Page>
			{/* Hero — bleed out of page padding */}
			<div className="relative -mx-6 -mt-6 overflow-hidden rounded-b-2xl border-b border-edge bg-muted/30 px-6 pb-14 pt-16">
				{/* Ambient glow */}
				<div aria-hidden className="pointer-events-none absolute inset-x-0 -top-20 -z-10 flex justify-center">
					<div className="h-[380px] w-[640px] rounded-full bg-brand/10 blur-[120px]" />
				</div>
				{/* Dot pattern */}
				<div
					aria-hidden
					className="pointer-events-none absolute inset-0 -z-10 opacity-40"
					style={{
						backgroundImage: "radial-gradient(circle, var(--border-default) 1px, transparent 1px)",
						backgroundSize: "24px 24px",
					}}
				/>

				<div className="relative mx-auto max-w-3xl text-center">
					<div className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-edge/60 bg-card/60 px-3 py-1 text-[11px] font-medium text-fg-muted backdrop-blur">
						<BookOpen className="size-3 text-brand" />
						Documentation
					</div>

					<h1 className="text-balance text-4xl font-semibold tracking-tight text-fg leading-[1] sm:text-5xl lg:text-6xl">
						Build <span className="bg-gradient-to-br from-fg to-fg-muted bg-clip-text text-transparent">serious software</span>, fast.
					</h1>

					<p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-fg-muted sm:text-base">
						A React component kit for shipping CRM, ATS, inventory, and internal tools — the parts teams usually build from scratch.
					</p>

					<div className="mt-7 flex flex-col items-center justify-center gap-2.5 sm:flex-row">
						<Link href="/docs/guide">
							<Button size="default" className="gap-1.5">
								Quickstart
								<ArrowRight className="size-3.5" />
							</Button>
						</Link>
						<Link href="/docs/components">
							<Button variant="outline" size="default" className="gap-1.5">
								<LayoutGrid className="size-3.5" />
								Browse components
							</Button>
						</Link>
						<a href={githubUrl} target="_blank" rel="noreferrer">
							<Button variant="ghost" size="default" className="gap-1.5">
								<Github className="size-3.5" />
								GitHub
							</Button>
						</a>
					</div>

					<div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[11px] text-fg-subtle">
						<span className="inline-flex items-center gap-1.5">
							<span className="size-1.5 rounded-full bg-positive" />
							MIT core
						</span>
						<span className="inline-flex items-center gap-1.5">
							<span className="size-1.5 rounded-full bg-brand" />
							Light & dark
						</span>
						<span className="inline-flex items-center gap-1.5">
							<span className="size-1.5 rounded-full bg-fg-subtle" />
							TypeScript strict
						</span>
					</div>
				</div>
			</div>

			{/* Content */}
			<div className="space-y-20 py-14">
				{/* Foundations — big stats */}
				<section>
					<div className="grid grid-cols-3 gap-6 border-b border-edge/60 pb-10">
						{foundations.map((stat) => (
							<div key={stat.label}>
								<div className="text-4xl font-semibold tracking-tight text-fg tabular-nums lg:text-5xl">{stat.value}</div>
								<div className="mt-2 text-sm font-medium text-fg">{stat.label}</div>
								<p className="mt-1 text-[13px] leading-relaxed text-fg-muted">{stat.description}</p>
							</div>
						))}
					</div>
				</section>

				{/* Vision */}
				<section>
					<p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">Vision</p>
					<h2 className="max-w-2xl text-balance text-2xl font-semibold tracking-tight text-fg lg:text-3xl">Internal tools shouldn't cost €200 per seat per month.</h2>
					<div className="mt-5 max-w-2xl space-y-4 text-[15px] leading-relaxed text-fg-muted">
						<p>
							Companies pay Salesforce, SAP or HubSpot hundreds per user per month for software that barely fits their workflow. A senior engineer with the right building blocks can ship something
							better in weeks — tailored exactly to how their team works.
						</p>
						<p>
							Blazz UI provides those building blocks. Not a template. Not a boilerplate. A production-grade component library designed for data-heavy applications where users spend 8 hours a day.
						</p>
					</div>
				</section>

				{/* Approach — 3 principles */}
				<section>
					<p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">Approach</p>
					<h2 className="max-w-2xl text-balance text-2xl font-semibold tracking-tight text-fg lg:text-3xl">Three principles behind every component.</h2>
					<p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-fg-muted">Composition over configuration, information density without clutter, and AI-native from day one.</p>

					<div className="mt-8 grid gap-4 sm:grid-cols-3">
						{principles.map((principle) => (
							<div key={principle.title} className="rounded-xl border border-edge bg-card p-5">
								<div className="mb-4 inline-flex size-9 items-center justify-center rounded-lg border border-edge/50 bg-muted/60 text-brand">
									<principle.icon className="size-4" />
								</div>
								<h3 className="text-sm font-semibold text-fg">{principle.title}</h3>
								<p className="mt-1.5 text-[13px] leading-relaxed text-fg-muted">{principle.description}</p>
							</div>
						))}
					</div>
				</section>

				{/* Component previews — real tease */}
				<section>
					<p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">What's inside</p>
					<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
						<div>
							<h2 className="max-w-2xl text-balance text-2xl font-semibold tracking-tight text-fg lg:text-3xl">A preview of the kit.</h2>
							<p className="mt-4 max-w-xl text-[15px] leading-relaxed text-fg-muted">Every block ships production-ready, with light and dark themes, accessible patterns, and full TypeScript types.</p>
						</div>
						<Link href="/docs/blocks" className="group inline-flex items-center gap-1 text-sm font-medium text-brand hover:underline">
							Browse all blocks
							<ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
						</Link>
					</div>

					<div className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
						{previews.map((preview) => (
							<Link key={preview.slug} href={`/docs/blocks/${preview.slug}`} className="group overflow-hidden rounded-xl border border-edge bg-card transition-colors hover:bg-muted/40">
								<div className="overflow-hidden bg-muted/30 p-3">
									<img
										src={`/thumbnails/light/${preview.slug}.png`}
										alt={preview.label}
										className="w-full rounded-md border border-edge/40 transition-transform duration-300 group-hover:scale-[1.02] dark:hidden"
									/>
									<img
										src={`/thumbnails/dark/${preview.slug}.png`}
										alt={preview.label}
										className="hidden w-full rounded-md border border-edge/40 transition-transform duration-300 group-hover:scale-[1.02] dark:block"
									/>
								</div>
								<div className="flex items-center justify-between border-t border-edge/60 px-4 py-3">
									<div>
										<div className="text-[13px] font-medium text-fg">{preview.label}</div>
										<div className="text-[11px] text-fg-subtle">{preview.category}</div>
									</div>
									<ArrowRight className="size-3.5 text-fg-muted opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100" />
								</div>
							</Link>
						))}
					</div>
				</section>

				{/* Explore the docs */}
				<section>
					<p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand">Explore</p>
					<h2 className="max-w-2xl text-balance text-2xl font-semibold tracking-tight text-fg lg:text-3xl">Pick your starting point.</h2>

					<div className="mt-8 grid gap-3 sm:grid-cols-2">
						{sections.map((section) => (
							<Link key={section.id} href={section.href} className="group flex items-start gap-4 rounded-xl border border-edge bg-card p-5 transition-colors hover:bg-muted/40">
								<div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-edge/50 bg-muted/60 text-brand">
									<section.icon className="size-4" />
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex items-center justify-between gap-2">
										<span className="text-[15px] font-semibold text-fg">{section.title}</span>
										<Badge variant="outline" size="xs">
											{section.count}
										</Badge>
									</div>
									<p className="mt-1 text-[13px] leading-relaxed text-fg-muted">{section.description}</p>
								</div>
								<ArrowRight className="mt-1 size-3.5 shrink-0 text-fg-muted opacity-0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:opacity-100" />
							</Link>
						))}
					</div>
				</section>

				{/* Bottom CTA */}
				<section className="rounded-xl border border-edge bg-muted/30 p-8 text-center">
					<div className="mx-auto flex size-10 items-center justify-center rounded-lg border border-edge/60 bg-card text-brand">
						<Zap className="size-4" />
					</div>
					<h3 className="mt-4 text-lg font-semibold text-fg">Ready to start building?</h3>
					<p className="mx-auto mt-1 max-w-md text-[13px] leading-relaxed text-fg-muted">Install Blazz UI, copy a component, and ship your first pro page in minutes.</p>
					<div className="mt-5 flex flex-col items-center justify-center gap-2 sm:flex-row">
						<Link href="/docs/guide">
							<Button size="default" className="gap-1.5">
								Quickstart guide
								<ArrowRight className="size-3.5" />
							</Button>
						</Link>
						<Link href="/docs/components">
							<Button variant="outline" size="default">
								Browse components
							</Button>
						</Link>
					</div>
				</section>
			</div>
		</Page>
	)
}
