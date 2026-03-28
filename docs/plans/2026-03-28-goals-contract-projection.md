# Goals — Contract-Aware Projection Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Integrate active contracts into the Goals projection so future months use guaranteed contract revenue instead of extrapolating past pace.

**Architecture:** Extract a shared `contractMonthlyRevenue()` helper into `convex/lib/contracts.ts`. Modify `goals.dashboard` query to fetch active contracts and compute a hybrid projection (past=real, current=extrapolation, future=max(contract, target)). Add a "Sécurisé" stat card to the Goals UI.

**Tech Stack:** Convex (queries), React, @blazz/pro StatsGrid, lucide-react

---

### Task 1: Extract contractMonthlyRevenue helper

**Files:**
- Create: `apps/ops/convex/lib/contracts.ts`

**Step 1: Create the shared helper**

```ts
import type { Doc } from "../_generated/dataModel"

type Contract = Doc<"contracts">
type Project = { tjm: number }

/**
 * Compute the monthly revenue (in euros, NOT cents) for a contract in a given yearMonth.
 * Returns 0 if the contract is not active during that month.
 */
export function contractMonthlyRevenue(
	contract: Contract,
	project: Project,
	yearMonth: string
): number {
	// Check contract covers this month
	const cStart = contract.startDate.slice(0, 7)
	const cEnd = contract.endDate.slice(0, 7)
	if (yearMonth < cStart || yearMonth > cEnd) return 0

	if (contract.type === "tma" && contract.daysPerMonth) {
		return contract.daysPerMonth * project.tjm
	}

	if (contract.type === "regie") {
		return 20 * project.tjm
	}

	if (contract.type === "forfait" && contract.budgetAmount) {
		const startDate = new Date(contract.startDate)
		const endDate = new Date(contract.endDate)
		const totalMonths =
			(endDate.getFullYear() - startDate.getFullYear()) * 12 +
			(endDate.getMonth() - startDate.getMonth()) + 1
		if (totalMonths > 0) {
			return contract.budgetAmount / totalMonths
		}
	}

	return 0
}
```

**Step 2: Commit**

```bash
git add apps/ops/convex/lib/contracts.ts
git commit -m "feat(ops): extract contractMonthlyRevenue shared helper"
```

---

### Task 2: Refactor treasury.forecast to use the shared helper

**Files:**
- Modify: `apps/ops/convex/treasury.ts` (lines 199-227 — the contract revenue loop inside `forecast`)

**Step 1: Import the helper at the top of treasury.ts**

Add after the existing imports:

```ts
import { contractMonthlyRevenue } from "./lib/contracts"
```

**Step 2: Replace the inline contract revenue calculation**

Replace the contract loop body (lines 201-227) with:

```ts
			for (const contract of contracts) {
				const project = projectMap.get(contract.projectId)
				if (!project) continue
				revenueCents += Math.round(contractMonthlyRevenue(contract, project, yearMonth) * 100)
			}
```

**Step 3: Verify the app still works**

Run: `cd apps/ops && pnpm build`
Expected: Build succeeds, no type errors.

**Step 4: Commit**

```bash
git add apps/ops/convex/treasury.ts
git commit -m "refactor(ops): use shared contractMonthlyRevenue in treasury forecast"
```

---

### Task 3: Add contract-aware projection to goals.dashboard

**Files:**
- Modify: `apps/ops/convex/goals.ts` (query `dashboard`, lines 74-235)

**Step 1: Add imports**

At the top of `goals.ts`, add:

```ts
import { contractMonthlyRevenue } from "./lib/contracts"
```

**Step 2: Fetch active contracts and their projects**

Inside the `dashboard` handler, after fetching `yearEntries` (after line 96), add:

```ts
		// Fetch active contracts for revenue projection
		const contracts = await ctx.db
			.query("contracts")
			.withIndex("by_user_status", (q) => q.eq("userId", userId).eq("status", "active"))
			.collect()

		const contractProjects = await Promise.all(
			contracts.map((c) => ctx.db.get(c.projectId))
		)
		const projectMap = new Map(
			contractProjects.filter(Boolean).map((p) => [p!._id, p!])
		)
```

**Step 3: Compute monthly contract revenue breakdown**

After the `projectMap`, add:

```ts
		// Compute contract revenue per month
		const monthlyContractRevenue = new Array(12).fill(0) as number[]
		for (let i = 0; i < 12; i++) {
			const ym = `${year}-${String(i + 1).padStart(2, "0")}`
			for (const contract of contracts) {
				const project = projectMap.get(contract.projectId)
				if (!project) continue
				monthlyContractRevenue[i] += contractMonthlyRevenue(contract, project, ym)
			}
		}

		const securedAnnual = Math.round(monthlyContractRevenue.reduce((a, b) => a + b, 0))
```

