"use client"

import { motion } from "motion/react"

const stats = [
	{ value: "48+", label: "Components" },
	{ value: "3", label: "Themes" },
	{ value: "3", label: "Demo Apps" },
	{ value: "15", label: "CRM Screens" },
]

export function StatsBar() {
	return (
		<section className="py-12 px-6 bg-raised">
			<motion.div
				initial={{ opacity: 0, y: 10 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.4 }}
				className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-8"
			>
				{stats.map((stat) => (
					<div key={stat.label} className="text-center">
						<div className="text-3xl font-bold text-fg">{stat.value}</div>
						<div className="mt-1 text-sm text-fg-muted">{stat.label}</div>
					</div>
				))}
			</motion.div>
		</section>
	)
}
