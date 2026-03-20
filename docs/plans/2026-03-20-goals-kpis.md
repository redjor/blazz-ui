# Goals & KPIs — Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a goals/KPIs system to the ops app — annual targets with monthly redistribution, dashboard summary, and dedicated `/goals` page.

**Architecture:** One Convex table `goalPlans` (one doc per user per year). A pure `resolveMonthlyTargets()` function handles redistribution logic (shared server + client). A `goals.dashboard` query aggregates targets + actuals from existing `timeEntries`. UI = dashboard progress card + `/goals` page with charts + config dialog.

**Tech Stack:** Convex (schema, queries, mutations), React 19, @blazz/ui + @blazz/pro components, Recharts (already in deps), react-hook-form + zod, date-fns.

**Design doc:** `docs/plans/2026-03-20-goals-kpis-design.md`

---

### Task 1: Schema — Add `goalPlans` table

**Files:**
- Modify: `apps/ops/convex/schema.ts`

**Step 1: Add the table definition**

Add after the `settings` table (around line 250):

```ts
goalPlans: defineTable({
	userId: v.string(),
	year: v.number(),
	revenue: v.object({
		annual: v.number(),
		overrides: v.record(v.string(), v.number()),
	}),
	days: v.object({
		annual: v.number(),
		overrides: v.record(v.string(), v.number()),
	}),
	tjm: v.object({
		target: v.number(),
	}),
	createdAt: v.number(),
	updatedAt: v.number(),
})
	.index("by_user", ["userId"])
	.index("by_user_year", ["userId", "year"]),
```

**Step 2: Verify schema compiles**

Run: `cd apps/ops && npx convex dev --once --typecheck disable`
Expected: Schema pushed successfully.

**Step 3: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add goalPlans table to schema"
```

---

### Task 2: Shared logic — `resolveMonthlyTargets` pure function

**Files:**
- Create: `apps/ops/lib/goals.ts`
- Create: `apps/ops/lib/goals.test.ts`

**Step 1: Write the tests**

```ts
import { describe, expect, it } from "vitest"
import { resolveMonthlyTargets } from "./goals"

describe("resolveMonthlyTargets", () => {
	it("distributes evenly with no overrides", () => {
		const result = resolveMonthlyTargets(120000, {})
		expect(result).toHaveLength(12)
		expect(result.every((v) => v === 10000)).toBe(true)
	})

	it("applies overrides and redistributes remainder", () => {
		const result = resolveMonthlyTargets(120000, { "8": 0, "12": 5000 })
		// reste = 120000 - 0 - 5000 = 115000, 10 mois auto = 11500
		expect(result[7]).toBe(0) // août (index 7)
		expect(result[11]).toBe(5000) // décembre (index 11)
		expect(result[0]).toBe(11500) // janvier
		expect(result.reduce((a, b) => a + b, 0)).toBe(120000)
	})

	it("handles all months overridden", () => {
		const overrides: Record<string, number> = {}
		for (let i = 1; i <= 12; i++) overrides[String(i)] = 10000
		const result = resolveMonthlyTargets(120000, overrides)
		expect(result.every((v) => v === 10000)).toBe(true)
	})

	it("handles zero annual", () => {
		const result = resolveMonthlyTargets(0, {})
		expect(result.every((v) => v === 0)).toBe(true)
	})

	it("rounds to avoid floating point issues", () => {
		const result = resolveMonthlyTargets(100000, {})
		// 100000 / 12 = 8333.33... → should round and adjust
		const sum = result.reduce((a, b) => a + b, 0)
		expect(sum).toBe(100000)
		expect(result.every((v) => Number.isInteger(v))).toBe(true)
	})
})
```

**Step 2: Run tests to verify they fail**

Run: `cd apps/ops && npx vitest run lib/goals.test.ts`
Expected: FAIL — module not found.

**Step 3: Implement the function**

```ts
/**
 * Resolve monthly targets from an annual goal + per-month overrides.
 * Overrides use 1-based month keys ("1" = Jan, "12" = Dec).
 * Non-overridden months share the remainder equally.
 * Returns an array of 12 integers (index 0 = Jan).
 */
