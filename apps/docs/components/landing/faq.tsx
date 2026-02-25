"use client"

import { motion } from "motion/react"
import { ChevronDown } from "lucide-react"

const faqs = [
	{
		question: "What technologies are used?",
		answer:
			"Pro UI Kit is built with Next.js 16, React 19, TypeScript strict, Tailwind v4, and Base UI (headless components). It uses react-hook-form + Zod for forms, TanStack Table for data grids, Recharts for charts, and @dnd-kit for drag-and-drop.",
	},
	{
		question: "Is the kit compatible with my existing project?",
		answer:
			"Yes. The components are built on standard React patterns and Tailwind CSS. You can copy individual components into your existing Next.js project or use the full kit as a starting point. No vendor lock-in.",
	},
	{
		question: "How does the license work?",
		answer:
			"The Starter tier is MIT licensed and free forever. The Pro license is a one-time purchase that gives you access to all components, demo apps, and themes for unlimited projects. You own the code.",
	},
	{
		question: "Is there support included?",
		answer:
			"Pro includes priority support via GitHub issues and email. Enterprise includes dedicated support with SLA. The Starter tier uses community support via GitHub discussions.",
	},
	{
		question: "Can I use the kit for client projects?",
		answer:
			"Absolutely. Both Pro and Enterprise licenses allow unlimited commercial projects. You can build and ship products for your clients without additional licensing fees.",
	},
	{
		question: "How are updates handled?",
		answer:
			"Since you own the code, you control when and how to update. We publish updates regularly with new components and improvements. Pro users get access to all updates included in their purchase.",
	},
]

export function Faq() {
	return (
		<section id="faq" className="py-24 px-6">
			<div className="mx-auto max-w-3xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.4 }}
					className="text-center mb-16"
				>
					<h2 className="text-3xl font-bold text-fg">
						Frequently asked questions
					</h2>
				</motion.div>

				<div className="space-y-2">
					{faqs.map((faq, i) => (
						<motion.details
							key={faq.question}
							initial={{ opacity: 0, y: 10 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ duration: 0.3, delay: i * 0.05 }}
							className="group rounded-lg border border-edge bg-surface"
						>
							<summary className="flex items-center justify-between cursor-pointer px-5 py-4 text-sm font-medium text-fg list-none [&::-webkit-details-marker]:hidden">
								{faq.question}
								<ChevronDown className="size-4 text-fg-muted transition-transform group-open:rotate-180" />
							</summary>
							<div className="px-5 pb-4 text-xs text-fg-muted leading-relaxed">
								{faq.answer}
							</div>
						</motion.details>
					))}
				</div>
			</div>
		</section>
	)
}
