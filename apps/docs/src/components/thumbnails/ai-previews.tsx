import {
	ActionList,
	// Generative UI — Actions & Decisions
	ApprovalCard,
	AvailabilityCard,
	// Generative UI — Scheduling
	CalendarCard,
	// Generative UI — People & Entities
	CandidateCard,
	ChainOfThought,
	ChainOfThoughtContent,
	ChainOfThoughtHeader,
	ChainOfThoughtStep,
	ChecklistCard,
	CompanyCard,
	ComparisonTable,
	ContactCard,
	DataGrid,
	DataList,
	DealCard,
	// Generative UI — Communication
	EmailPreview,
	EventCard,
	FileCard,
	// Generative UI — Insights & Analytics
	InsightCard,
	// Generative UI — Financial
	InvoiceCard,
	LinkPreview,
	// Generative UI — Location & Media
	LocationCard,
	// Chat
	Message,
	MessageContent,
	MessagePreview,
	// Generative UI — Data & Metrics
	MetricCard,
	MiniChart,
	PollCard,
	PricingTable,
	ProgressCard,
	QuoteSummary,
	RatingCard,
	// Reasoning
	Reasoning,
	ReasoningContent,
	ReasoningTrigger,
	ScoreCard,
	Source,
	Sources,
	SourcesContent,
	SourcesTrigger,
	StatsRow,
	StatusUpdate,
	Suggestion,
	Suggestions,
	SummaryCard,
	// Generative UI — Tasks & Workflow
	TaskCard,
	// Generative UI — Timeline & Activity
	Timeline,
	TransactionCard,
	UserCard,
	VideoCard,
} from "@blazz/pro/components/ai"
import { BrainIcon, CheckIcon, CornerDownLeft, DollarSign, XIcon } from "lucide-react"

// ============================================================================
// Chat Components
// ============================================================================

export function AiConversationPreview() {
	return (
		<div className="flex flex-col gap-4 w-[500px]">
			<Message from="user">
				<MessageContent>What were our top deals last quarter?</MessageContent>
			</Message>
			<Message from="assistant">
				<MessageContent>
					Based on the data, your top 3 deals were Acme Corp ($120K), TechVentures ($85K), and
					GlobalTech ($72K).
				</MessageContent>
			</Message>
		</div>
	)
}

export function AiMessagePreview() {
	return (
		<div className="flex flex-col gap-4 w-[500px]">
			<Message from="user">
				<MessageContent>Analyze this quarter&apos;s performance</MessageContent>
			</Message>
			<Message from="assistant">
				<MessageContent>
					I&apos;ll analyze the key metrics for Q4 2025. Revenue grew 18% QoQ reaching $4.2M.
				</MessageContent>
			</Message>
		</div>
	)
}

export function AiPromptInputPreview() {
	return (
		<div className="w-[500px]">
			<div className="flex items-end gap-2 rounded-lg border border-edge bg-surface p-2">
				<div className="flex-1 min-h-[40px] px-3 py-2 text-sm text-fg-muted">
					What would you like to know?
				</div>
				<button
					type="button"
					className="flex size-8 shrink-0 items-center justify-center rounded-md bg-foreground text-background"
				>
					<CornerDownLeft className="size-4" />
				</button>
			</div>
		</div>
	)
}

export function AiSuggestionPreview() {
	return (
		<Suggestions>
			<Suggestion suggestion="Summarize Q4 results" />
			<Suggestion suggestion="Show pipeline forecast" />
			<Suggestion suggestion="Compare team performance" />
		</Suggestions>
	)
}

// ============================================================================
// Reasoning Components
// ============================================================================

export function AiReasoningPreview() {
	return (
		<div className="w-[500px]">
			<Reasoning defaultOpen>
				<ReasoningTrigger />
				<ReasoningContent>
					{
						"Analyzing the quarterly sales data to identify trends and patterns across all regions..."
					}
				</ReasoningContent>
			</Reasoning>
		</div>
	)
}

