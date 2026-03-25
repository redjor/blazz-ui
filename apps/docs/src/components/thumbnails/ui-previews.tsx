"use client"

import { Alert, AlertDescription, AlertTitle } from "@blazz/ui/components/ui/alert"
import { Avatar, AvatarFallback, AvatarGroup } from "@blazz/ui/components/ui/avatar"
import { Badge } from "@blazz/ui/components/ui/badge"
import { Banner } from "@blazz/ui/components/ui/banner"
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@blazz/ui/components/ui/breadcrumb"
// ── UI primitives ──────────────────────────────────────────────────────────
import { Button } from "@blazz/ui/components/ui/button"
import { ButtonGroup } from "@blazz/ui/components/ui/button-group"
import { Calendar } from "@blazz/ui/components/ui/calendar"
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@blazz/ui/components/ui/card"
import { Checkbox } from "@blazz/ui/components/ui/checkbox"
import { Empty } from "@blazz/ui/components/ui/empty"
import {
	Frame,
	FrameDescription,
	FrameHeader,
	FramePanel,
	FrameTitle,
} from "@blazz/ui/components/ui/frame-panel"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import { NavMenu, NavMenuGroup, NavMenuItem } from "@blazz/ui/components/ui/nav-menu"
import { Property } from "@blazz/ui/components/ui/property"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { Switch } from "@blazz/ui/components/ui/switch"
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@blazz/ui/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@blazz/ui/components/ui/tabs"
import { Text } from "@blazz/ui/components/ui/text"
import { Textarea } from "@blazz/ui/components/ui/textarea"
import {
	AlertTriangle,
	BarChart3,
	Bell,
	Building2,
	CalendarIcon,
	CheckCircle2,
	ChevronRight,
	ChevronsUpDown,
	Copy,
	DollarSign,
	Download,
	Edit,
	FileText,
	FolderOpen,
	Home,
	Inbox,
	Info,
	LayoutDashboard,
	Mail,
	MoreHorizontal,
	Search,
	Settings,
	Share2,
	Star,
	Trash2,
	Users,
} from "lucide-react"
import { useState } from "react"

// ════════════════════════════════════════════════════════════════════════════
// 1. SIMPLE FORM / INPUT COMPONENTS
// ════════════════════════════════════════════════════════════════════════════

export function ButtonPreview() {
	return (
		<div className="flex flex-col gap-4 p-8">
			<div className="flex flex-wrap items-center gap-3">
				<Button variant="default">Primary</Button>
				<Button variant="outline">Outline</Button>
				<Button variant="secondary">Secondary</Button>
				<Button variant="ghost">Ghost</Button>
				<Button variant="destructive">Destructive</Button>
				<Button variant="link">Link</Button>
			</div>
			<div className="flex flex-wrap items-center gap-3">
				<Button size="xs">Extra small</Button>
				<Button size="sm">Small</Button>
				<Button size="default">Default</Button>
				<Button size="lg">Large</Button>
			</div>
			<div className="flex items-center gap-3">
				<Button>
					<Mail data-icon="inline-start" />
					Send email
				</Button>
				<Button variant="outline">
					Download
					<Download data-icon="inline-end" />
				</Button>
				<Button variant="destructive" size="sm">
					<Trash2 data-icon="inline-start" />
					Delete
				</Button>
			</div>
		</div>
	)
}

export function InputPreview() {
	return (
		<div className="flex flex-col gap-4 p-8 w-[400px]">
			<div className="space-y-1.5">
				<Label>Full name</Label>
				<Input placeholder="Enter your name..." />
			</div>
			<div className="space-y-1.5">
				<Label>Email</Label>
				<Input type="email" placeholder="you@example.com" />
			</div>
			<div className="space-y-1.5">
				<Label>Disabled</Label>
				<Input disabled placeholder="Cannot edit" />
			</div>
		</div>
	)
}

export function TextareaPreview() {
	return (
		<div className="flex flex-col gap-4 p-8 w-[420px]">
			<div className="space-y-1.5">
				<Label>Description</Label>
				<Textarea placeholder="Write a brief description of the project..." rows={4} />
			</div>
			<div className="space-y-1.5">
				<Label>Notes</Label>
				<Textarea placeholder="Additional notes..." rows={2} />
			</div>
		</div>
	)
}

export function CheckboxPreview() {
	const [a, setA] = useState(true)
	const [b, setB] = useState(false)
	const [c, setC] = useState(true)

	return (
		<div className="flex flex-col gap-4 p-8">
			<div className="flex items-center gap-2">
				<Checkbox checked={a} onCheckedChange={setA} id="cb-1" />
				<Label htmlFor="cb-1">Email notifications</Label>
			</div>
			<div className="flex items-center gap-2">
				<Checkbox checked={b} onCheckedChange={setB} id="cb-2" />
				<Label htmlFor="cb-2">SMS notifications</Label>
			</div>
			<div className="flex items-center gap-2">
				<Checkbox checked={c} onCheckedChange={setC} id="cb-3" />
				<Label htmlFor="cb-3">Push notifications</Label>
			</div>
			<div className="flex items-center gap-2 opacity-50">
				<Checkbox disabled checked id="cb-4" />
				<Label htmlFor="cb-4">Required (disabled)</Label>
			</div>
		</div>
	)
}

