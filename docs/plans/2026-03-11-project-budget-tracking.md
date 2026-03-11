# Project Budget Tracking — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add budget tracking to Blazz Ops projects — progress bar, alerts, TJM effectif, burn-down sparkline, and budget health indicators in project list.

**Architecture:** Single new field `budgetAmount` on `projects` schema. All derived metrics computed in `getWithStats` query. New `BudgetSection` client component on the project detail page. No new pages, no new tables.

**Tech Stack:** Convex (schema + query), React, recharts (via `@blazz/ui` AreaChart), Tailwind, react-hook-form + zod.

**Design doc:** `docs/plans/2026-03-11-project-budget-tracking-design.md`

---

### Task 1: Add `budgetAmount` to schema + mutations

**Files:**
- Modify: `apps/ops/convex/schema.ts:17-30`
- Modify: `apps/ops/convex/projects.ts:40-70`

**Step 1: Add field to schema**

In `apps/ops/convex/schema.ts`, add `budgetAmount` to the `projects` table definition:

```ts
projects: defineTable({
    clientId: v.id("clients"),
    name: v.string(),
    description: v.optional(v.string()),
    tjm: v.number(),
    hoursPerDay: v.number(),
    budgetAmount: v.optional(v.number()), // ← NEW
    currency: v.union(v.literal("EUR")),
    status: v.union(v.literal("active"), v.literal("paused"), v.literal("closed")),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    createdAt: v.number(),
})
```

**Step 2: Add `budgetAmount` to create and update mutations**

In `apps/ops/convex/projects.ts`, add `budgetAmount: v.optional(v.number())` to the `args` of both `create` and `update` mutations.

For `create` (line ~41):
```ts
args: {
    clientId: v.id("clients"),
    name: v.string(),
    description: v.optional(v.string()),
    tjm: v.number(),
    hoursPerDay: v.number(),
    budgetAmount: v.optional(v.number()), // ← NEW
    currency: v.string(),
    status: statusValidator,
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
},
```

For `update` (line ~57):
```ts
args: {
    id: v.id("projects"),
    name: v.string(),
    description: v.optional(v.string()),
    tjm: v.number(),
    hoursPerDay: v.number(),
    budgetAmount: v.optional(v.number()), // ← NEW
    currency: v.string(),
    status: statusValidator,
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
},
```

**Step 3: Verify**

Run: `cd apps/ops && npx convex dev --once`
Expected: Schema push succeeds, no errors.

**Step 4: Commit**

```bash
git add apps/ops/convex/schema.ts apps/ops/convex/projects.ts
git commit -m "feat(ops): add budgetAmount field to projects schema"
```

---

### Task 2: Add budget helpers in `lib/budget.ts`

**Files:**
- Create: `apps/ops/lib/budget.ts`

**Step 1: Create budget utility module**

Create `apps/ops/lib/budget.ts`:

```ts
export type BudgetHealth = "ok" | "warning" | "danger" | "over"

export interface BudgetMetrics {
  budgetAmount: number
  daysSold: number
  daysConsumed: number
  revenueConsumed: number
  remaining: number
  percentUsed: number
  effectiveTjm: number | null // null if 0 days consumed
  health: BudgetHealth
}

/**
 * Compute all budget-derived metrics from a project's data.
 * Returns null if no budget is set.
 */
export function computeBudgetMetrics(opts: {
  budgetAmount: number | undefined
  tjm: number
  hoursPerDay: number
  billableMinutes: number
  billableRevenue: number
}): BudgetMetrics | null {
  if (!opts.budgetAmount || opts.budgetAmount <= 0) return null

  const daysSold = opts.tjm > 0 ? opts.budgetAmount / opts.tjm : 0
  const daysConsumed =
    opts.hoursPerDay > 0 ? opts.billableMinutes / (opts.hoursPerDay * 60) : 0
  const remaining = opts.budgetAmount - opts.billableRevenue
  const percentUsed = daysSold > 0 ? (daysConsumed / daysSold) * 100 : 0
  const effectiveTjm =
    daysConsumed > 0 ? opts.billableRevenue / daysConsumed : null

  let health: BudgetHealth = "ok"
  if (percentUsed >= 100) health = "over"
  else if (percentUsed >= 90) health = "danger"
  else if (percentUsed >= 70) health = "warning"

  return {
    budgetAmount: opts.budgetAmount,
    daysSold: Math.round(daysSold * 10) / 10,
    daysConsumed: Math.round(daysConsumed * 10) / 10,
    revenueConsumed: Math.round(opts.billableRevenue),
    remaining: Math.round(remaining),
    percentUsed: Math.round(percentUsed * 10) / 10,
    effectiveTjm: effectiveTjm !== null ? Math.round(effectiveTjm) : null,
    health,
  }
}

/** Returns Tailwind classes for progress bar color based on health. */
export function healthColor(health: BudgetHealth): {
  bar: string
  text: string
  bg: string
} {
  switch (health) {
    case "ok":
      return {
        bar: "bg-green-500",
        text: "text-green-700 dark:text-green-400",
        bg: "bg-green-50 dark:bg-green-950/30",
      }
    case "warning":
      return {
        bar: "bg-amber-500",
        text: "text-amber-700 dark:text-amber-400",
        bg: "bg-amber-50 dark:bg-amber-950/30",
      }
    case "danger":
      return {
        bar: "bg-red-500",
        text: "text-red-700 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-950/30",
      }
    case "over":
      return {
        bar: "bg-red-600",
        text: "text-red-700 dark:text-red-400",
        bg: "bg-red-50 dark:bg-red-950/30",
      }
  }
}
```

