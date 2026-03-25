"use client"

import type {
	DataTableColumnDef,
	DataTableView,
	RowAction,
} from "@blazz/pro/components/blocks/data-table"
import { DataTable } from "@blazz/pro/components/blocks/data-table"
import { Ban, CheckCircle2, CircleDot, FileEdit, Pencil, Send, Trash2 } from "lucide-react"
import * as React from "react"
import { DocHero } from "~/components/docs/doc-hero"
import { DocPage } from "~/components/docs/doc-page"
import { DocSection } from "~/components/docs/doc-section"

type Issue = {
	id: string
	title: string
	status: "backlog" | "todo" | "in_progress" | "done" | "cancelled"
	priority: "urgent" | "high" | "medium" | "low"
	project: string
	date: string
}

const statusConfig: Record<
	string,
	{ icon: typeof FileEdit; iconClass: string; tint: string; label: string }
> = {
	backlog: {
		icon: Ban,
		iconClass: "text-fg-muted",
		tint: "oklch(0.55 0.02 270 / 0.06)",
		label: "Backlog",
	},
	todo: {
		icon: FileEdit,
		iconClass: "text-violet-500",
		tint: "oklch(0.65 0.15 300 / 0.08)",
		label: "Todo",
	},
	in_progress: {
		icon: Send,
		iconClass: "text-amber-500",
		tint: "oklch(0.75 0.15 85 / 0.08)",
		label: "In Progress",
	},
	done: {
		icon: CheckCircle2,
		iconClass: "text-green-500",
		tint: "oklch(0.70 0.15 150 / 0.08)",
		label: "Done",
	},
	cancelled: {
		icon: CircleDot,
		iconClass: "text-red-500",
		tint: "oklch(0.65 0.15 25 / 0.08)",
		label: "Cancelled",
	},
}

const issues: Issue[] = [
	{
		id: "1",
		title: "Add dark mode support",
		status: "in_progress",
		priority: "high",
		project: "Frontend",
		date: "2026-03-10",
	},
	{
		id: "2",
		title: "Fix login redirect bug",
		status: "todo",
		priority: "urgent",
		project: "Auth",
		date: "2026-03-12",
	},
	{
		id: "3",
		title: "Update API docs",
		status: "done",
		priority: "medium",
		project: "Docs",
		date: "2026-03-08",
	},
	{
		id: "4",
		title: "Optimize bundle size",
		status: "in_progress",
		priority: "medium",
		project: "Frontend",
		date: "2026-03-11",
	},
	{
		id: "5",
		title: "Add export CSV feature",
		status: "backlog",
		priority: "low",
		project: "Backend",
		date: "2026-03-05",
	},
	{
		id: "6",
		title: "Refactor auth middleware",
		status: "todo",
		priority: "high",
		project: "Auth",
		date: "2026-03-13",
	},
	{
		id: "7",
		title: "Design system tokens audit",
		status: "done",
		priority: "medium",
		project: "Design",
		date: "2026-03-07",
	},
	{
		id: "8",
		title: "Setup CI/CD pipeline",
		status: "cancelled",
		priority: "low",
		project: "DevOps",
		date: "2026-03-01",
	},
	{
		id: "9",
		title: "Add rate limiting",
		status: "backlog",
		priority: "high",
		project: "Backend",
		date: "2026-03-14",
	},
	{
		id: "10",
		title: "Migrate to React 19",
		status: "in_progress",
		priority: "urgent",
		project: "Frontend",
		date: "2026-03-09",
	},
]

const toc = [
	{ id: "demo", title: "Demo" },
	{ id: "how-it-works", title: "How it Works" },
	{ id: "renderRow", title: "renderRow" },
	{ id: "groupRowStyle", title: "groupRowStyle" },
]