export function AiChainOfThoughtPreview() {
	return (
		<div className="w-[500px]">
			<ChainOfThought defaultOpen>
				<ChainOfThoughtHeader>Analysis Steps</ChainOfThoughtHeader>
				<ChainOfThoughtContent>
					<ChainOfThoughtStep label="Fetching sales data" status="complete" />
					<ChainOfThoughtStep label="Analyzing trends" status="active" />
					<ChainOfThoughtStep label="Generating report" status="pending" />
				</ChainOfThoughtContent>
			</ChainOfThought>
		</div>
	)
}

export function AiSourcesPreview() {
	return (
		<div className="w-[500px]">
			<Sources defaultOpen>
				<SourcesTrigger count={4} />
				<SourcesContent>
					<Source href="#" title="Q4 Sales Report 2025" />
					<Source href="#" title="Market Analysis - Industry Trends" />
					<Source href="#" title="Customer Satisfaction Survey" />
					<Source href="#" title="Revenue Forecast Model" />
				</SourcesContent>
			</Sources>
		</div>
	)
}

export function AiConfirmationPreview() {
	return (
		<div className="w-[500px]">
			<div className="rounded-lg border border-edge bg-surface p-4">
				<div className="flex items-start gap-3">
					<div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-surface-3">
						<BrainIcon className="size-4 text-fg-muted" />
					</div>
					<div className="min-w-0 flex-1">
						<span className="text-sm font-semibold text-fg">Send follow-up email</span>
						<p className="mt-1 text-xs text-fg-muted">
							This will send an email to marc@acme.com with the Q1 contract renewal details.
						</p>
					</div>
				</div>
				<div className="mt-3 flex items-center justify-end gap-2">
					<button
						type="button"
						className="inline-flex items-center gap-1.5 rounded-md border border-edge bg-surface px-3 py-1.5 text-xs font-medium text-fg transition-colors hover:bg-surface-3"
					>
						<XIcon className="size-3" />
						Reject
					</button>
					<button
						type="button"
						className="inline-flex items-center gap-1.5 rounded-md bg-foreground px-3 py-1.5 text-xs font-medium text-background transition-colors"
					>
						<CheckIcon className="size-3" />
						Approve
					</button>
				</div>
			</div>
		</div>
	)
}

export function AiModelSelectorPreview() {
	return (
		<div className="w-[320px]">
			<div className="rounded-lg border border-edge bg-surface overflow-hidden">
				<div className="border-b border-edge px-3 py-2.5">
					<div className="flex items-center gap-2 text-sm text-fg-muted">
						<svg
							className="size-4"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
						>
							<circle cx="11" cy="11" r="8" />
							<path d="m21 21-4.35-4.35" />
						</svg>
						Search models...
					</div>
				</div>
				<div className="p-1">
					<div className="px-2 py-1.5 text-xs font-medium text-fg-muted">Popular</div>
					<div className="rounded-md bg-surface-3 px-2 py-1.5 text-sm text-fg">GPT-4o</div>
					<div className="px-2 py-1.5 text-sm text-fg">Claude 3.5 Sonnet</div>
					<div className="px-2 py-1.5 text-sm text-fg">Gemini Pro</div>
				</div>
			</div>
		</div>
	)
}

// ============================================================================
// Generative UI — Data & Metrics
// ============================================================================

export function AiMetricCardPreview() {
	return (
		<MetricCard
			label="Monthly Revenue"
			value="$142,500"
			trend={12.3}
			trendLabel="vs last month"
			icon={<DollarSign className="size-4" />}
		/>
	)
}

export function AiStatsRowPreview() {
	return (
		<StatsRow
			items={[
				{ label: "Revenue", value: "$48.2K", trend: 12 },
				{ label: "Deals", value: "64", trend: -3 },
				{ label: "Customers", value: "2,340", trend: 8 },
				{ label: "Win Rate", value: "68%", trend: 5 },
			]}
		/>
	)
}

export function AiMiniChartPreview() {
	return <MiniChart label="Revenue Trend" data={[22, 28, 35, 31, 42, 38, 45, 52]} value="$52K" />
}

export function AiComparisonTablePreview() {
	return (
		<ComparisonTable
			title="Plan Comparison"
			columns={["Feature", "Starter", "Pro", "Enterprise"]}
			rows={[
				["Users", "5", "25", "Unlimited"],
				["Storage", "10GB", "100GB", "1TB"],
				["Support", "Email", "Priority", "Dedicated"],
			]}
		/>
	)
}

