"use client"

import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@blazz/ui/components/ui/tabs"
import { Badge } from "@blazz/ui/components/ui/badge"

const examplesUrl = import.meta.env.VITE_EXAMPLES_URL ?? ""

const apps = [
	{
		id: "forge-crm",
		label: "Forge CRM",
		screens: "18 screens",
		description: "Full CRUD, deals pipeline with kanban, quotes, invoices, reporting dashboard. A complete CRM built entirely with Blazz UI.",
		href: `${examplesUrl}/examples/crm/dashboard`,
		status: "live" as const,
	},
	{
		id: "talentflow",
		label: "TalentFlow",
		screens: "12 screens",
		description: "Recruitment pipeline, candidate tracking, interview scheduling, and hiring dashboard for ATS workflows.",
		href: `${examplesUrl}/examples/talentflow/dashboard`,
		status: "live" as const,
	},
	{
		id: "stockbase",
		label: "StockBase",
		screens: "10 screens",
		description: "Inventory management with stock levels, product catalog, purchase orders, and warehouse tracking.",
		href: `${examplesUrl}/examples/stockbase/dashboard`,
		status: "live" as const,
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
							3 complete apps, same kit
						</h2>
						<p className="mt-2 text-[13px] text-fg-muted max-w-xl">
							Every screen is built with Blazz UI components. Pick a vertical,
							customize, ship.
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
									<div className="rounded-lg border border-edge/40 bg-raised/50">
										<div className="flex flex-col sm:flex-row items-start gap-6 p-6">
											{/* Screenshot placeholder */}
											<div className="w-full sm:w-1/2 aspect-video rounded-md border border-edge/30 bg-app flex items-center justify-center">
												<span className="text-xs text-fg-subtle">
													Preview coming soon
												</span>
											</div>

											{/* Description */}
											<div className="flex-1 py-2">
												<div className="flex items-center gap-2 mb-2">
													<h3 className="text-sm font-semibold text-fg">
														{app.label}
													</h3>
													<Badge variant="info" fill="subtle" size="xs">
														{app.screens}
													</Badge>
												</div>
												<p className="text-[13px] text-fg-muted leading-relaxed mb-4">
													{app.description}
												</p>
												<a
													href={app.href}
													className="inline-flex items-center gap-1.5 text-[13px] font-medium text-brand hover:underline"
												>
													Try it live
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
