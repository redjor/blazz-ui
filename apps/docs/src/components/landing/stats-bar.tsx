"use client"

import { motion } from "motion/react"

const stats = [
	{ value: "200+", label: "Components" },
	{ value: "25", label: "Design tokens" },
	{ value: "3", label: "Demo apps" },
	{ value: "52", label: "AI elements" },
]

export function StatsBar() {
	return (
		<section className="py-4 px-6">
			<motion.div
				initial={{ opacity: 0, y: 8 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.3 }}
				className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-4"
			>
				{stats.map((stat) => (
					<div
						key={stat.label}
						className="flex items-center gap-3 rounded-lg border border-container bg-surface px-5 py-4"
					>
						<span className="text-2xl font-semibold text-fg tabular-nums">
							{stat.value}
						</span>
						<span className="text-[13px] text-fg-muted">{stat.label}</span>
					</div>
				))}
			</motion.div>
		</section>
	)
}
