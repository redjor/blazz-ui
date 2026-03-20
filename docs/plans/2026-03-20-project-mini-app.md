# Project Mini-App Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Transform the monolithic project detail page into a mini-app with sidebar navigation and 6 sub-pages, including a new project-scoped todos view.

**Architecture:** Next.js nested layout at `[pid]/layout.tsx` renders a compact sidebar nav + `{children}`. Each section is a sub-route. The existing `_client.tsx` (~878 lines) is split into 5 pages. A shared `<TodosDataTable>` component is extracted from the global todos page and reused in the project todos page.

**Tech Stack:** Next.js 16, React 19, Convex (backend + real-time queries), @blazz/ui layout primitives, @blazz/pro DataTable, Lucide icons.

**Design doc:** `docs/plans/2026-03-20-project-mini-app-design.md`

---

### Task 1: Add Convex index and query for project todos

**Files:**
- Modify: `apps/ops/convex/schema.ts:209-214` (add index)
- Modify: `apps/ops/convex/todos.ts:48-66` (add query after `list`)

**Step 1: Add `by_user_project` index on todos table**

In `convex/schema.ts`, add the index after line 214 (after `by_user_category`):

```ts
// In the todos defineTable chain, add:
.index("by_user_project", ["userId", "projectId"])
```

The full index list for todos becomes:
```ts
.index("by_status", ["status"])
.index("by_category", ["categoryId"])
.index("by_user", ["userId"])
.index("by_user_status", ["userId", "status"])
.index("by_user_category", ["userId", "categoryId"])
.index("by_user_project", ["userId", "projectId"]),
```

**Step 2: Add `listByProject` query in `convex/todos.ts`**

Add after the `list` query (after line 66):

```ts
export const listByProject = query({
	args: {
		projectId: v.id("projects"),
	},
	handler: async (ctx, { projectId }) => {
		const { userId } = await requireAuth(ctx)
		return ctx.db
			.query("todos")
			.withIndex("by_user_project", (q) =>
				q.eq("userId", userId).eq("projectId", projectId)
			)
			.order("desc")
			.collect()
	},
})
```

**Step 3: Verify Convex generates types**

Run: `cd apps/ops && npx convex dev --once` (or check the running dev server picks up the schema change)

**Step 4: Commit**

```bash
git add apps/ops/convex/schema.ts apps/ops/convex/todos.ts
git commit -m "feat(ops): add listByProject query for project-scoped todos"
```

---

### Task 2: Create the ProjectSidebar component

**Files:**
- Create: `apps/ops/components/project-sidebar.tsx`

**Step 1: Create the component**

```tsx
"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import {
	CheckSquare,
	Clock,
	FileStack,
	LayoutDashboard,
	Receipt,
	StickyNote,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

interface ProjectSidebarProps {
	basePath: string // e.g. "/clients/abc/projects/def"
}

const navItems = [
	{ label: "Vue d'ensemble", href: "", icon: LayoutDashboard },
	{ label: "Temps", href: "/time", icon: Clock },
	{ label: "Todos", href: "/todos", icon: CheckSquare },
	{ label: "Factures", href: "/invoices", icon: Receipt },
	{ label: "Notes", href: "/notes", icon: StickyNote },
	{ label: "Contrats", href: "/contracts", icon: FileStack },
]

export function ProjectSidebar({ basePath }: ProjectSidebarProps) {
	const pathname = usePathname()

	function isActive(href: string) {
		const full = basePath + href
		if (href === "") {
			// Overview: exact match only (not /time, /todos, etc.)
			return pathname === full || pathname === full + "/"
		}
		return pathname.startsWith(full)
	}

	return (
		<nav className="w-[200px] shrink-0 border-r border-edge py-2">
			<BlockStack gap="050">
				{navItems.map((item) => {
					const active = isActive(item.href)
					const Icon = item.icon
					return (
						<Link
							key={item.href}
							href={basePath + item.href}
							className={`flex items-center gap-2 px-3 py-1.5 text-[13px] mx-1 rounded-md transition-colors ${
								active
									? "bg-surface-2 text-fg font-medium"
									: "text-fg-muted hover:text-fg hover:bg-surface-2/50"
							}`}
						>
							<Icon className="size-4 shrink-0" />
							{item.label}
						</Link>
					)
				})}
			</BlockStack>
		</nav>
	)
}
```

**Step 2: Commit**

```bash
git add apps/ops/components/project-sidebar.tsx
git commit -m "feat(ops): create ProjectSidebar component for project mini-app"
```

---

### Task 3: Create the project layout with sidebar

**Files:**
- Create: `apps/ops/app/(main)/clients/[id]/projects/[pid]/layout.tsx`

This layout wraps all project sub-pages. It fetches just the project name + client name for breadcrumb, and renders the sidebar + children.

**Step 1: Create the layout**

