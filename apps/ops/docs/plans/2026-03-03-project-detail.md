# Project Detail Page — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a dedicated page `/clients/[id]/projects/[pid]` showing KPI financials, a monthly activity bar chart, and a filterable timeline of time entries.

**Architecture:** New Convex query `getWithStats` aggregates all time entries for a project into KPI totals and monthly breakdown. A new Next.js page consumes this query and renders 4 stat cards, a `BarChartBlock`, and a filtered list of entries using the existing `EntryStatusBadge`. The client detail page is updated to make project rows navigable via `Link`.

**Tech Stack:** Next.js 16 App Router, Convex (server queries), `@blazz/ui` (Card, BarChartBlock, PageHeader, Skeleton), `EntryStatusBadge`, `getEffectiveStatus` from `@/lib/time-entry-status`

---

### Task 1: Add `getWithStats` query to Convex

**Files:**
- Modify: `apps/ops/convex/projects.ts`

**Step 1: Add the query at the bottom of the file**

```ts
export const getWithStats = query({
  args: { id: v.id("projects") },
  handler: async (ctx, { id }) => {
    const project = await ctx.db.get(id)
    if (!project) return null

    const entries = await ctx.db
      .query("timeEntries")
      .withIndex("by_project", (q) => q.eq("projectId", id))
      .collect()

    const totalMinutes = entries.reduce((s, e) => s + e.minutes, 0)
    const totalRevenue = entries.reduce(
      (s, e) => s + (e.minutes / 60) * e.hourlyRate,
      0
    )
    const invoicedRevenue = entries
      .filter((e) => e.status === "invoiced" || e.status === "paid")
      .reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0)
    const pendingRevenue = totalRevenue - invoicedRevenue

    const byMonthMap: Record<string, { minutes: number; revenue: number }> = {}
    for (const e of entries) {
      const month = e.date.slice(0, 7) // "2026-03"
      if (!byMonthMap[month]) byMonthMap[month] = { minutes: 0, revenue: 0 }
      byMonthMap[month].minutes += e.minutes
      byMonthMap[month].revenue += (e.minutes / 60) * e.hourlyRate
    }
    const monthlyData = Object.entries(byMonthMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        heures: Math.round((data.minutes / 60) * 10) / 10,
        ca: Math.round(data.revenue),
      }))

    return {
      project,
      entries: entries.sort((a, b) => b.date.localeCompare(a.date)),
      stats: {
        totalMinutes,
        totalRevenue: Math.round(totalRevenue),
        invoicedRevenue: Math.round(invoicedRevenue),
        pendingRevenue: Math.round(pendingRevenue),
      },
      monthlyData,
    }
  },
})
```

**Step 2: Verify Convex picks up the change**

The Convex dev server hot-reloads automatically. Check the terminal running `pnpm dev:ops` — no red errors should appear.

**Step 3: Commit**

```bash
git add apps/ops/convex/projects.ts
git commit -m "feat(ops): add getWithStats query for project detail page"
```

---

### Task 2: Make project rows clickable in the client detail page

**Files:**
- Modify: `apps/ops/app/clients/[id]/page.tsx`

**Step 1: Add Link import**

At the top of the file, add:
```ts
import Link from "next/link"
```

**Step 2: Replace the project row div with a Link wrapper**

Find the row div (lines ~141-170 in `apps/ops/app/clients/[id]/page.tsx`):

```tsx
<div
  key={project._id}
  className="flex items-center justify-between py-2.5 border-b border-edge last:border-0"
>
```

Replace with:

```tsx
<div
  key={project._id}
  className="flex items-center justify-between py-2.5 border-b border-edge last:border-0"
>
  <Link
    href={`/clients/${id}/projects/${project._id}`}
    className="flex-1 min-w-0 hover:opacity-75 transition-opacity"
  >
    <p className="text-sm font-medium text-fg">{project.name}</p>
    <p className="text-xs text-fg-muted mt-0.5 tabular-nums">
      {project.tjm}€/j · {project.hoursPerDay}h/j · {project.currency}
      {project.startDate && ` · depuis ${project.startDate}`}
    </p>
  </Link>
```

**Step 3: Remove the duplicate name/description block** that was inside the div (only keep the `Link` version above, and keep the status + edit button alongside it).

The full updated row should look like:

```tsx
<div
  key={project._id}
  className="flex items-center justify-between py-2.5 border-b border-edge last:border-0"
>
  <Link
    href={`/clients/${id}/projects/${project._id}`}
    className="flex-1 min-w-0 hover:opacity-75 transition-opacity"
  >
    <p className="text-sm font-medium text-fg">{project.name}</p>
    <p className="text-xs text-fg-muted mt-0.5 tabular-nums">
      {project.tjm}€/j · {project.hoursPerDay}h/j · {project.currency}
      {project.startDate && ` · depuis ${project.startDate}`}
    </p>
  </Link>
  <div className="flex items-center gap-3 shrink-0 ml-4">
    <span className="flex items-center gap-1.5 text-xs text-fg-muted">
      <span
        className={`inline-block size-1.5 rounded-full ${statusDot[project.status]}`}
      />
      {statusLabel[project.status]}
    </span>
    <Button
      variant="ghost"
      size="icon"
      className="size-8 text-fg-muted"
      onClick={(e) => {
        e.preventDefault()
        setEditingProject(project)
      }}
    >
      <Pencil className="size-3.5" />
    </Button>
  </div>
</div>
```

Note the `e.preventDefault()` on the edit button to prevent navigating when clicking the pencil.

**Step 4: Verify in the browser**

- Navigate to a client detail page
- The project name should now be a clickable link (hover shows opacity change)
- Clicking the pencil still opens the edit dialog without navigating

**Step 5: Commit**

```bash
git add apps/ops/app/clients/[id]/page.tsx
git commit -m "feat(ops): make project rows clickable from client detail page"
```

---

### Task 3: Create the project detail page

**Files:**
- Create: `apps/ops/app/clients/[id]/projects/[pid]/page.tsx`

**Step 1: Create the directory and file**

```bash
mkdir -p apps/ops/app/clients/[id]/projects/[pid]
```

**Step 2: Write the page**

```tsx
"use client"

import { BarChartBlock } from "@blazz/pro/components/blocks/bar-chart-block"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { use, useState } from "react"
import { EntryStatusBadge } from "@/components/entry-status-badge"
import { OpsFrame } from "@/components/ops-frame"
import { ProjectForm } from "@/components/project-form"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { getEffectiveStatus, type EntryStatus, ENTRY_STATUS_LABELS } from "@/lib/time-entry-status"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@blazz/ui/components/ui/dialog"

interface Props {
  params: Promise<{ id: string; pid: string }>
}

const chartConfig = {
  heures: { label: "Heures", color: "var(--chart-1)" },
  ca: { label: "CA (€)", color: "var(--chart-2)" },
}

const STATUS_FILTERS: Array<{ key: EntryStatus | "all"; label: string }> = [
  { key: "all", label: "Tout" },
  { key: "draft", label: ENTRY_STATUS_LABELS.draft },
  { key: "ready_to_invoice", label: ENTRY_STATUS_LABELS.ready_to_invoice },
  { key: "invoiced", label: ENTRY_STATUS_LABELS.invoiced },
  { key: "paid", label: ENTRY_STATUS_LABELS.paid },
]

function formatMinutes(minutes: number): string {
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`
}

