"use client"

import Link from "next/link"
import { motion } from "motion/react"
import { ArrowRight } from "lucide-react"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Button } from "@blazz/ui/components/ui/button"

export function Hero() {
	return (
		<section className="relative pt-32 pb-20 px-6 overflow-hidden">
			{/* Subtle gradient background */}
			<div className="absolute inset-0 bg-gradient-to-b from-brand/5 via-transparent to-transparent pointer-events-none" />

			<div className="relative mx-auto max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="flex flex-col items-center text-center"
				>
					<Badge variant="info" fill="subtle" size="md" className="mb-6">
						Open Beta
					</Badge>

					<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-fg max-w-4xl">
						Ship internal apps{" "}
						<span className="text-brand">10x faster</span>
					</h1>

					<p className="mt-6 text-lg text-fg-muted max-w-2xl">
						50+ production-ready React components. Build your CRM, ATS, or
						inventory system in days, not months.
					</p>

					<div className="mt-10 flex flex-col sm:flex-row gap-4">
						<Link href="/examples/crm/dashboard">
							<Button size="lg" className="gap-2">
								Try the demo
								<ArrowRight className="size-4" />
							</Button>
						</Link>
						<Link href="/docs/components">
							<Button variant="outline" size="lg">
								Browse components
							</Button>
						</Link>
					</div>
				</motion.div>

				{/* Screenshot placeholder */}
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.6, delay: 0.2 }}
					className="mt-16 mx-auto max-w-5xl"
				>
					<div className="aspect-video rounded-xl border border-edge/50 bg-gradient-to-br from-raised via-surface to-raised flex items-center justify-center">
						<p className="text-fg-subtle text-sm">
							Screenshot preview coming soon
						</p>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