export function AiProgressCardPreview() {
	return <ProgressCard label="Sprint Progress" value={72} description="18 of 25 tasks completed" />
}

export function AiDataListPreview() {
	return (
		<DataList
			title="Deal Details"
			items={[
				{ label: "Company", value: "Acme Corp" },
				{ label: "Amount", value: "$45,000" },
				{ label: "Stage", value: "Negotiation", badge: { text: "Active", variant: "success" } },
				{ label: "Close Date", value: "Mar 31, 2026" },
			]}
		/>
	)
}

export function AiDataGridPreview() {
	return (
		<DataGrid
			title="Top Opportunities"
			columns={[
				{ key: "name", label: "Deal" },
				{ key: "amount", label: "Amount" },
				{ key: "stage", label: "Stage" },
			]}
			rows={[
				{
					name: "Enterprise Plan",
					amount: "$120K",
					stage: { type: "badge", value: "Proposal", variant: "info" },
				},
				{
					name: "Growth Package",
					amount: "$85K",
					stage: { type: "badge", value: "Negotiation", variant: "warning" },
				},
				{
					name: "Starter License",
					amount: "$24K",
					stage: { type: "badge", value: "Closed Won", variant: "success" },
				},
			]}
		/>
	)
}

// ============================================================================
// Generative UI — People & Entities
// ============================================================================

export function AiCandidateCardPreview() {
	return (
		<CandidateCard
			name="Sarah Chen"
			company="Google"
			location="San Francisco, CA"
			matchScore={92}
			status="available"
			skills={["React", "TypeScript", "Node.js"]}
			experience="8 years"
		/>
	)
}

export function AiContactCardPreview() {
	return (
		<ContactCard
			name="Marc Dupont"
			company="Acme Corp"
			email="marc@acme.com"
			phone="+1 555 0123"
			tags={["Enterprise", "Key Account"]}
		/>
	)
}

export function AiCompanyCardPreview() {
	return (
		<CompanyCard
			name="TechVentures Inc."
			industry="Software"
			size="500+"
			revenue="$24M"
			location="New York, NY"
			status="Active"
			statusVariant="success"
		/>
	)
}

export function AiDealCardPreview() {
	return (
		<DealCard
			title="Enterprise SaaS License"
			amount="$85,000"
			stage="proposal"
			probability={65}
			company="Acme Corp"
			closeDate="Mar 31, 2026"
			owner="Sarah Chen"
		/>
	)
}

export function AiUserCardPreview() {
	return <UserCard name="Lisa Park" department="Product" status="online" />
}

// ============================================================================
// Generative UI — Timeline & Activity
// ============================================================================

export function AiTimelinePreview() {
	return (
		<Timeline
			title="Deal History"
			items={[
				{ title: "Deal created", time: "3 days ago" },
				{ title: "Proposal sent", time: "2 days ago" },
				{ title: "Meeting scheduled", time: "1 day ago" },
				{ title: "Contract reviewed", time: "2 hours ago" },
			]}
		/>
	)
}

export function AiEventCardPreview() {
	return (
		<EventCard
			title="Quarterly Business Review"
			type="meeting"
			date="Mar 24, 2026"
			time="2:00 PM"
			location="Conference Room A"
		/>
	)
}

export function AiStatusUpdatePreview() {
	return (
		<StatusUpdate
			title="Deal stage changed"
			from="Qualification"
			to="Proposal"
			fromVariant="info"
			toVariant="warning"
			time="2 hours ago"
		/>
	)
}

// ============================================================================
// Generative UI — Actions & Decisions
// ============================================================================

export function AiApprovalCardPreview() {
	return (
		<ApprovalCard
			title="Discount Approval Request"
			description="20% discount for Enterprise deal"
			status="pending"
			details={[
				{ label: "Deal", value: "Acme Corp" },
				{ label: "Discount", value: "20%" },
				{ label: "New Total", value: "$68,000" },
			]}
		/>
	)
}