```tsx
"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { use } from "react"
import { ProjectSidebar } from "@/components/project-sidebar"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

interface Props {
	params: Promise<{ id: string; pid: string }>
	children: React.ReactNode
}

export default function ProjectLayout({ params, children }: Props) {
	const { id, pid } = use(params)
	const project = useQuery(api.projects.get, { id: pid as Id<"projects"> })
	const client = useQuery(api.clients.get, { id: id as Id<"clients"> })
	const basePath = `/clients/${id}/projects/${pid}`

	useAppTopBar(
		project != null
			? [
					{ label: "Clients", href: "/clients" },
					{ label: client?.name ?? "...", href: `/clients/${id}` },
					{ label: project.name },
				]
			: null
	)

	if (project === undefined) {
		return (
			<div className="flex h-[calc(100vh-3.5rem)]">
				<div className="w-[200px] shrink-0 border-r border-edge p-4">
					<Skeleton className="h-4 w-24 mb-3" />
					<Skeleton className="h-4 w-20 mb-2" />
					<Skeleton className="h-4 w-28 mb-2" />
					<Skeleton className="h-4 w-20 mb-2" />
				</div>
				<div className="flex-1 p-6">
					<Skeleton className="h-6 w-48 mb-4" />
					<Skeleton className="h-32 w-full" />
				</div>
			</div>
		)
	}

	if (project === null) {
		return <div className="p-6 text-fg-muted text-sm">Projet introuvable.</div>
	}

	return (
		<div className="flex h-[calc(100vh-3.5rem)]">
			<ProjectSidebar basePath={basePath} />
			<div className="flex-1 min-w-0 overflow-y-auto">
				{children}
			</div>
		</div>
	)
}
```

**Step 2: Check that `api.projects.get` exists**

The layout needs a lightweight query that returns just the project doc (not the full getWithStats). Check `convex/projects.ts` for a `get` query. If it doesn't exist, add one:

```ts
export const get = query({
	args: { id: v.id("projects") },
	handler: async (ctx, { id }) => {
		const { userId } = await requireAuth(ctx)
		const project = await ctx.db.get(id)
		if (!project || project.userId !== userId) return null
		return project
	},
})
```

**Step 3: Commit**

```bash
git add apps/ops/app/\(main\)/clients/\[id\]/projects/\[pid\]/layout.tsx
git commit -m "feat(ops): create project layout with sidebar navigation"
```

---

### Task 4: Convert current page to Overview (page.tsx)

**Files:**
- Modify: `apps/ops/app/(main)/clients/[id]/projects/[pid]/page.tsx` (rewrite)
- Reference: `apps/ops/app/(main)/clients/[id]/projects/[pid]/_client.tsx` (source to extract from)

The overview page contains: KPIs (lines 573-611), BudgetSection (lines 613-620), ContractSection (lines 622-638), and the edit project dialog (lines 786-798).

**Step 1: Rewrite page.tsx**

Replace the current `page.tsx` with a new client component that contains only the Overview content. Extract from `_client.tsx` lines 64-67 (data fetching for overview), 472-498 (loading/error), 500-540 (computed metrics), 542-638 (render: header + KPIs + budget + contract), and 786-798 (edit dialog).

The key differences from the monolith:
- No `useAppTopBar` (handled by layout)
- No time entries DataTable, invoices, notes, contracts list — those move to their own pages
- Fetches `projects.getWithStats` for KPIs, `contracts.getActiveByProject` for active contract