**Step 2: Commit**

```bash
git add apps/ops/lib/budget.ts
git commit -m "feat(ops): add budget metrics computation helpers"
```

---

### Task 3: Enrich `getWithStats` query with budget data

**Files:**
- Modify: `apps/ops/convex/projects.ts:72-122`

**Step 1: Add budget metrics to getWithStats return**

In `getWithStats`, after computing `monthlyData` (line ~108), add weekly burn-down data and budget fields to the return object. The budget computation itself will happen client-side (since `computeBudgetMetrics` is a client lib), but we need to return the raw data.

Update the return value (line ~110) to include `billableMinutes` and `billableRevenue`:

```ts
return {
    project,
    entries: [...entries].sort((a, b) => b.date.localeCompare(a.date)),
    stats: {
        totalMinutes,
        billableMinutes: billableEntries.reduce((s, e) => s + e.minutes, 0),   // ← NEW
        billableRevenue: Math.round(                                            // ← NEW
            billableEntries.reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0)
        ),
        totalRevenue: Math.round(totalRevenue),
        invoicedRevenue: Math.round(invoicedRevenue),
        pendingRevenue: Math.round(pendingRevenue),
    },
    monthlyData,
    weeklyBurnDown: buildWeeklyBurnDown(project, billableEntries), // ← NEW
}
```

Add this helper function above `getWithStats` in the same file:

```ts
function buildWeeklyBurnDown(
    project: { startDate?: string; budgetAmount?: number; tjm: number; hoursPerDay: number },
    billableEntries: Array<{ date: string; minutes: number; hourlyRate: number }>
) {
    if (!project.budgetAmount || !project.startDate) return null

    // Group revenue by ISO week
    const revenueByWeek: Record<string, number> = {}
    for (const e of billableEntries) {
        // week key = monday of the week (ISO)
        const d = new Date(e.date)
        const day = d.getDay() || 7 // Mon=1..Sun=7
        const monday = new Date(d)
        monday.setDate(d.getDate() - day + 1)
        const weekKey = monday.toISOString().slice(0, 10)
        revenueByWeek[weekKey] = (revenueByWeek[weekKey] ?? 0) + (e.minutes / 60) * e.hourlyRate
    }

    const sortedWeeks = Object.keys(revenueByWeek).sort()
    if (sortedWeeks.length === 0) return null

    // Build cumulative spend, derive remaining
    const budget = project.budgetAmount
    let cumulative = 0
    const points = sortedWeeks.map((week) => {
        cumulative += revenueByWeek[week]
        return { week, remaining: Math.round(budget - cumulative) }
    })

    // Add theoretical linear burn-down
    const totalWeeks = points.length
    return points.map((p, i) => ({
        ...p,
        theoretical: Math.round(budget - (budget / totalWeeks) * (i + 1)),
    }))
}
```

**Step 2: Verify**

Run: `cd apps/ops && npx convex dev --once`
Expected: No errors.

**Step 3: Commit**

```bash
git add apps/ops/convex/projects.ts
git commit -m "feat(ops): add budget metrics and weekly burn-down to getWithStats"
```

