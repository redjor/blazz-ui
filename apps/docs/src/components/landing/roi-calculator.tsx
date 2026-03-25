"use client"

import { Blocks, DatabaseZap, LayoutPanelTop } from "lucide-react"
import { motion } from "motion/react"

export function RoiCalculator() {
	const reasons = [
		{
			icon: LayoutPanelTop,
			title: "A complete UI foundation",
			description:
				"Layouts, navigation, forms, tables, and dashboards already work together as one system.",
		},
		{
			icon: DatabaseZap,
			title: "Made for data-heavy products",
			description: "Built for dense workflows where users scan, compare, edit, and move quickly.",
		},
		{
			icon: Blocks,
			title: "Reusable across projects",
			description:
				"Use the same patterns across products and clients without rebuilding your UI stack each time.",
		},
	]

	return (
		<section className="py-4 px-6">
			<div className="mx-auto max-w-6xl">
				<div className="rounded-xl border border-container bg-card px-8 py-12 sm:px-12">
					<motion.div
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3 }}
						className="mb-10"
					>
						<p className="text-sm font-medium text-brand mb-1.5">Why teams buy</p>
						<h2 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
							Build faster with a system made for business software.
						</h2>
						<p className="mt-2 text-[13px] text-fg-muted max-w-xl">
							Ship dense, coherent, and visually credible enterprise screens without rebuilding the
							same patterns from scratch.
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: 0.1 }}
						className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]"
					>
						<div className="grid gap-4">
							{reasons.map((reason) => (
								<div
									key={reason.title}
									className="rounded-lg border border-edge/40 bg-muted/40 p-5"
								>
									<div className="mb-2 flex items-center gap-2">
										<div className="flex size-8 items-center justify-center rounded-md bg-app">
											<reason.icon className="size-4 text-brand" />
										</div>
										<h3 className="text-sm font-semibold text-fg">{reason.title}</h3>
									</div>
									<p className="text-[13px] leading-relaxed text-fg-muted">{reason.description}</p>
								</div>
							))}
						</div>

						<div className="rounded-lg border border-edge/40 bg-app p-5">
							<p className="text-2xs font-medium uppercase tracking-[0.18em] text-fg-subtle">
								Best fit
							</p>
							<div className="mt-4 space-y-4">
								<div>
									<p className="text-sm font-semibold text-fg">You are building</p>
									<p className="mt-1 text-[13px] text-fg-muted">
										CRM, ATS, admin, operations, or internal tools with dense workflows and serious
										information needs.
									</p>
								</div>
								<div>
									<p className="text-sm font-semibold text-fg">You want</p>
									<p className="mt-1 text-[13px] text-fg-muted">
										A reusable UI package, not just primitives and another set of disconnected
										components.
									</p>
								</div>
								<div>
									<p className="text-sm font-semibold text-fg">You avoid</p>
									<p className="mt-1 text-[13px] text-fg-muted">
										Paying per seat, rebuilding dense screens from scratch, or mixing multiple UI
										kits that never feel coherent.
									</p>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	)
}