```tsx
"use client"

import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { InlineGrid } from "@blazz/ui/components/ui/inline-grid"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { use, useState } from "react"
import { toast } from "sonner"
import { BudgetSection } from "@/components/budget-section"
import { ContractSection } from "@/components/contract-section"
import { ProjectForm } from "@/components/project-form"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { computeBudgetMetrics } from "@/lib/budget"
import { computeContractMetrics, computeForfaitMetrics } from "@/lib/contracts"
import { formatMinutes } from "@/lib/format"

interface Props {
	params: Promise<{ id: string; pid: string }>
}

export default function ProjectOverviewPage({ params }: Props) {
	const { id, pid } = use(params)
	const data = useQuery(api.projects.getWithStats, { id: pid as Id<"projects"> })
	const activeContract = useQuery(api.contracts.getActiveByProject, {
		projectId: pid as Id<"projects">,
	})
	const completeContract = useMutation(api.contracts.complete)
	const [editOpen, setEditOpen] = useState(false)
	const [editingContract, setEditingContract] = useState<Doc<"contracts"> | null>(null)

	if (data === undefined) {
		return (
			<BlockStack gap="600" className="p-6">
				<Skeleton className="h-6 w-56" />
				<InlineGrid columns={4} gap="400">
					{Array.from({ length: 4 }).map((_, i) => (
						<Skeleton key={i} className="h-20 rounded-lg" />
					))}
				</InlineGrid>
				<Skeleton className="h-48 rounded-lg" />
			</BlockStack>
		)
	}

	if (data === null) return null // layout handles not-found

	const { project, entries, stats } = data

	const budgetMetrics = computeBudgetMetrics({
		budgetAmount: project.budgetAmount,
		tjm: project.tjm,
		hoursPerDay: project.hoursPerDay,
		billableMinutes: stats.billableMinutes,
		billableRevenue: stats.billableRevenue,
	})

	const contractMetrics =
		activeContract && activeContract.type === "tma" && activeContract.daysPerMonth
			? computeContractMetrics({
					daysPerMonth: activeContract.daysPerMonth,
					carryOver: activeContract.carryOver,
					prestationStartDate: activeContract.prestationStartDate,
					startDate: activeContract.startDate,
					endDate: activeContract.endDate,
					hoursPerDay: project.hoursPerDay,
					entries: entries.map((e) => ({
						date: e.date,
						minutes: e.minutes,
						billable: e.billable,
					})),
				})
			: null

	const forfaitMetrics =
		activeContract && activeContract.type === "forfait" && activeContract.budgetAmount
			? computeForfaitMetrics({
					budgetAmount: activeContract.budgetAmount,
					entries: entries.map((e) => ({
						date: e.date,
						minutes: e.minutes,
						hourlyRate: e.hourlyRate,
						billable: e.billable,
					})),
					startDate: activeContract.startDate,
					endDate: activeContract.endDate,
				})
			: null

	const statusDot: Record<string, string> = {
		active: "bg-green-500",
		paused: "bg-amber-500",
		closed: "bg-fg-muted",
	}
	const statusLabel: Record<string, string> = {
		active: "Actif",
		paused: "En pause",
		closed: "Clôturé",
	}

	return (
		<>
			<BlockStack gap="800" className="p-6">
				<BlockStack gap="150">
					<PageHeader
						title={project.name}
						actions={[
							{
								label: "Modifier",
								variant: "outline",
								onClick: () => setEditOpen(true),
							},
						]}
					/>
					<InlineStack as="span" gap="150" blockAlign="center" className="text-xs text-fg-muted">
						<span className={`inline-block size-1.5 rounded-full ${statusDot[project.status]}`} />
						{statusLabel[project.status]}
					</InlineStack>
				</BlockStack>

				{/* KPI cards */}
				<div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
					<Card>
						<CardContent className="p-4">
							<p className="text-xs text-fg-muted mb-1">CA total</p>
							<p className="text-xl font-semibold font-pixel">
								{stats.totalRevenue.toLocaleString("fr-FR")} €
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<p className="text-xs text-fg-muted mb-1">Facturé</p>
							<p className="text-xl font-semibold font-pixel text-green-600 dark:text-green-400">
								{stats.invoicedRevenue.toLocaleString("fr-FR")} €
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<p className="text-xs text-fg-muted mb-1">À facturer</p>
							<p className="text-xl font-semibold font-pixel text-amber-600 dark:text-amber-400">
								{stats.pendingRevenue.toLocaleString("fr-FR")} €
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="p-4">
							<p className="text-xs text-fg-muted mb-1">Temps passé</p>
							<p className="text-xl font-semibold font-pixel">
								{formatMinutes(stats.totalMinutes)}
							</p>
							<p className="text-xs text-fg-muted mt-1 tabular-nums">
								{(stats.totalMinutes / (project.hoursPerDay * 60)).toFixed(1).replace(".", ",")}{" "}
								jours
							</p>
						</CardContent>
					</Card>
				</div>

				{/* Budget section */}
				{budgetMetrics && (
					<BudgetSection
						metrics={budgetMetrics}
						tjm={project.tjm}
						weeklyBurnDown={data.weeklyBurnDown ?? null}
					/>
				)}

				{/* Contract section */}
				{activeContract && (
					<ContractSection
						contract={activeContract}
						metrics={contractMetrics}
						forfaitMetrics={forfaitMetrics}
						onEdit={() => setEditingContract(activeContract)}
						onComplete={async () => {
							try {
								await completeContract({ id: activeContract._id })
								toast.success("Contrat clôturé")
							} catch (e) {
								toast.error(e instanceof Error ? e.message : "Erreur")
							}
						}}
					/>
				)}
			</BlockStack>

			{/* Edit project dialog */}
			<Dialog open={editOpen} onOpenChange={setEditOpen}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Modifier le projet</DialogTitle>
					</DialogHeader>
					<ProjectForm
						clientId={project.clientId}
						defaultValues={{ ...project, id: project._id }}
						onSuccess={() => setEditOpen(false)}
						onCancel={() => setEditOpen(false)}
					/>
				</DialogContent>
			</Dialog>
		</>
	)
}
```

