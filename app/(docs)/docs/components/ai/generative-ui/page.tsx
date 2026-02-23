import { ArrowRight } from "lucide-react"
import Link from "next/link"
import { Page } from "@/components/ui/page"

interface GenUICategory {
	id: string
	title: string
	description: string
	items: { title: string; href: string }[]
}

const categories: GenUICategory[] = [
	{
		id: "data",
		title: "Data & Metrics",
		description: "KPIs, charts, tables and progress indicators.",
		items: [
			{ title: "Metric Card", href: "/docs/components/ai/metric-card" },
			{ title: "Stats Row", href: "/docs/components/ai/stats-row" },
			{ title: "Mini Chart", href: "/docs/components/ai/mini-chart" },
			{ title: "Comparison Table", href: "/docs/components/ai/comparison-table" },
			{ title: "Progress Card", href: "/docs/components/ai/progress-card" },
			{ title: "Data List", href: "/docs/components/ai/data-list" },
			{ title: "Data Grid", href: "/docs/components/ai/data-grid" },
		],
	},
	{
		id: "entities",
		title: "People & Entities",
		description: "Profile cards and entity representations.",
		items: [
			{ title: "Candidate Card", href: "/docs/components/ai/candidate-card" },
			{ title: "Contact Card", href: "/docs/components/ai/contact-card" },
			{ title: "Company Card", href: "/docs/components/ai/company-card" },
			{ title: "Deal Card", href: "/docs/components/ai/deal-card" },
			{ title: "User Card", href: "/docs/components/ai/user-card" },
		],
	},
	{
		id: "timeline",
		title: "Timeline & Activity",
		description: "Activity feeds, events and status changes.",
		items: [
			{ title: "Timeline", href: "/docs/components/ai/timeline" },
			{ title: "Event Card", href: "/docs/components/ai/event-card" },
			{ title: "Status Update", href: "/docs/components/ai/status-update" },
		],
	},
	{
		id: "actions",
		title: "Actions & Decisions",
		description: "Approvals, polls and suggested actions.",
		items: [
			{ title: "Approval Card", href: "/docs/components/ai/approval-card" },
			{ title: "Action List", href: "/docs/components/ai/action-list" },
			{ title: "Poll Card", href: "/docs/components/ai/poll-card" },
		],
	},
	{
		id: "communication",
		title: "Communication",
		description: "Email drafts and message previews.",
		items: [
			{ title: "Email Preview", href: "/docs/components/ai/email-preview" },
			{ title: "Message Preview", href: "/docs/components/ai/message-preview" },
		],
	},
	{
		id: "tasks",
		title: "Tasks & Workflow",
		description: "Task tracking, checklists and progress.",
		items: [
			{ title: "Task Card", href: "/docs/components/ai/task-card" },
			{ title: "Checklist Card", href: "/docs/components/ai/checklist-card" },
		],
	},
	{
		id: "financial",
		title: "Financial",
		description: "Invoices, quotes, pricing and transactions.",
		items: [
			{ title: "Invoice Card", href: "/docs/components/ai/invoice-card" },
			{ title: "Quote Summary", href: "/docs/components/ai/quote-summary" },
			{ title: "Pricing Table", href: "/docs/components/ai/pricing-table" },
			{ title: "Transaction Card", href: "/docs/components/ai/transaction-card" },
		],
	},
	{
		id: "scheduling",
		title: "Scheduling",
		description: "Calendars and availability grids.",
		items: [
			{ title: "Calendar Card", href: "/docs/components/ai/calendar-card" },
			{ title: "Availability Card", href: "/docs/components/ai/availability-card" },
		],
	},
	{
		id: "insights",
		title: "Insights & Analytics",
		description: "AI recommendations, summaries, ratings and scores.",
		items: [
			{ title: "Insight Card", href: "/docs/components/ai/insight-card" },
			{ title: "Summary Card", href: "/docs/components/ai/summary-card" },
			{ title: "Rating Card", href: "/docs/components/ai/rating-card" },
			{ title: "Score Card", href: "/docs/components/ai/score-card" },
		],
	},
	{
		id: "media",
		title: "Media & Files",
		description: "File attachments, link previews, images and video.",
		items: [
			{ title: "File Card", href: "/docs/components/ai/file-card" },
			{ title: "Link Preview", href: "/docs/components/ai/link-preview" },
			{ title: "Image Gallery", href: "/docs/components/ai/image-gallery" },
			{ title: "Location Card", href: "/docs/components/ai/location-card" },
			{ title: "Video Card", href: "/docs/components/ai/video-card" },
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
