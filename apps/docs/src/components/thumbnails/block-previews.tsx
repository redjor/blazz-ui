import { ActivityTimeline } from "@blazz/pro/components/blocks/activity-timeline"
import { BudgetCard } from "@blazz/pro/components/blocks/budget-card"
import { ChartCard } from "@blazz/pro/components/blocks/chart-card"
import { DealLinesEditor } from "@blazz/pro/components/blocks/deal-lines-editor"
import { DetailPanel } from "@blazz/pro/components/blocks/detail-panel"
import { FilterBar } from "@blazz/pro/components/blocks/filter-bar"
import { InlineEdit } from "@blazz/pro/components/blocks/inline-edit"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { QuotePreview } from "@blazz/pro/components/blocks/quote-preview"
import { SegmentedProgress } from "@blazz/pro/components/blocks/segmented-progress"
import { SplitView } from "@blazz/pro/components/blocks/split-view"
import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"
import { StatusFlow } from "@blazz/pro/components/blocks/status-flow"
import { ErrorState } from "@blazz/ui/components/patterns/error-state"
import { Field, FieldGrid } from "@blazz/ui/components/patterns/field-grid"
import { FormSection } from "@blazz/ui/components/patterns/form-section"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { Switch } from "@blazz/ui/components/ui/switch"
import {
	Bell,
	Calendar,
	Check,
	ChevronRight,
	Columns3,
	DollarSign,
	Download,
	Edit,
	Globe,
	LayoutGrid,
	List,
	Mail,
	Moon,
	Pencil,
	Phone,
	Plus,
	Rows3,
	StickyNote,
	Target,
	Trash2,
	TrendingUp,
	Upload,
	UserPlus,
	Users,
} from "lucide-react"

// ════════════════════════════════════════════════════════════════════════════
// activity-timeline
// ════════════════════════════════════════════════════════════════════════════