export function resolveMonthlyTargets(
	annual: number,
	overrides: Record<string, number>
): number[] {
	const result: number[] = new Array(12).fill(0)
	const autoMonths: number[] = []
	let overrideSum = 0

	for (let i = 0; i < 12; i++) {
		const key = String(i + 1)
		if (key in overrides) {
			result[i] = overrides[key]
			overrideSum += overrides[key]
		} else {
			autoMonths.push(i)
		}
	}

	if (autoMonths.length === 0) return result

	const remainder = annual - overrideSum
	const base = Math.floor(remainder / autoMonths.length)
	let leftover = remainder - base * autoMonths.length

	for (const idx of autoMonths) {
		result[idx] = base + (leftover > 0 ? 1 : 0)
		if (leftover > 0) leftover--
	}

	return result
}

/** Quarter index (0-3) for a given month index (0-11) */
export function quarterOf(monthIndex: number): number {
	return Math.floor(monthIndex / 3)
}

/** Label for a quarter: "Q1", "Q2", etc. */
export function quarterLabel(quarterIndex: number): string {
	return `Q${quarterIndex + 1}`
}
```

**Step 4: Run tests to verify they pass**

Run: `cd apps/ops && npx vitest run lib/goals.test.ts`
Expected: All 5 tests PASS.

**Step 5: Commit**

```bash
git add apps/ops/lib/goals.ts apps/ops/lib/goals.test.ts
git commit -m "feat(ops): add resolveMonthlyTargets pure function with tests"
```

---

### Task 3: Convex functions — `goals.ts`

**Files:**
- Create: `apps/ops/convex/goals.ts`

**Step 1: Implement query `get` and mutation `save`**

```ts
import { ConvexError, v } from "convex/values"
import { mutation, query } from "./_generated/server"
import { requireAuth } from "./lib/auth"

export const get = query({
	args: { year: v.number() },
	handler: async (ctx, { year }) => {
		const { userId } = await requireAuth(ctx)
		const plan = await ctx.db
			.query("goalPlans")
			.withIndex("by_user_year", (q) => q.eq("userId", userId).eq("year", year))
			.unique()
		return plan ?? null
	},
})