export function AiActionListPreview() {
	return (
		<ActionList
			title="Suggested Actions"
			items={[
				{ label: "Send follow-up email", description: "Last contact was 5 days ago" },
				{ label: "Schedule demo", description: "Prospect expressed interest" },
				{ label: "Update forecast", description: "Deal probability changed" },
			]}
		/>
	)
}

export function AiPollCardPreview() {
	return (
		<PollCard
			question="Best time for the team meeting?"
			showResults
			totalVotes={24}
			options={[
				{ label: "Monday 2PM", votes: 12 },
				{ label: "Tuesday 10AM", votes: 8 },
				{ label: "Wednesday 3PM", votes: 4 },
			]}
		/>
	)
}

// ============================================================================
// Generative UI — Communication
// ============================================================================

export function AiEmailPreviewPreview() {
	return (
		<EmailPreview
			subject="Q1 Contract Renewal"
			from={{ name: "Sarah Chen", email: "sarah@company.com" }}
			to={[{ name: "Marc Dupont", email: "marc@acme.com" }]}
			body={
				"Hi Marc,\n\nI wanted to follow up regarding the Q1 contract renewal. Please let me know a good time to discuss the updated terms."
			}
			date="Feb 23, 2026"
			status="draft"
		/>
	)
}

export function AiMessagePreviewPreview() {
	return (
		<MessagePreview
			platform="slack"
			from={{ name: "Lisa Park" }}
			content="Just finished the client presentation. They're very interested in the enterprise plan!"
			channel="sales"
			time="11:30 AM"
		/>
	)
}

// ============================================================================
// Generative UI — Tasks & Workflow
// ============================================================================

export function AiTaskCardPreview() {
	return (
		<TaskCard
			title="Review Q4 Sales Report"
			description="Analyze performance metrics and prepare summary"
			priority="high"
			status="in-progress"
			assignee={{ name: "Marc Dupont" }}
			dueDate="Feb 28, 2026"
			subtasks={{ done: 3, total: 5 }}
		/>
	)
}

export function AiChecklistCardPreview() {
	return (
		<ChecklistCard
			title="Client Onboarding"
			items={[
				{ label: "Send welcome email", checked: true },
				{ label: "Schedule kickoff call", checked: true },
				{ label: "Configure workspace", checked: false },
				{ label: "Import data", checked: false },
			]}
		/>
	)
}

// ============================================================================
// Generative UI — Financial
// ============================================================================

export function AiInvoiceCardPreview() {
	return (
		<InvoiceCard
			number="INV-2026-042"
			client="Acme Corp"
			amount="$12,500"
			status="sent"
			dueDate="Mar 15, 2026"
			issuedDate="Feb 15, 2026"
		/>
	)
}

export function AiQuoteSummaryPreview() {
	return (
		<QuoteSummary
			number="QT-2026-018"
			client="TechVentures Inc."
			total="$45,000"
			status="sent"
			validUntil="Mar 31, 2026"
			itemCount={5}
		/>
	)
}

export function AiPricingTablePreview() {
	return (
		<PricingTable
			tiers={[
				{
					name: "Starter",
					price: "$29",
					period: "mo",
					features: ["5 users", "10GB storage", "Email support"],
				},
				{
					name: "Pro",
					price: "$79",
					period: "mo",
					features: ["25 users", "100GB storage", "Priority support"],
					recommended: true,
				},
				{
					name: "Enterprise",
					price: "$199",
					period: "mo",
					features: ["Unlimited users", "1TB storage", "Dedicated support"],
				},
			]}
		/>
	)
}

export function AiTransactionCardPreview() {
	return (
		<TransactionCard
			title="License Payment"
			amount="$2,400"
			type="incoming"
			status="completed"
			method="Wire Transfer"
			date="Feb 20, 2026"
			reference="TXN-8847"
		/>
	)
}

// ============================================================================
// Generative UI — Scheduling
// ============================================================================

export function AiCalendarCardPreview() {
	return (
		<CalendarCard
			month="February 2026"
			days={[
				{ day: 23, isToday: true, events: [{ title: "Team Sync" }] },
				{ day: 25, events: [{ title: "Client Demo" }] },
				{ day: 28, isHighlighted: true },
			]}
		/>
	)
}

