"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import Link from "next/link"
import { ArrowRight, Github, Sparkles } from "lucide-react"
import { motion } from "motion/react"

const githubUrl = "https://github.com/redjor/blazz-ui"

export function Hero() {
	return (
		<section className="px-6 pb-4 pt-8 md:pt-10">
			<div className="mx-auto max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
				>
					<div className="mx-auto max-w-3xl text-center">
						<motion.div
							initial={{ opacity: 0, scale: 0.96 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.25, delay: 0.1 }}
							className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-edge/60 bg-card px-3 py-1 text-xs text-fg-muted"
						>
							<Sparkles className="size-3 text-brand" />
							Built for high-density enterprise workflows
						</motion.div>

						<h1 className="text-balance text-4xl font-semibold tracking-tight text-fg leading-[0.98] sm:text-5xl lg:text-7xl">
							Enterprise UI,
							<br />
							ready to ship.
						</h1>

						<p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-fg-muted sm:text-lg">
							Dense tables, structured layouts, fast workflows, and polished visuals for serious
							business software.
						</p>

						<div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
							<Link href="/docs">
								<Button size="lg" className="gap-2">
									Browse docs
									<ArrowRight className="size-4" />
								</Button>
							</Link>
							<a href={githubUrl} target="_blank" rel="noreferrer">
								<Button variant="outline" size="lg" className="gap-2">
									<Github className="size-4" />
									GitHub
								</Button>
							</a>
						</div>

						<div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-fg-subtle">
							<Badge variant="outline" size="xs">
								200+ components
							</Badge>
							<Badge variant="outline" size="xs">
								One-time purchase
							</Badge>
						</div>
					</div>

					<div className="relative mt-14">
						<div className="absolute inset-x-20 -top-8 -z-10 h-40 rounded-full bg-brand/8 blur-3xl" />
						<div className="overflow-hidden rounded-[28px] border border-container bg-card shadow-[0_20px_80px_-32px_rgba(0,0,0,0.35)]">
							<div className="flex items-center justify-between border-b border-edge/50 px-4 py-3">
								<div className="flex items-center gap-2">
									<span className="size-2 rounded-full bg-fg-subtle/40" />
									<span className="size-2 rounded-full bg-fg-subtle/40" />
									<span className="size-2 rounded-full bg-fg-subtle/40" />
								</div>
								<div className="text-xs text-fg-muted">Component preview</div>
								<Badge variant="success" fill="subtle" size="xs">
									Real component preview
								</Badge>
							</div>

							<div className="grid gap-0 border-edge/50 lg:grid-cols-[1.35fr_0.65fr]">
								<div className="border-b border-edge/50 p-4 lg:border-b-0 lg:border-r">
									<img
										src="/thumbnails/light/data-table.png"
										alt="Editable data table preview"
										className="w-full rounded-xl border border-edge/40 dark:hidden"
									/>
									<img
										src="/thumbnails/dark/data-table.png"
										alt="Editable data table preview"
										className="hidden w-full rounded-xl border border-edge/40 dark:block"
									/>
								</div>
								<div className="grid gap-0">
									<div className="border-b border-edge/50 p-4">
										<img
											src="/thumbnails/light/stats-grid.png"
											alt="Stats grid preview"
											className="w-full rounded-xl border border-edge/40 dark:hidden"
										/>
										<img
											src="/thumbnails/dark/stats-grid.png"
											alt="Stats grid preview"
											className="hidden w-full rounded-xl border border-edge/40 dark:block"
										/>
									</div>
									<div className="p-4">
										<img
											src="/thumbnails/light/notification-center.png"
											alt="Notification center preview"
											className="w-full rounded-xl border border-edge/40 dark:hidden"
										/>
										<img
											src="/thumbnails/dark/notification-center.png"
											alt="Notification center preview"
											className="hidden w-full rounded-xl border border-edge/40 dark:block"
										/>
									</div>
								</div>
							</div>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