export const save = mutation({
	args: {
		year: v.number(),
		revenue: v.object({
			annual: v.number(),
			overrides: v.record(v.string(), v.number()),
		}),
		days: v.object({
			annual: v.number(),
			overrides: v.record(v.string(), v.number()),
		}),
		tjm: v.object({ target: v.number() }),
	},
	handler: async (ctx, { year, revenue, days, tjm }) => {
		const { userId } = await requireAuth(ctx)
		const existing = await ctx.db
			.query("goalPlans")
			.withIndex("by_user_year", (q) => q.eq("userId", userId).eq("year", year))
			.unique()

		if (existing) {
			await ctx.db.patch(existing._id, { revenue, days, tjm, updatedAt: Date.now() })
			return existing._id
		}
		return ctx.db.insert("goalPlans", {
			userId,
			year,
			revenue,
			days,
			tjm,
			createdAt: Date.now(),
			updatedAt: Date.now(),
		})
	},
})
```

**Step 2: Implement query `dashboard`**

```ts
export const dashboard = query({
	args: { year: v.number() },
	handler: async (ctx, { year }) => {
		const { userId } = await requireAuth(ctx)

		const plan = await ctx.db
			.query("goalPlans")
			.withIndex("by_user_year", (q) => q.eq("userId", userId).eq("year", year))
			.unique()

		if (!plan) return null

		// Fetch all billable time entries for the year
		const startDate = `${year}-01-01`
		const endDate = `${year}-12-31`
		const allEntries = await ctx.db
			.query("timeEntries")
			.withIndex("by_user", (q) => q.eq("userId", userId))
			.collect()

		const yearEntries = allEntries.filter(
			(e) => e.billable && e.date >= startDate && e.date <= endDate
		)

		// Aggregate actuals per month
		const monthlyRevenue = new Array(12).fill(0)
		const monthlyMinutes = new Array(12).fill(0)
		for (const e of yearEntries) {
			const monthIdx = Number.parseInt(e.date.slice(5, 7), 10) - 1
			monthlyRevenue[monthIdx] += (e.minutes / 60) * e.hourlyRate
			monthlyMinutes[monthIdx] += e.minutes
		}

		// Convert minutes to days (using 7h standard or per-project hoursPerDay — simplified to 7h)
		const monthlyDays = monthlyMinutes.map((m) => Math.round((m / 60 / 7) * 10) / 10)

		// Resolve targets
		const revenueTargets = resolveTargets(plan.revenue.annual, plan.revenue.overrides)
		const dayTargets = resolveTargets(plan.days.annual, plan.days.overrides)

		const now = new Date()
		const currentMonth = now.getFullYear() === year ? now.getMonth() : 11
		const currentQuarter = Math.floor(currentMonth / 3)

		// Helpers
		function sumRange(arr: number[], from: number, to: number) {
			return arr.slice(from, to + 1).reduce((a, b) => a + b, 0)
		}
		function pct(actual: number, target: number) {
			return target === 0 ? 0 : Math.round((actual / target) * 100)
		}

		const qStart = currentQuarter * 3
		const qEnd = qStart + 2

		const totalRevenue = sumRange(monthlyRevenue, 0, 11)
		const totalDays = sumRange(monthlyDays, 0, 11)

		const result = {
			year,
			revenue: {
				annual: {
					target: plan.revenue.annual,
					actual: Math.round(totalRevenue),
					percent: pct(totalRevenue, plan.revenue.annual),
				},
				quarter: {
					target: sumRange(revenueTargets, qStart, qEnd),
					actual: Math.round(sumRange(monthlyRevenue, qStart, qEnd)),
					percent: pct(sumRange(monthlyRevenue, qStart, qEnd), sumRange(revenueTargets, qStart, qEnd)),
					label: `Q${currentQuarter + 1}`,
				},
				month: {
					target: revenueTargets[currentMonth],
					actual: Math.round(monthlyRevenue[currentMonth]),
					percent: pct(monthlyRevenue[currentMonth], revenueTargets[currentMonth]),
					label: new Date(year, currentMonth).toLocaleDateString("fr-FR", { month: "long" }),
				},
				monthlyTargets: revenueTargets,
				monthlyActuals: monthlyRevenue.map(Math.round),
			},
			days: {
				annual: {
					target: plan.days.annual,
					actual: Math.round(sumRange(monthlyDays, 0, 11) * 10) / 10,
					percent: pct(sumRange(monthlyDays, 0, 11), plan.days.annual),
				},
				quarter: {
					target: sumRange(dayTargets, qStart, qEnd),
					actual: Math.round(sumRange(monthlyDays, qStart, qEnd) * 10) / 10,
					percent: pct(sumRange(monthlyDays, qStart, qEnd), sumRange(dayTargets, qStart, qEnd)),
					label: `Q${currentQuarter + 1}`,
				},
				month: {
					target: dayTargets[currentMonth],
					actual: Math.round(monthlyDays[currentMonth] * 10) / 10,
					percent: pct(monthlyDays[currentMonth], dayTargets[currentMonth]),
					label: new Date(year, currentMonth).toLocaleDateString("fr-FR", { month: "long" }),
				},
				monthlyTargets: dayTargets,
				monthlyActuals: monthlyDays,
			},
			tjm: {
				target: plan.tjm.target,
				actual:
					totalDays > 0 ? Math.round(totalRevenue / totalDays) : 0,
				trend:
					totalDays > 0
						? Math.round(((totalRevenue / totalDays - plan.tjm.target) / plan.tjm.target) * 1000) / 10
						: 0,
			},
		}
		return result
	},
})

