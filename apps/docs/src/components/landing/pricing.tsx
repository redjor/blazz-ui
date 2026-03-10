"use client"

import { motion } from "motion/react"
import { Check } from "lucide-react"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"

const tiers = [
	{
		name: "Starter",
		price: "0€",
		period: "forever",
		description: "Open source primitives",
		features: [
			"48 UI primitives",
			"Light & dark themes",
			"TypeScript strict",
			"MIT license",
		],
		cta: "Get started",
		highlighted: false,
	},
	{
		name: "Pro",
		price: "149€",
		period: "one-time",
		description: "Full kit + all demos",
		features: [
			"Everything in Starter",
			"150+ blocks & patterns",
			"52 AI components",
			"3 complete demo apps",
			"MCP server for AI coding",
			"Priority support",
		],
		cta: "Buy now",
		highlighted: true,
	},
	{
		name: "Enterprise",
		price: "Custom",
		period: "on quote",
		description: "Custom + training",
		features: [
			"Everything in Pro",
			"Custom theme creation",
			"Team onboarding session",
			"SLA & dedicated support",
			"Custom components",
		],
		cta: "Contact us",
		highlighted: false,
	},
]

export function Pricing() {
	return (
		<section id="pricing" className="py-4 px-6">
			<div className="mx-auto max-w-6xl">
				<div className="rounded-xl border border-container bg-surface px-8 py-12 sm:px-12">
					<motion.div
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3 }}
						className="mb-10"
					>
						<p className="text-sm font-medium text-brand mb-1.5">Pricing</p>
						<h2 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
							Pay once, own forever
						</h2>
						<p className="mt-2 text-[13px] text-fg-muted max-w-xl">
							No subscriptions, no per-seat fees. One purchase, unlimited projects.
						</p>
					</motion.div>

					<div className="grid md:grid-cols-3 gap-4">
						{tiers.map((tier, i) => (
							<motion.div
								key={tier.name}
								initial={{ opacity: 0, y: 10 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.3, delay: i * 0.05 }}
								className={`relative rounded-lg border p-6 flex flex-col ${
									tier.highlighted
										? "border-brand bg-brand/[0.03]"
										: "border-edge/40 bg-raised/30"
								}`}
							>
								{tier.highlighted && (
									<div className="absolute -top-2.5 left-4">
										<Badge variant="default" size="xs">
											Most popular
										</Badge>
									</div>
								)}

								<div className="mb-5">
									<h3 className="text-[13px] font-semibold text-fg">
										{tier.name}
									</h3>
									<div className="mt-2 flex items-baseline gap-1.5">
										<span className="text-2xl font-bold text-fg">
											{tier.price}
										</span>
										<span className="text-xs text-fg-muted">
											{tier.period}
										</span>
									</div>
									<p className="mt-1.5 text-xs text-fg-muted">
										{tier.description}
									</p>
								</div>

								<ul className="space-y-2.5 mb-6 flex-1">
									{tier.features.map((feature) => (
										<li
											key={feature}
											className="flex items-start gap-2 text-xs text-fg-muted"
										>
											<Check className="size-3.5 text-positive shrink-0 mt-px" />
											{feature}
										</li>
									))}
								</ul>

								<Button
									variant={tier.highlighted ? "default" : "outline"}
									size="sm"
									className="w-full"
								>
									{tier.cta}
								</Button>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