export function ActivityTimelinePreview() {
	return (
		<div className="w-[420px] p-6">
			<ActivityTimeline
				events={[
					{
						date: "2026-02-23T10:00:00Z",
						user: "Sarah Chen",
						action: "Created deal",
						detail: "Enterprise Plan - Acme Corp",
					},
					{
						date: "2026-02-22T14:30:00Z",
						user: "Marc Dupont",
						action: "Sent proposal",
						detail: "Q1 contract renewal",
					},
					{
						date: "2026-02-21T09:15:00Z",
						user: "Lisa Park",
						action: "Updated status",
						detail: "Moved to Negotiation",
					},
					{
						date: "2026-02-20T16:45:00Z",
						user: "James Lee",
						action: "Added note",
						detail: "Follow-up scheduled for Friday",
					},
				]}
			/>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// bulk-action-bar
// ════════════════════════════════════════════════════════════════════════════

export function BulkActionBarPreview() {
	return (
		<div className="relative flex h-[120px] w-[600px] items-end justify-center pb-4">
			{/* Override fixed positioning for thumbnail preview */}
			<div className="flex items-center gap-3 rounded-lg border bg-card px-4 py-2.5 shadow-lg">
				<span className="text-sm font-medium text-fg">12 selected</span>
				<div className="h-4 w-px bg-border" />
				<div className="flex items-center gap-2">
					<button
						type="button"
						className="inline-flex h-8 items-center gap-1.5 rounded-md border border-edge bg-transparent px-3 text-sm font-medium"
					>
						<Download className="size-4" />
						Export
					</button>
					<button
						type="button"
						className="inline-flex h-8 items-center gap-1.5 rounded-md border border-edge bg-transparent px-3 text-sm font-medium"
					>
						<UserPlus className="size-4" />
						Assign
					</button>
					<button
						type="button"
						className="inline-flex h-8 items-center gap-1.5 rounded-md border border-negative bg-negative px-3 text-sm font-medium text-white"
					>
						<Trash2 className="size-4" />
						Delete
					</button>
				</div>
				<div className="h-4 w-px bg-border" />
				<button
					type="button"
					className="inline-flex size-7 items-center justify-center rounded-md text-fg-muted hover:bg-muted"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						strokeWidth="2"
						strokeLinecap="round"
						strokeLinejoin="round"
					>
						<path d="M18 6 6 18" />
						<path d="m6 6 12 12" />
					</svg>
				</button>
			</div>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// chart-card
// ════════════════════════════════════════════════════════════════════════════

export function ChartCardPreview() {
	return (
		<div className="w-[560px] p-4">
			<ChartCard
				title="Revenue Trend"
				description="Monthly revenue over the last 6 months"
				type="bar"
				data={[
					{ month: "Jan", revenue: 4200 },
					{ month: "Feb", revenue: 5100 },
					{ month: "Mar", revenue: 4800 },
					{ month: "Apr", revenue: 6300 },
					{ month: "May", revenue: 7100 },
					{ month: "Jun", revenue: 6800 },
				]}
				xKey="month"
				yKey="revenue"
				height={220}
			/>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// detail-panel
// ════════════════════════════════════════════════════════════════════════════

export function DetailPanelPreview() {
	return (
		<div className="w-[560px] p-6">
			<DetailPanel>
				<DetailPanel.Header
					title="Acme Corporation"
					subtitle="Enterprise customer since 2024"
					status={
						<Badge variant="success" size="xs" fill="subtle">
							Active
						</Badge>
					}
					actions={[
						{ label: "Edit", onClick: () => {}, icon: Edit, variant: "outline" },
						{ label: "Send email", onClick: () => {}, icon: Mail },
					]}
				/>
				<DetailPanel.Section title="Company Details" description="Basic information">
					<FieldGrid columns={2}>
						<Field label="Industry" value="Technology" />
						<Field label="Revenue" value="$2.4M" />
						<Field label="Employees" value="150" />
						<Field label="Location" value="San Francisco, CA" />
					</FieldGrid>
				</DetailPanel.Section>
			</DetailPanel>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// error-state
// ════════════════════════════════════════════════════════════════════════════

export function ErrorStatePreview() {
	return (
		<div className="w-[480px] p-6">
			<ErrorState
				title="Failed to load data"
				description="Please check your connection and try again."
				onRetry={() => {}}
			/>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// field-grid
// ════════════════════════════════════════════════════════════════════════════

export function FieldGridPreview() {
	return (
		<div className="w-[560px] p-6">
			<FieldGrid columns={3}>
				<Field label="Company" value="Acme Corp" />
				<Field label="Industry" value="Technology" />
				<Field label="Revenue" value="$2.4M" />
				<Field label="Employees" value="150" />
				<Field label="Location" value="San Francisco, CA" />
				<Field label="Founded" value="2019" />
			</FieldGrid>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// filter-bar
// ════════════════════════════════════════════════════════════════════════════

export function FilterBarPreview() {
	return (
		<div className="w-[640px] p-6">
			<FilterBar
				filters={[
					{
						id: "search",
						type: "search",
						placeholder: "Search contacts...",
					},
					{
						id: "status",
						type: "select",
						label: "Status",
						options: [
							{ value: "active", label: "Active" },
							{ value: "inactive", label: "Inactive" },
							{ value: "pending", label: "Pending" },
						],
					},
					{
						id: "industry",
						type: "select",
						label: "Industry",
						options: [
							{ value: "tech", label: "Technology" },
							{ value: "finance", label: "Finance" },
							{ value: "health", label: "Healthcare" },
						],
					},
					{
						id: "created",
						type: "date",
						placeholder: "Created after",
					},
				]}
			/>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// form-field (static representation — requires react-hook-form control)
// ════════════════════════════════════════════════════════════════════════════

export function FormFieldPreview() {
	return (
		<div className="grid w-[480px] grid-cols-2 gap-4 p-6">
			<div className="space-y-1.5">
				<Label>
					Full name <span className="ml-0.5 text-negative">*</span>
				</Label>
				<Input placeholder="Enter full name" />
			</div>
			<div className="space-y-1.5">
				<Label>
					Email <span className="ml-0.5 text-negative">*</span>
				</Label>
				<Input type="email" placeholder="email@example.com" />
			</div>
			<div className="space-y-1.5">
				<Label>Company</Label>
				<Input placeholder="Company name" />
				<p className="text-xs text-fg-muted">Optional field</p>
			</div>
			<div className="space-y-1.5">
				<Label>Role</Label>
				<select className="flex h-8 w-full rounded-md border border-edge bg-card px-3 py-1 text-sm shadow-sm">
					<option value="">Select...</option>
					<option value="ceo">CEO</option>
					<option value="cto">CTO</option>
					<option value="vp">VP Sales</option>
				</select>
			</div>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// form-section
// ════════════════════════════════════════════════════════════════════════════

export function FormSectionPreview() {
	return (
		<div className="flex w-[520px] flex-col gap-4 p-6">
			<FormSection
				title="Contact Information"
				description="Primary contact details for this record"
				defaultOpen
			>
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-1.5">
						<Label>First name</Label>
						<Input placeholder="First name" />
					</div>
					<div className="space-y-1.5">
						<Label>Last name</Label>
						<Input placeholder="Last name" />
					</div>
				</div>
			</FormSection>
			<FormSection title="Address" description="Billing and shipping address" defaultOpen={false}>
				<div className="space-y-3">
					<div className="space-y-1.5">
						<Label>Street</Label>
						<Input placeholder="Street address" />
					</div>
				</div>
			</FormSection>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// multi-step-form (static representation — requires zod schemas + step components)
// ════════════════════════════════════════════════════════════════════════════

const multiStepSteps = [
	{ id: "company", title: "Company", completed: true },
	{ id: "contact", title: "Contact", completed: false, current: true },
	{ id: "deal", title: "Deal", completed: false },
]

export function MultiStepFormPreview() {
	return (
		<div className="w-[560px] space-y-6 p-6">
			{/* Step indicator */}
			<nav className="flex items-center gap-2">
				{multiStepSteps.map((step, i) => (
					<div key={step.id} className="flex items-center gap-2">
						{i > 0 && <div className="h-px w-8 bg-border" />}
						<div className="flex items-center gap-2">
							<div
								className={`flex size-7 items-center justify-center rounded-full border text-xs font-medium ${
									step.completed
										? "border-fg bg-fg text-card"
										: step.current
											? "border-fg text-fg"
											: "border-edge text-fg-muted"
								}`}
							>
								{step.completed ? <Check className="size-3.5" /> : i + 1}
							</div>
							<span className={`text-sm ${step.current ? "font-medium text-fg" : "text-fg-muted"}`}>
								{step.title}
							</span>
						</div>
					</div>
				))}
			</nav>

			{/* Step content */}
			<div className="rounded-lg border p-6">
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-1.5">
						<Label>
							Contact name <span className="ml-0.5 text-negative">*</span>
						</Label>
						<Input placeholder="Full name" defaultValue="Sarah Chen" />
					</div>
					<div className="space-y-1.5">
						<Label>
							Email <span className="ml-0.5 text-negative">*</span>
						</Label>
						<Input type="email" placeholder="email@company.com" defaultValue="sarah@acme.com" />
					</div>
					<div className="space-y-1.5">
						<Label>Phone</Label>
						<Input placeholder="+1 (555) 000-0000" />
					</div>
					<div className="space-y-1.5">
						<Label>Job title</Label>
						<Input placeholder="e.g. VP Sales" />
					</div>
				</div>
			</div>

			{/* Navigation */}
			<div className="flex items-center justify-between">
				<button
					type="button"
					className="inline-flex h-9 items-center rounded-md border border-edge bg-transparent px-4 text-sm font-medium"
				>
					Previous
				</button>
				<button
					type="button"
					className="inline-flex h-9 items-center rounded-md bg-fg px-4 text-sm font-medium text-card"
				>
					Next
				</button>
			</div>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// page-header
// ════════════════════════════════════════════════════════════════════════════

export function PageHeaderPreview() {
	return (
		<div className="w-[640px] p-6">
			<PageHeader
				title="Contacts"
				description="Manage your customer contacts"
				breadcrumbs={[{ label: "CRM", href: "/" }, { label: "Contacts" }]}
				actions={[
					{
						label: "Import",
						variant: "outline",
						icon: Upload,
						onClick: () => {},
					},
					{
						label: "Add Contact",
						icon: Plus,
						onClick: () => {},
					},
				]}
			/>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// split-view
// ════════════════════════════════════════════════════════════════════════════

const splitViewItems = [
	{ name: "Acme Corp", subtitle: "Technology", active: true },
	{ name: "Globex Inc", subtitle: "Manufacturing", active: false },
	{ name: "Initech", subtitle: "Finance", active: false },
	{ name: "Umbrella Co", subtitle: "Healthcare", active: false },
	{ name: "Hooli", subtitle: "Technology", active: false },
]

export function SplitViewPreview() {
	return (
		<div className="h-[360px] w-[640px] p-4">
			<SplitView defaultWidth={210}>
				<SplitView.Master>
					<div className="divide-y divide-edge">
						{splitViewItems.map((item) => (
							<div
								key={item.name}
								className={`flex items-center gap-3 px-4 py-3 ${item.active ? "bg-brand/5" : ""}`}
							>
								<div className="flex size-8 items-center justify-center rounded-full bg-muted text-xs font-medium">
									{item.name.charAt(0)}
								</div>
								<div className="min-w-0 flex-1">
									<p className="truncate text-sm font-medium text-fg">{item.name}</p>
									<p className="text-xs text-fg-muted">{item.subtitle}</p>
								</div>
								<ChevronRight className="size-4 text-fg-muted" />
							</div>
						))}
					</div>
				</SplitView.Master>
				<SplitView.Detail>
					<div className="space-y-4 p-4">
						<div className="flex items-center gap-3">
							<div className="flex size-10 items-center justify-center rounded-full bg-muted text-sm font-semibold">
								A
							</div>
							<div>
								<p className="text-sm font-semibold text-fg">Acme Corp</p>
								<p className="text-xs text-fg-muted">Technology</p>
							</div>
						</div>
						<div className="grid grid-cols-2 gap-3">
							<div>
								<p className="text-xs text-fg-muted">Revenue</p>
								<p className="text-sm font-medium text-fg">$2.4M</p>
							</div>
							<div>
								<p className="text-xs text-fg-muted">Employees</p>
								<p className="text-sm font-medium text-fg">150</p>
							</div>
							<div>
								<p className="text-xs text-fg-muted">Location</p>
								<p className="text-sm font-medium text-fg">San Francisco, CA</p>
							</div>
							<div>
								<p className="text-xs text-fg-muted">Founded</p>
								<p className="text-sm font-medium text-fg">2019</p>
							</div>
						</div>
					</div>
				</SplitView.Detail>
			</SplitView>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// stats-grid
// ════════════════════════════════════════════════════════════════════════════

export function StatsGridPreview() {
	return (
		<div className="w-[700px] p-4">
			<StatsGrid
				columns={4}
				stats={[
					{
						label: "Revenue",
						value: "$48,200",
						trend: 12.5,
						icon: DollarSign,
					},
					{
						label: "Customers",
						value: "2,340",
						trend: 8.1,
						icon: Users,
					},
					{
						label: "Deals Won",
						value: "64",
						trend: -3.2,
						icon: Target,
					},
					{
						label: "Growth",
						value: "+18%",
						trend: 18,
						icon: TrendingUp,
					},
				]}
			/>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// status-flow
// ════════════════════════════════════════════════════════════════════════════

export function StatusFlowPreview() {
	return (
		<div className="w-[640px] p-6">
			<StatusFlow
				currentStatus="negotiation"
				statuses={[
					{ id: "lead", label: "Lead", color: "gray" },
					{ id: "qualified", label: "Qualified", color: "blue" },
					{ id: "proposal", label: "Proposal", color: "yellow" },
					{
						id: "negotiation",
						label: "Negotiation",
						color: "purple",
					},
					{ id: "won", label: "Won", color: "green" },
				]}
			/>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// budget-card
// ════════════════════════════════════════════════════════════════════════════

export function BudgetCardPreview() {
	return (
		<div className="grid w-[600px] grid-cols-3 gap-4 p-4">
			<BudgetCard name="Acme Corp" revenue={4200} daysConsumed={7} percent={42} budgetLabel="4.2 / 10j" />
			<BudgetCard name="Globex Inc" revenue={8900} daysConsumed={12} percent={82} budgetLabel="8.2 / 10j" />
			<BudgetCard name="Initech" revenue={11200} daysConsumed={15} percent={95} budgetLabel="9.5 / 10j" />
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// deal-lines-editor
// ════════════════════════════════════════════════════════════════════════════

export function DealLinesEditorPreview() {
	return (
		<div className="w-[640px] p-4">
			<DealLinesEditor
				lines={[
					{ id: "1", product: "Enterprise Plan", description: "Annual license", quantity: 1, unitPrice: 24000 },
					{ id: "2", product: "Onboarding", description: "Setup & training", quantity: 5, unitPrice: 1200 },
					{ id: "3", product: "Support Premium", description: "24/7 support", quantity: 12, unitPrice: 500 },
				]}
				onChange={() => {}}
				readOnly
			/>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// inbox
// ════════════════════════════════════════════════════════════════════════════

export function InboxPreview() {
	return (
		<div className="w-[480px] p-4">
			<div className="divide-y divide-edge rounded-lg border">
				{[
					{ initials: "SC", name: "Sarah Chen", action: "commented on", target: "Q1 Proposal", time: "2m", unread: true },
					{ initials: "MD", name: "Marc Dupont", action: "mentioned you in", target: "Deal Review", time: "15m", unread: true },
					{ initials: "LP", name: "Lisa Park", action: "assigned you to", target: "Acme Corp", time: "1h", unread: false },
					{ initials: "JL", name: "James Lee", action: "replied to", target: "Budget approval", time: "3h", unread: false },
				].map((n) => (
					<div key={n.target} className={`flex items-start gap-3 px-4 py-3 ${n.unread ? "bg-brand/5" : ""}`}>
						<div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-medium">
							{n.initials}
						</div>
						<div className="min-w-0 flex-1">
							<p className="text-sm">
								<span className="font-medium">{n.name}</span>{" "}
								<span className="text-fg-muted">{n.action}</span>{" "}
								<span className="font-medium">{n.target}</span>
							</p>
							<p className="text-xs text-fg-muted">{n.time} ago</p>
						</div>
						{n.unread && <div className="mt-2 size-2 shrink-0 rounded-full bg-brand" />}
					</div>
				))}
			</div>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// inline-edit
// ════════════════════════════════════════════════════════════════════════════

export function InlineEditPreview() {
	return (
		<div className="w-[480px] p-6">
			<div className="space-y-4">
				<div className="space-y-1">
					<p className="text-xs text-fg-muted">Company Name</p>
					<InlineEdit value="Acme Corporation" onSave={() => {}} />
				</div>
				<div className="space-y-1">
					<p className="text-xs text-fg-muted">Industry</p>
					<InlineEdit value="Technology" onSave={() => {}} />
				</div>
				<div className="space-y-1">
					<p className="text-xs text-fg-muted">Revenue</p>
					<InlineEdit value="$2.4M" onSave={() => {}} />
				</div>
			</div>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// kanban-board
// ════════════════════════════════════════════════════════════════════════════

const kanbanColumns = [
	{ id: "lead", label: "Lead", variant: "outline" as const },
	{ id: "qualified", label: "Qualified", variant: "info" as const },
	{ id: "proposal", label: "Proposal", variant: "warning" as const },
	{ id: "won", label: "Won", variant: "success" as const },
]

const kanbanItems = [
	{ id: "1", name: "Acme Corp", amount: "$24K", stage: "lead" },
	{ id: "2", name: "Globex Inc", amount: "$18K", stage: "lead" },
	{ id: "3", name: "Initech", amount: "$32K", stage: "qualified" },
	{ id: "4", name: "Hooli", amount: "$45K", stage: "proposal" },
	{ id: "5", name: "Umbrella", amount: "$12K", stage: "won" },
]

export function KanbanBoardPreview() {
	return (
		<div className="w-[700px] p-4">
			<div className="flex gap-3">
				{kanbanColumns.map((col) => {
					const colItems = kanbanItems.filter((i) => i.stage === col.id)
					return (
						<div key={col.id} className="flex w-full flex-col gap-2">
							<div className="flex items-center gap-2 px-1">
								<Badge variant={col.variant} size="xs">{col.label}</Badge>
								<span className="text-xs text-fg-muted">{colItems.length}</span>
							</div>
							<div className="space-y-2">
								{colItems.map((item) => (
									<div key={item.id} className="rounded-lg border bg-card p-3">
										<p className="text-sm font-medium">{item.name}</p>
										<p className="text-xs text-fg-muted">{item.amount}</p>
									</div>
								))}
							</div>
						</div>
					)
				})}
			</div>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// quick-log-activity
// ════════════════════════════════════════════════════════════════════════════

const activityTypes = [
	{ type: "call", label: "Appel", Icon: Phone, active: true },
	{ type: "email", label: "Email", Icon: Mail, active: false },
	{ type: "note", label: "Note", Icon: StickyNote, active: false },
	{ type: "meeting", label: "RDV", Icon: Calendar, active: false },
]

export function QuickLogActivityPreview() {
	return (
		<div className="w-[320px] p-4">
			<div className="space-y-3 rounded-lg border bg-card p-4 shadow-md">
				<p className="text-sm font-medium">Type d&apos;activité</p>
				<div className="grid grid-cols-4 gap-1.5">
					{activityTypes.map((at) => (
						<div
							key={at.type}
							className={`flex flex-col items-center gap-1 rounded-md border px-2 py-2 text-xs ${
								at.active ? "border-fg bg-fg text-card" : "border-edge"
							}`}
						>
							<at.Icon className="size-4" />
							{at.label}
						</div>
					))}
				</div>
				<div className="space-y-1.5">
					<p className="text-sm">Note</p>
					<div className="h-16 rounded-md border border-edge bg-card px-3 py-2 text-sm text-fg-muted">
						Résumé de l&apos;activité...
					</div>
				</div>
				<div className="flex h-8 items-center justify-center rounded-md bg-fg text-sm font-medium text-card">
					Enregistrer
				</div>
			</div>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// quote-preview
// ════════════════════════════════════════════════════════════════════════════

export function QuotePreviewPreview() {
	return (
		<div className="w-[640px] p-4">
			<QuotePreview
				reference="DEV-2026-042"
				date="2026-03-15"
				validUntil="2026-04-15"
				company={{ name: "Acme Corporation", address: "42 Tech Street", city: "San Francisco", country: "USA" }}
				contact={{ name: "Sarah Chen", email: "sarah@acme.com" }}
				lines={[
					{ product: "Enterprise Plan", description: "Annual license", quantity: 1, unitPrice: 24000 },
					{ product: "Premium Support", quantity: 12, unitPrice: 500 },
				]}
			/>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// segmented-progress
// ════════════════════════════════════════════════════════════════════════════

export function SegmentedProgressPreview() {
	return (
		<div className="w-[480px] space-y-6 p-6">
			<div className="space-y-2">
				<div className="flex items-center justify-between text-sm">
					<span>Budget consumed</span>
					<span className="font-medium tabular-nums">42%</span>
				</div>
				<SegmentedProgress percent={42} />
			</div>
			<div className="space-y-2">
				<div className="flex items-center justify-between text-sm">
					<span>Near limit</span>
					<span className="font-medium tabular-nums text-caution">82%</span>
				</div>
				<SegmentedProgress percent={82} autoColor />
			</div>
			<div className="space-y-2">
				<div className="flex items-center justify-between text-sm">
					<span>Over budget</span>
					<span className="font-medium tabular-nums text-negative">95%</span>
				</div>
				<SegmentedProgress percent={95} autoColor />
			</div>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// settings-block
// ════════════════════════════════════════════════════════════════════════════

export function SettingsBlockPreview() {
	return (
		<div className="w-[560px] p-4">
			<div className="space-y-6">
				<div>
					<h2 className="text-lg font-semibold">Settings</h2>
					<p className="text-sm text-fg-muted">Manage your account preferences</p>
				</div>
				<div className="space-y-1 rounded-lg border">
					{[
						{ icon: Bell, label: "Notifications", desc: "Configure how you receive alerts", control: "switch-on" },
						{ icon: Moon, label: "Dark mode", desc: "Toggle dark appearance", control: "switch-off" },
						{ icon: Globe, label: "Language", desc: "Choose your preferred language", control: "text" },
					].map((item, i) => (
						<div key={item.label} className={`flex items-center gap-3 px-4 py-3 ${i > 0 ? "border-t" : ""}`}>
							<div className="flex size-8 items-center justify-center rounded-md bg-muted">
								<item.icon className="size-4 text-fg-muted" />
							</div>
							<div className="flex-1">
								<p className="text-sm font-medium">{item.label}</p>
								<p className="text-xs text-fg-muted">{item.desc}</p>
							</div>
							{item.control === "switch-on" && <Switch checked />}
							{item.control === "switch-off" && <Switch />}
							{item.control === "text" && <span className="text-sm text-fg-muted">English</span>}
						</div>
					))}
				</div>
			</div>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// view-config-panel
// ════════════════════════════════════════════════════════════════════════════

export function ViewConfigPanelPreview() {
	return (
		<div className="flex w-[320px] justify-center p-4">
			<div className="flex w-[280px] flex-col rounded-lg bg-popover shadow-md ring-1 ring-edge/40">
				{/* Tabs */}
				<div className="mx-3 mt-3 mb-1 flex items-center gap-0.5 rounded-lg bg-muted p-1">
					{[
						{ Icon: List, label: "List", active: true },
						{ Icon: LayoutGrid, label: "Board", active: false },
						{ Icon: Columns3, label: "Table", active: false },
					].map((tab) => (
						<div
							key={tab.label}
							className={`flex flex-1 flex-col items-center gap-1 rounded-md px-3 py-1.5 text-xs font-medium ${
								tab.active ? "bg-card text-fg shadow-sm" : "text-fg-muted"
							}`}
						>
							<tab.Icon className="size-4" />
							{tab.label}
						</div>
					))}
				</div>
				{/* Sections */}
				<div className="space-y-3 p-3">
					<div className="space-y-2">
						<p className="text-xs font-medium text-fg-muted uppercase tracking-wide">Sort by</p>
						<div className="flex h-8 items-center rounded-md border border-edge px-3 text-sm">
							<Rows3 className="mr-2 size-3.5 text-fg-muted" />
							Created date
						</div>
					</div>
					<div className="space-y-2">
						<p className="text-xs font-medium text-fg-muted uppercase tracking-wide">Properties</p>
						{["Status", "Assignee", "Priority"].map((prop) => (
							<div key={prop} className="flex items-center justify-between">
								<span className="text-sm">{prop}</span>
								<Switch checked />
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	)
}
