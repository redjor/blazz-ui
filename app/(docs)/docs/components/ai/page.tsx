import type { LucideIcon } from "lucide-react"
import { ArrowRight, BookOpen, Brain, MessageSquare, MousePointerClick } from "lucide-react"
import Link from "next/link"
import { Page } from "@/components/ui/page"

interface AIComponentItem {
	title: string
	href: string
}

interface AIComponentCategory {
	id: string
	title: string
	description: string
	icon: LucideIcon
	items: AIComponentItem[]
}

const aiCategories: AIComponentCategory[] = [
	{
		id: "core-chat",
		title: "Core Chat",
		description: "Message bubbles, conversation threads and prompt input.",
		icon: MessageSquare,
		items: [
			{ title: "Message", href: "/docs/components/ai/message" },
			{ title: "Conversation", href: "/docs/components/ai/conversation" },
			{ title: "Prompt Input", href: "/docs/components/ai/prompt-input" },
		],
	},
	{
		id: "interactions",
		title: "Interactions",
		description: "Suggestions, confirmations, attachments and model selection.",
		icon: MousePointerClick,
		items: [
			{ title: "Suggestion", href: "/docs/components/ai/suggestion" },
			{ title: "Confirmation", href: "/docs/components/ai/confirmation" },
			{ title: "Attachments", href: "/docs/components/ai/attachments" },
			{ title: "Model Selector", href: "/docs/components/ai/model-selector" },
		],
	},
	{
		id: "reasoning",
		title: "Reasoning",
		description: "Thinking indicators and step-by-step reasoning chains.",
		icon: Brain,
		items: [
			{ title: "Reasoning", href: "/docs/components/ai/reasoning" },
			{ title: "Chain of Thought", href: "/docs/components/ai/chain-of-thought" },
		],
	},
	{
		id: "citations-context",
		title: "Citations & Context",
		description: "Source references, inline citations and contextual information.",
		icon: BookOpen,
		items: [
			{ title: "Sources", href: "/docs/components/ai/sources" },
			{ title: "Inline Citation", href: "/docs/components/ai/inline-citation" },
			{ title: "Context", href: "/docs/components/ai/context" },
			{ title: "Shimmer", href: "/docs/components/ai/shimmer" },
		],
	},
]

const totalComponents = aiCategories.reduce((sum, cat) => sum + cat.items.length, 0)

export default function AIElementsPage() {
	return (
		<Page
			title="AI Elements"
			subtitle={`${totalComponents} components for building AI chat interfaces. Browse by category or search for a specific component.`}
		>
			<div className="space-y-10">
				{aiCategories.map((category) => (
					<section key={category.id} className="space-y-3">
						<div className="flex items-center gap-3">
							<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-raised border border-edge">
								<category.icon className="h-4 w-4 text-fg-muted" />
							</div>
							<div className="min-w-0">
								<div className="flex items-center gap-2">
									<h2 className="text-sm font-semibold text-fg">{category.title}</h2>
									<span className="text-xs text-fg-muted tabular-nums">
										{category.items.length}
									</span>
								</div>
								<p className="text-xs text-fg-muted">{category.description}</p>
							</div>
						</div>
						<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
							{category.items.map((component) => (
								<Link
									key={component.href}
									href={component.href}
									className="group flex items-center justify-between rounded-lg border border-edge bg-surface px-3.5 py-2.5 transition-colors hover:bg-raised"
								>
									<span className="text-sm text-fg group-hover:text-fg">{component.title}</span>
									<ArrowRight className="h-3.5 w-3.5 text-fg-muted opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
								</Link>
							))}
						</div>
					</section>
				))}
			</div>
		</Page>
	)
}
