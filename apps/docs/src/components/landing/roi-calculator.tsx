"use client"

import { Blocks, DatabaseZap, LayoutPanelTop } from "lucide-react"
import { motion } from "motion/react"

export function RoiCalculator() {
	const reasons = [
		{
			icon: LayoutPanelTop,
			title: "One app shell instead of ad hoc pages",
			description:
				"Navigation, breadcrumbs, tabs, empty states, drawers, and page headers already match each other.",
		},
		{
			icon: DatabaseZap,
			title: "Data-heavy screens without custom glue",
			description:
				"Tables, filters, stats, charts, and forms are designed to work together in CRUD-heavy products.",
		},
		{
			icon: Blocks,
			title: "Copy code once, scale it across products",
			description:
				"Fork a demo, adapt the domain language, and keep the same design tokens and interaction patterns.",
		},
	]

	return (
		<section className="py-4 px-6">
			<div className="mx-auto max-w-6xl">
				<div className="rounded-xl border border-container bg-surface px-8 py-12 sm:px-12">
					<motion.div
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3 }}
						className="mb-10"
					>
						<p className="text-sm font-medium text-brand mb-1.5">Why teams buy</p>
						<h2 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
							Spend time on product logic, not UI assembly
						</h2>
						<p className="mt-2 text-[13px] text-fg-muted max-w-xl">
							Blazz UI is valuable when your bottleneck is shipping coherent business screens fast,
							not drawing another button set.
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
									className="rounded-lg border border-edge/40 bg-raised/40 p-5"
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
										CRM, ATS, inventory, admin, or other operator-facing products with dense
										workflows.
									</p>
								</div>
								<div>
									<p className="text-sm font-semibold text-fg">You want</p>
									<p className="mt-1 text-[13px] text-fg-muted">
										Reusable screens and patterns, not only primitives and a design board.
									</p>
								</div>
								<div>
									<p className="text-sm font-semibold text-fg">You avoid</p>
									<p className="mt-1 text-[13px] text-fg-muted">
										Paying per seat, rebuilding tables and forms in every client project, or mixing
										multiple UI kits.
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
