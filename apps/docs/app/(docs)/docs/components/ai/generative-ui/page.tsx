import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Page } from "@blazz/ui/components/ui/page"

interface GenUICategory {
	id: string
	title: string
	description: string
	items: { title: string; href: string }[]
}

const categories: GenUICategory[] = [
	{
		id: "data",
		title: "Data",
		description: "KPIs, charts, tables and progress indicators.",
		items: [
			{ title: "Metric Card", href: "/docs/components/ai/data/metric-card" },
			{ title: "Stats Row", href: "/docs/components/ai/data/stats-row" },
			{ title: "Mini Chart", href: "/docs/components/ai/data/mini-chart" },
			{ title: "Comparison Table", href: "/docs/components/ai/data/comparison-table" },
			{ title: "Progress Card", href: "/docs/components/ai/data/progress-card" },
			{ title: "Data List", href: "/docs/components/ai/data/data-list" },
			{ title: "Data Grid", href: "/docs/components/ai/data/data-grid" },
			{ title: "Rating Card", href: "/docs/components/ai/data/rating-card" },
			{ title: "Score Card", href: "/docs/components/ai/data/score-card" },
		],
	},
	{
		id: "entities",
		title: "Entities",
		description: "Profile cards and entity representations.",
		items: [
			{ title: "Candidate Card", href: "/docs/components/ai/entities/candidate-card" },
			{ title: "Contact Card", href: "/docs/components/ai/entities/contact-card" },
			{ title: "Company Card", href: "/docs/components/ai/entities/company-card" },
			{ title: "Deal Card", href: "/docs/components/ai/entities/deal-card" },
			{ title: "User Card", href: "/docs/components/ai/entities/user-card" },
		],
	},
	{
		id: "workflow",
		title: "Workflow",
		description: "Tasks, approvals, polls and communication previews.",
		items: [
			{ title: "Task Card", href: "/docs/components/ai/workflow/task-card" },
			{ title: "Checklist Card", href: "/docs/components/ai/workflow/checklist-card" },
			{ title: "Approval Card", href: "/docs/components/ai/workflow/approval-card" },
			{ title: "Action List", href: "/docs/components/ai/workflow/action-list" },
			{ title: "Poll Card", href: "/docs/components/ai/workflow/poll-card" },
			{ title: "Email Preview", href: "/docs/components/ai/workflow/email-preview" },
			{ title: "Message Preview", href: "/docs/components/ai/workflow/message-preview" },
		],
	},
	{
		id: "planning",
		title: "Planning",
		description: "Timelines, events, calendars and availability.",
		items: [
			{ title: "Timeline", href: "/docs/components/ai/planning/timeline" },
			{ title: "Event Card", href: "/docs/components/ai/planning/event-card" },
			{ title: "Status Update", href: "/docs/components/ai/planning/status-update" },
			{ title: "Calendar Card", href: "/docs/components/ai/planning/calendar-card" },
			{ title: "Availability Card", href: "/docs/components/ai/planning/availability-card" },
		],
	},
	{
		id: "commerce",
		title: "Commerce",
		description: "Invoices, quotes, pricing and transactions.",
		items: [
			{ title: "Invoice Card", href: "/docs/components/ai/commerce/invoice-card" },
			{ title: "Quote Summary", href: "/docs/components/ai/commerce/quote-summary" },
			{ title: "Pricing Table", href: "/docs/components/ai/commerce/pricing-table" },
			{ title: "Transaction Card", href: "/docs/components/ai/commerce/transaction-card" },
		],
	},
	{
		id: "content",
		title: "Content",
		description: "Insights, summaries, files, media and links.",
		items: [
			{ title: "Insight Card", href: "/docs/components/ai/content/insight-card" },
			{ title: "Summary Card", href: "/docs/components/ai/content/summary-card" },
			{ title: "File Card", href: "/docs/components/ai/content/file-card" },
			{ title: "Link Preview", href: "/docs/components/ai/content/link-preview" },
			{ title: "Image Gallery", href: "/docs/components/ai/content/image-gallery" },
			{ title: "Location Card", href: "/docs/components/ai/content/location-card" },
			{ title: "Video Card", href: "/docs/components/ai/content/video-card" },
		],
	},
]

const totalComponents = categories.reduce((sum, cat) => sum + cat.items.length, 0)

export default function GenerativeUiPage() {
	return (
		<Page
			title="Generative UI"
			subtitle={`${totalComponents} structured blocks that render inline in AI chat messages. Browse by category.`}
		>
			<div className="space-y-10">
				{categories.map((category) => (
					<section key={category.id} className="space-y-3">
						<div className="min-w-0">
							<div className="flex items-center gap-2">
								<h2 className="text-sm font-semibold text-fg">
									{category.title}
								</h2>
								<span className="text-xs text-fg-muted tabular-nums">
									{category.items.length}
								</span>
							</div>
							<p className="text-xs text-fg-muted">
								{category.description}
							</p>
						</div>
						<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
							{category.items.map((component) => (
								<Link
									key={component.href}
									href={component.href}
									className="group flex items-center justify-between rounded-lg border border-edge bg-surface px-3.5 py-2.5 transition-colors hover:bg-raised"
								>
									<span className="text-sm text-fg group-hover:text-fg">
										{component.title}
									</span>
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