**Step 4: Replace the end-of-year projection logic**

Replace the current projection calculation (lines 141-158, from `// End-of-year projection` to `projectedYearDays`) with:

```ts
		// End-of-year projection (hybrid: real + current extrapolation + future max(contract, target))
		let projectedYearRevenue = 0
		let projectedYearDays = 0

		for (let i = 0; i < 12; i++) {
			if (!isCurrentYear) {
				// Past year: just use actuals
				projectedYearRevenue += monthlyRevenue[i]
				projectedYearDays += monthlyDays[i]
			} else if (i < currentMonth) {
				// Past month: actual
				projectedYearRevenue += monthlyRevenue[i]
				projectedYearDays += monthlyDays[i]
			} else if (i === currentMonth) {
				// Current month: extrapolation from pace
				projectedYearRevenue += projectedMonthRevenue
				projectedYearDays += projectedMonthDays
			} else {
				// Future month: max(contract revenue, target from goalPlan)
				projectedYearRevenue += Math.max(monthlyContractRevenue[i], revenueTargets[i])
				projectedYearDays += dayTargets[i]
			}
		}

		projectedYearRevenue = Math.round(projectedYearRevenue)
		projectedYearDays = Math.round(projectedYearDays * 10) / 10
```

**Step 5: Add `secured` to the return object**

Inside the return statement, after the `tjm` block, add:

```ts
			secured: {
				annual: securedAnnual,
				percent: pct(securedAnnual, plan.revenue.annual),
				monthlyBreakdown: monthlyContractRevenue.map(Math.round),
			},
```

**Step 6: Verify build**

Run: `cd apps/ops && pnpm build`
Expected: Build succeeds.

**Step 7: Commit**

```bash
git add apps/ops/convex/goals.ts
git commit -m "feat(ops): integrate contracts into goals hybrid projection"
```

---

### Task 4: Add "Sécurisé" stat card to Goals UI

**Files:**
- Modify: `apps/ops/app/(main)/goals/_client.tsx`

**Step 1: Add ShieldCheck import**

Update the lucide-react import (line 15) to include `ShieldCheck`:

```ts
import { Banknote, Calendar, Clock, ShieldCheck, Target, TrendingDown, TrendingUp } from "lucide-react"
```

**Step 2: Add the 5th stat to StatsGrid and change columns to 5**

Replace the `<StatsGrid>` block (lines 127-158) with:

```tsx
			<StatsGrid
				columns={5}
				stats={[
					{
						label: "CA Annuel",
						value: formatCurrency(data.revenue.annual.actual),
						description: `/ ${formatCurrency(data.revenue.annual.target)}`,
						icon: Banknote,
						trend: data.revenue.annual.percent - 100,
					},
					{
						label: "Sécurisé",
						value: formatCurrency(data.secured.annual),
						description: `/ ${formatCurrency(data.revenue.annual.target)}`,
						icon: ShieldCheck,
						trend: data.secured.percent - 100,
					},
					{
						label: `CA ${data.revenue.month.label}`,
						value: formatCurrency(data.revenue.month.actual),
						description: `/ ${formatCurrency(data.revenue.month.target)}`,
						icon: Calendar,
						trend: data.revenue.month.percent - 100,
					},
					{
						label: "Jours",
						value: `${data.days.month.actual}j`,
						description: `/ ${data.days.month.target}j`,
						icon: Clock,
						trend: data.days.month.percent - 100,
					},
					{
						label: "TJM moyen",
						value: formatCurrency(data.tjm.actual),
						description: `cible ${formatCurrency(data.tjm.target)}`,
						icon: TrendingUp,
						trend: data.tjm.trend,
					},
				]}
			/>
```

**Step 3: Verify build**

Run: `cd apps/ops && pnpm build`
Expected: Build succeeds, no type errors.

**Step 4: Commit**

```bash
git add apps/ops/app/\(main\)/goals/_client.tsx
git commit -m "feat(ops): add secured revenue stat card to goals page"
```

---

### Task 5: Manual verification

**Step 1: Start the dev server**

Run: `pnpm dev:ops`

**Step 2: Verify Goals page**

1. Navigate to `/goals`
2. Check the StatsGrid shows 5 cards including "Sécurisé"
3. Verify the secured value reflects active contracts
4. Check the "Projection fin d'année" uses the hybrid logic (should be higher than before if contracts exist for future months)

**Step 3: Verify Treasury still works**

1. Navigate to `/treasury`
2. Check the forecast chart still renders correctly
3. Verify numbers are consistent (contract revenue should match between goals and treasury)

**Step 4: Edge cases to check**

- No active contracts → "Sécurisé" shows 0€, projection falls back to targets
- Contract that ends mid-year → only contributes to months within range
- Contract revenue > target → projection uses contract amount for those months
