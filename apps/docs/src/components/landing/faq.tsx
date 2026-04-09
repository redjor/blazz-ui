"use client"

import { ChevronDown } from "lucide-react"
import { motion } from "motion/react"
import { SectionShell } from "./section-shell"

const faqs = [
	{
		question: "What technologies are used?",
		answer: "React 19, TypeScript strict, Tailwind v4 and Base UI (headless). Forms use react-hook-form + Zod, data grids use TanStack Table, charts use Recharts, drag-and-drop uses @dnd-kit.",
	},
	{
		question: "Is it compatible with my existing project?",
		answer: "Yes. Components are standard React + Tailwind. Copy individual components or use the full kit as a starting point. No vendor lock-in.",
	},
	{
		question: "How does the license work?",
		answer: "Starter is MIT licensed and free forever. Pro is a one-time purchase — you own the code, unlimited projects, no runtime fees.",
	},
	{
		question: "Can I use it for client projects?",
		answer: "Absolutely. Both Pro and Enterprise allow unlimited commercial projects with no additional licensing fees.",
	},
	{
		question: "What about the MCP server?",
		answer:
			"The MCP server gives AI coding assistants (Cursor, Claude Code) access to your design tokens, component APIs and usage patterns. It helps AI write correct Blazz UI code on the first try.",
	},
	{
		question: "How are updates handled?",
		answer: "You own the code and control updates. We publish regularly with new components and improvements. Pro users get all updates included.",
	},
]

export function Faq() {
	return (
		<SectionShell id="faq" eyebrow="FAQ" title="Common questions" description="Everything you need to know before buying. Still unsure? Open an issue on GitHub.">
			<div className="mx-auto max-w-2xl space-y-2">
				{faqs.map((faq, i) => (
					<motion.details
						key={faq.question}
						initial={{ opacity: 0, y: 6 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true }}
						transition={{ duration: 0.2, delay: i * 0.03 }}
						className="group rounded-lg border border-edge/50 bg-card/40 transition-colors open:bg-card/70"
					>
						<summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-medium text-fg [&::-webkit-details-marker]:hidden">
							{faq.question}
							<ChevronDown className="size-4 text-fg-muted transition-transform duration-150 group-open:rotate-180" />
						</summary>
						<div className="px-5 pb-4 text-[13px] leading-relaxed text-fg-muted">{faq.answer}</div>
					</motion.details>
				))}
			</div>
		</SectionShell>
	)
}
