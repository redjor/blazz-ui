"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { TrendingUp, Clock } from "lucide-react"

export function RoiCalculator() {
	const [teamSize, setTeamSize] = useState(5)

	const weeksSaved = teamSize * 2
	const saasAvoided = teamSize * 150

	return (
		<section className="py-4 px-6">
			<div className="mx-auto max-w-6xl">
				<div className="rounded-xl border border-container bg-surface px-8 py-12 sm:px-12">
					<motion.div
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3 }}
						className="mb-10"
					>
						<p className="text-sm font-medium text-brand mb-1.5">ROI</p>
						<h2 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
							Calculate your savings
						</h2>
						<p className="mt-2 text-[13px] text-fg-muted max-w-xl">
							How much time and money you save vs. paying for SaaS licenses.
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 10 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3, delay: 0.1 }}
						className="max-w-md"
					>
						{/* Slider */}
						<div className="mb-8">
							<div className="flex items-center justify-between mb-3">
								<label
									htmlFor="team-size"
									className="text-[13px] font-medium text-fg"
								>
									Team size
								</label>
								<span className="text-[13px] font-semibold text-brand tabular-nums">
									{teamSize} dev{teamSize > 1 ? "s" : ""}
								</span>
							</div>
							<input
								id="team-size"
								type="range"
								min={1}
								max={20}
								value={teamSize}
								onChange={(e) => setTeamSize(Number(e.target.value))}
								className="w-full h-1.5 bg-raised rounded-full appearance-none cursor-pointer accent-brand [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:cursor-pointer"
							/>
							<div className="flex justify-between text-2xs text-fg-subtle mt-1.5">
								<span>1</span>
								<span>20</span>
							</div>
						</div>

						{/* Results */}
						<div className="grid grid-cols-2 gap-3">
							<div className="rounded-lg border border-edge/40 bg-raised/50 p-4">
								<div className="flex items-center gap-1.5 mb-2">
									<Clock className="size-3.5 text-fg-muted" />
									<span className="text-2xs text-fg-muted uppercase tracking-wide font-medium">Time saved</span>
								</div>
								<span className="text-xl font-semibold text-fg tabular-nums">
									{weeksSaved} weeks
								</span>
							</div>
							<div className="rounded-lg border border-edge/40 bg-raised/50 p-4">
								<div className="flex items-center gap-1.5 mb-2">
									<TrendingUp className="size-3.5 text-fg-muted" />
									<span className="text-2xs text-fg-muted uppercase tracking-wide font-medium">SaaS avoided</span>
								</div>
								<span className="text-xl font-semibold text-fg tabular-nums">
									{saasAvoided.toLocaleString("en")}€<span className="text-xs text-fg-muted font-normal">/mo</span>
								</span>
							</div>
						</div>

						<p className="mt-4 text-2xs text-fg-subtle">
							Based on 2 weeks saved per developer and ~150€/user/month for
							comparable SaaS solutions.
						</p>
					</motion.div>
				</div>
			</div>
		</section>
	)
}