Note: This is a `"use client"` component exported as default from `page.tsx`. If Next.js requires a server component wrapper, keep `page.tsx` as a thin server wrapper that imports this client component (same pattern as the current code).

**Step 2: Commit**

```bash
git add apps/ops/app/\(main\)/clients/\[id\]/projects/\[pid\]/page.tsx
git commit -m "feat(ops): rewrite project page.tsx as Overview sub-page"
```

---

### Task 5: Create the Time sub-page

**Files:**
- Create: `apps/ops/app/(main)/clients/[id]/projects/[pid]/time/page.tsx`
- Reference: `apps/ops/app/(main)/clients/[id]/projects/[pid]/_client.tsx` lines 95-783

Extract the time entries DataTable and all associated dialogs (TimeEntryForm, QuickTimeEntryModal) from the monolithic page.

**Step 1: Create `time/page.tsx`**

This page contains:
- All `statusConfig`, `entryColumns`, `entryViews`, `entryRowActions`, `entryBulkActions` (lines 99-470)
- The DataTable render (lines 715-783)
- TimeEntryForm edit dialog (lines 800-822)
- QuickTimeEntryModal (lines 824-833)
- Header with "+ Nouvelle entrée" button (lines 707-713)

```tsx
"use client"

import type {
	BulkAction,
	DataTableColumnDef,
	DataTableView,
	RowAction,
} from "@blazz/pro/components/blocks/data-table"
import { DataTable } from "@blazz/pro/components/blocks/data-table"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import {
	Ban,
	CheckCircle2,
	CircleDashed,
	CircleDollarSign,
	CircleFadingArrowUp,
	FileText,
	Pencil,
	Plus,
	Receipt,
	Send,
	Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { use, useMemo, useState } from "react"
import { toast } from "sonner"
import { QuickTimeEntryModal } from "@/components/quick-time-entry-modal"
import { TimeEntryForm } from "@/components/time-entry-form"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { useFeatureFlags } from "@/lib/feature-flags-context"
import { formatMinutes } from "@/lib/format"
import {
	type EntryStatus,
	getAllowedTransitions,
	getEffectiveStatus,
} from "@/lib/time-entry-status"

// Copy the ENTIRE content of the current _client.tsx time entries section:
// - statusConfig (lines 99-127)
// - entryColumns (lines 129-191)
// - entryViews (lines 193-300)
// - entryRowActions (lines 302-395)
// - entryBulkActions (lines 397-470)
// - DataTable render (lines 706-783)
// - TimeEntryForm dialog (lines 800-822)
// - QuickTimeEntryModal (lines 824-833)
//
// The component fetches `api.projects.getWithStats` for entries + project data.
// See _client.tsx for exact code — copy lines verbatim, removing the
// overview/contracts/invoices/notes sections.
```

The component structure:

```tsx
export default function ProjectTimePage({ params }: { params: Promise<{ id: string; pid: string }> }) {
	const { isEnabled } = useFeatureFlags()
	const { id, pid } = use(params)
	const data = useQuery(api.projects.getWithStats, { id: pid as Id<"projects"> })
	const setStatus = useMutation(api.timeEntries.setStatus)
	const remove = useMutation(api.timeEntries.remove)
	const [editing, setEditing] = useState<Doc<"timeEntries"> | null>(null)
	const [quickEntryOpen, setQuickEntryOpen] = useState(false)
	const router = useRouter()

	// ... statusConfig, entryColumns, entryViews, entryRowActions, entryBulkActions
	// (copy verbatim from _client.tsx lines 99-470)

	if (data === undefined) {
		return (
			<BlockStack gap="400" className="p-6">
				<Skeleton className="h-6 w-48" />
				{Array.from({ length: 5 }).map((_, i) => (
					<Skeleton key={i} className="h-10 rounded" />
				))}
			</BlockStack>
		)
	}
	if (data === null) return null

	const { project, entries } = data

	return (
		<>
			<BlockStack gap="0" className="p-6 pb-0">
				<InlineStack align="space-between" blockAlign="center">
					<h2 className="text-sm font-medium text-fg">Entrées de temps</h2>
					<Button size="sm" variant="outline" onClick={() => setQuickEntryOpen(true)}>
						<Plus className="size-3.5 mr-1" />
						Nouvelle entrée
					</Button>
				</InlineStack>
			</BlockStack>
			<DataTable
				{/* ... same props as current _client.tsx lines 715-783 */}
			/>

			{/* Edit time entry dialog — copy from _client.tsx lines 800-822 */}
			{/* QuickTimeEntryModal — copy from _client.tsx lines 824-833 */}
		</>
	)
}
```

**Step 2: Commit**

```bash
git add apps/ops/app/\(main\)/clients/\[id\]/projects/\[pid\]/time/
git commit -m "feat(ops): create Time sub-page for project mini-app"
```

---

### Task 6: Extract shared TodosDataTable component