---

### Task 4: Add `budgetAmount` to ProjectForm

**Files:**
- Modify: `apps/ops/components/project-form.tsx`

**Step 1: Add field to zod schema**

In the `schema` (line 18), add:

```ts
const schema = z.object({
    name: z.string().min(1, "Nom requis"),
    description: z.string().optional(),
    tjm: z.coerce.number().min(1, "TJM requis"),
    hoursPerDay: z.coerce.number().min(1).max(24),
    budgetAmount: z.coerce.number().optional(),  // ← NEW
    currency: z.string().min(1),
    status: z.enum(["active", "paused", "closed"]),
    startDate: z.string().optional(),
    endDate: z.string().optional(),
})
```

**Step 2: Add Budget input field after the TJM row**

After the grid with TJM/H jour/Devise (line ~88), add:

```tsx
{/* Budget field */}
<div className="space-y-1.5">
    <Label htmlFor="budgetAmount">Budget (€)</Label>
    <Input
        id="budgetAmount"
        type="number"
        placeholder="Ex: 15000"
        {...register("budgetAmount")}
    />
    {tjmValue > 0 && budgetValue > 0 && (
        <p className="text-xs text-fg-muted">
            ≈ {Math.round((budgetValue / tjmValue) * 10) / 10} jours à {tjmValue}€/j
        </p>
    )}
</div>
```

To get the live values, add watches after the `useForm` call:

```ts
const tjmValue = watch("tjm") ?? 0
const budgetValue = watch("budgetAmount") ?? 0
```

**Step 3: Also fix the Select `items` bug (line 94)**

Change from:
```ts
items={{ active: "Actif", paused: "En pause", closed: "Clôturé" }}
```
To:
```ts
items={[
    { value: "active", label: "Actif" },
    { value: "paused", label: "En pause" },
    { value: "closed", label: "Clôturé" },
]}
```

**Step 4: Verify**

Run: `pnpm dev:ops`, open a project edit dialog. The budget field should appear.

**Step 5: Commit**

```bash
git add apps/ops/components/project-form.tsx
git commit -m "feat(ops): add budget field to project form with live day estimate"
```

---

### Task 5: Add `BudgetSection` component to project detail page

**Files:**
- Create: `apps/ops/components/budget-section.tsx`
- Modify: `apps/ops/app/(main)/clients/[id]/projects/[pid]/page.tsx`

**Step 1: Create the BudgetSection component**

Create `apps/ops/components/budget-section.tsx`:

