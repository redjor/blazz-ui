"use client"

import { motion } from "motion/react"
import {
	Table2,
	Palette,
	PanelLeft,
	FileCheck,
	BarChart3,
	Bot,
} from "lucide-react"

const features = [
	{
		icon: Table2,
		title: "Advanced DataTable",
		description:
			"TanStack Table with 8 presets, inline editing, column pinning, sorting, and multi-faceted filters.",
	},
	{
		icon: Palette,
		title: "25 Design Tokens",
		description:
			"oklch color space, 3 themes, consistent density system. Change the entire look with CSS variables.",
	},
	{
		icon: PanelLeft,
		title: "App Shell & Navigation",
		description:
			"Sidebar, tabbed nav, breadcrumbs, command palette. Everything for complex multi-page apps.",
	},
	{
		icon: FileCheck,
		title: "Forms & Validation",
		description:
			"react-hook-form + Zod, multi-step forms, inline editing, date pickers, and 15+ input types.",
	},
	{
		icon: BarChart3,
		title: "Charts & Dashboards",
		description:
			"Recharts integration with StatsGrid, KPI cards, funnel charts, and forecast visualizations.",
	},
	{
		icon: Bot,
		title: "52 AI Components",
		description:
			"Chat, reasoning traces, tool confirmations, metric cards. Build AI-native interfaces from day one.",
	},
]

export function FeaturesGrid() {
	return (
		<section id="features" className="py-4 px-6">
			<div className="mx-auto max-w-6xl">
				<div className="rounded-xl border border-container bg-surface px-8 py-12 sm:px-12">
					<motion.div
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3 }}
						className="mb-10"
					>
						<p className="text-sm font-medium text-brand mb-1.5">Features</p>
						<h2 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
							Everything for pro apps
						</h2>
						<p className="mt-2 text-[13px] text-fg-muted max-w-xl">
							From data tables to AI chat, every component is designed for
							real-world enterprise applications.
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
									<div className="flex items-center justify-center size-8 rounded-md bg-raised">
										<feature.icon className="size-4 text-fg-muted" />
									</div>
								</div>
								<div>
									<h3 className="text-[13px] font-semibold text-fg">
										{feature.title}
									</h3>
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