**Files:**
- Create: `apps/ops/components/todos-data-table.tsx`
- Reference: `apps/ops/app/(main)/todos/_client.tsx` lines 225-649

Extract the DataTable portion of the todos page into a reusable component. This component accepts an optional `projectId` prop.

**Step 1: Create the shared component**

Extract from `todos/_client.tsx`:
- `statusTint`, `statusLabel` (lines 274-288)
- `columns` (lines 290-374) — conditionally exclude `projectName` column when `projectId` is set
- `views` (lines 376-447)
- `rowActions`, `bulkActions` (lines 449-490)
- `viewMode` state with localStorage (lines 240-254) — use `storageKey` prop for distinct keys
- `todoRows` memo (lines 257-268)
- DataTable render (lines 520-633)
- `AddTodoDialog` (lines 68-223) — when `projectId` is set, pre-fill and hide project select

```tsx
"use client"

import type {
	BulkAction,
	DataTableColumnDef,
	DataTableView,
	RowAction,
} from "@blazz/pro/components/blocks/data-table"
import { DataTable } from "@blazz/pro/components/blocks/data-table"
import { Bleed } from "@blazz/ui/components/ui/bleed"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@blazz/ui/components/ui/dropdown-menu"
import {
	Empty,
	EmptyActions,
	EmptyDescription,
	EmptyIcon,
	EmptyTitle,
} from "@blazz/ui/components/ui/empty"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Input } from "@blazz/ui/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@blazz/ui/components/ui/select"
import { Textarea } from "@blazz/ui/components/ui/textarea"
import { useMutation, useQuery } from "convex/react"
import {
	CircleCheck,
	CircleDashed,
	CircleDot,
	CircleSlash,
	Columns3,
	LayoutList,
	Pencil,
	Plus,
	Trash2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useMemo, useState } from "react"
import { toast } from "sonner"
import { DueDatePicker } from "@/components/due-date-picker"
import type { Category } from "@/components/edit-todo-dialog"
import { PriorityIcon, ProjectBadge } from "@/components/edit-todo-dialog"
import { CategoryBadge } from "@/components/manage-categories-sheet"
import { TagInput } from "@/components/tag-input"
import { TodoCard } from "@/components/todo-card"
import type { Todo } from "@/components/todos-preset"
import { formatDueDate, StatusIcon } from "@/components/todos-preset"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"

type TodoStatus = "triage" | "todo" | "blocked" | "in_progress" | "done"

interface TodosDataTableProps {
	/** When set, filters todos by project and hides the project column */
	projectId?: Id<"projects">
}

// AddTodoDialog — extracted from todos/_client.tsx lines 68-223
// When projectId is provided:
//   - Pre-fill projectId and hide the project select
//   - Submit with fixed projectId
function AddTodoDialog({
	defaultStatus,
	open,
	onOpenChange,
	projects,
	categories,
	allTags,
	fixedProjectId,
}: {
	defaultStatus: TodoStatus
	open: boolean
	onOpenChange: (v: boolean) => void
	projects: Doc<"projects">[]
	categories: Category[]
	allTags: string[]
	fixedProjectId?: Id<"projects">
}) {
	// ... copy from todos/_client.tsx lines 83-222
	// Change: use fixedProjectId ?? projectId for the create mutation
	// Change: hide project Select when fixedProjectId is set
}

export function TodosDataTable({ projectId }: TodosDataTableProps) {
	const router = useRouter()
	// Fetch todos: use listByProject when scoped, list when global
	const todos = useQuery(
		projectId ? api.todos.listByProject : api.todos.list,
		projectId ? { projectId } : {}
	)
	const projects = useQuery(api.projects.listActive, {})
	const categories = useQuery(api.categories.list, {})
	const allTags = useQuery(api.todos.listAllTags, {})
	const [addFor, setAddFor] = useState<TodoStatus | null>(null)

	const projectList = projects ?? []
	const categoryList = categories ?? []
	const allTagsList = allTags ?? []

	const updateStatus = useMutation(api.todos.updateStatus)
	const remove = useMutation(api.todos.remove)

	// View mode with distinct localStorage key
	const storageKey = projectId ? `ops-project-todos-mode-${projectId}` : "ops-todos-mode"
	const [viewMode, setViewMode] = useState<"kanban" | "list">(() => {
		try {
			const saved = typeof window !== "undefined" ? localStorage.getItem(storageKey) : null
			if (saved === "list" || saved === "kanban") return saved
		} catch {}
		return "kanban"
	})

	const handleSetViewMode = (mode: "kanban" | "list") => {
		setViewMode(mode)
		try { localStorage.setItem(storageKey, mode) } catch {}
	}

	const todoRows = useMemo<Todo[]>(() => {
		if (!todos) return []
		return todos.map((t) => {
			const cat = categoryList.find((c) => c._id === t.categoryId)
			return {
				...t,
				projectName: projectList.find((p) => p._id === t.projectId)?.name,
				categoryName: cat?.name,
				categoryColor: cat?.color,
			}
		})
	}, [todos, projectList, categoryList])

	// Columns — conditionally exclude projectName when scoped
	const columns = useMemo<DataTableColumnDef<Todo>[]>(() => {
		const base: DataTableColumnDef<Todo>[] = [
			// ... copy status, priority, text columns from _client.tsx lines 291-346
		]

		// Only include project column when NOT scoped to a project
		if (!projectId) {
			base.push(
				// ... copy projectName column from _client.tsx lines 348-358
			)
		}

		base.push(
			// ... copy categoryName, dueDate, createdAt columns from _client.tsx lines 359-372
		)

		return base
	}, [projectList, categoryList, projectId])

	// views, rowActions, bulkActions — copy verbatim from _client.tsx lines 376-490

	// DataTable storageKey also scoped
	const dtStorageKey = projectId ? `ops-project-todos-${projectId}` : "ops-todos"

	// Render: copy from _client.tsx lines 494-648
	// Use dtStorageKey for DataTable storageKey prop
	// Pass fixedProjectId={projectId} to AddTodoDialog

	return (
		<>
			{/* ... same render as _client.tsx lines 496-647 */}
			{/* Use dtStorageKey as DataTable storageKey */}
			{/* Pass fixedProjectId={projectId} to AddTodoDialog */}
		</>
	)
}
```