```tsx
"use client"

import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis, ReferenceLine } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@blazz/ui/components/ui/chart"
import { type BudgetMetrics, healthColor } from "@/lib/budget"
import { formatCurrency, Currency } from "@/lib/format"

interface BudgetSectionProps {
    metrics: BudgetMetrics
    tjm: number
    weeklyBurnDown: Array<{ week: string; remaining: number; theoretical: number }> | null
}

const chartConfig = {
    remaining: { label: "Reste réel", color: "oklch(0.585 0.22 275)" },
    theoretical: { label: "Théorique", color: "oklch(0.7 0.05 260)" },
} satisfies ChartConfig

export function BudgetSection({ metrics, tjm, weeklyBurnDown }: BudgetSectionProps) {
    const colors = healthColor(metrics.health)
    const clampedPercent = Math.min(metrics.percentUsed, 100)
    const daysRemaining = tjm > 0 ? metrics.remaining / tjm : 0

    return (
        <div className="space-y-4">
            {/* Alert banner */}
            {metrics.health === "over" && (
                <div className={`px-4 py-2.5 rounded-lg text-sm font-medium ${colors.bg} ${colors.text}`}>
                    Budget dépassé de {formatCurrency(Math.abs(metrics.remaining))}
                </div>
            )}
            {metrics.health === "danger" && (
                <div className={`px-4 py-2.5 rounded-lg text-sm font-medium ${colors.bg} ${colors.text}`}>
                    ⚠ {metrics.percentUsed}% du budget consommé
                </div>
            )}
            {metrics.health === "warning" && (
                <div className={`px-4 py-2.5 rounded-lg text-sm font-medium ${colors.bg} ${colors.text}`}>
                    ⚠ {metrics.percentUsed}% du budget consommé
                </div>
            )}

            {/* Progress bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-fg-muted">Budget</span>
                    <span className="text-fg tabular-nums font-medium">
                        {formatCurrency(metrics.revenueConsumed)} / {formatCurrency(metrics.budgetAmount)} ({metrics.percentUsed}%)
                    </span>
                </div>
                <div className="h-2.5 bg-surface-alt rounded-full overflow-hidden border border-edge">
                    <div
                        className={`h-full rounded-full transition-all ${colors.bar}`}
                        style={{ width: `${clampedPercent}%` }}
                    />
                </div>
                <p className="text-xs text-fg-muted tabular-nums">
                    Reste : {formatCurrency(Math.max(0, metrics.remaining))} (~{Math.round(daysRemaining * 10) / 10}j)
                </p>
            </div>

            {/* TJM effectif card */}
            <Card>
                <CardContent className="p-4">
                    <p className="text-xs text-fg-muted mb-1">TJM effectif</p>
                    <div className="flex items-baseline gap-2">
                        <p className={`text-xl font-semibold tabular-nums ${
                            metrics.effectiveTjm !== null && metrics.effectiveTjm >= tjm
                                ? "text-green-600 dark:text-green-400"
                                : "text-red-600 dark:text-red-400"
                        }`}>
                            {metrics.effectiveTjm !== null ? `${metrics.effectiveTjm}€` : "—"}
                        </p>
                        <span className="text-xs text-fg-muted">TJM vendu : {tjm}€</span>
                    </div>
                </CardContent>
            </Card>

            {/* Burn-down sparkline */}
            {weeklyBurnDown && weeklyBurnDown.length >= 2 && (
                <div className="space-y-2">
                    <p className="text-xs text-fg-muted">Burn-down budget</p>
                    <ChartContainer config={chartConfig} className="h-[140px] w-full">
                        <AreaChart data={weeklyBurnDown} margin={{ top: 4, right: 4, bottom: 0, left: 4 }}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis
                                dataKey="week"
                                tickFormatter={(v) => v.slice(5)} // "03-10"
                                tick={{ fontSize: 10 }}
                            />
                            <YAxis hide />
                            <ReferenceLine y={0} stroke="var(--color-fg-muted)" strokeDasharray="3 3" />
                            <ChartTooltip content={<ChartTooltipContent />} />
                            <Area
                                dataKey="theoretical"
                                stroke="var(--color-theoretical)"
                                fill="var(--color-theoretical)"
                                fillOpacity={0.05}
                                strokeDasharray="4 4"
                                type="linear"
                            />
                            <Area
                                dataKey="remaining"
                                stroke="var(--color-remaining)"
                                fill="var(--color-remaining)"
                                fillOpacity={0.15}
                                type="monotone"
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            )}
        </div>
    )
}
```

**Step 2: Integrate into project detail page**

In `apps/ops/app/(main)/clients/[id]/projects/[pid]/page.tsx`:

Add imports at top:
```ts
import { BudgetSection } from "@/components/budget-section"
import { computeBudgetMetrics } from "@/lib/budget"
```

After `const { project, entries, stats } = data` (line 81), compute budget:
```ts
const budgetMetrics = computeBudgetMetrics({
    budgetAmount: project.budgetAmount,
    tjm: project.tjm,
    hoursPerDay: project.hoursPerDay,
    billableMinutes: stats.billableMinutes,
    billableRevenue: stats.billableRevenue,
})
```

After the KPI cards `</div>` (after line 153), insert:
```tsx
{/* Budget section */}
{budgetMetrics && (
    <BudgetSection
        metrics={budgetMetrics}
        tjm={project.tjm}
        weeklyBurnDown={data.weeklyBurnDown ?? null}
    />
)}
```

**Step 3: Verify**

Run `pnpm dev:ops`. Open a project with a `budgetAmount` set. Verify:
- Progress bar renders with correct % and color
- TJM effectif card shows green/red correctly
- Alert banner appears at 70%+ threshold
- Burn-down chart renders if ≥2 weeks of data

**Step 4: Commit**

```bash
git add apps/ops/components/budget-section.tsx apps/ops/app/\(main\)/clients/\[id\]/projects/\[pid\]/page.tsx
git commit -m "feat(ops): add budget section to project detail page"
```

---

### Task 6: Add budget health indicator to client project list