export function SwitchPreview() {
	const [a, setA] = useState(true)
	const [b, setB] = useState(false)
	const [c, setC] = useState(true)

	return (
		<div className="flex flex-col gap-5 p-8">
			<div className="flex items-center justify-between w-64">
				<Label>Dark mode</Label>
				<Switch checked={a} onCheckedChange={setA} />
			</div>
			<div className="flex items-center justify-between w-64">
				<Label>Notifications</Label>
				<Switch checked={b} onCheckedChange={setB} />
			</div>
			<div className="flex items-center justify-between w-64">
				<Label>Auto-save</Label>
				<Switch checked={c} onCheckedChange={setC} size="sm" />
			</div>
		</div>
	)
}

export function SelectPreview() {
	return (
		<div className="flex flex-col gap-4 p-8 w-[360px]">
			<div className="space-y-1.5">
				<Label>Status</Label>
				<Select
					defaultValue="active"
					items={[
						{ value: "active", label: "Active" },
						{ value: "inactive", label: "Inactive" },
						{ value: "pending", label: "Pending" },
						{ value: "archived", label: "Archived" },
					]}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="active">Active</SelectItem>
						<SelectItem value="inactive">Inactive</SelectItem>
						<SelectItem value="pending">Pending</SelectItem>
						<SelectItem value="archived">Archived</SelectItem>
					</SelectContent>
				</Select>
			</div>
			<div className="space-y-1.5">
				<Label>Priority</Label>
				<Select
					defaultValue="medium"
					items={[
						{ value: "urgent", label: "Urgent" },
						{ value: "high", label: "High" },
						{ value: "medium", label: "Medium" },
						{ value: "low", label: "Low" },
					]}
				>
					<SelectTrigger className="w-full">
						<SelectValue placeholder="Select priority" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="urgent">Urgent</SelectItem>
						<SelectItem value="high">High</SelectItem>
						<SelectItem value="medium">Medium</SelectItem>
						<SelectItem value="low">Low</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	)
}

export function PhoneInputPreview() {
	return (
		<div className="flex flex-col gap-4 p-8 w-[380px]">
			<div className="space-y-1.5">
				<Label>Phone number</Label>
				<div className="flex items-center gap-2 rounded-lg border border-edge px-3 py-2 text-sm">
					<span className="flex items-center gap-1.5 text-fg-muted">
						<span className="text-base">🇫🇷</span>
						<span className="text-xs">+33</span>
					</span>
					<span className="text-fg">6 12 34 56 78</span>
				</div>
			</div>
			<Text variant="body-sm" tone="muted">
				International phone input with country selection
			</Text>
		</div>
	)
}

export function CalendarPreview() {
	return (
		<div className="p-4">
			<Calendar />
		</div>
	)
}

