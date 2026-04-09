"use client"

import { Blocks, Bot, Github, Layers, Moon, Type } from "lucide-react"
import { motion } from "motion/react"

const items = [
	{ icon: Blocks, label: "200+ components" },
	{ icon: Layers, label: "35+ page patterns" },
	{ icon: Bot, label: "52 AI blocks" },
	{ icon: Moon, label: "Light & dark themes" },
	{ icon: Type, label: "TypeScript strict" },
	{ icon: Github, label: "Open-source core" },
]

export function SocialProof() {
	return (
		<section className="px-6 py-10">
			<motion.div initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3 }} className="mx-auto max-w-6xl">
				<p className="mb-6 text-center text-xs font-medium uppercase tracking-[0.18em] text-fg-subtle">Everything you need, in one package</p>
				<div className="grid grid-cols-2 items-center gap-x-8 gap-y-5 border-y border-edge/40 py-6 sm:grid-cols-3 lg:grid-cols-6">
					{items.map((item) => (
						<div key={item.label} className="flex items-center justify-center gap-2 text-[13px] text-fg-muted">
							<item.icon className="size-3.5 text-fg-subtle" />
							<span>{item.label}</span>
						</div>
					))}
				</div>
			</motion.div>
		</section>
	)
}