**Step 2: Commit**

```bash
git add apps/ops/components/todos-data-table.tsx
git commit -m "feat(ops): extract TodosDataTable shared component"
```

---

### Task 7: Refactor global /todos page to use shared component

**Files:**
- Modify: `apps/ops/app/(main)/todos/_client.tsx`

Replace the entire DataTable logic with the shared component.

**Step 1: Simplify _client.tsx**

```tsx
"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { TodosDataTable } from "@/components/todos-data-table"

export default function TodosPageClient() {
	useAppTopBar([{ label: "Todos" }])

	return <TodosDataTable />
}
```

**Step 2: Verify the global /todos page still works**

Run: `pnpm dev:ops` and navigate to `/todos`. Verify:
- Kanban/List toggle works
- All statuses render correctly
- Row actions (edit, delete) work
- Add todo dialog works with project select visible

**Step 3: Commit**

```bash
git add apps/ops/app/\(main\)/todos/_client.tsx
git commit -m "refactor(ops): use shared TodosDataTable in global todos page"
```

---

### Task 8: Create the Todos sub-page for project

**Files:**
- Create: `apps/ops/app/(main)/clients/[id]/projects/[pid]/todos/page.tsx`

**Step 1: Create the page**

```tsx
"use client"

import { use } from "react"
import { TodosDataTable } from "@/components/todos-data-table"
import type { Id } from "@/convex/_generated/dataModel"

export default function ProjectTodosPage({
	params,
}: { params: Promise<{ id: string; pid: string }> }) {
	const { pid } = use(params)

	return <TodosDataTable projectId={pid as Id<"projects">} />
}
```

**Step 2: Commit**

```bash
git add apps/ops/app/\(main\)/clients/\[id\]/projects/\[pid\]/todos/
git commit -m "feat(ops): create project-scoped Todos sub-page"
```

---

### Task 9: Create Invoices, Notes, Contracts sub-pages

**Files:**
- Create: `apps/ops/app/(main)/clients/[id]/projects/[pid]/invoices/page.tsx`
- Create: `apps/ops/app/(main)/clients/[id]/projects/[pid]/notes/page.tsx`
- Create: `apps/ops/app/(main)/clients/[id]/projects/[pid]/contracts/page.tsx`

These are thin wrappers around existing components.

**Step 1: Create invoices/page.tsx**

```tsx
"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { useQuery } from "convex/react"
import { FileText } from "lucide-react"
import { useRouter } from "next/navigation"
import { use } from "react"
import { InvoiceSection } from "@/components/invoice-section"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { useFeatureFlags } from "@/lib/feature-flags-context"

export default function ProjectInvoicesPage({
	params,
}: { params: Promise<{ id: string; pid: string }> }) {
	const { isEnabled } = useFeatureFlags()
	const { id, pid } = use(params)
	const data = useQuery(api.projects.getWithStats, { id: pid as Id<"projects"> })
	const router = useRouter()

	if (!isEnabled("invoicing")) {
		return <div className="p-6 text-fg-muted text-sm">Facturation non activée.</div>
	}

	const entries = data?.entries ?? []
	const readyEntries = entries.filter(
		(e) => e.billable && e.status !== "invoiced" && e.status !== "paid" && !e.invoicedAt
	)

	return (
		<BlockStack gap="400" className="p-6">
			<InlineStack align="space-between" blockAlign="center">
				<h2 className="text-sm font-medium text-fg">Factures</h2>
				{readyEntries.length > 0 && (
					<Button
						size="sm"
						variant="outline"
						onClick={() =>
							router.push(`/invoices/new?clientId=${data?.project.clientId}&projectId=${pid}`)
						}
					>
						<FileText className="size-3.5 mr-1" />
						Facturer ({readyEntries.length} entrée{readyEntries.length > 1 ? "s" : ""})
					</Button>
				)}
			</InlineStack>
			<InvoiceSection projectId={pid as Id<"projects">} />
		</BlockStack>
	)
}
```

