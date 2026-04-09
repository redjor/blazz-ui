"use client"

import { BarChart3, Bot, FileCheck, Palette, PanelLeft, Table2 } from "lucide-react"
import { motion } from "motion/react"
import { SectionShell } from "./section-shell"

const features = [
	{
		icon: Table2,
		title: "Advanced DataTable",
		description: "Editable, filterable, high-density tables built for real business workflows. Server pagination, grouping, inline edit, bulk actions.",
	},
	{
		icon: Palette,
		title: "Enterprise visual system",
		description: "25 oklch design tokens, light + dark themes, and density-aware defaults tuned for operator-facing products.",
	},
	{
		icon: PanelLeft,
		title: "App shell & navigation",
		description: "Structured layouts for multi-page apps with tabs, breadcrumbs, sidebars, command palette and keyboard flows.",
	},
	{
		icon: FileCheck,
		title: "Forms & validation",
		description: "React-hook-form + Zod patterns for CRUD-heavy products. Field grids, multi-step flows, inline errors, optimistic saves.",
	},
	{
		icon: BarChart3,
		title: "Charts & dashboards",
		description: "KPI strips, chart cards, stats grids, and reporting blocks that feel native to business software.",
	},
	{
		icon: Bot,
		title: "52 AI-native components",
		description: "Chat, reasoning, tools, generative cards — designed for AI workflows inside serious software, not just demos.",
	},
]

export function FeaturesGrid() {
	return (
		<SectionShell
			id="features"
			eyebrow="What's inside"
			title="The full package for operator-facing software"
			description="Components, blocks and workflows designed for products where users manage data, compare, edit and move fast."
		>
			<div className="grid gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
				{features.map((feature, i) => (
					<motion.div key={feature.title} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: i * 0.04 }}>
						<div className="mb-4 inline-flex size-9 items-center justify-center rounded-lg border border-edge/50 bg-muted/40 text-brand">
							<feature.icon className="size-4" />
						</div>
						<h3 className="text-[15px] font-semibold text-fg">{feature.title}</h3>
						<p className="mt-2 text-sm leading-relaxed text-fg-muted">{feature.description}</p>
					</motion.div>
				))}
			</div>
		</SectionShell>
	)
}
