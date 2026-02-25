"use client"

import { motion } from "motion/react"
import { Check } from "lucide-react"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { cn } from "@blazz/ui/lib/utils"

const tiers = [
	{
		name: "Starter",
		price: "0€",
		period: "forever",
		description: "Open source components",
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
			"23 block components",
			"8 DataTable presets",
			"3 complete demo apps",
			"3 color themes",
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
			"Custom component development",
		],
		cta: "Contact us",
		highlighted: false,
	},
]

export function Pricing() {
	return (
		<section id="pricing" className="py-24 px-6 bg-surface">
			<div className="mx-auto max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4 }}
					className="text-center mb-16"
				>
					<h2 className="text-3xl font-bold text-fg">
						Simple, transparent pricing
					</h2>
					<p className="mt-4 text-fg-muted max-w-2xl mx-auto">
						Pay once, own it forever. No subscriptions, no per-seat fees.
					</p>
				</motion.div>

				<div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
					{tiers.map((tier, i) => (
						<motion.div
							key={tier.name}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.4, delay: i * 0.08 }}
						>
							<Card
								className={cn(
									"h-full relative",
									tier.highlighted && "border-brand"
								)}
							>
								{tier.highlighted && (
									<div className="absolute -top-3 left-1/2 -translate-x-1/2">
										<Badge variant="default" size="sm">
											Most popular
										</Badge>
									</div>
								)}
								<CardContent className="pt-8 flex flex-col h-full">
									<div className="mb-6">
										<h3 className="text-sm font-semibold text-fg">
											{tier.name}
										</h3>
										<div className="mt-2 flex items-baseline gap-1">
											<span className="text-3xl font-bold text-fg">
												{tier.price}
											</span>
											<span className="text-xs text-fg-muted">
												{tier.period}
											</span>
										</div>
										<p className="mt-2 text-xs text-fg-muted">
											{tier.description}
										</p>
									</div>

									<ul className="space-y-3 mb-8 flex-1">
										{tier.features.map((feature) => (
											<li
												key={feature}
												className="flex items-start gap-2 text-xs text-fg-muted"
											>
												<Check className="size-3.5 text-positive shrink-0 mt-0.5" />
												{feature}
											</li>
										))}
									</ul>

									<Button
										variant={tier.highlighted ? "default" : "outline"}
										className="w-full"
									>
										{tier.cta}
									</Button>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
