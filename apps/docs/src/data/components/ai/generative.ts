// apps/docs/src/data/components/ai/generative.ts
import type { ComponentDataLite } from "../../types"

// ---------------------------------------------------------------------------
// Commerce (5)
// ---------------------------------------------------------------------------

const commerce: ComponentDataLite[] = [
	{
		name: "InvoiceCard",
		category: "ai",
		description: "Invoice card with number, client, amount, status badge, dates, and line items.",
		imports: {
			path: "@blazz/pro/components/ai/generative/commerce/invoice-card",
			named: ["InvoiceCard"],
		},
		useCase: "Display invoice details in AI chat responses.",
		canonicalExample: '<InvoiceCard number="INV-001" client="Acme Corp" amount={1200} status="paid" date="2026-01-15" />',
	},
	{
		name: "PricingTable",
		category: "ai",
		description: "Pricing tiers comparison with features, price, description, and recommended badge.",
		imports: {
			path: "@blazz/pro/components/ai/generative/commerce/pricing-table",
			named: ["PricingTable"],
		},
		useCase: "Show pricing plans or subscription options in AI responses.",
		canonicalExample: '<PricingTable tiers={[{ name: "Free", price: 0, features: ["5 users"] }, { name: "Pro", price: 29, features: ["Unlimited"], recommended: true }]} />',
	},
	{
		name: "ProductCard",
		category: "ai",
		description: "Product card with name, price, category, status badge, and image.",
		imports: {
			path: "@blazz/pro/components/ai/generative/commerce/product-card",
			named: ["ProductCard"],
		},
		useCase: "Display product information in AI commerce responses.",
		canonicalExample: '<ProductCard name="Widget Pro" price={49.99} category="Electronics" status="in-stock" />',
	},
	{
		name: "QuoteSummary",
		category: "ai",
		description: "Quote summary with number, client, total, status, validity date, and item count.",
		imports: {
			path: "@blazz/pro/components/ai/generative/commerce/quote-summary",
			named: ["QuoteSummary"],
		},
		useCase: "Show quote details in AI sales responses.",
		canonicalExample: '<QuoteSummary number="Q-2026-042" client="Acme" total={5400} status="pending" validUntil="2026-04-01" items={3} />',
	},
	{
		name: "TransactionCard",
		category: "ai",
		description: "Transaction card with title, amount, type (incoming/outgoing), status, method, and reference.",
		imports: {
			path: "@blazz/pro/components/ai/generative/commerce/transaction-card",
			named: ["TransactionCard"],
		},
		useCase: "Display financial transaction details in AI responses.",
		canonicalExample: '<TransactionCard title="Payment received" amount={500} type="incoming" status="completed" method="card" />',
	},
]

// ---------------------------------------------------------------------------
// Content (7)
// ---------------------------------------------------------------------------

const content: ComponentDataLite[] = [
	{
		name: "FileCard",
		category: "ai",
		description: "File card with icon, name, type, size, and download link.",
		imports: {
			path: "@blazz/pro/components/ai/generative/content/file-card",
			named: ["FileCard"],
		},
		useCase: "Display file information with download action in AI responses.",
		canonicalExample: '<FileCard name="report.pdf" type="application/pdf" size={2048000} href="/files/report.pdf" />',
	},
	{
		name: "ImageGallery",
		category: "ai",
		description: "Image carousel with navigation arrows, dots, and captions.",
		imports: {
			path: "@blazz/pro/components/ai/generative/content/image-gallery",
			named: ["ImageGallery"],
		},
		useCase: "Display multiple images in AI responses.",
		canonicalExample: '<ImageGallery images={[{ src: "/img1.jpg", alt: "Photo 1", caption: "First image" }]} />',
	},
	{
		name: "InsightCard",
		category: "ai",
		description: "Insight card with icon, title, description, type badge, confidence bar, and source.",
		imports: {
			path: "@blazz/pro/components/ai/generative/content/insight-card",
			named: ["InsightCard"],
		},
		useCase: "Present AI-generated insights and analysis findings.",
		canonicalExample: '<InsightCard title="Revenue Trend" description="Revenue increased 12% QoQ" type="positive" confidence={0.85} />',
	},
	{
		name: "LinkPreview",
		category: "ai",
		description: "Link preview card with domain, thumbnail, title, and description.",
		imports: {
			path: "@blazz/pro/components/ai/generative/content/link-preview",
			named: ["LinkPreview"],
		},
		useCase: "Show rich link previews when AI references URLs.",
		canonicalExample: '<LinkPreview url="https://example.com" title="Example Site" description="A sample website" />',
	},
	{
		name: "LocationCard",
		category: "ai",
		description: "Location card with address, city, country, and Google Maps link.",
		imports: {
			path: "@blazz/pro/components/ai/generative/content/location-card",
			named: ["LocationCard"],
		},
		useCase: "Display location information in AI responses.",
		canonicalExample: '<LocationCard address="123 Main St" city="Paris" country="France" />',
	},
	{
		name: "SummaryCard",
		category: "ai",
		description: "Summary card with title, bullet points, conclusion, and source.",
		imports: {
			path: "@blazz/pro/components/ai/generative/content/summary-card",
			named: ["SummaryCard"],
		},
		useCase: "Present summarized content or key takeaways in AI responses.",
		canonicalExample: '<SummaryCard title="Meeting Summary" points={["Discussed Q1 results", "Set Q2 goals"]} conclusion="Next review in April" />',
	},
	{
		name: "VideoCard",
		category: "ai",
		description: "Video card with thumbnail, play button, duration, title, and channel.",
		imports: {
			path: "@blazz/pro/components/ai/generative/content/video-card",
			named: ["VideoCard"],
		},
		useCase: "Display video information in AI responses.",
		canonicalExample: '<VideoCard title="Introduction" thumbnail="/thumb.jpg" duration="5:32" channel="Blazz" />',
	},
]

