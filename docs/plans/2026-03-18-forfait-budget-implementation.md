# Forfait Budget Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add a `budgetAmount` field on forfait contracts and display a progress bar with health badge on the project detail page.

**Architecture:** 4 layers — schema → mutations → metrics lib → UI. Each layer builds on the previous.

**Tech Stack:** Convex (schema + mutations), React 19, @blazz/ui components, zod + react-hook-form

---

### Task 1: Add `budgetAmount` to Convex schema

**Files:**
- Modify: `apps/ops/convex/schema.ts:42-57`

**Step 1: Add the field**

In `schema.ts`, add `budgetAmount: v.optional(v.number())` to the `contracts` table, after line 48 (`prestationStartDate`):

```ts
contracts: defineTable({
    userId: v.string(),
    projectId: v.id("projects"),
    type: v.union(v.literal("tma"), v.literal("forfait"), v.literal("regie")),
    daysPerMonth: v.optional(v.number()),
    carryOver: v.boolean(),
    budgetAmount: v.optional(v.number()), // ← NEW — forfait budget in €
    prestationStartDate: v.optional(v.string()),
    startDate: v.string(),
    endDate: v.string(),
    status: v.union(v.literal("active"), v.literal("completed"), v.literal("cancelled")),
    notes: v.optional(v.string()),
    createdAt: v.number(),
})
```

**Step 2: Verify**

Run: `cd apps/ops && npx convex dev --once`
Expected: Schema pushed successfully (additive change, no migration needed).

**Step 3: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add budgetAmount field to contracts schema"
```

---

### Task 2: Update Convex mutations to accept `budgetAmount`

**Files:**
- Modify: `apps/ops/convex/contracts.ts:47-82` (create mutation)
- Modify: `apps/ops/convex/contracts.ts:85-110` (update mutation)

**Step 1: Add `budgetAmount` to `create` mutation args**

In `contracts.ts`, add to the `create` args (after `daysPerMonth`):

```ts
budgetAmount: v.optional(v.number()),
```

**Step 2: Add `budgetAmount` to `update` mutation args**

Same — add to the `update` args (after `daysPerMonth`):

```ts
budgetAmount: v.optional(v.number()),
```

**Step 3: Verify**

Run: `cd apps/ops && npx convex dev --once`
Expected: Functions pushed successfully.

**Step 4: Commit**

```bash
git add apps/ops/convex/contracts.ts
git commit -m "feat(ops): accept budgetAmount in contract create/update mutations"
```

---

### Task 3: Add `computeForfaitMetrics()` in lib

**Files:**
- Modify: `apps/ops/lib/contracts.ts`

**Step 1: Add the interface and function**

Append after `computeContractMetrics()` (after line 123):

```ts
export interface ForfaitMetrics {
    budgetTotal: number
    consumed: number
    remaining: number
    percentUsed: number
    health: ContractHealth
}

/**
 * Compute forfait contract metrics.
 * Consumption = sum of (minutes / 60 * hourlyRate) for billable entries within contract period.
 */
