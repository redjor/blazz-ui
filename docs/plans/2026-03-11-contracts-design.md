# Contracts — Design Document

**Date:** 2026-03-11
**Scope:** `apps/ops/`
**Status:** Validated

## Context

Blazz Ops tracks freelance time and budget per project. The current model uses a single `budgetAmount` field on projects — fine for one-shot forfaits, but insufficient for TMA (Tierce Maintenance Applicative) contracts where a fixed number of days per month is contractualized.

## Requirements (from brainstorming)

- Contract type: **X days/month fixed** (TMA)
- Carry-over: **depends on contract** (configurable per contract)
- Contract changes: **new contract** (close old, create new — no amendments)
- One active contract per project at a time
- Time entries auto-deducted from active contract (no manual linking)
- UI: KPI cards + month-by-month history table

## Approach

**New `contracts` table** (Approach A — separate table with FK to projects). Clean separation, natural history, idiomatic Convex.

## 1. Schema — Table `contracts`

```ts
contracts: defineTable({
  projectId: v.id("projects"),
  type: v.union(v.literal("tma"), v.literal("forfait")),
  daysPerMonth: v.optional(v.number()),    // TMA only
  carryOver: v.boolean(),                   // carry unused days to next month
  startDate: v.string(),                    // ISO date
  endDate: v.string(),                      // ISO date
  status: v.union(
    v.literal("active"),
    v.literal("completed"),
    v.literal("cancelled")
  ),
  notes: v.optional(v.string()),
  createdAt: v.number(),
})
.index("by_project", ["projectId"])
.index("by_status", ["status"])
```

**Business rules:**
- One `active` contract per project at any time (enforced in mutation)
- `daysPerMonth` required if `type === "tma"`, ignored for `forfait`
- For forfait, `budgetAmount` on project is used (no duplication)
- No `totalBudget` field — computed: `daysPerMonth × months × tjm`

## 2. Monthly consumption logic

Library: `lib/contracts.ts` — `computeMonthlyConsumption(contract, timeEntries)`

For each month between `startDate` and `endDate` (or today if ongoing):

| Month   | Allocated | Consumed | Carry in | Carry out |
|---------|-----------|----------|----------|-----------|
| 2026-01 | 5         | 3        | 0        | 2         |
| 2026-02 | 5+2=7     | 6        | 2        | 1         |
| 2026-03 | 5+1=6     | 7        | 1        | -1 (over) |

**Rules:**
- `consumed` = sum of billable minutes for the month ÷ (hoursPerDay × 60)
- `carryOver: true` → unused days roll to next month
- `carryOver: false` → each month resets to `daysPerMonth`
- Overrun is informational (negative remaining), not blocking

**Derived metrics (for KPI cards):**
- `daysAllocatedThisMonth` — available days this month (base + carry)
- `daysConsumedThisMonth` — consumed days this month
- `daysRemainingThisMonth` — delta
- `contractHealth` — ok / warning (≥70%) / danger (≥90%) / over (>100%)
- `totalDaysConsumed` / `totalDaysAllocated` — across entire contract duration

## 3. Backend — Queries & Mutations

### Mutations (`convex/contracts.ts`)

- `contracts.create` — validates no other `active` contract on project. Requires `daysPerMonth` if TMA.
- `contracts.update` — modify notes, endDate only. Volume changes = new contract.
- `contracts.complete` — sets status to `completed`.
- `contracts.cancel` — sets status to `cancelled`.

### Queries

- `contracts.getActiveByProject(projectId)` — active contract or null.
- `contracts.listByProject(projectId)` — all contracts, sorted by date desc (history).
- `contracts.getWithMonthlyBreakdown(contractId)` — contract + month-by-month table joining timeEntries.

### Impact on existing queries

- `projects.getWithStats` — if active contract exists, add `contractMetrics` (this month days, health, etc.).
- `projects.listAllWithBudget` — add `hasActiveContract` + `contractHealth` indicators.

## 4. UI

### A) Project detail page (`clients/[id]/projects/[pid]/page.tsx`)

- **KPI card** — "Contrat TMA" card: `3/5 jours ce mois` + health dot + contract period. Complements existing budget logic.
- **Contract section** below KPIs — month-by-month table (allocated | consumed | carry | remaining) with health-based colors (green < 70%, amber, red).
- **Contract history** — past contracts (completed/cancelled) in a discreet accordion.

### B) Projects list page (`projects/page.tsx`)

- Badge: "TMA 3/5j" with health dot, alongside existing budget display.

### C) Client detail page (`clients/[id]/page.tsx`)

- Existing health dot logic extended to TMA contracts.

### D) Contract form — `contract-form.tsx`

- Dialog from project detail page ("Nouveau contrat" button).
- Fields: type (TMA/forfait), daysPerMonth (conditional), startDate, endDate, carryOver (switch), notes.
- Zod validation: daysPerMonth required if TMA, endDate > startDate.

**No new routes** — everything lives in the existing project detail page.

## 5. Cohabitation with existing budget

- **Active TMA contract** → contract tracking takes priority in KPIs and detail section. `budgetAmount` stays stored but not displayed.
- **`budgetAmount` without contract** → current behavior unchanged (global envelope, burn-down chart).
- **Neither** → time/revenue tracking only, as today.

No migration of existing `budgetAmount`. Both systems coexist, contract takes priority when present.