// Inline resolve — same logic as lib/goals.ts but available server-side
function resolveTargets(annual: number, overrides: Record<string, number>): number[] {
	const result: number[] = new Array(12).fill(0)
	const autoMonths: number[] = []
	let overrideSum = 0
	for (let i = 0; i < 12; i++) {
		const key = String(i + 1)
		if (key in overrides) {
			result[i] = overrides[key]
			overrideSum += overrides[key]
		} else {
			autoMonths.push(i)
		}
	}
	if (autoMonths.length === 0) return result
	const remainder = annual - overrideSum
	const base = Math.floor(remainder / autoMonths.length)
	let leftover = remainder - base * autoMonths.length
	for (const idx of autoMonths) {
		result[idx] = base + (leftover > 0 ? 1 : 0)
		if (leftover > 0) leftover--
	}
	return result
}
```

Note: `resolveTargets` is duplicated here because Convex functions can't import from `lib/` outside the `convex/` directory. The client-side `lib/goals.ts` version is used for the dialog preview.

**Step 2: Verify it compiles**

Run: `cd apps/ops && npx convex dev --once --typecheck disable`
Expected: Functions pushed successfully.

**Step 3: Commit**

```bash
git add apps/ops/convex/goals.ts
git commit -m "feat(ops): add goals Convex functions (get, save, dashboard)"
```

---

### Task 4: Feature flag — Add `goals` flag

**Files:**
- Modify: `apps/ops/lib/features.ts`

**Step 1: Add the flag and route mapping**

In `defaults` object, add after `finances: true`:
```ts
goals: true,
```

In `routeMap` object, add after `"/finances": "finances"`:
```ts
"/goals": "goals",
```

**Step 2: Commit**

```bash
git add apps/ops/lib/features.ts
git commit -m "feat(ops): add goals feature flag"
```

---

### Task 5: Navigation — Add Goals to sidebar

**Files:**
- Modify: `apps/ops/components/ops-frame.tsx`

**Step 1: Add import for Target icon**

Add `Target` to the lucide-react import line.

**Step 2: Add nav item**

In `allNavGroups`, in the "Activité" group, add after the Finances item (line ~63):
```ts
{ title: "Objectifs", url: "/goals", icon: Target, flag: "goals" },
```

**Step 3: Commit**

```bash
git add apps/ops/components/ops-frame.tsx
git commit -m "feat(ops): add Goals to sidebar navigation"
```

---

### Task 6: Dashboard — Goals summary card

**Files:**
- Modify: `apps/ops/app/(main)/_client.tsx`

**Step 1: Add the GoalsSummary component**

Add a `GoalsSummaryCard` component in the same file. It calls `useQuery(api.goals.dashboard, { year })` and renders 3 progress bars (revenue, days, TJM) inside a Card.

Progress bar color logic:
- `percent >= 90` → `bg-positive`
- `percent >= 70` → `bg-caution`
- `percent < 70` → `bg-critical`

Structure:
```tsx
function GoalsSummaryCard() {
	const year = new Date().getFullYear()
	const data = useQuery(api.goals.dashboard, { year })

	if (data === undefined) return <GoalsSummarySkeleton />
	if (data === null) return null // no goals set — don't show

	return (
		<BlockStack gap="200">
			<InlineStack align="space-between" blockAlign="center">
				<span className="text-xs font-medium text-fg-muted uppercase tracking-wider">
					Objectifs {data.revenue.month.label}
				</span>
				<Link href="/goals" className="text-xs text-brand hover:underline">
					Voir détails →
				</Link>
			</InlineStack>
			<Card>
				<CardContent className="p-4">
					<BlockStack gap="400">
						<ProgressRow
							label="Revenu"
							actual={formatCurrency(data.revenue.month.actual)}
							target={formatCurrency(data.revenue.month.target)}
							percent={data.revenue.month.percent}
						/>
						<ProgressRow
							label="Jours"
							actual={`${data.days.month.actual}j`}
							target={`${data.days.month.target}j`}
							percent={data.days.month.percent}
						/>
						<ProgressRow
							label="TJM moyen"
							actual={formatCurrency(data.tjm.actual)}
							target={`cible ${formatCurrency(data.tjm.target)}`}
							percent={data.tjm.target > 0 ? Math.round((data.tjm.actual / data.tjm.target) * 100) : 0}
						/>
						<InlineStack align="space-between" className="pt-1 border-t border-edge">
							<span className="text-xs text-fg-muted">
								{data.revenue.quarter.label} : {formatCurrency(data.revenue.quarter.actual)} / {formatCurrency(data.revenue.quarter.target)} ({data.revenue.quarter.percent}%)
							</span>
							<span className="text-xs text-fg-muted">
								{data.year} : {data.revenue.annual.percent}%
							</span>
						</InlineStack>
					</BlockStack>
				</CardContent>
			</Card>
		</BlockStack>
	)
}