export function computeForfaitMetrics(opts: {
    budgetAmount: number
    entries: Array<{ date: string; minutes: number; hourlyRate: number; billable: boolean }>
    startDate: string
    endDate: string
}): ForfaitMetrics {
    const consumed = opts.entries
        .filter((e) => e.billable && e.date >= opts.startDate && e.date <= opts.endDate)
        .reduce((sum, e) => sum + (e.minutes / 60) * e.hourlyRate, 0)

    const remaining = opts.budgetAmount - consumed
    const percentUsed = opts.budgetAmount > 0 ? (consumed / opts.budgetAmount) * 100 : 0

    let health: ContractHealth = "ok"
    if (percentUsed >= 100) health = "over"
    else if (percentUsed >= 90) health = "danger"
    else if (percentUsed >= 70) health = "warning"

    return {
        budgetTotal: opts.budgetAmount,
        consumed: Math.round(consumed),
        remaining: Math.round(remaining),
        percentUsed: Math.round(percentUsed * 10) / 10,
        health,
    }
}
```

**Step 2: Commit**

```bash
git add apps/ops/lib/contracts.ts
git commit -m "feat(ops): add computeForfaitMetrics for forfait budget tracking"
```

---

### Task 4: Update `ContractForm` — add budget field for forfait

**Files:**
- Modify: `apps/ops/components/contract-form.tsx`

**Step 1: Add `budgetAmount` to the zod schema**

In the `schema` object (line 27-55), add inside `.object({})`:

```ts
budgetAmount: z.preprocess(
    (v) => (v === "" || v === undefined ? undefined : Number(v)),
    z.number().positive("Requis pour un forfait").optional()
),
```

Add a refinement after the existing ones:

```ts
.refine((d) => d.type !== "forfait" || (d.budgetAmount && d.budgetAmount > 0), {
    message: "Budget requis pour un contrat forfait",
    path: ["budgetAmount"],
})
```

**Step 2: Add the conditional field in JSX**

After the TMA `daysPerMonth` block (after line 202), add:

```tsx
{/* Budget amount — only for Forfait */}
{contractType === "forfait" && (
    <div className="space-y-1.5">
        <Label htmlFor="budgetAmount">Budget forfait (€) *</Label>
        <Input
            id="budgetAmount"
            type="number"
            step="100"
            placeholder="Ex: 15000"
            {...register("budgetAmount")}
        />
        {errors.budgetAmount && (
            <p className="text-xs text-red-500">{errors.budgetAmount.message}</p>
        )}
    </div>
)}
```

**Step 3: Pass `budgetAmount` in `onSubmit`**

In the `update` call (line 128-138), add:

```ts
budgetAmount: values.type === "forfait" ? values.budgetAmount : undefined,
```

The `create` call (line 144) already uses spread `{ projectId, ...values }` so `budgetAmount` will be included automatically.

**Step 4: Verify**

Run: `pnpm dev:ops` and create a contract with type "Forfait" — the budget field should appear.

**Step 5: Commit**

```bash
git add apps/ops/components/contract-form.tsx
git commit -m "feat(ops): add budget field to contract form for forfait type"
```

---

### Task 5: Update `ContractSection` — show forfait progress bar

**Files:**
- Modify: `apps/ops/components/contract-section.tsx`

**Step 1: Update imports and props**

Add `ForfaitMetrics` to the import from `@/lib/contracts`:

```ts
import { type ContractMetrics, type ForfaitMetrics, healthColor } from "@/lib/contracts"
```

Update the props interface:

```ts
interface ContractSectionProps {
    contract: Doc<"contracts">
    metrics: ContractMetrics | null
    forfaitMetrics: ForfaitMetrics | null // ← NEW
    onComplete?: () => void
    onEdit?: () => void
}
```

Update the component signature:

```ts
export function ContractSection({ contract, metrics, forfaitMetrics, onComplete, onEdit }: ContractSectionProps) {
```

**Step 2: Add forfait metrics display**

After the existing `{metrics && colors && ( ... )}` block (after line 227), add:

```tsx
{/* Forfait metrics */}
{forfaitMetrics && (() => {
    const fColors = healthColor(forfaitMetrics.health)
    const clampedForfait = Math.min(forfaitMetrics.percentUsed, 100)
    return (
        <div className="space-y-3">
            {/* Alert banner */}
            {forfaitMetrics.health === "over" && (
                <div className={`px-4 py-2.5 rounded-lg text-sm font-medium ${fColors.bg} ${fColors.text}`}>
                    Dépassement de {Math.abs(forfaitMetrics.remaining).toLocaleString("fr-FR")}€
                </div>
            )}
            {(forfaitMetrics.health === "danger" || forfaitMetrics.health === "warning") && (
                <div className={`px-4 py-2.5 rounded-lg text-sm font-medium ${fColors.bg} ${fColors.text}`}>
                    {forfaitMetrics.percentUsed}% du budget consommé
                </div>
            )}

            {/* Progress bar */}
            <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-fg-muted">Budget consommé</span>
                    <span className="text-fg font-mono font-medium">
                        {forfaitMetrics.consumed.toLocaleString("fr-FR")}€ / {forfaitMetrics.budgetTotal.toLocaleString("fr-FR")}€ ({forfaitMetrics.percentUsed}%)
                    </span>
                </div>
                <div className="h-2.5 bg-surface-3 rounded-full overflow-hidden border border-edge">
                    <div
                        className={`h-full rounded-full transition-all ${fColors.bar}`}
                        style={{ width: `${clampedForfait}%` }}
                    />
                </div>
            </div>
        </div>
    )
})()}
```

**Step 3: Commit**

```bash
git add apps/ops/components/contract-section.tsx
git commit -m "feat(ops): display forfait budget progress bar in contract section"
```

---

### Task 6: Wire forfait metrics in the project detail page

**Files:**
- Modify: `apps/ops/app/(main)/clients/[id]/projects/[pid]/_client.tsx`

**Step 1: Import `computeForfaitMetrics`**

Update the import from `@/lib/contracts` (line 51):

```ts
import { computeContractMetrics, computeForfaitMetrics } from "@/lib/contracts"
```

**Step 2: Compute forfait metrics**

After the `contractMetrics` computation (around line 520-528), add:

```ts
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
```

**Step 3: Pass to ContractSection**

Update the `<ContractSection>` call (line 618-631) to include:

```tsx
<ContractSection
    contract={activeContract}
    metrics={contractMetrics}
    forfaitMetrics={forfaitMetrics}
    onEdit={() => setEditingContract(activeContract)}
    onComplete={async () => { ... }}
/>
```

**Step 4: Verify end-to-end**

1. Run `pnpm dev:ops`
2. Navigate to a project
3. Create a forfait contract with budget 15000€
4. Add time entries within the contract period
5. Verify the progress bar shows correct consumption

**Step 5: Commit**

```bash
git add apps/ops/app/(main)/clients/[id]/projects/[pid]/_client.tsx
git commit -m "feat(ops): wire forfait metrics on project detail page"
```
