"use client"

import { Blocks, DatabaseZap, LayoutPanelTop } from "lucide-react"
import { motion } from "motion/react"
import { SectionShell } from "./section-shell"

const reasons = [
	{
		icon: LayoutPanelTop,
		title: "A complete UI foundation",
		description: "Layouts, navigation, forms, tables and dashboards already work together as one coherent system — not a bag of primitives.",
	},
	{
		icon: DatabaseZap,
		title: "Made for data-heavy products",
		description: "Built for dense workflows where users scan, compare, edit and move quickly. Density, alignment and hierarchy tuned for long sessions.",
	},
	{
		icon: Blocks,
		title: "Reusable across projects",
		description: "Use the same patterns across products and clients without rebuilding your UI stack each time. Own the code, not a subscription.",
	},
]

const bestFit = [
	{
		label: "You are building",
		value: "CRM, ATS, admin, operations or internal tools with dense workflows and serious information needs.",
	},
	{
		label: "You want",
		value: "A reusable UI package — not just primitives and another set of disconnected components.",
	},
	{
		label: "You avoid",
		value: "Paying per seat, rebuilding dense screens from scratch, or mixing multiple UI kits that never feel coherent.",
	},
]

export function WhyTeamsBuy() {
	return (
		<SectionShell
			eyebrow="Why teams buy"
			title="Build faster with a system made for business software"
			description="Ship dense, coherent and visually credible enterprise screens without rebuilding the same patterns from scratch."
		>
			<motion.div initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3 }} className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr]">
				<div className="grid gap-10 sm:grid-cols-1">
					{reasons.map((reason) => (
						<div key={reason.title} className="flex gap-4">
							<div className="flex size-10 shrink-0 items-center justify-center rounded-lg border border-edge/50 bg-muted/40 text-brand">
								<reason.icon className="size-4" />
							</div>
							<div>
								<h3 className="text-[15px] font-semibold text-fg">{reason.title}</h3>
								<p className="mt-1.5 text-sm leading-relaxed text-fg-muted">{reason.description}</p>
							</div>
						</div>
					))}
				</div>

				<div className="rounded-xl border border-edge/50 bg-muted/30 p-6">
					<p className="text-xs font-medium uppercase tracking-[0.14em] text-fg-subtle">Best fit</p>
					<div className="mt-5 space-y-5">
						{bestFit.map((row) => (
							<div key={row.label}>
								<p className="text-sm font-semibold text-fg">{row.label}</p>
								<p className="mt-1 text-[13px] leading-relaxed text-fg-muted">{row.value}</p>
							</div>
						))}
					</div>
				</div>
			</motion.div>
		</SectionShell>
	)
}