function ProgressRow({ label, actual, target, percent }: {
	label: string; actual: string; target: string; percent: number
}) {
	const color = percent >= 90 ? "bg-positive" : percent >= 70 ? "bg-caution" : "bg-critical"
	return (
		<BlockStack gap="100">
			<InlineStack align="space-between" blockAlign="center">
				<span className="text-sm text-fg-secondary">{label}</span>
				<span className="text-sm tabular-nums">
					{actual} <span className="text-fg-muted">/ {target}</span>
					<span className="text-fg-muted ml-2">{percent}%</span>
				</span>
			</InlineStack>
			<div className="h-1.5 rounded-full bg-surface-3">
				<div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${Math.min(percent, 100)}%` }} />
			</div>
		</BlockStack>
	)
}
```

**Step 2: Place `<GoalsSummaryCard />` in the dashboard**

Insert it after the pipeline financier section (after the closing `</BlockStack>` at ~line 210), before the active projects section.

**Step 3: Verify visually**

Run: `pnpm dev:ops` — open dashboard. If no goals set, nothing shows (null → return null). If goals exist, the card appears.

**Step 4: Commit**

```bash
git add apps/ops/app/(main)/_client.tsx
git commit -m "feat(ops): add goals summary card to dashboard"
```

---

### Task 7: Goals page — Route + empty state

**Files:**
- Create: `apps/ops/app/(main)/goals/page.tsx`
- Create: `apps/ops/app/(main)/goals/_client.tsx`

**Step 1: Create the server page**

```tsx
// page.tsx
import type { Metadata } from "next"
import GoalsPageClient from "./_client"

export const metadata: Metadata = {
	title: "Objectifs",
}

export default function GoalsPage() {
	return <GoalsPageClient />
}
```

**Step 2: Create the client page with empty state**

```tsx
// _client.tsx
"use client"

import { useAppTopBar } from "@blazz/pro/components/blocks/app-frame"
import { PageHeader } from "@blazz/pro/components/blocks/page-header"
import { BlockStack } from "@blazz/ui/components/ui/block-stack"
import { Box } from "@blazz/ui/components/ui/box"
import { Button } from "@blazz/ui/components/ui/button"
import { Skeleton } from "@blazz/ui/components/ui/skeleton"
import { useQuery } from "convex/react"
import { Target } from "lucide-react"
import { useState } from "react"
import { api } from "@/convex/_generated/api"
import { GoalsConfigDialog } from "./_config-dialog"

export default function GoalsPageClient() {
	const year = new Date().getFullYear()
	const data = useQuery(api.goals.dashboard, { year })
	const plan = useQuery(api.goals.get, { year })
	const [configOpen, setConfigOpen] = useState(false)

	useAppTopBar([{ label: "Objectifs" }])

	// Loading
	if (data === undefined || plan === undefined) {
		return (
			<BlockStack gap="600" className="p-6">
				<PageHeader title={`Objectifs ${year}`} />
				<Skeleton className="h-24 w-full" />
				<Skeleton className="h-64 w-full" />
			</BlockStack>
		)
	}

	// Empty state
	if (data === null) {
		return (
			<BlockStack gap="600" className="p-6">
				<PageHeader title={`Objectifs ${year}`} />
				<Box padding="8" className="text-center">
					<BlockStack gap="300" className="items-center">
						<Target className="size-12 text-fg-muted" />
						<span className="text-base font-medium">Pas encore d'objectifs</span>
						<span className="text-sm text-fg-muted">
							Définissez vos cibles pour {year}
						</span>
						<Button onClick={() => setConfigOpen(true)} className="mt-2">
							Définir mes objectifs
						</Button>
					</BlockStack>
				</Box>
				<GoalsConfigDialog
					open={configOpen}
					onOpenChange={setConfigOpen}
					year={year}
					plan={plan}
				/>
			</BlockStack>
		)
	}

	// Success state → Task 9
	return (
		<BlockStack gap="600" className="p-6">
			<PageHeader
				title={`Objectifs ${year}`}
				actions={<Button variant="outline" onClick={() => setConfigOpen(true)}>Modifier les cibles</Button>}
			/>
			{/* StatsGrid + Charts + Table → Task 9 */}
			<GoalsConfigDialog
				open={configOpen}
				onOpenChange={setConfigOpen}
				year={year}
				plan={plan}
			/>
		</BlockStack>
	)
}
```

**Step 3: Create a stub config dialog**

Create `apps/ops/app/(main)/goals/_config-dialog.tsx` as a minimal placeholder:

```tsx
"use client"

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@blazz/ui/components/ui/dialog"

interface GoalsConfigDialogProps {
	open: boolean
	onOpenChange: (open: boolean) => void
	year: number
	plan: any
}

export function GoalsConfigDialog({ open, onOpenChange, year }: GoalsConfigDialogProps) {
	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>Objectifs {year}</DialogTitle>
				</DialogHeader>
				<p className="text-sm text-fg-muted">Configuration — à implémenter (Task 8)</p>
			</DialogContent>
		</Dialog>
	)
}
```

**Step 4: Verify**

Run: `pnpm dev:ops` — navigate to `/goals`. Should show empty state with CTA.

**Step 5: Commit**

```bash
git add apps/ops/app/(main)/goals/
git commit -m "feat(ops): add /goals page with empty state and stub dialog"
```

---

### Task 8: Config dialog — Full form

**Files:**
- Modify: `apps/ops/app/(main)/goals/_config-dialog.tsx`

**Step 1: Implement the full dialog with react-hook-form + zod**

The dialog contains:
- Revenue section: annual input + 12-cell grid for overrides
- Days section: annual input + 12-cell grid for overrides
- TJM section: target input
- Each month cell shows placeholder with auto-calculated value (via `resolveMonthlyTargets`)
- Empty field = auto, filled = override
- Footer: Annuler + Sauvegarder

Key implementation details:
- Use `react-hook-form` with `zodResolver`
- Schema: `{ revenueAnnual: number, revenueOverrides: Record<string, string>, daysAnnual: number, daysOverrides: Record<string, string>, tjmTarget: number }`
- Override fields are strings (empty = auto, number = override)
- On submit: filter out empty overrides, call `api.goals.save` mutation
- Preview: `useMemo` recalculates resolved targets as user types (live feedback)
- Month labels in French abbreviated: "Jan", "Fév", "Mar", etc.

Form structure:
```
<Dialog>
  <form onSubmit={handleSubmit}>
    <DialogHeader>Objectifs {year}</DialogHeader>
    <DialogBody className="max-h-[60vh] overflow-y-auto">
      <BlockStack gap="600">
        {/* Revenue section */}
        <BlockStack gap="300">
          <h3>Revenu</h3>
          <FormField label="Objectif annuel" ...input />
          <InlineGrid columns={4} gap="200">
            {months.map(m => <Input key={m} placeholder={autoValue} />)}
          </InlineGrid>
        </BlockStack>
        {/* Days section — same pattern */}
        {/* TJM section — single input */}
      </BlockStack>
    </DialogBody>
    <DialogFooter>
      <Button type="button" variant="outline" onClick={close}>Annuler</Button>
      <Button type="submit">Sauvegarder</Button>
    </DialogFooter>
  </form>
</Dialog>
```

**Step 2: Test manually**

Run: `pnpm dev:ops` → `/goals` → click CTA → fill form → save → verify data appears.

**Step 3: Commit**

```bash
git add apps/ops/app/(main)/goals/_config-dialog.tsx
git commit -m "feat(ops): implement goals config dialog with live preview"
```

---

### Task 9: Goals page — StatsGrid + Charts + Quarterly table

**Files:**
- Modify: `apps/ops/app/(main)/goals/_client.tsx`

**Step 1: Add StatsGrid**

Replace the `{/* StatsGrid + Charts + Table → Task 9 */}` comment with:

```tsx
<StatsGrid
	columns={4}
	stats={[
		{
			label: "CA Annuel",
			value: formatCurrency(data.revenue.annual.actual),
			description: `/ ${formatCurrency(data.revenue.annual.target)}`,
			trend: data.revenue.annual.percent - 100,
		},
		{
			label: `CA ${data.revenue.month.label}`,
			value: formatCurrency(data.revenue.month.actual),
			description: `/ ${formatCurrency(data.revenue.month.target)}`,
			trend: data.revenue.month.percent - 100,
		},
		{
			label: "Jours",
			value: `${data.days.month.actual}j`,
			description: `/ ${data.days.month.target}j`,
			trend: data.days.month.percent - 100,
		},
		{
			label: "TJM moyen",
			value: formatCurrency(data.tjm.actual),
			description: `cible ${formatCurrency(data.tjm.target)}`,
			trend: data.tjm.trend,
		},
	]}
/>
```

**Step 2: Add bar charts (revenue + days)**

Use Recharts `BarChart` with grouped bars (target in opacity-20, actual in full color).

```tsx
import {
	BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts"

const MONTHS_FR = ["Jan", "Fév", "Mar", "Avr", "Mai", "Jun", "Jul", "Aoû", "Sep", "Oct", "Nov", "Déc"]

const revenueChartData = MONTHS_FR.map((name, i) => ({
	name,
	cible: data.revenue.monthlyTargets[i],
	réel: data.revenue.monthlyActuals[i],
}))

const daysChartData = MONTHS_FR.map((name, i) => ({
	name,
	cible: data.days.monthlyTargets[i],
	réel: data.days.monthlyActuals[i],
}))
```

Render two charts side by side in a `Grid` (2 × 6 columns), each wrapped in a `Card`.

**Step 3: Add quarterly recap table**

Simple HTML table with 4 quarter rows + 1 total row. Columns: Période | Cible | Réel | % | Écart.

Compute quarter aggregates from `monthlyTargets` and `monthlyActuals` arrays using `sumRange`.

**Step 4: Verify visually**

Run: `pnpm dev:ops` → `/goals` → verify StatsGrid, charts, and table render correctly.

**Step 5: Commit**

```bash
git add apps/ops/app/(main)/goals/_client.tsx
git commit -m "feat(ops): add StatsGrid, charts, and quarterly table to goals page"
```

---

### Task 10: Polish & verify

**Files:**
- All modified files

**Step 1: Run linter**

Run: `cd /Users/jonathanruas/Development/blazz-ui-app && pnpm lint`
Expected: No errors.

**Step 2: Run tests**

Run: `cd apps/ops && npx vitest run`
Expected: All tests pass (including new goals.test.ts).

**Step 3: Manual QA checklist**

- [ ] Dashboard: no goals → no card shown
- [ ] Dashboard: with goals → summary card with 3 progress bars
- [ ] Dashboard: "Voir détails →" navigates to `/goals`
- [ ] `/goals`: no goals → empty state with CTA
- [ ] `/goals`: CTA opens config dialog
- [ ] Config dialog: fill annual targets → save → page refreshes with data
- [ ] Config dialog: set override for a month → auto values recalculate live
- [ ] Config dialog: clear override → reverts to auto
- [ ] `/goals`: StatsGrid shows 4 KPIs
- [ ] `/goals`: Charts show target vs actual bars
- [ ] `/goals`: Quarterly table shows correct aggregates
- [ ] Sidebar: "Objectifs" link appears after "Finances"
- [ ] Loading states: skeletons on dashboard card and goals page
- [ ] 4 states: loading, empty, error (Convex handles), success

**Step 4: Final commit if any fixes**

```bash
git add -A
git commit -m "fix(ops): polish goals feature"
```
