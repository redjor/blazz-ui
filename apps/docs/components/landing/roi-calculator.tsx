"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Card, CardContent } from "@blazz/ui/components/ui/card"

export function RoiCalculator() {
	const [teamSize, setTeamSize] = useState(5)

	const weeksSaved = teamSize * 2
	const saasAvoided = teamSize * 150

	return (
		<section className="py-24 px-6">
			<div className="mx-auto max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4 }}
					className="text-center mb-12"
				>
					<h2 className="text-3xl font-bold text-fg">Calculate your ROI</h2>
					<p className="mt-4 text-fg-muted max-w-2xl mx-auto">
						See how much time and money you save by building with Pro UI Kit
						instead of paying for SaaS licenses.
					</p>
				</motion.div>

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4, delay: 0.1 }}
					className="max-w-lg mx-auto"
				>
					<Card>
						<CardContent className="pt-6 space-y-8">
							<div>
								<div className="flex items-center justify-between mb-3">
									<label
										htmlFor="team-size"
										className="text-sm font-medium text-fg"
									>
										Team size
									</label>
									<span className="text-sm font-semibold text-brand">
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
									className="w-full h-2 bg-raised rounded-full appearance-none cursor-pointer accent-brand [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-brand [&::-webkit-slider-thumb]:cursor-pointer"
								/>
								<div className="flex justify-between text-xs text-fg-subtle mt-1">
									<span>1</span>
									<span>20</span>
								</div>
							</div>

							<div className="grid grid-cols-2 gap-6">
								<div className="text-center p-4 rounded-lg bg-raised">
									<div className="text-2xl font-bold text-positive">
										{weeksSaved} weeks
									</div>
									<div className="mt-1 text-xs text-fg-muted">
										Development time saved
									</div>
								</div>
								<div className="text-center p-4 rounded-lg bg-raised">
									<div className="text-2xl font-bold text-positive">
										{saasAvoided.toLocaleString("en")}€/mo
									</div>
									<div className="mt-1 text-xs text-fg-muted">
										SaaS licenses avoided
									</div>
								</div>
							</div>

							<p className="text-xs text-fg-subtle text-center">
								Based on 2 weeks saved per developer and ~150€/user/month for
								comparable SaaS solutions.
							</p>
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</section>
	)
}
