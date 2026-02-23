import type { LucideIcon } from "lucide-react"
import { ArrowRight, Brain, ChartLine, MessageCircle, Wrench } from "lucide-react"
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
		id: "chat",
		title: "Chat",
		description: "Conversation, messages and prompt input components.",
		icon: MessageCircle,
		items: [
			{ title: "Conversation", href: "/docs/components/ai/chat/conversation" },
			{ title: "Message", href: "/docs/components/ai/chat/message" },
			{ title: "Prompt Input", href: "/docs/components/ai/chat/prompt-input" },
			{ title: "Suggestion", href: "/docs/components/ai/chat/suggestion" },
			{ title: "Attachments", href: "/docs/components/ai/chat/attachments" },
			{ title: "Shimmer", href: "/docs/components/ai/chat/shimmer" },
		],
	},
	{
		id: "reasoning",
		title: "Reasoning",
		description: "Chain of thought, sources and citation components.",
		icon: Brain,
		items: [
			{ title: "Reasoning", href: "/docs/components/ai/reasoning" },
			{ title: "Chain of Thought", href: "/docs/components/ai/chain-of-thought" },
			{ title: "Sources", href: "/docs/components/ai/sources" },
			{ title: "Inline Citation", href: "/docs/components/ai/inline-citation" },
		],
	},
	{
		id: "tools",
		title: "Tools",
		description: "Confirmation, model selection and context components.",
		icon: Wrench,
		items: [
			{ title: "Confirmation", href: "/docs/components/ai/confirmation" },
			{ title: "Model Selector", href: "/docs/components/ai/model-selector" },
			{ title: "Context", href: "/docs/components/ai/context" },
		],
	},
	{
		id: "generative-ui",
		title: "Generative UI",
		description: "Rich data blocks and entity cards rendered inline in conversations.",
		icon: ChartLine,
		items: [
			{ title: "Metric Card", href: "/docs/components/ai/metric-card" },
			{ title: "Stats Row", href: "/docs/components/ai/stats-row" },
			{ title: "Mini Chart", href: "/docs/components/ai/mini-chart" },
			{ title: "Comparison Table", href: "/docs/components/ai/comparison-table" },
			{ title: "Progress Card", href: "/docs/components/ai/progress-card" },
			{ title: "Data List", href: "/docs/components/ai/data-list" },
			{ title: "Data Grid", href: "/docs/components/ai/data-grid" },
			{ title: "Candidate Card", href: "/docs/components/ai/candidate-card" },
			{ title: "Contact Card", href: "/docs/components/ai/contact-card" },
			{ title: "Company Card", href: "/docs/components/ai/company-card" },
			{ title: "Deal Card", href: "/docs/components/ai/deal-card" },
			{ title: "User Card", href: "/docs/components/ai/user-card" },
			{ title: "Timeline", href: "/docs/components/ai/timeline" },
			{ title: "Event Card", href: "/docs/components/ai/event-card" },
			{ title: "Status Update", href: "/docs/components/ai/status-update" },
			{ title: "Approval Card", href: "/docs/components/ai/approval-card" },
			{ title: "Action List", href: "/docs/components/ai/action-list" },
			{ title: "Poll Card", href: "/docs/components/ai/poll-card" },
			{ title: "File Card", href: "/docs/components/ai/file-card" },
			{ title: "Link Preview", href: "/docs/components/ai/link-preview" },
			{ title: "Image Gallery", href: "/docs/components/ai/image-gallery" },
		],
	},
]

const totalComponents = aiCategories.reduce((sum, cat) => sum + cat.items.length, 0)

export default function AIElementsPage() {
	return (
		<Page
			title="AI Elements"
			subtitle={`${totalComponents} components for building AI chat interfaces. Browse by category.`}
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