**Step 2: Create notes/page.tsx**

```tsx
"use client"

import { use } from "react"
import { ProjectNotesList } from "@/components/project-notes-list"

export default function ProjectNotesPage({
	params,
}: { params: Promise<{ id: string; pid: string }> }) {
	const { pid } = use(params)

	return (
		<div className="p-6">
			<ProjectNotesList projectId={pid} />
		</div>
	)
}
```

**Step 3: Create contracts/page.tsx**

Extract from `_client.tsx` lines 640-674 (contract list) + 835-874 (contract dialogs):

```tsx
"use client"

import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Button } from "@blazz/ui/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@blazz/ui/components/ui/dialog"
import { InlineStack } from "@blazz/ui/components/ui/inline-stack"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useMutation, useQuery } from "convex/react"
import { use, useState } from "react"
import { toast } from "sonner"
import { ContractForm } from "@/components/contract-form"
import { ContractSection } from "@/components/contract-section"
import { api } from "@/convex/_generated/api"
import type { Doc, Id } from "@/convex/_generated/dataModel"
import { computeContractMetrics, computeForfaitMetrics } from "@/lib/contracts"

export default function ProjectContractsPage({
	params,
}: { params: Promise<{ id: string; pid: string }> }) {
	const { id, pid } = use(params)
	const data = useQuery(api.projects.getWithStats, { id: pid as Id<"projects"> })
	const activeContract = useQuery(api.contracts.getActiveByProject, {
		projectId: pid as Id<"projects">,
	})
	const allContracts = useQuery(api.contracts.listByProject, {
		projectId: pid as Id<"projects">,
	})
	const completeContract = useMutation(api.contracts.complete)
	const [contractOpen, setContractOpen] = useState(false)
	const [editingContract, setEditingContract] = useState<Doc<"contracts"> | null>(null)

	if (allContracts === undefined) {
		return (
			<BlockStack gap="400" className="p-6">
				<Skeleton className="h-6 w-48" />
				<Skeleton className="h-32 rounded-lg" />
			</BlockStack>
		)
	}

	const entries = data?.entries ?? []
	const project = data?.project

	// Compute metrics for active contract display
	const contractMetrics =
		activeContract && activeContract.type === "tma" && activeContract.daysPerMonth && project
			? computeContractMetrics({
					daysPerMonth: activeContract.daysPerMonth,
					carryOver: activeContract.carryOver,
					prestationStartDate: activeContract.prestationStartDate,
					startDate: activeContract.startDate,
					endDate: activeContract.endDate,
					hoursPerDay: project.hoursPerDay,
					entries: entries.map((e) => ({
						date: e.date,
						minutes: e.minutes,
						billable: e.billable,
					})),
				})
			: null

	const forfaitMetrics =
		activeContract && activeContract.type === "forfait" && activeContract.budgetAmount
			? computeForfaitMetrics({
					budgetAmount: activeContract.budgetAmount,
					entries: entries.map((e) => ({
						date: e.date,
						minutes: e.minutes,
						hourlyRate: e.hourlyRate,
						billable: e.billable,
					})),
					startDate: activeContract.startDate,
					endDate: activeContract.endDate,
				})
			: null

	return (
		<>
			<BlockStack gap="600" className="p-6">
				{/* Active contract */}
				{activeContract && (
					<ContractSection
						contract={activeContract}
						metrics={contractMetrics}
						forfaitMetrics={forfaitMetrics}
						onEdit={() => setEditingContract(activeContract)}
						onComplete={async () => {
							try {
								await completeContract({ id: activeContract._id })
								toast.success("Contrat clôturé")
							} catch (e) {
								toast.error(e instanceof Error ? e.message : "Erreur")
							}
						}}
					/>
				)}

				{/* All contracts header */}
				<InlineStack align="space-between" blockAlign="center">
					<h2 className="text-sm font-medium text-fg">Tous les contrats</h2>
					<Button size="sm" variant="outline" onClick={() => setContractOpen(true)}>
						Nouveau contrat
					</Button>
				</InlineStack>

				{/* Past contracts list — copy from _client.tsx lines 649-674 */}
				{allContracts.filter((c) => c.status !== "active").length > 0 && (
					<BlockStack gap="100">
						{allContracts
							.filter((c) => c.status !== "active")
							.map((c) => (
								<InlineStack
									key={c._id}
									align="space-between"
									blockAlign="center"
									className="py-2 border-b border-edge last:border-0 text-xs text-fg-muted"
								>
									<span className="font-mono">
										{c.startDate} → {c.endDate}
									</span>
									<span>
										{c.type === "tma"
											? `${c.daysPerMonth}j/mois`
											: c.type === "regie"
												? "Régie"
												: "Forfait"}{" "}
										· {c.status === "completed" ? "Terminé" : "Annulé"}
									</span>
								</InlineStack>
							))}
					</BlockStack>
				)}
			</BlockStack>

			{/* New contract dialog */}
			<Dialog open={contractOpen} onOpenChange={setContractOpen}>
				<DialogContent size="lg" className="max-h-[85vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Nouveau contrat</DialogTitle>
					</DialogHeader>
					<ContractForm
						projectId={pid as Id<"projects">}
						onSuccess={() => setContractOpen(false)}
						onCancel={() => setContractOpen(false)}
					/>
				</DialogContent>
			</Dialog>

			{/* Edit contract dialog */}
			<Dialog open={!!editingContract} onOpenChange={(open) => !open && setEditingContract(null)}>
				<DialogContent size="lg" className="max-h-[85vh] overflow-y-auto">
					<DialogHeader>
						<DialogTitle>Modifier le contrat</DialogTitle>
					</DialogHeader>
					{editingContract && (
						<ContractForm
							projectId={pid as Id<"projects">}
							defaultValues={{
								id: editingContract._id,
								type: editingContract.type,
								daysPerMonth: editingContract.daysPerMonth,
								carryOver: editingContract.carryOver,
								prestationStartDate: editingContract.prestationStartDate,
								startDate: editingContract.startDate,
								endDate: editingContract.endDate,
								status: editingContract.status,
								notes: editingContract.notes,
							}}
							onSuccess={() => setEditingContract(null)}
							onCancel={() => setEditingContract(null)}
						/>
					)}
				</DialogContent>
			</Dialog>
		</>
	)
}
```