// ---------------------------------------------------------------------------
// Data (9)
// ---------------------------------------------------------------------------

const data: ComponentDataLite[] = [
	{
		name: "ComparisonTable",
		category: "ai",
		description: "Simple comparison table with labeled columns and rows.",
		imports: {
			path: "@blazz/pro/components/ai/generative/data/comparison-table",
			named: ["ComparisonTable"],
		},
		useCase: "Compare items side-by-side in AI responses.",
		canonicalExample: '<ComparisonTable columns={["Feature", "Plan A", "Plan B"]} rows={[["Users", "5", "Unlimited"]]} />',
	},
	{
		name: "DataGrid",
		category: "ai",
		description: "Data grid with typed cells (text, badge, avatar, trend), sortable columns, and clickable rows.",
		imports: {
			path: "@blazz/pro/components/ai/generative/data/data-grid",
			named: ["DataGrid"],
		},
		useCase: "Display structured tabular data in AI responses.",
		canonicalExample: '<DataGrid columns={[{ key: "name", label: "Name" }]} rows={[{ name: "Alice" }]} />',
	},
	{
		name: "DataList",
		category: "ai",
		description: "Labeled key-value list with optional status badges.",
		imports: {
			path: "@blazz/pro/components/ai/generative/data/data-list",
			named: ["DataList"],
		},
		useCase: "Display structured key-value data in AI responses.",
		canonicalExample: '<DataList items={[{ label: "Status", value: "Active", badge: "success" }]} />',
	},
	{
		name: "MetricCard",
		category: "ai",
		description: "Metric card with label, value, trend indicator, icon, and percentage change.",
		imports: {
			path: "@blazz/pro/components/ai/generative/data/metric-card",
			named: ["MetricCard"],
		},
		useCase: "Display single KPI metrics in AI responses.",
		canonicalExample: '<MetricCard label="Revenue" value="€1.2M" trend={8.2} />',
	},
	{
		name: "MiniChart",
		category: "ai",
		description: "Mini area chart with label, sparkline data, and current value.",
		imports: {
			path: "@blazz/pro/components/ai/generative/data/mini-chart",
			named: ["MiniChart"],
		},
		useCase: "Show trend visualization in AI responses.",
		canonicalExample: '<MiniChart label="Users" value="2.4K" data={[10, 15, 12, 18, 22]} />',
	},
	{
		name: "ProgressCard",
		category: "ai",
		description: "Progress bar card with label, percentage, and optional description.",
		imports: {
			path: "@blazz/pro/components/ai/generative/data/progress-card",
			named: ["ProgressCard"],
		},
		useCase: "Show progress toward goals in AI responses.",
		canonicalExample: '<ProgressCard label="Project Alpha" progress={72} description="On track for Q2" />',
	},
	{
		name: "RatingCard",
		category: "ai",
		description: "Rating display in stars, numeric, or NPS format with review count.",
		imports: {
			path: "@blazz/pro/components/ai/generative/data/rating-card",
			named: ["RatingCard"],
		},
		useCase: "Display ratings and reviews in AI responses.",
		canonicalExample: '<RatingCard rating={4.5} format="stars" reviews={128} />',
	},
	{
		name: "ScoreCard",
		category: "ai",
		description: "Circular progress score with breakdown bars.",
		imports: {
			path: "@blazz/pro/components/ai/generative/data/score-card",
			named: ["ScoreCard"],
		},
		useCase: "Display composite scores with breakdowns in AI responses.",
		canonicalExample: '<ScoreCard score={85} breakdown={[{ label: "Speed", value: 90 }, { label: "Quality", value: 80 }]} />',
	},
	{
		name: "StatsRow",
		category: "ai",
		description: "Horizontal stats row with label, value, and optional trend.",
		imports: {
			path: "@blazz/pro/components/ai/generative/data/stats-row",
			named: ["StatsRow"],
		},
		useCase: "Display inline statistics in AI responses.",
		canonicalExample: '<StatsRow stats={[{ label: "Users", value: "2.8K" }, { label: "Revenue", value: "€45K", trend: 5.2 }]} />',
	},
]

