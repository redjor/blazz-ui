"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { ArrowRight, Github, Sparkles } from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"

const githubUrl = "https://github.com/redjor/blazz-ui"

export function Hero() {
	return (
		<section className="relative overflow-hidden px-6 pt-16 pb-8 md:pt-24 md:pb-12">
			{/* Ambient background glow */}
			<div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 -z-10 flex justify-center">
				<div className="h-[520px] w-[820px] rounded-full bg-brand/10 blur-[140px]" />
			</div>

			<div className="mx-auto max-w-6xl">
				<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}>
					<div className="mx-auto max-w-3xl text-center">
						<motion.div
							initial={{ opacity: 0, scale: 0.96 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3, delay: 0.05 }}
							className="mb-8 inline-flex items-center gap-1.5 rounded-full border border-edge/60 bg-card/60 px-3 py-1 text-xs text-fg-muted backdrop-blur"
						>
							<Sparkles className="size-3 text-brand" />
							The React kit for data-heavy software
						</motion.div>

						<h1 className="text-balance text-4xl font-semibold tracking-tight text-fg leading-[0.96] sm:text-6xl lg:text-[5.25rem]">
							Enterprise UI,
							<br />
							<span className="bg-gradient-to-br from-fg to-fg-muted bg-clip-text text-transparent">ready to ship.</span>
						</h1>

						<p className="mx-auto mt-7 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">
							Dense tables, structured layouts, fast workflows, and polished visuals for serious business software — without rebuilding the same patterns from scratch.
						</p>

						<div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<Link href="/docs">
								<Button size="lg" className="gap-2">
									Browse docs
									<ArrowRight className="size-4" />
								</Button>
							</Link>
							<a href={githubUrl} target="_blank" rel="noreferrer">
								<Button variant="outline" size="lg" className="gap-2">
									<Github className="size-4" />
									Star on GitHub
								</Button>
							</a>
						</div>

						<div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-fg-subtle">
							<span className="inline-flex items-center gap-1.5">
								<span className="size-1.5 rounded-full bg-positive" />
								MIT core
							</span>
							<span className="inline-flex items-center gap-1.5">
								<span className="size-1.5 rounded-full bg-brand" />
								One-time purchase
							</span>
							<span className="inline-flex items-center gap-1.5">
								<span className="size-1.5 rounded-full bg-fg-subtle" />
								No runtime lock-in
							</span>
						</div>
					</div>

					{/* Product preview panel */}
					<motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }} className="relative mt-16">
						<div className="absolute -inset-x-6 -top-10 -z-10 h-48 rounded-[48px] bg-brand/10 blur-3xl" />

						<div className="overflow-hidden rounded-[20px] border border-container bg-card shadow-[0_30px_120px_-40px_rgba(0,0,0,0.45)] ring-1 ring-edge/30">
							<div className="flex items-center justify-between border-b border-edge/50 bg-muted/30 px-4 py-2.5">
								<div className="flex items-center gap-2">
									<Badge variant="default" fill="subtle" size="xs">
										Live preview
									</Badge>
									<span className="text-xs text-fg-muted">blazz/dashboard</span>
								</div>
								<div className="hidden items-center gap-4 text-xs text-fg-subtle sm:flex">
									<span>DataTable</span>
									<span>·</span>
									<span>StatsGrid</span>
									<span>·</span>
									<span>Notifications</span>
								</div>
							</div>

							<div className="grid gap-0 border-edge/50 lg:grid-cols-[1.45fr_0.55fr]">
								<div className="border-b border-edge/50 bg-muted/20 p-5 lg:border-b-0 lg:border-r">
									<img src="/thumbnails/light/data-table.png" alt="Editable data table preview" className="w-full rounded-lg border border-edge/40 dark:hidden" />
									<img src="/thumbnails/dark/data-table.png" alt="Editable data table preview" className="hidden w-full rounded-lg border border-edge/40 dark:block" />
								</div>
								<div className="grid gap-0 bg-muted/10">
									<div className="border-b border-edge/50 p-4">
										<img src="/thumbnails/light/stats-grid.png" alt="Stats grid preview" className="w-full rounded-lg border border-edge/40 dark:hidden" />
										<img src="/thumbnails/dark/stats-grid.png" alt="Stats grid preview" className="hidden w-full rounded-lg border border-edge/40 dark:block" />
									</div>
									<div className="p-4">
										<img src="/thumbnails/light/notification-center.png" alt="Notification center preview" className="w-full rounded-lg border border-edge/40 dark:hidden" />
										<img src="/thumbnails/dark/notification-center.png" alt="Notification center preview" className="hidden w-full rounded-lg border border-edge/40 dark:block" />
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</motion.div>
			</div>
		</section>
	)
}
