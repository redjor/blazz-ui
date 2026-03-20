import { ActivityTimeline } from "@blazz/pro/components/blocks/activity-timeline"
import { ChartCard } from "@blazz/pro/components/blocks/chart-card"
import { DetailPanel } from "@blazz/pro/components/blocks/detail-panel"
import { FilterBar } from "@blazz/pro/components/blocks/filter-bar"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { SplitView } from "@blazz/pro/components/blocks/split-view"
import { StatsGrid } from "@blazz/pro/components/blocks/stats-grid"
import { StatusFlow } from "@blazz/pro/components/blocks/status-flow"
import { ErrorState } from "@blazz/ui/components/patterns/error-state"
import { Field, FieldGrid } from "@blazz/ui/components/patterns/field-grid"
import { FormSection } from "@blazz/ui/components/patterns/form-section"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import {
	Check,
	ChevronRight,
	DollarSign,
	Download,
	Edit,
	Mail,
	Plus,
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
			<div className="flex items-center gap-3 rounded-lg border bg-surface px-4 py-2.5 shadow-lg">
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
					className="inline-flex size-7 items-center justify-center rounded-md text-fg-muted hover:bg-surface-3"
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
				<select className="flex h-8 w-full rounded-md border border-edge bg-surface px-3 py-1 text-sm shadow-sm">
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
										? "border-fg bg-fg text-surface"
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
					className="inline-flex h-9 items-center rounded-md bg-fg px-4 text-sm font-medium text-surface"
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
								<div className="flex size-8 items-center justify-center rounded-full bg-surface-3 text-xs font-medium">
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
							<div className="flex size-10 items-center justify-center rounded-full bg-surface-3 text-sm font-semibold">
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