// ---------------------------------------------------------------------------
// Entities (5)
// ---------------------------------------------------------------------------

const entities: ComponentDataLite[] = [
	{
		name: "CandidateCard",
		category: "ai",
		description: "Candidate profile card with avatar, role, status badge, skills, experience, and match score.",
		imports: {
			path: "@blazz/pro/components/ai/generative/entities/candidate-card",
			named: ["CandidateCard"],
		},
		useCase: "Display candidate profiles in AI recruitment responses.",
		canonicalExample: '<CandidateCard name="Alice Martin" role="Senior Developer" skills={["React", "TypeScript"]} matchScore={92} />',
	},
	{
		name: "CompanyCard",
		category: "ai",
		description: "Company profile card with logo, industry, size, revenue, location, website, and status.",
		imports: {
			path: "@blazz/pro/components/ai/generative/entities/company-card",
			named: ["CompanyCard"],
		},
		useCase: "Display company information in AI CRM responses.",
		canonicalExample: '<CompanyCard name="Acme Corp" industry="Technology" size="50-200" location="Paris" />',
	},
	{
		name: "ContactCard",
		category: "ai",
		description: "Contact card with avatar, name, role, company, email, phone, last contact, and tags.",
		imports: {
			path: "@blazz/pro/components/ai/generative/entities/contact-card",
			named: ["ContactCard"],
		},
		useCase: "Display contact information in AI CRM responses.",
		canonicalExample: '<ContactCard name="Bob Smith" role="CTO" company="Acme" email="bob@acme.com" />',
	},
	{
		name: "DealCard",
		category: "ai",
		description: "Deal card with title, amount, stage badge, probability, company, close date, and owner.",
		imports: {
			path: "@blazz/pro/components/ai/generative/entities/deal-card",
			named: ["DealCard"],
		},
		useCase: "Display deal pipeline information in AI sales responses.",
		canonicalExample: '<DealCard title="Enterprise License" amount={50000} stage="negotiation" probability={60} company="Acme" />',
	},
	{
		name: "UserCard",
		category: "ai",
		description: "User card with avatar, name, role, department, and online status badge.",
		imports: {
			path: "@blazz/pro/components/ai/generative/entities/user-card",
			named: ["UserCard"],
		},
		useCase: "Display user profiles in AI team responses.",
		canonicalExample: '<UserCard name="Alice" role="Designer" department="Product" status="online" />',
	},
]

// ---------------------------------------------------------------------------
// Planning (5)
// ---------------------------------------------------------------------------

const planning: ComponentDataLite[] = [
	{
		name: "AvailabilityCard",
		category: "ai",
		description: "Time slot availability calendar with selectable slots (available, busy, tentative).",
		imports: {
			path: "@blazz/pro/components/ai/generative/planning/availability-card",
			named: ["AvailabilityCard"],
		},
		useCase: "Show scheduling availability in AI responses.",
		canonicalExample: '<AvailabilityCard date="2026-03-20" slots={[{ time: "09:00", status: "available" }, { time: "10:00", status: "busy" }]} />',
	},
	{
		name: "CalendarCard",
		category: "ai",
		description: "Mini calendar view with events per day and status indicators.",
		imports: {
			path: "@blazz/pro/components/ai/generative/planning/calendar-card",
			named: ["CalendarCard"],
		},
		useCase: "Display calendar overview in AI scheduling responses.",
		canonicalExample: '<CalendarCard month={3} year={2026} events={[{ date: "2026-03-20", title: "Meeting", status: "confirmed" }]} />',
	},
	{
		name: "EventCard",
		category: "ai",
		description: "Event card with type badge, date, time, location, and participant avatars.",
		imports: {
			path: "@blazz/pro/components/ai/generative/planning/event-card",
			named: ["EventCard"],
		},
		useCase: "Display event details in AI scheduling responses.",
		canonicalExample: '<EventCard title="Team Standup" type="meeting" date="2026-03-20" time="09:00" location="Room A" />',
	},
	{
		name: "StatusUpdate",
		category: "ai",
		description: "Status change card showing before/after state with badges.",
		imports: {
			path: "@blazz/pro/components/ai/generative/planning/status-update",
			named: ["StatusUpdate"],
		},
		useCase: "Display status transitions in AI workflow responses.",
		canonicalExample: '<StatusUpdate entity="Deal #42" from="negotiation" to="won" updatedBy="Alice" />',
	},
	{
		name: "Timeline",
		category: "ai",
		description: "Vertical timeline with items, icons, descriptions, and timestamps.",
		imports: {
			path: "@blazz/pro/components/ai/generative/planning/timeline",
			named: ["Timeline"],
		},
		useCase: "Display chronological events in AI responses.",
		canonicalExample: '<Timeline items={[{ title: "Created", description: "Project started", date: "2026-01-01" }]} />',
	},
]