**Files:**
- Modify: `apps/ops/app/(main)/clients/[id]/page.tsx`
- Modify: `apps/ops/convex/projects.ts` (listByClient query)

**Step 1: Enrich `listByClient` to include budget consumption data**

In `apps/ops/convex/projects.ts`, update `listByClient` to also fetch billable entry totals per project:

```ts
export const listByClient = query({
    args: { clientId: v.id("clients") },
    handler: async (ctx, { clientId }) => {
        const projects = await ctx.db
            .query("projects")
            .withIndex("by_client", (q) => q.eq("clientId", clientId))
            .collect()

        // Attach billable totals for budget health indicator
        return Promise.all(
            projects.map(async (project) => {
                if (!project.budgetAmount) return { ...project, budgetPercent: null }
                const entries = await ctx.db
                    .query("timeEntries")
                    .withIndex("by_project", (q) => q.eq("projectId", project._id))
                    .collect()
                const billableRevenue = entries
                    .filter((e) => e.billable)
                    .reduce((s, e) => s + (e.minutes / 60) * e.hourlyRate, 0)
                const daysSold = project.tjm > 0 ? project.budgetAmount / project.tjm : 0
                const daysConsumed =
                    project.hoursPerDay > 0
                        ? entries.filter((e) => e.billable).reduce((s, e) => s + e.minutes, 0) /
                          (project.hoursPerDay * 60)
                        : 0
                const percentUsed = daysSold > 0 ? (daysConsumed / daysSold) * 100 : 0
                return { ...project, budgetPercent: Math.round(percentUsed * 10) / 10 }
            })
        )
    },
})
```

**Step 2: Add budget dot to project row in client detail page**

In `apps/ops/app/(main)/clients/[id]/page.tsx`, in the project row (line ~170), add a budget health dot before the status dot:

```tsx
{project.budgetPercent !== null && (
    <span
        className={`inline-block size-2 rounded-full ${
            project.budgetPercent >= 90
                ? "bg-red-500"
                : project.budgetPercent >= 70
                  ? "bg-amber-500"
                  : "bg-green-500"
        }`}
        title={`Budget : ${project.budgetPercent}%`}
    />
)}
```

Insert this inside the `<div className="flex items-center gap-3 shrink-0 ml-4">` block, before the status span (line ~177).

**Step 3: Verify**

Run `pnpm dev:ops`. Open a client page. Projects with budgets should show colored dots.

**Step 4: Commit**

```bash
git add apps/ops/convex/projects.ts apps/ops/app/\(main\)/clients/\[id\]/page.tsx
git commit -m "feat(ops): add budget health indicator to client project list"
```

---

### Task 7: Install recharts in ops app

**Files:**
- Modify: `apps/ops/package.json`

**Note:** Check first if recharts is already available transitively via `@blazz/ui`. If the chart components from `@blazz/ui` re-export recharts, we only need to import from `@blazz/ui/components/ui/chart`. If recharts is needed directly (for `AreaChart`, `Area`, etc.), install it:

**Step 1: Check and install if needed**

```bash
cd /Users/jonathanruas/Development/blazz-ui-app && pnpm --filter ops add recharts
```

**Step 2: Commit**

```bash
git add apps/ops/package.json pnpm-lock.yaml
git commit -m "chore(ops): add recharts dependency for budget burn-down chart"
```

> **Important:** This task should be done BEFORE Task 5 so the imports work.

---

## Execution Order

1. **Task 7** — Install recharts (prerequisite for Task 5)
2. **Task 1** — Schema + mutations
3. **Task 2** — Budget helpers (`lib/budget.ts`)
4. **Task 3** — Enrich `getWithStats` query
5. **Task 4** — ProjectForm budget field
6. **Task 5** — BudgetSection component + integration
7. **Task 6** — Budget health dots in project list

## Summary of files touched

| Action | File |
|--------|------|
| Modify | `apps/ops/convex/schema.ts` |
| Modify | `apps/ops/convex/projects.ts` |
| Create | `apps/ops/lib/budget.ts` |
| Modify | `apps/ops/components/project-form.tsx` |
| Create | `apps/ops/components/budget-section.tsx` |
| Modify | `apps/ops/app/(main)/clients/[id]/projects/[pid]/page.tsx` |
| Modify | `apps/ops/app/(main)/clients/[id]/page.tsx` |
| Modify | `apps/ops/package.json` (if recharts needed) |