export function DateSelectorPreview() {
	return (
		<div className="flex flex-col gap-4 p-8 w-[360px]">
			<div className="space-y-1.5">
				<Label>Start date</Label>
				<button
					type="button"
					className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-edge bg-transparent px-2.5 text-sm"
				>
					<CalendarIcon className="size-4 text-fg-muted" />
					<span>February 23, 2026</span>
				</button>
			</div>
			<div className="space-y-1.5">
				<Label>Date range</Label>
				<button
					type="button"
					className="inline-flex h-8 items-center gap-0 rounded-lg border border-edge bg-transparent px-2.5 text-sm"
				>
					<CalendarIcon className="mr-1.5 size-4 text-fg-muted" />
					<span>Feb 01, 2026</span>
					<span className="mx-1.5 text-fg-muted">&ndash;</span>
					<span>Feb 28, 2026</span>
				</button>
			</div>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// 2. DISPLAY COMPONENTS
// ════════════════════════════════════════════════════════════════════════════

export function AlertPreview() {
	return (
		<div className="flex flex-col gap-4 p-8 w-[480px]">
			<Alert>
				<Info className="size-4" />
				<AlertTitle>Information</AlertTitle>
				<AlertDescription>
					Your account has been successfully created. Check your email to verify.
				</AlertDescription>
			</Alert>
			<Alert variant="destructive">
				<AlertTriangle className="size-4" />
				<AlertTitle>Error</AlertTitle>
				<AlertDescription>
					There was a problem processing your request. Please try again.
				</AlertDescription>
			</Alert>
		</div>
	)
}

export function AvatarPreview() {
	return (
		<div className="flex flex-col gap-6 p-8">
			<div className="flex items-center gap-3">
				<Avatar size="sm">
					<AvatarFallback>JD</AvatarFallback>
				</Avatar>
				<Avatar>
					<AvatarFallback>AR</AvatarFallback>
				</Avatar>
				<Avatar size="lg">
					<AvatarFallback>MS</AvatarFallback>
				</Avatar>
			</div>
			<AvatarGroup>
				<Avatar>
					<AvatarFallback>JD</AvatarFallback>
				</Avatar>
				<Avatar>
					<AvatarFallback>AR</AvatarFallback>
				</Avatar>
				<Avatar>
					<AvatarFallback>MS</AvatarFallback>
				</Avatar>
				<Avatar>
					<AvatarFallback>LP</AvatarFallback>
				</Avatar>
			</AvatarGroup>
		</div>
	)
}

export function BadgePreview() {
	return (
		<div className="flex flex-col gap-4 p-8">
			<div className="flex flex-wrap items-center gap-2">
				<Badge variant="default">Default</Badge>
				<Badge variant="info">Info</Badge>
				<Badge variant="success">Success</Badge>
				<Badge variant="warning">Warning</Badge>
				<Badge variant="critical">Critical</Badge>
				<Badge variant="outline">Outline</Badge>
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<Badge variant="default" fill="subtle">
					Default
				</Badge>
				<Badge variant="info" fill="subtle">
					Info
				</Badge>
				<Badge variant="success" fill="subtle">
					Success
				</Badge>
				<Badge variant="warning" fill="subtle">
					Warning
				</Badge>
				<Badge variant="critical" fill="subtle">
					Critical
				</Badge>
			</div>
			<div className="flex flex-wrap items-center gap-2">
				<Badge variant="success" dot>
					Active
				</Badge>
				<Badge variant="warning" dot>
					Pending
				</Badge>
				<Badge variant="critical" dot>
					Overdue
				</Badge>
				<Badge size="xs">XS</Badge>
				<Badge size="sm">SM</Badge>
				<Badge size="md">MD</Badge>
			</div>
		</div>
	)
}

export function BannerPreview() {
	return (
		<div className="flex flex-col gap-3 p-8 w-[520px]">
			<Banner title="New feature available" tone="info">
				We have launched a new dashboard experience for your workspace.
			</Banner>
			<Banner title="Payment received" tone="success" />
			<Banner title="Usage limit approaching" tone="warning">
				You have used 85% of your monthly API quota.
			</Banner>
			<Banner title="Service degradation" tone="critical">
				Some features may be temporarily unavailable.
			</Banner>
		</div>
	)
}

export function BreadcrumbPreview() {
	return (
		<div className="flex flex-col gap-6 p-8">
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="#">
							<Home className="size-3.5" />
						</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="#">Companies</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="#">Acme Corp</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Contacts</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
			<Breadcrumb>
				<BreadcrumbList>
					<BreadcrumbItem>
						<BreadcrumbLink href="#">Dashboard</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbLink href="#">Settings</BreadcrumbLink>
					</BreadcrumbItem>
					<BreadcrumbSeparator />
					<BreadcrumbItem>
						<BreadcrumbPage>Notifications</BreadcrumbPage>
					</BreadcrumbItem>
				</BreadcrumbList>
			</Breadcrumb>
		</div>
	)
}

export function SkeletonPreview() {
	return (
		<div className="flex flex-col gap-6 p-8 w-[400px]">
			{/* Card skeleton */}
			<div className="rounded-lg border border-edge p-4 space-y-4">
				<div className="flex items-center gap-3">
					<Skeleton className="size-10 rounded-full" />
					<div className="flex-1 space-y-2">
						<Skeleton className="h-4 w-3/4" />
						<Skeleton className="h-3 w-1/2" />
					</div>
				</div>
				<Skeleton className="h-24 w-full" />
				<div className="space-y-2">
					<Skeleton className="h-3 w-full" />
					<Skeleton className="h-3 w-5/6" />
					<Skeleton className="h-3 w-4/6" />
				</div>
			</div>
			{/* Table row skeleton */}
			<div className="space-y-3">
				{[1, 2, 3].map((i) => (
					<div key={i} className="flex items-center gap-3">
						<Skeleton className="size-8 rounded-full" />
						<Skeleton className="h-4 flex-1" />
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-4 w-16" />
					</div>
				))}
			</div>
		</div>
	)
}

export function TextPreview() {
	return (
		<div className="flex flex-col gap-3 p-8 w-[480px]">
			<Text variant="heading-3xl">Heading 3XL</Text>
			<Text variant="heading-xl">Heading XL</Text>
			<Text variant="heading-lg">Heading LG</Text>
			<Text variant="heading-md">Heading MD</Text>
			<Text variant="heading-sm">Heading SM</Text>
			<Text variant="body-lg">Body large text for primary content.</Text>
			<Text variant="body-md">Body medium for default interface text.</Text>
			<Text variant="body-sm" tone="muted">
				Body small with muted tone.
			</Text>
			<Text variant="body-xs" tone="subtle">
				Body XS with subtle tone.
			</Text>
		</div>
	)
}

export function EmptyPreview() {
	return (
		<div className="p-8 w-[480px]">
			<Empty
				icon={FolderOpen}
				title="No items found"
				description="Get started by creating a new item, or adjust your filters to find what you are looking for."
				action={{ label: "Create item", icon: FileText }}
				secondaryAction={{ label: "Learn more" }}
			/>
		</div>
	)
}

export function PropertyPreview() {
	return (
		<div className="grid grid-cols-3 gap-x-6 gap-y-4 p-8">
			<Property label="Status">Active</Property>
			<Property label="Company">Acme Corp</Property>
			<Property label="Revenue">$124,500</Property>
			<Property label="Owner">Sarah Johnson</Property>
			<Property label="Stage">Negotiation</Property>
			<Property label="Created">Feb 14, 2026</Property>
		</div>
	)
}

export function CellsPreview() {
	return (
		<div className="flex flex-col gap-4 p-8 w-[480px]">
			<Text variant="heading-sm">Data Table Cells</Text>
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-1">
					<Text variant="body-xs" tone="muted">
						CellUser
					</Text>
					<div className="flex items-center gap-2">
						<Avatar size="sm">
							<AvatarFallback>JD</AvatarFallback>
						</Avatar>
						<div>
							<Text variant="body-sm">John Doe</Text>
							<Text variant="body-xs" tone="muted">
								Engineering
							</Text>
						</div>
					</div>
				</div>
				<div className="space-y-1">
					<Text variant="body-xs" tone="muted">
						CellTags
					</Text>
					<div className="flex gap-1">
						<Badge size="xs" variant="info">
							React
						</Badge>
						<Badge size="xs" variant="success">
							TypeScript
						</Badge>
						<Badge size="xs" variant="outline">
							+2
						</Badge>
					</div>
				</div>
				<div className="space-y-1">
					<Text variant="body-xs" tone="muted">
						CellProgress
					</Text>
					<div className="flex items-center gap-2">
						<div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
							<div className="h-full w-3/4 rounded-full bg-brand" />
						</div>
						<Text variant="body-xs" tone="muted">
							75%
						</Text>
					</div>
				</div>
				<div className="space-y-1">
					<Text variant="body-xs" tone="muted">
						CellRating
					</Text>
					<div className="flex gap-0.5">
						{[1, 2, 3, 4, 5].map((i) => (
							<Star
								key={i}
								className={`size-3.5 ${i <= 4 ? "fill-caution text-caution" : "text-fg-subtle"}`}
							/>
						))}
					</div>
				</div>
				<div className="space-y-1">
					<Text variant="body-xs" tone="muted">
						CellBoolean
					</Text>
					<div className="flex items-center gap-1">
						<CheckCircle2 className="size-3.5 text-positive" />
						<Text variant="body-sm">Verified</Text>
					</div>
				</div>
				<div className="space-y-1">
					<Text variant="body-xs" tone="muted">
						CellColorDot
					</Text>
					<div className="flex items-center gap-1.5">
						<span className="size-2 rounded-full bg-positive" />
						<Text variant="body-sm">Won</Text>
					</div>
				</div>
			</div>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// 3. LAYOUT / NAVIGATION
// ════════════════════════════════════════════════════════════════════════════

export function TabsPreview() {
	return (
		<div className="flex flex-col gap-6 p-8 w-[480px]">
			<Tabs defaultValue="overview">
				<TabsList>
					<TabsTrigger value="overview">Overview</TabsTrigger>
					<TabsTrigger value="analytics">Analytics</TabsTrigger>
					<TabsTrigger value="reports">Reports</TabsTrigger>
					<TabsTrigger value="settings">Settings</TabsTrigger>
				</TabsList>
				<TabsContent value="overview">
					<div className="rounded-lg border border-edge p-4">
						<Text variant="body-md" tone="muted">
							Overview tab content goes here.
						</Text>
					</div>
				</TabsContent>
			</Tabs>
			<Tabs defaultValue="general">
				<TabsList variant="line">
					<TabsTrigger value="general">General</TabsTrigger>
					<TabsTrigger value="security">Security</TabsTrigger>
					<TabsTrigger value="billing">Billing</TabsTrigger>
				</TabsList>
				<TabsContent value="general">
					<div className="rounded-lg border border-edge p-4">
						<Text variant="body-md" tone="muted">
							Line variant tab content.
						</Text>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	)
}

export function ButtonGroupPreview() {
	return (
		<div className="flex flex-col gap-5 p-8">
			<ButtonGroup>
				<Button variant="outline">Left</Button>
				<Button variant="outline">Center</Button>
				<Button variant="outline">Right</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="outline" size="sm">
					<Copy className="size-3.5" />
					Copy
				</Button>
				<Button variant="outline" size="sm">
					<Share2 className="size-3.5" />
					Share
				</Button>
				<Button variant="outline" size="sm">
					<Download className="size-3.5" />
					Export
				</Button>
			</ButtonGroup>
			<ButtonGroup>
				<Button variant="default">Save</Button>
				<Button variant="outline">Cancel</Button>
			</ButtonGroup>
		</div>
	)
}

export function NavMenuPreview() {
	return (
		<div className="p-6 w-[240px]">
			<NavMenu>
				<NavMenuGroup label="Main">
					<NavMenuItem active href="#">
						<LayoutDashboard />
						<span>Dashboard</span>
					</NavMenuItem>
					<NavMenuItem href="#">
						<Inbox />
						<span>Inbox</span>
					</NavMenuItem>
					<NavMenuItem href="#">
						<Users />
						<span>Contacts</span>
					</NavMenuItem>
					<NavMenuItem href="#">
						<Building2 />
						<span>Companies</span>
					</NavMenuItem>
				</NavMenuGroup>
				<NavMenuGroup label="Analytics">
					<NavMenuItem href="#">
						<BarChart3 />
						<span>Reports</span>
					</NavMenuItem>
					<NavMenuItem href="#">
						<DollarSign />
						<span>Revenue</span>
					</NavMenuItem>
				</NavMenuGroup>
			</NavMenu>
		</div>
	)
}

export function FramePanelPreview() {
	return (
		<div className="p-8 w-[480px]">
			<Frame>
				<FramePanel>
					<FrameHeader>
						<FrameTitle>Deal Details</FrameTitle>
						<FrameDescription>Acme Corp — Enterprise Plan</FrameDescription>
					</FrameHeader>
					<div className="grid grid-cols-2 gap-4 p-4">
						<Property label="Value">$85,000</Property>
						<Property label="Stage">Proposal</Property>
						<Property label="Close date">Mar 15, 2026</Property>
						<Property label="Probability">65%</Property>
					</div>
				</FramePanel>
				<FramePanel>
					<FrameHeader>
						<FrameTitle>Activity</FrameTitle>
					</FrameHeader>
					<div className="p-4">
						<Text variant="body-sm" tone="muted">
							No recent activity.
						</Text>
					</div>
				</FramePanel>
			</Frame>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// 4. TABLE
// ════════════════════════════════════════════════════════════════════════════

export function TablePreview() {
	const data = [
		{ name: "Acme Corp", contact: "Sarah Johnson", revenue: "$124,500", status: "Active" },
		{ name: "Globex Inc", contact: "James Chen", revenue: "$89,200", status: "Active" },
		{ name: "Initech", contact: "Michael Scott", revenue: "$45,800", status: "Pending" },
		{ name: "Umbrella Co", contact: "Alice Wesker", revenue: "$210,000", status: "Active" },
	]

	return (
		<div className="p-6 w-[560px]">
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Company</TableHead>
						<TableHead>Contact</TableHead>
						<TableHead className="text-right">Revenue</TableHead>
						<TableHead>Status</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{data.map((row) => (
						<TableRow key={row.name}>
							<TableCell className="font-medium">{row.name}</TableCell>
							<TableCell>{row.contact}</TableCell>
							<TableCell className="text-right tabular-nums">{row.revenue}</TableCell>
							<TableCell>
								<Badge
									variant={row.status === "Active" ? "success" : "warning"}
									size="xs"
									fill="subtle"
								>
									{row.status}
								</Badge>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// 5. OVERLAY COMPONENTS (static representations)
// ════════════════════════════════════════════════════════════════════════════

export function DialogPreview() {
	return (
		<div className="p-8 w-[480px]">
			<div className="rounded-xl border border-edge bg-popover p-4 shadow-lg ring-1 ring-edge/40">
				<div className="-mx-4 -mt-4 flex flex-col gap-2 border-b border-edge px-4 pb-3 pt-4">
					<div className="text-sm font-medium text-fg">Create new contact</div>
					<div className="text-sm text-fg-muted">Add a new contact to your CRM database.</div>
				</div>
				<div className="mt-4 space-y-3">
					<div className="space-y-1.5">
						<Label>Name</Label>
						<Input placeholder="Full name" />
					</div>
					<div className="space-y-1.5">
						<Label>Email</Label>
						<Input placeholder="email@example.com" />
					</div>
				</div>
				<div className="-mx-4 -mb-4 mt-4 flex justify-end gap-2 rounded-b-xl border-t border-edge bg-muted p-4">
					<Button variant="outline">Cancel</Button>
					<Button>Create contact</Button>
				</div>
			</div>
		</div>
	)
}

export function SheetPreview() {
	return (
		<div className="p-8 w-[400px]">
			<div className="flex h-[320px] flex-col rounded-xl border border-edge bg-popover shadow-lg overflow-hidden">
				<div className="flex flex-col gap-1.5 border-b border-edge px-4 pb-3 pt-4">
					<div className="text-sm font-medium text-fg">Edit company</div>
					<div className="text-sm text-fg-muted">Update the company information.</div>
				</div>
				<div className="flex-1 space-y-3 overflow-auto p-4">
					<div className="space-y-1.5">
						<Label>Company name</Label>
						<Input defaultValue="Acme Corporation" />
					</div>
					<div className="space-y-1.5">
						<Label>Industry</Label>
						<Input defaultValue="Technology" />
					</div>
					<div className="space-y-1.5">
						<Label>Website</Label>
						<Input defaultValue="https://acme.com" />
					</div>
				</div>
				<div className="flex justify-end gap-2 border-t border-edge bg-muted px-4 py-3">
					<Button variant="outline" size="sm">
						Cancel
					</Button>
					<Button size="sm">Save changes</Button>
				</div>
			</div>
		</div>
	)
}

export function DropdownMenuPreview() {
	return (
		<div className="p-8 w-[280px]">
			<div className="rounded-lg border bg-popover p-1 shadow-md ring-1 ring-fg/10">
				<div className="px-1.5 py-1 text-xs font-medium text-fg-muted">Actions</div>
				<div className="flex cursor-default items-center gap-1.5 rounded-md bg-muted px-1.5 py-1 text-sm text-fg">
					<Edit className="size-4" />
					Edit
					<span className="ml-auto text-xs text-fg-muted">Ctrl+E</span>
				</div>
				<div className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm">
					<Copy className="size-4" />
					Duplicate
					<span className="ml-auto text-xs text-fg-muted">Ctrl+D</span>
				</div>
				<div className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm">
					<Share2 className="size-4" />
					Share
				</div>
				<div className="-mx-1 my-1 h-px bg-edge" />
				<div className="flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm text-negative">
					<Trash2 className="size-4" />
					Delete
					<span className="ml-auto text-xs text-fg-muted">Del</span>
				</div>
			</div>
		</div>
	)
}

export function PopoverPreview() {
	return (
		<div className="p-8 w-[340px]">
			<div className="rounded-lg border bg-popover p-2.5 shadow-md ring-1 ring-edge/40">
				<div className="flex flex-col gap-0.5 text-sm">
					<div className="font-medium">Dimensions</div>
					<div className="text-fg-muted">Set the dimensions for the layer.</div>
				</div>
				<div className="mt-2.5 grid gap-2">
					<div className="grid grid-cols-3 items-center gap-2">
						<Label className="text-xs">Width</Label>
						<Input defaultValue="100%" className="col-span-2 h-7 text-xs" />
					</div>
					<div className="grid grid-cols-3 items-center gap-2">
						<Label className="text-xs">Height</Label>
						<Input defaultValue="25px" className="col-span-2 h-7 text-xs" />
					</div>
					<div className="grid grid-cols-3 items-center gap-2">
						<Label className="text-xs">Max width</Label>
						<Input defaultValue="300px" className="col-span-2 h-7 text-xs" />
					</div>
				</div>
			</div>
		</div>
	)
}

export function TooltipPreview() {
	return (
		<div className="flex flex-col items-center gap-4 p-8">
			<div className="relative inline-flex flex-col items-center">
				<div className="mb-2 rounded-md bg-fg px-3 py-1.5 text-xs text-card">
					Click to save your changes
					<div className="absolute -bottom-1 left-1/2 size-2.5 -translate-x-1/2 rotate-45 rounded-[2px] bg-fg" />
				</div>
				<Button>Save changes</Button>
			</div>
			<div className="relative inline-flex flex-col items-center">
				<div className="mb-2 rounded-md bg-fg px-3 py-1.5 text-xs text-card">
					Share with your team
					<div className="absolute -bottom-1 left-1/2 size-2.5 -translate-x-1/2 rotate-45 rounded-[2px] bg-fg" />
				</div>
				<Button variant="outline">
					<Share2 data-icon="inline-start" />
					Share
				</Button>
			</div>
		</div>
	)
}

export function MenubarPreview() {
	return (
		<div className="p-8 w-[520px]">
			<div className="flex items-center gap-0.5 rounded-lg border border-edge bg-popover p-[3px]">
				<div className="rounded-sm bg-muted px-1.5 py-[2px] text-sm font-medium">File</div>
				<div className="rounded-sm px-1.5 py-[2px] text-sm font-medium">Edit</div>
				<div className="rounded-sm px-1.5 py-[2px] text-sm font-medium">View</div>
				<div className="rounded-sm px-1.5 py-[2px] text-sm font-medium">Help</div>
			</div>
			{/* Open dropdown representation */}
			<div className="ml-0.5 mt-1 w-52 rounded-lg border bg-popover p-1 shadow-md ring-1 ring-fg/10">
				<div className="flex items-center gap-1.5 rounded-md bg-muted px-1.5 py-1 text-sm">
					New File
					<span className="ml-auto text-xs text-fg-muted">Ctrl+N</span>
				</div>
				<div className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm">
					Open...
					<span className="ml-auto text-xs text-fg-muted">Ctrl+O</span>
				</div>
				<div className="-mx-1 my-1 h-px bg-edge" />
				<div className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm">
					Save
					<span className="ml-auto text-xs text-fg-muted">Ctrl+S</span>
				</div>
				<div className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm">
					Save As...
					<span className="ml-auto text-xs text-fg-muted">Ctrl+Shift+S</span>
				</div>
				<div className="-mx-1 my-1 h-px bg-edge" />
				<div className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm">
					Export
					<ChevronRight className="ml-auto size-3.5 text-fg-muted" />
				</div>
			</div>
		</div>
	)
}

export function MenuPreview() {
	return (
		<div className="p-8 w-[240px]">
			<div className="rounded-md border bg-popover p-1 shadow-md">
				<div className="flex cursor-default items-center rounded-sm bg-muted px-2 py-1.5 text-sm text-fg">
					<Edit className="mr-2 size-4" />
					Edit
				</div>
				<div className="flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm">
					<Copy className="mr-2 size-4" />
					Duplicate
				</div>
				<div className="flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm">
					<Download className="mr-2 size-4" />
					Export
				</div>
				<div className="-mx-1 my-1 h-px bg-edge" />
				<div className="flex cursor-default items-center rounded-sm px-2 py-1.5 text-sm">
					<Settings className="mr-2 size-4" />
					Settings
				</div>
			</div>
		</div>
	)
}

export function CommandPreview() {
	return (
		<div className="p-8 w-[480px]">
			<div className="rounded-lg border bg-popover shadow-lg overflow-hidden">
				<div className="flex items-center border-b px-3">
					<Search className="mr-2 size-4 shrink-0 text-fg-muted" />
					<div className="flex h-11 w-full items-center text-sm text-fg-muted">
						Type a command or search...
					</div>
				</div>
				<div className="p-1">
					<div className="px-2 py-1.5 text-xs font-semibold text-fg-muted">Suggestions</div>
					<div className="flex items-center gap-2 rounded-sm bg-muted px-2 py-1.5 text-sm text-fg">
						<FileText className="size-4 text-fg-muted" />
						Create new deal
						<span className="ml-auto text-xs text-fg-muted">Ctrl+N</span>
					</div>
					<div className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm">
						<Users className="size-4 text-fg-muted" />
						Search contacts
						<span className="ml-auto text-xs text-fg-muted">Ctrl+K</span>
					</div>
					<div className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm">
						<BarChart3 className="size-4 text-fg-muted" />
						View reports
					</div>
					<div className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm">
						<Settings className="size-4 text-fg-muted" />
						Open settings
					</div>
				</div>
			</div>
		</div>
	)
}

export function ConfirmationDialogPreview() {
	return (
		<div className="p-8 w-[420px]">
			<div className="rounded-xl border border-edge bg-popover p-4 shadow-lg ring-1 ring-edge/40">
				<div className="-mx-4 -mt-4 flex flex-col gap-2 px-4 pb-3 pt-4">
					<div className="text-sm font-medium text-fg">Delete this deal?</div>
					<div className="text-sm text-fg-muted">
						This action cannot be undone. The deal and all associated data will be permanently
						removed from your workspace.
					</div>
				</div>
				<div className="-mx-4 -mb-4 mt-4 flex justify-end gap-2 rounded-b-xl border-t border-edge bg-muted p-4">
					<Button variant="outline">Cancel</Button>
					<Button variant="destructive">Delete deal</Button>
				</div>
			</div>
		</div>
	)
}

// ════════════════════════════════════════════════════════════════════════════
// 6. COMPLEX COMPONENTS
// ════════════════════════════════════════════════════════════════════════════

export function DataTablePreview() {
	const deals = [
		{
			name: "Enterprise Plan",
			company: "Acme Corp",
			value: "$85,000",
			stage: "Proposal",
			owner: "SJ",
		},
		{
			name: "Pro License x50",
			company: "Globex Inc",
			value: "$42,000",
			stage: "Negotiation",
			owner: "JC",
		},
		{
			name: "Annual Renewal",
			company: "Initech",
			value: "$28,500",
			stage: "Closed Won",
			owner: "MS",
		},
		{
			name: "Custom Integration",
			company: "Umbrella Co",
			value: "$120,000",
			stage: "Discovery",
			owner: "AW",
		},
		{ name: "Startup Bundle", company: "Hooli", value: "$15,000", stage: "Proposal", owner: "RG" },
	]

	const stageBadge = (stage: string) => {
		const map: Record<string, "success" | "warning" | "info" | "default"> = {
			"Closed Won": "success",
			Negotiation: "warning",
			Discovery: "info",
			Proposal: "default",
		}
		return map[stage] ?? "default"
	}

	return (
		<div className="p-4 w-[640px]">
			<div className="rounded-lg border border-edge overflow-hidden">
				{/* Toolbar */}
				<div className="flex items-center justify-between border-b border-edge bg-card px-3 py-2">
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-1 rounded-md border border-edge bg-transparent px-2 py-1 text-xs">
							<Search className="size-3 text-fg-muted" />
							<span className="text-fg-muted">Filter deals...</span>
						</div>
						<Badge variant="secondary" size="xs">
							{deals.length} deals
						</Badge>
					</div>
					<div className="flex items-center gap-1">
						<Button variant="ghost" size="icon-xs">
							<Settings className="size-3.5" />
						</Button>
					</div>
				</div>
				{/* Table */}
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead className="w-8">
								<Checkbox />
							</TableHead>
							<TableHead>Deal</TableHead>
							<TableHead>Company</TableHead>
							<TableHead className="text-right">Value</TableHead>
							<TableHead>Stage</TableHead>
							<TableHead className="w-10" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{deals.map((deal) => (
							<TableRow key={deal.name}>
								<TableCell>
									<Checkbox />
								</TableCell>
								<TableCell className="font-medium">{deal.name}</TableCell>
								<TableCell>
									<div className="flex items-center gap-1.5">
										<Avatar size="sm">
											<AvatarFallback>{deal.owner}</AvatarFallback>
										</Avatar>
										{deal.company}
									</div>
								</TableCell>
								<TableCell className="text-right tabular-nums">{deal.value}</TableCell>
								<TableCell>
									<Badge variant={stageBadge(deal.stage)} size="xs" fill="subtle">
										{deal.stage}
									</Badge>
								</TableCell>
								<TableCell>
									<Button variant="ghost" size="icon-xs">
										<MoreHorizontal />
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
				{/* Pagination */}
				<div className="flex items-center justify-between border-t border-edge bg-card px-3 py-2">
					<Text variant="body-xs" tone="muted">
						Showing 1-5 of 24 deals
					</Text>
					<div className="flex items-center gap-1">
						<Button variant="outline" size="xs" disabled>
							Previous
						</Button>
						<Button variant="outline" size="xs">
							Next
						</Button>
					</div>
				</div>
			</div>
		</div>
	)
}

export function NotificationCenterPreview() {
	const notifications = [
		{
			icon: DollarSign,
			variant: "success" as const,
			title: "Deal closed",
			description: "Acme Corp - Enterprise Plan ($85,000)",
			time: "2 min ago",
			read: false,
		},
		{
			icon: Users,
			variant: "info" as const,
			title: "New contact added",
			description: "Sarah Johnson was added to Globex Inc.",
			time: "15 min ago",
			read: false,
		},
		{
			icon: AlertTriangle,
			variant: "warning" as const,
			title: "Deal stalled",
			description: "Initech renewal has not progressed in 14 days.",
			time: "1 hour ago",
			read: true,
		},
		{
			icon: Mail,
			variant: "info" as const,
			title: "Email received",
			description: "James Chen replied to your proposal.",
			time: "3 hours ago",
			read: true,
		},
	]

	const iconVariantClasses: Record<string, string> = {
		info: "bg-blue-500/15 text-blue-500",
		success: "bg-emerald-500/15 text-emerald-500",
		warning: "bg-amber-500/15 text-amber-400",
	}

	return (
		<div className="p-6 w-[400px]">
			<Card>
				<CardHeader>
					<CardTitle>
						<div className="flex items-center gap-2">
							<Bell className="size-4" />
							Notifications
							<Badge variant="default" size="xs">
								2
							</Badge>
						</div>
					</CardTitle>
				</CardHeader>
				<CardContent className="p-0">
					<div className="divide-y divide-edge">
						{notifications.map((n, i) => {
							const Icon = n.icon
							return (
								<div key={i} className={`flex gap-3 px-4 py-3 ${!n.read ? "bg-brand/5" : ""}`}>
									<div
										className={`mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ${iconVariantClasses[n.variant]}`}
									>
										<Icon className="size-3.5" />
									</div>
									<div className="min-w-0 flex-1">
										<div className="flex items-start justify-between gap-2">
											<Text variant="body-sm" className={!n.read ? "font-semibold" : ""}>
												{n.title}
											</Text>
											<Text variant="body-xs" tone="muted" className="shrink-0">
												{n.time}
											</Text>
										</div>
										<Text variant="body-xs" tone="muted">
											{n.description}
										</Text>
									</div>
									{!n.read && <span className="mt-2 size-2 shrink-0 rounded-full bg-brand" />}
								</div>
							)
						})}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export function OrgMenuPreview() {
	return (
		<div className="p-8 w-[280px]">
			{/* Trigger representation */}
			<div className="flex items-center gap-2 rounded-lg px-2 py-2 transition-colors hover:bg-muted">
				<Avatar className="size-8 rounded-lg after:rounded-lg">
					<AvatarFallback className="rounded-lg text-xs font-semibold">AC</AvatarFallback>
				</Avatar>
				<div className="flex min-w-0 flex-1 flex-col text-left">
					<span className="truncate text-[13px] font-semibold leading-tight text-fg">
						Acme Corp
					</span>
					<span className="truncate text-xs leading-tight text-fg-muted">Pro Plan</span>
				</div>
				<ChevronsUpDown className="size-3.5 shrink-0 text-fg-muted" />
			</div>
			{/* Dropdown representation */}
			<div className="mt-2 rounded-lg border bg-popover p-1 shadow-md ring-1 ring-fg/10">
				<div className="px-1.5 py-1 text-xs font-medium text-fg-muted">Organizations</div>
				<div className="flex items-center gap-2 rounded-md bg-muted px-1.5 py-1 text-sm">
					<Avatar className="size-5 rounded after:rounded">
						<AvatarFallback className="rounded text-[10px] font-semibold">AC</AvatarFallback>
					</Avatar>
					<span className="flex-1 truncate">Acme Corp</span>
					<CheckCircle2 className="size-3.5 text-brand" />
				</div>
				<div className="flex items-center gap-2 rounded-md px-1.5 py-1 text-sm">
					<Avatar className="size-5 rounded after:rounded">
						<AvatarFallback className="rounded text-[10px] font-semibold">GI</AvatarFallback>
					</Avatar>
					<span className="flex-1 truncate">Globex Inc</span>
				</div>
				<div className="-mx-1 my-1 h-px bg-edge" />
				<div className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-sm text-fg-muted">
					<Settings className="size-4" />
					Manage organizations
				</div>
			</div>
		</div>
	)
}

export function PropertyCardPreview() {
	return (
		<div className="p-8 w-[560px]">
			<Card>
				<CardHeader>
					<CardTitle>Deal information</CardTitle>
					<CardDescription>Key details about this opportunity</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-3 gap-x-6 gap-y-4">
						<Property label="Deal name">Enterprise Plan</Property>
						<Property label="Company">Acme Corporation</Property>
						<Property label="Owner">Sarah Johnson</Property>
						<Property label="Value">$85,000</Property>
						<Property label="Stage">Proposal Sent</Property>
						<Property label="Close date">Mar 15, 2026</Property>
						<Property label="Probability">65%</Property>
						<Property label="Source">Inbound Lead</Property>
						<Property label="Created">Jan 20, 2026</Property>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}

export function StatsStripPreview() {
	const stats = [
		{ label: "Total deals", value: "142" },
		{ label: "Pipeline value", value: "$1.24M" },
		{ label: "Won this month", value: "18" },
		{ label: "Win rate", value: "34%" },
		{ label: "Avg deal size", value: "$42K" },
	]

	return (
		<div className="p-6 w-[640px]">
			<Card>
				<CardContent className="p-0">
					<div className="flex divide-x divide-edge">
						{stats.map((stat) => (
							<div key={stat.label} className="flex flex-1 flex-col gap-1 px-4 py-3">
								<Text variant="body-xs" tone="muted">
									{stat.label}
								</Text>
								<Text variant="heading-lg" numeric>
									{stat.value}
								</Text>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
