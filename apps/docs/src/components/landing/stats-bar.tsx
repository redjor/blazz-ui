"use client"

import { motion } from "motion/react"

const stats = [
	{ value: "200+", label: "Production-ready components" },
	{ value: "150+", label: "Blocks and workflow patterns" },
	{ value: "3", label: "Full demo apps to fork" },
	{ value: "0", label: "Runtime lock-in" },
]

export function StatsBar() {
	return (
		<section className="px-6 py-3">
			<motion.div
				initial={{ opacity: 0, y: 8 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true }}
				transition={{ duration: 0.3 }}
				className="mx-auto grid max-w-6xl grid-cols-2 gap-x-6 gap-y-4 border-y border-edge/50 py-5 md:grid-cols-4"
			>
				{stats.map((stat) => (
					<div key={stat.label} className="flex flex-col gap-1">
						<span className="text-2xl font-semibold text-fg tabular-nums">{stat.value}</span>
						<span className="text-[13px] text-fg-muted">{stat.label}</span>
					</div>
				))}
			</motion.div>
		</section>
	)
}
