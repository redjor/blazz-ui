"use client"

import { ChevronDown } from "lucide-react"
import { motion } from "motion/react"

const faqs = [
	{
		question: "What technologies are used?",
		answer:
			"React 19, TypeScript strict, Tailwind v4, and Base UI (headless). Forms use react-hook-form + Zod, data grids use TanStack Table, charts use Recharts, drag-and-drop uses @dnd-kit.",
	},
	{
		question: "Is it compatible with my existing project?",
		answer:
			"Yes. Components are standard React + Tailwind. Copy individual components or use the full kit as a starting point. No vendor lock-in.",
	},
	{
		question: "How does the license work?",
		answer:
			"Starter is MIT licensed and free forever. Pro is a one-time purchase — you own the code, unlimited projects.",
	},
	{
		question: "Can I use it for client projects?",
		answer:
			"Absolutely. Both Pro and Enterprise allow unlimited commercial projects. No additional licensing fees.",
	},
	{
		question: "What about the MCP server?",
		answer:
			"The MCP server gives AI coding assistants (Cursor, Claude Code) access to your design tokens, component APIs, and usage patterns. It helps AI write correct Blazz UI code on the first try.",
	},
	{
		question: "How are updates handled?",
		answer:
			"You own the code and control updates. We publish regularly with new components and improvements. Pro users get all updates included.",
	},
]

export function Faq() {
	return (
		<section id="faq" className="py-4 px-6">
			<div className="mx-auto max-w-6xl">
				<div className="rounded-xl border border-container bg-card px-8 py-12 sm:px-12">
					<motion.div
						initial={{ opacity: 0, y: 12 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.3 }}
						className="mb-8"
					>
						<p className="text-sm font-medium text-brand mb-1.5">FAQ</p>
						<h2 className="text-xl sm:text-2xl font-bold tracking-tight text-fg">
							Common questions
						</h2>
					</motion.div>

					<div className="max-w-2xl space-y-1.5">
						{faqs.map((faq, i) => (
							<motion.details
								key={faq.question}
								initial={{ opacity: 0, y: 8 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								transition={{ duration: 0.2, delay: i * 0.03 }}
								className="group rounded-lg border border-edge/40 bg-muted/30"
							>
								<summary className="flex items-center justify-between cursor-pointer px-4 py-3 text-[13px] font-medium text-fg list-none [&::-webkit-details-marker]:hidden">
									{faq.question}
									<ChevronDown className="size-3.5 text-fg-muted transition-transform duration-150 group-open:rotate-180" />
								</summary>
								<div className="px-4 pb-3 text-xs text-fg-muted leading-relaxed">{faq.answer}</div>
							</motion.details>
						))}
					</div>
				</div>
			</div>
		</section>
	)
}
