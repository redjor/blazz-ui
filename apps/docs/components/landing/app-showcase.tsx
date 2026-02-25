"use client"

import { motion } from "motion/react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@blazz/ui/components/ui/tabs"
import { Badge } from "@blazz/ui/components/ui/badge"

const apps = [
	{
		id: "forge-crm",
		label: "Forge CRM",
		description: "15 screens, full CRUD, deals pipeline, quotes, reports",
		href: "/examples/crm/dashboard",
		status: "live" as const,
	},
	{
		id: "talentflow",
		label: "TalentFlow ATS",
		description: "Recruitment pipeline, candidate tracking, hiring dashboard",
		href: "/examples/talentflow/dashboard",
		status: "live" as const,
	},
	{
		id: "stockbase",
		label: "StockBase",
		description: "Inventory management, stock levels, product catalog",
		href: "/examples/stockbase/dashboard",
		status: "live" as const,
	},
	{
		id: "pulseops",
		label: "PulseOps",
		description: "Field operations tracking and dispatch management",
		href: "#",
		status: "coming" as const,
	},
	{
		id: "teamdesk",
		label: "TeamDesk",
		description: "Helpdesk support, ticket management, knowledge base",
		href: "#",
		status: "coming" as const,
	},
]

export function AppShowcase() {
	return (
		<section id="apps" className="py-24 px-6 bg-surface">
			<div className="mx-auto max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4 }}
					className="text-center mb-12"
				>
					<h2 className="text-3xl font-bold text-fg">
						One kit, infinite possibilities
					</h2>
					<p className="mt-4 text-fg-muted max-w-2xl mx-auto">
						Every demo app is built with the same components. Pick a vertical,
						customize, and ship.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4, delay: 0.1 }}
				>
					<Tabs defaultValue="forge-crm">
						<div className="flex justify-center mb-8">
							<TabsList variant="line" className="flex-wrap">
								{apps.map((app) => (
									<TabsTrigger
										key={app.id}
										value={app.id}
										disabled={app.status === "coming"}
										className="gap-2"
									>
										{app.label}
										{app.status === "coming" && (
											<Badge variant="secondary" size="xs" fill="subtle">
												Soon
											</Badge>
										)}
									</TabsTrigger>
								))}
							</TabsList>
						</div>

						{apps.map((app) => (
							<TabsContent key={app.id} value={app.id}>
								<div className="rounded-xl border border-edge/50 bg-gradient-to-br from-raised via-surface to-raised aspect-video flex flex-col items-center justify-center gap-4">
									<p className="text-fg-subtle text-sm">{app.description}</p>
									{app.status === "live" && (
										<Link
											href={app.href}
											className="inline-flex items-center gap-1 text-brand text-sm font-medium hover:underline"
										>
											Try it live
											<ArrowRight className="size-3" />
										</Link>
									)}
								</div>
							</TabsContent>
						))}
					</Tabs>
				</motion.div>
			</div>
		</section>
	)
}