// ---------------------------------------------------------------------------
// Workflow (7)
// ---------------------------------------------------------------------------

const workflow: ComponentDataLite[] = [
	{
		name: "ActionList",
		category: "ai",
		description: "Clickable list of actions with icons, labels, and descriptions.",
		imports: {
			path: "@blazz/pro/components/ai/generative/workflow/action-list",
			named: ["ActionList"],
		},
		useCase: "Present actionable options in AI responses.",
		canonicalExample: '<ActionList actions={[{ label: "Send email", description: "Draft and send", icon: "mail" }]} />',
	},
	{
		name: "ApprovalCard",
		category: "ai",
		description: "Approval request card with status badge, description, and detail rows.",
		imports: {
			path: "@blazz/pro/components/ai/generative/workflow/approval-card",
			named: ["ApprovalCard"],
		},
		useCase: "Display approval requests in AI workflow responses.",
		canonicalExample: '<ApprovalCard title="Budget Approval" status="pending" amount={5000} requestedBy="Alice" />',
	},
	{
		name: "ChecklistCard",
		category: "ai",
		description: "Interactive checklist with progress bar and toggleable items.",
		imports: {
			path: "@blazz/pro/components/ai/generative/workflow/checklist-card",
			named: ["ChecklistCard"],
		},
		useCase: "Display task checklists in AI responses.",
		canonicalExample: '<ChecklistCard title="Launch Checklist" items={[{ label: "Tests passing", checked: true }, { label: "Deploy", checked: false }]} />',
	},
	{
		name: "EmailPreview",
		category: "ai",
		description: "Email preview with subject, from/to info, body excerpt, and attachment count.",
		imports: {
			path: "@blazz/pro/components/ai/generative/workflow/email-preview",
			named: ["EmailPreview"],
		},
		useCase: "Preview email content in AI communication responses.",
		canonicalExample: '<EmailPreview subject="Q1 Report" from="alice@acme.com" to="team@acme.com" body="Please find attached..." />',
	},
	{
		name: "MessagePreview",
		category: "ai",
		description: "Message preview for SMS, WhatsApp, Slack, or Email with platform icon.",
		imports: {
			path: "@blazz/pro/components/ai/generative/workflow/message-preview",
			named: ["MessagePreview"],
		},
		useCase: "Preview messages across platforms in AI responses.",
		canonicalExample: '<MessagePreview platform="slack" from="Alice" message="Hey team, the deploy is done!" />',
	},
	{
		name: "PollCard",
		category: "ai",
		description: "Poll/survey with voteable options, results percentage, and vote count.",
		imports: {
			path: "@blazz/pro/components/ai/generative/workflow/poll-card",
			named: ["PollCard"],
		},
		useCase: "Display polls or surveys in AI responses.",
		canonicalExample: '<PollCard question="Preferred stack?" options={[{ label: "React", votes: 12 }, { label: "Vue", votes: 5 }]} />',
	},
	{
		name: "TaskCard",
		category: "ai",
		description: "Task card with status icon, priority badge, due date, subtasks, and assignee avatar.",
		imports: {
			path: "@blazz/pro/components/ai/generative/workflow/task-card",
			named: ["TaskCard"],
		},
		useCase: "Display task information in AI project management responses.",
		canonicalExample: '<TaskCard title="Fix login bug" priority="high" status="in-progress" dueDate="2026-03-25" assignee="Bob" />',
	},
]

// ---------------------------------------------------------------------------
// Export
// ---------------------------------------------------------------------------

export const generativeAiData: ComponentDataLite[] = [...commerce, ...content, ...data, ...entities, ...planning, ...workflow]