**Step 4: Commit**

```bash
git add apps/ops/app/\(main\)/clients/\[id\]/projects/\[pid\]/invoices/ \
        apps/ops/app/\(main\)/clients/\[id\]/projects/\[pid\]/notes/ \
        apps/ops/app/\(main\)/clients/\[id\]/projects/\[pid\]/contracts/
git commit -m "feat(ops): create Invoices, Notes, Contracts sub-pages"
```

---

### Task 10: Delete the old monolithic _client.tsx

**Files:**
- Delete: `apps/ops/app/(main)/clients/[id]/projects/[pid]/_client.tsx`

**Step 1: Delete the file**

```bash
rm apps/ops/app/\(main\)/clients/\[id\]/projects/\[pid\]/_client.tsx
```

**Step 2: Verify no imports reference it**

Search for `_client` imports in the `[pid]` directory — should be none since `page.tsx` was rewritten in Task 4.

**Step 3: Commit**

```bash
git add apps/ops/app/\(main\)/clients/\[id\]/projects/\[pid\]/_client.tsx
git commit -m "chore(ops): remove monolithic project _client.tsx (replaced by sub-pages)"
```

---

### Task 11: Smoke test all sub-pages

**No files to create/modify.** This is a manual verification task.

**Step 1: Start the dev server**

Run: `pnpm dev:ops`

**Step 2: Verify each route**

Navigate to a project and check each section:

1. `/clients/[id]/projects/[pid]` — Overview with KPIs, budget, active contract
2. `/clients/[id]/projects/[pid]/time` — Time entries DataTable with all actions
3. `/clients/[id]/projects/[pid]/todos` — Kanban/List todos filtered by project
4. `/clients/[id]/projects/[pid]/invoices` — Invoice section
5. `/clients/[id]/projects/[pid]/notes` — Project notes
6. `/clients/[id]/projects/[pid]/contracts` — Contract list + CRUD

**Step 3: Verify sidebar behavior**

- Active item highlights correctly on each route
- Overview highlights on exact `[pid]` path (not on sub-routes)
- Breadcrumb shows Clients > Client Name > Project Name on all sub-pages

**Step 4: Verify global /todos still works**

- Navigate to `/todos` — should show all todos (not filtered)
- Project column should be visible
- Add todo dialog should show project selector

**Step 5: Verify project todos**

- Navigate to `/clients/[id]/projects/[pid]/todos`
- Should show only todos for this project
- Project column should be hidden
- Add todo dialog should NOT show project selector (pre-filled)
- Kanban/List toggle should have its own persisted state

**Step 6: Commit final cleanup if needed**

```bash
git commit -m "feat(ops): project mini-app with sidebar navigation — complete"
```