export function AiAvailabilityCardPreview() {
	return (
		<AvailabilityCard
			title="Schedule Meeting"
			days={[
				{
					date: "Mon, Feb 24",
					slots: [
						{ time: "9:00 AM", status: "available" },
						{ time: "2:00 PM", status: "busy" },
						{ time: "4:00 PM", status: "available" },
					],
				},
				{
					date: "Tue, Feb 25",
					slots: [
						{ time: "10:00 AM", status: "available" },
						{ time: "1:00 PM", status: "tentative" },
					],
				},
			]}
		/>
	)
}

// ============================================================================
// Generative UI — Insights & Analytics
// ============================================================================

export function AiInsightCardPreview() {
	return (
		<InsightCard
			title="Upsell Opportunity Detected"
			description="Acme Corp usage has grown 40% this quarter. Consider proposing Enterprise plan upgrade."
			type="opportunity"
			confidence={87}
			source="Usage Analytics"
		/>
	)
}

export function AiSummaryCardPreview() {
	return (
		<SummaryCard
			title="Q4 Performance Summary"
			points={[
				"Revenue increased 18% quarter-over-quarter",
				"12 new enterprise accounts acquired",
				"Customer churn decreased to 2.3%",
				"Average deal size grew by $15K",
			]}
			conclusion="Strong quarter with growth across all key metrics."
			source="Sales Analytics"
		/>
	)
}

export function AiRatingCardPreview() {
	return (
		<RatingCard
			title="Customer Satisfaction"
			score={4.5}
			maxScore={5}
			type="stars"
			reviewCount={128}
			label="Based on customer surveys"
		/>
	)
}

export function AiScoreCardPreview() {
	return (
		<ScoreCard
			title="Lead Quality Score"
			score={85}
			maxScore={100}
			label="High potential"
			breakdown={[
				{ label: "Engagement", value: 90, maxValue: 100 },
				{ label: "Fit", value: 80, maxValue: 100 },
				{ label: "Budget", value: 85, maxValue: 100 },
			]}
		/>
	)
}

// ============================================================================
// Generative UI — Location & Media
// ============================================================================

export function AiLocationCardPreview() {
	return (
		<LocationCard
			name="Acme Corp HQ"
			address="350 5th Avenue"
			city="New York"
			country="United States"
			coordinates={{ lat: 40.7484, lng: -73.9857 }}
		/>
	)
}

export function AiVideoCardPreview() {
	return (
		<VideoCard
			title="Product Demo - Enterprise Features"
			duration="12:45"
			channel="Sales Enablement"
		/>
	)
}

export function AiFileCardPreview() {
	return <FileCard name="Q4-Sales-Report.pdf" size="2.4 MB" type="PDF" />
}

export function AiLinkPreviewPreview() {
	return (
		<LinkPreview
			url="https://example.com/article"
			title="The Future of Enterprise SaaS"
			description="An in-depth analysis of emerging trends in enterprise software."
			domain="example.com"
		/>
	)
}

export function AiImageGalleryPreview() {
	return (
		<div className="overflow-hidden rounded-lg border border-edge bg-surface">
			<div className="relative aspect-video bg-surface-3">
				<div className="flex h-full w-full items-center justify-center">
					<div className="flex flex-col items-center gap-2 text-fg-muted/50">
						<svg
							className="size-10"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="1.5"
						>
							<rect x="3" y="3" width="18" height="18" rx="2" />
							<circle cx="8.5" cy="8.5" r="1.5" />
							<path d="M21 15l-5-5L5 21" />
						</svg>
						<span className="text-xs font-medium">3 images</span>
					</div>
				</div>
				{/* Static dots */}
				<div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
					<span className="size-1.5 rounded-full bg-fg" />
					<span className="size-1.5 rounded-full bg-fg/30" />
					<span className="size-1.5 rounded-full bg-fg/30" />
				</div>
			</div>
			<div className="px-3 py-2">
				<span className="text-xs text-fg-muted">Product screenshots</span>
			</div>
		</div>
	)
}
