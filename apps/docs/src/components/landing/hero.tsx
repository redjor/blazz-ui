"use client"

import { Link } from "@tanstack/react-router"
import { motion } from "motion/react"
import { ArrowRight, Sparkles } from "lucide-react"
import { Button } from "@blazz/ui/components/ui/button"

const examplesUrl = import.meta.env.VITE_EXAMPLES_URL ?? ""

export function Hero() {
	return (
		<section className="pt-20 pb-4 px-6">
			<div className="mx-auto max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.4 }}
					className="rounded-xl border border-container bg-surface px-8 py-20 sm:px-16 sm:py-28"
				>
					<div className="mx-auto max-w-3xl text-center">
						{/* Badge */}
						<motion.div
							initial={{ opacity: 0, scale: 0.95 }}
							animate={{ opacity: 1, scale: 1 }}
							transition={{ duration: 0.3, delay: 0.1 }}
							className="inline-flex items-center gap-1.5 rounded-full border border-edge/60 bg-raised px-3 py-1 text-xs text-fg-muted mb-8"
						>
							<Sparkles className="size-3 text-brand" />
							200+ components &middot; Open Beta
						</motion.div>

						{/* Headline */}
						<h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-fg leading-[1.1]">
							The React kit for{" "}
							<span className="text-brand">data-heavy apps</span>
						</h1>

						<p className="mt-5 text-base sm:text-lg text-fg-muted max-w-2xl mx-auto leading-relaxed">
							Ship your CRM, ATS, or inventory system in days.
							200+ production-ready components, 3 demo apps, built on
							Base UI + Tailwind v4.
						</p>

						{/* CTAs */}
						<div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
							<a href={`${examplesUrl}/examples/crm/dashboard`}>
								<Button size="lg" className="gap-2">
									Try the demo
									<ArrowRight className="size-4" />
								</Button>
							</a>
							<Link to="/docs/components">
								<Button variant="outline" size="lg">
									Browse docs
								</Button>
							</Link>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	)
}
