"use client"

import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"
import { Check } from "lucide-react"
import { motion } from "motion/react"
import { SectionShell } from "./section-shell"

const githubUrl = "https://github.com/redjor/blazz-ui"

const tiers = [
	{
		name: "Starter",
		price: "Free",
		period: "forever",
		description: "Open-source primitives to ship fast.",
		features: ["72 UI primitives", "Light & dark themes", "TypeScript strict", "MIT license"],
		cta: "Browse free docs",
		href: "/docs/components",
		highlighted: false,
	},
	{
		name: "Pro",
		price: "€249",
		period: "one-time",
		description: "The full enterprise UI package.",
		features: ["Everything in Starter", "150+ blocks & patterns", "52 AI components", "MCP server for AI coding", "Unlimited projects", "Free updates for life"],
		cta: "Get Pro — €249",
		href: "/docs/blocks",
		highlighted: true,
	},
	{
		name: "Enterprise",
		price: "Custom",
		period: "on quote",
		description: "For teams who need more.",
		features: ["Everything in Pro", "Custom theme creation", "Team onboarding session", "SLA & dedicated support", "Custom components"],
		cta: "Contact us",
		href: `${githubUrl}/issues/new`,
		highlighted: false,
	},
]

export function Pricing() {
	return (
		<SectionShell id="pricing" eyebrow="Pricing" title="One-time purchase. Own the code." description="No subscription, no per-seat fee, no vendor lock-in. Buy once, ship forever.">
			<div className="grid gap-5 md:grid-cols-3">
				{tiers.map((tier, i) => (
					<motion.div
						key={tier.name}
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: i * 0.05 }}
						className={`relative flex flex-col rounded-2xl border p-7 ${
							tier.highlighted ? "border-brand/70 bg-card shadow-[0_20px_60px_-30px_oklch(0.50_0.22_275/0.5)] ring-1 ring-brand/40" : "border-edge/50 bg-card/50"
						}`}
					>
						{tier.highlighted && (
							<div className="absolute -top-2.5 left-6">
								<Badge variant="default" size="xs">
									Most popular
								</Badge>
							</div>
						)}

						<div className="mb-6">
							<h3 className="text-sm font-semibold uppercase tracking-[0.12em] text-fg">{tier.name}</h3>
							<div className="mt-4 flex items-baseline gap-2">
								<span className="text-4xl font-semibold tracking-tight text-fg tabular-nums">{tier.price}</span>
								<span className="text-sm text-fg-muted">{tier.period}</span>
							</div>
							<p className="mt-2 text-sm text-fg-muted">{tier.description}</p>
						</div>

						<ul className="mb-7 flex-1 space-y-3">
							{tier.features.map((feature) => (
								<li key={feature} className="flex items-start gap-2.5 text-[13px] text-fg">
									<Check className="mt-0.5 size-3.5 shrink-0 text-positive" />
									<span className="text-fg-muted">{feature}</span>
								</li>
							))}
						</ul>

						<a href={tier.href} className="w-full">
							<Button variant={tier.highlighted ? "default" : "outline"} size="lg" className="w-full">
								{tier.cta}
							</Button>
						</a>
					</motion.div>
				))}
			</div>

			<p className="mt-8 text-center text-xs text-fg-subtle">Prices exclude VAT. 14-day refund, no questions asked.</p>
		</SectionShell>
	)
}
