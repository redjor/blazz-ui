"use client"

import { motion } from "motion/react"
import {
	Table2,
	Palette,
	PanelLeft,
	FileCheck,
	BarChart3,
	ShieldCheck,
} from "lucide-react"
import { Card, CardContent } from "@blazz/ui/components/ui/card"

const features = [
	{
		icon: Table2,
		title: "Advanced DataTable",
		description:
			"TanStack Table with 8 CRM presets, inline editing, column pinning, sorting, and multi-faceted filters.",
	},
	{
		icon: Palette,
		title: "Design System",
		description:
			"25 design tokens, 3 themes (Slate, Corporate, Warm), oklch color space, and consistent density system.",
	},
	{
		icon: PanelLeft,
		title: "Navigation System",
		description:
			"Sidebar with nested menus, tabbed navigation, breadcrumbs, and command palette (Cmd+K).",
	},
	{
		icon: FileCheck,
		title: "Form System",
		description:
			"react-hook-form + Zod validation, multi-step forms, inline editing, and field-level error handling.",
	},
	{
		icon: BarChart3,
		title: "Charts & Dashboard",
		description:
			"Recharts integration with StatsGrid, KPI cards, funnel charts, and forecast visualizations.",
	},
	{
		icon: ShieldCheck,
		title: "Production Ready",
		description:
			"TypeScript strict mode, Biome lint/format, accessible components, and enterprise-grade patterns.",
	},
]

export function FeaturesGrid() {
	return (
		<section id="features" className="py-24 px-6">
			<div className="mx-auto max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4 }}
					className="text-center mb-16"
				>
					<h2 className="text-3xl font-bold text-fg">
						Everything you need to build pro apps
					</h2>
					<p className="mt-4 text-fg-muted max-w-2xl mx-auto">
						From data tables to design tokens, every component is built for
						real-world enterprise applications.
					</p>
				</motion.div>

				<div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
					{features.map((feature, i) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.4, delay: i * 0.08 }}
						>
							<Card className="h-full">
								<CardContent className="pt-6">
									<feature.icon className="size-8 text-brand mb-4" />
									<h3 className="text-sm font-semibold text-fg">
										{feature.title}
									</h3>
									<p className="mt-2 text-xs text-fg-muted leading-relaxed">
										{feature.description}
									</p>
								</CardContent>
							</Card>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	)
}
