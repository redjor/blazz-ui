"use client"

import { BarChart3, Bot, FileCheck, Palette, PanelLeft, Table2 } from "lucide-react"
import { motion } from "motion/react"

const features = [
	{
		icon: Table2,
		title: "Advanced DataTable",
		description: "Editable, filterable, high-density tables built for real business workflows.",
	},
	{
		icon: Palette,
		title: "Enterprise Visual System",
		description:
			"A consistent design language with density, themes, and polished defaults for serious products.",
	},
	{
		icon: PanelLeft,
		title: "App Shell & Navigation",
		description:
			"Structured layouts for multi-page apps with tabs, breadcrumbs, sidebars, and command flows.",
	},
	{
		icon: FileCheck,
		title: "Forms & Validation",
		description:
			"Production-ready form patterns for CRUD-heavy products and operator-facing workflows.",
	},
	{
		icon: BarChart3,
		title: "Charts & Dashboards",
		description: "KPI and reporting building blocks that fit naturally into business software.",
	},
	{
		icon: Bot,
		title: "52 AI Components",
		description: "Components for AI-native workflows inside serious software, not just chat demos.",
	},
]

export function FeaturesGrid() {
	return (
		<section id="features" className="py-4 px-6">
			<div className="mx-auto max-w-6xl">
				<div className="rounded-2xl border border-container bg-card px-8 py-12 sm:px-12">
					<motion.div
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3 }}
						className="mb-10"
					>
						<p className="text-sm font-medium text-brand mb-1.5">Features</p>
						<h2 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
							The full package for operator-facing software
						</h2>
						<p className="mt-2 text-[13px] text-fg-muted max-w-xl">
							Components, blocks, and workflows designed for products where users manage data and
							move fast.
						</p>
					</motion.div>

					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8">
						{features.map((feature, i) => (
							<motion.div
								key={feature.title}
								initial={{ opacity: 0, y: 10 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.3, delay: i * 0.05 }}
								className="flex gap-3.5"
							>
								<div className="shrink-0 mt-0.5">
									<div className="flex items-center justify-center size-8 rounded-md bg-muted">
										<feature.icon className="size-4 text-fg-muted" />
									</div>
								</div>
								<div>
									<h3 className="text-[13px] font-semibold text-fg">{feature.title}</h3>
									<p className="mt-1 text-xs text-fg-muted leading-relaxed">
										{feature.description}
									</p>
								</div>
							</motion.div>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