export default function ProjectDetailPage({ params }: Props) {
  const { id, pid } = use(params)
  const data = useQuery(api.projects.getWithStats, { id: pid as Id<"projects"> })
  const [editOpen, setEditOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<EntryStatus | "all">("all")

  // Loading state
  if (data === undefined) {
    return (
      <OpsFrame>
        <div className="p-6 space-y-6">
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-6 w-56" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-48 rounded-lg" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 rounded" />
            ))}
          </div>
        </div>
      </OpsFrame>
    )
  }

  // Error / not found
  if (data === null) {
    return (
      <OpsFrame>
        <div className="p-6 text-fg-muted text-sm">Projet introuvable.</div>
      </OpsFrame>
    )
  }

  const { project, entries, stats, monthlyData } = data

  // Filter entries by status pill
  const filteredEntries =
    statusFilter === "all"
      ? entries
      : entries.filter((e) => getEffectiveStatus(e) === statusFilter)

  return (
    <OpsFrame>
      <div className="p-6 space-y-8">
        <PageHeader
          breadcrumbs={[
            { label: "Clients", href: "/clients" },
            { label: "Client", href: `/clients/${id}` },
            { label: project.name },
          ]}
          title={project.name}
          actions={[
            {
              label: "Modifier",
              variant: "outline",
              onClick: () => setEditOpen(true),
            },
          ]}
        />

        {/* KPI cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-fg-muted mb-1">CA total</p>
              <p className="text-xl font-semibold tabular-nums">
                {stats.totalRevenue.toLocaleString("fr-FR")} €
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-fg-muted mb-1">Facturé</p>
              <p className="text-xl font-semibold tabular-nums text-green-600 dark:text-green-400">
                {stats.invoicedRevenue.toLocaleString("fr-FR")} €
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-fg-muted mb-1">À facturer</p>
              <p className="text-xl font-semibold tabular-nums text-amber-600 dark:text-amber-400">
                {stats.pendingRevenue.toLocaleString("fr-FR")} €
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-fg-muted mb-1">Heures</p>
              <p className="text-xl font-semibold tabular-nums">
                {formatMinutes(stats.totalMinutes)}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Monthly bar chart */}
        {monthlyData.length > 0 && (
          <BarChartBlock
            title="Activité mensuelle"
            data={monthlyData}
            config={chartConfig}
            xKey="month"
          />
        )}

        {/* Timeline of entries */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium text-fg">Entrées de temps</h2>
            {/* Status filter pills */}
            <div className="flex items-center gap-1.5 flex-wrap">
              {STATUS_FILTERS.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setStatusFilter(key)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors ${
                    statusFilter === key
                      ? "bg-brand text-white"
                      : "bg-surface border border-edge text-fg-muted hover:text-fg"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {filteredEntries.length === 0 ? (
            <p className="text-sm text-fg-muted py-4">Aucune entrée pour ce filtre.</p>
          ) : (
            <div className="space-y-0">
              {filteredEntries.map((entry) => {
                const revenue = Math.round((entry.minutes / 60) * entry.hourlyRate)
                const effectiveStatus = getEffectiveStatus(entry)
                return (
                  <div
                    key={entry._id}
                    className="flex items-center gap-4 py-2.5 border-b border-edge last:border-0"
                  >
                    <span className="text-xs tabular-nums text-fg-muted w-20 shrink-0">
                      {entry.date}
                    </span>
                    <span className="text-xs tabular-nums text-fg w-12 shrink-0">
                      {formatMinutes(entry.minutes)}
                    </span>
                    <span className="text-xs text-fg-muted flex-1 min-w-0 truncate">
                      {entry.description || "—"}
                    </span>
                    <span className="text-xs tabular-nums text-fg shrink-0">
                      {entry.billable ? `${revenue} €` : "—"}
                    </span>
                    <div className="shrink-0 w-28">
                      <EntryStatusBadge status={effectiveStatus} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

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
    </OpsFrame>
  )
}
```

**Step 3: Verify in the browser**

1. Navigate to `/clients/[id]` — click on a project name
2. The page `/clients/[id]/projects/[pid]` should load
3. Check: 4 KPI cards show values, bar chart appears (if there are time entries), timeline renders
4. Filter pills work: clicking "Facturé" shows only invoiced entries
5. "Modifier" button opens the edit dialog and updates the project correctly
6. Loading skeletons show on first load (before Convex responds)

**Step 4: Fix the breadcrumb client name** (optional polish)

The breadcrumb currently shows "Client" as a static label for the parent. If you want the actual client name, add a `useQuery(api.clients.get, ...)` at the top of the page alongside `getWithStats`. This is optional — the breadcrumb still works as a back-link.

**Step 5: Commit**

```bash
git add apps/ops/app/clients/[id]/projects/
git commit -m "feat(ops): add project detail page with KPIs, chart, and entry timeline"
```

---

### Task 4: (Optional) Fix breadcrumb to show client name

**Files:**
- Modify: `apps/ops/app/clients/[id]/projects/[pid]/page.tsx`

**Step 1: Add client query**

After the `data` query line, add:

```tsx
const client = useQuery(api.clients.get, { id: id as Id<"clients"> })
```

**Step 2: Update breadcrumb**

Change the breadcrumb item from:
```tsx
{ label: "Client", href: `/clients/${id}` },
```
To:
```tsx
{ label: client?.name ?? "Client", href: `/clients/${id}` },
```

**Step 3: Commit**

```bash
git add apps/ops/app/clients/[id]/projects/[pid]/page.tsx
git commit -m "feat(ops): show client name in project detail breadcrumb"
```