export default function FlatModePage() {
	const columns = React.useMemo<DataTableColumnDef<Issue>[]>(
		() => [
			{
				id: "status",
				accessorKey: "status",
				header: "Status",
				cell: ({ row }) => {
					if (!row.getIsGrouped()) return null
					const s = row.original.status
					const cfg = statusConfig[s]
					const Icon = cfg?.icon ?? Ban
					return (
						<span className="flex items-center gap-2 text-sm font-medium text-fg">
							<Icon className={`size-4 ${cfg?.iconClass ?? "text-fg-muted"}`} />
							{cfg?.label ?? s}
						</span>
					)
				},
				filterConfig: {
					type: "select" as const,
					options: Object.entries(statusConfig).map(([value, cfg]) => ({
						label: cfg.label,
						value,
					})),
					showInlineFilter: true,
					defaultInlineFilter: true,
					filterLabel: "Status",
				},
			},
			{ accessorKey: "title", header: "Title" },
			{ accessorKey: "priority", header: "Priority" },
			{ accessorKey: "project", header: "Project" },
			{ accessorKey: "date", header: "Date", enableSorting: true },
		],
		[]
	)

	const views = React.useMemo<DataTableView[]>(
		() => [
			{
				id: "all",
				name: "All",
				isSystem: true,
				isDefault: true,
				filters: { id: "root", operator: "AND", conditions: [] },
			},
			...Object.entries(statusConfig).map(([value, cfg]) => ({
				id: value,
				name: cfg.label,
				isSystem: true,
				filters: {
					id: `f-${value}`,
					operator: "AND" as const,
					conditions: [
						{
							id: `c-${value}`,
							column: "status",
							operator: "equals" as const,
							value,
							type: "select" as const,
						},
					],
				},
			})),
		],
		[]
	)

	const rowActions = React.useMemo<RowAction<Issue>[]>(
		() => [
			{ id: "edit", label: "Edit", icon: Pencil, handler: () => {} },
			{
				id: "delete",
				label: "Delete",
				icon: Trash2,
				variant: "destructive",
				separator: true,
				handler: () => {},
			},
		],
		[]
	)

	return (
		<DocPage
			title="Flat Mode"
			subtitle="Le variant flat transforme le DataTable en liste groupee style Linear — pas de headers de colonnes, rows composables via renderRow, grouping avec fond teinte."
			toc={toc}
		>
			<DocHero>
				<DataTable
					data={issues}
					columns={columns}
					views={views}
					rowActions={rowActions}
					variant="flat"
					toolbarLayout="stacked"
					enableSorting
					enableGlobalSearch
					enableAdvancedFilters
					enableCustomViews
					enableRowSelection
					enableGrouping
					defaultGrouping={["status"]}
					defaultExpanded
					groupRowStyle={(row) => {
						const s = row.getValue("status") as string
						const cfg = statusConfig[s]
						return cfg ? { background: cfg.tint } : undefined
					}}
					enablePagination={false}
					searchPlaceholder="Search issues..."
					locale="en"
					defaultSorting={[{ id: "date", desc: true }]}
					getRowId={(row) => row.id}
					renderRow={(row) => {
						const issue = row.original
						const cfg = statusConfig[issue.status]
						const Icon = cfg?.icon ?? Ban
						return (
							<>
								<div className="flex min-w-0 flex-1 items-center gap-3">
									<Icon className={`size-3.5 shrink-0 ${cfg?.iconClass ?? "text-fg-muted"}`} />
									<span className="text-fg" style={{ fontSize: 13 }}>
										{issue.title}
									</span>
								</div>
								<div className="flex shrink-0 items-center gap-3">
									<span className="text-xs text-fg-muted">{issue.date}</span>
									<span className="inline-flex items-center rounded-full bg-muted/70 px-2 py-0.5 text-[11px] text-fg-muted">
										{issue.project}
									</span>
								</div>
							</>
						)
					}}
				/>
			</DocHero>

			<DocSection id="how-it-works" title="How it Works">
				<p className="text-fg-muted mb-4">
					Le flat mode combine 3 features : <code>variant="flat"</code> (pas de bordures, pas de
					headers), <code>renderRow</code> (layout custom par ligne), et <code>enableGrouping</code>{" "}
					(regroupement).
				</p>
				<pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
					{`<DataTable
  variant="flat"
  enableGrouping
  defaultGrouping={["status"]}
  defaultExpanded
  groupRowStyle={(row) => {
    const status = row.getValue("status")
    return { background: statusTint[status] }
  }}
  renderRow={(row) => (
    <>
      <div className="flex flex-1 items-center gap-3">
        <StatusIcon status={row.original.status} />
        <span>{row.original.title}</span>
      </div>
      <div className="flex items-center gap-3">
        <span>{row.original.project}</span>
      </div>
    </>
  )}
/>`}
				</pre>
			</DocSection>

			<DocSection id="renderRow" title="renderRow">
				<p className="text-fg-muted mb-4">
					Quand <code>renderRow</code> est fourni, chaque data row rend un seul{" "}
					<code>&lt;td colSpan&gt;</code> avec un flex div. Le DataTable injecte automatiquement la
					checkbox de selection et le menu d'actions autour de votre contenu.
				</p>
				<pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
					{`renderRow={(row) => (
  <>
    {/* Left side — takes all available space */}
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <Icon className="size-3.5" />
      <span className="truncate">{row.original.title}</span>
    </div>
    {/* Right side — shrinks to fit */}
    <div className="flex shrink-0 items-center gap-3">
      <span>{row.original.date}</span>
      <Badge>{row.original.project}</Badge>
    </div>
  </>
)}`}
				</pre>
			</DocSection>

			<DocSection id="groupRowStyle" title="groupRowStyle">
				<p className="text-fg-muted mb-4">
					Callback qui recoit la row groupee et retourne des styles inline pour le{" "}
					<code>&lt;td&gt;</code> du group header. Ideal pour teinter le fond avec la couleur du
					statut.
				</p>
				<pre className="bg-muted rounded-lg p-4 text-sm overflow-x-auto">
					{`groupRowStyle={(row) => {
  const status = row.getValue("status")
  return { background: "oklch(0.70 0.15 150 / 0.08)" }
}}`}
				</pre>
			</DocSection>
		</DocPage>
	)
}
