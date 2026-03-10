"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@blazz/ui/components/ui/tabs"
import { ArrowRight } from "lucide-react"
import { motion } from "motion/react"

const examplesUrl = import.meta.env.VITE_EXAMPLES_URL ?? ""
const docsFallbackHref = "/docs/components"

const apps = [
	{
		id: "forge-crm",
		label: "Forge CRM",
		screens: "18 screens",
		description:
			"Full CRUD, deals pipeline with kanban, quotes, invoices, reporting dashboard. A complete CRM built entirely with Blazz UI.",
		href: examplesUrl ? `${examplesUrl}/examples/crm/dashboard` : docsFallbackHref,
		status: "live" as const,
		lightSrc: "/thumbnails/light/data-table.png",
		darkSrc: "/thumbnails/dark/data-table.png",
		secondaryLightSrc: "/thumbnails/light/notification-center.png",
		secondaryDarkSrc: "/thumbnails/dark/notification-center.png",
		outcomes: ["Sales pipeline", "Quotes and invoices", "Team dashboards"],
	},
	{
		id: "talentflow",
		label: "TalentFlow",
		screens: "12 screens",
		description:
			"Recruitment pipeline, candidate tracking, interview scheduling, and hiring dashboard for ATS workflows.",
		href: examplesUrl ? `${examplesUrl}/examples/talentflow/dashboard` : docsFallbackHref,
		status: "live" as const,
		lightSrc: "/thumbnails/light/ai-candidate-card.png",
		darkSrc: "/thumbnails/dark/ai-candidate-card.png",
		secondaryLightSrc: "/thumbnails/light/ai-availability-card.png",
		secondaryDarkSrc: "/thumbnails/dark/ai-availability-card.png",
		outcomes: ["Candidate review", "Interview planning", "Hiring workflow"],
	},
	{
		id: "stockbase",
		label: "StockBase",
		screens: "10 screens",
		description:
			"Inventory management with stock levels, product catalog, purchase orders, and warehouse tracking.",
		href: examplesUrl ? `${examplesUrl}/examples/stockbase/dashboard` : docsFallbackHref,
		status: "live" as const,
		lightSrc: "/thumbnails/light/property-card.png",
		darkSrc: "/thumbnails/dark/property-card.png",
		secondaryLightSrc: "/thumbnails/light/stats-grid.png",
		secondaryDarkSrc: "/thumbnails/dark/stats-grid.png",
		outcomes: ["Stock monitoring", "Catalog views", "Operations reporting"],
	},
]

export function AppShowcase() {
	return (
		<section id="apps" className="py-4 px-6">
			<div className="mx-auto max-w-6xl">
				<div className="rounded-xl border border-container bg-surface px-8 py-12 sm:px-12">
					<motion.div
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3 }}
						className="mb-10"
					>
						<p className="text-sm font-medium text-brand mb-1.5">Demo apps</p>
						<h2 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
							Start from shipped workflows, not empty screens
						</h2>
						<p className="mt-2 text-[13px] text-fg-muted max-w-xl">
							Each demo proves the kit on a real use case. Fork the closest one, swap your domain
							data, and keep moving.
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: 0.1 }}
					>
						<Tabs defaultValue="forge-crm">
							<TabsList variant="line" className="mb-6">
								{apps.map((app) => (
									<TabsTrigger key={app.id} value={app.id}>
										{app.label}
									</TabsTrigger>
								))}
							</TabsList>

							{apps.map((app) => (
								<TabsContent key={app.id} value={app.id}>
									<div className="rounded-lg border border-edge/40 bg-raised/50 p-6">
										<div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
											<div className="grid gap-4 sm:grid-cols-[1.2fr_0.8fr]">
												<div className="rounded-xl border border-edge/30 bg-app p-3">
													<img
														src={app.lightSrc}
														alt={`${app.label} primary preview`}
														className="w-full rounded-lg border border-edge/30 dark:hidden"
													/>
													<img
														src={app.darkSrc}
														alt={`${app.label} primary preview`}
														className="hidden w-full rounded-lg border border-edge/30 dark:block"
													/>
												</div>
												<div className="rounded-xl border border-edge/30 bg-app p-3">
													<img
														src={app.secondaryLightSrc}
														alt={`${app.label} secondary preview`}
														className="w-full rounded-lg border border-edge/30 dark:hidden"
													/>
													<img
														src={app.secondaryDarkSrc}
														alt={`${app.label} secondary preview`}
														className="hidden w-full rounded-lg border border-edge/30 dark:block"
													/>
												</div>
											</div>

											<div className="py-2">
												<div className="mb-2 flex items-center gap-2">
													<h3 className="text-sm font-semibold text-fg">{app.label}</h3>
													<Badge variant="info" fill="subtle" size="xs">
														{app.screens}
													</Badge>
													<Badge variant="success" fill="subtle" size="xs">
														Live demo
													</Badge>
												</div>
												<p className="mb-5 text-[13px] leading-relaxed text-fg-muted">
													{app.description}
												</p>
												<div className="mb-5 flex flex-wrap gap-2">
													{app.outcomes.map((outcome) => (
														<Badge key={outcome} variant="outline" size="xs">
															{outcome}
														</Badge>
													))}
												</div>
												<a
													href={app.href}
													className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand hover:underline"
												>
													Open {app.label}
													<ArrowRight className="size-3" />
												</a>
											</div>
										</div>
									</div>
								</TabsContent>
							))}
						</Tabs>
					</motion.div>
				</div>
			</div>
		</section>
	)
}
