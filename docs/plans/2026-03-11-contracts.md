# Contracts/TMA Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add TMA contract tracking to Blazz Ops — fixed days/month with carry-over, monthly breakdown, and integration into existing project pages.

**Architecture:** New `contracts` table in Convex with queries/mutations, a `lib/contracts.ts` utility for monthly metrics computation, a contract form component, a contract section display component, and integration into the project detail and projects list pages. Cohabits with existing `budgetAmount` system.

**Tech Stack:** Convex (schema, queries, mutations), React 19, react-hook-form + zod, recharts, @blazz/ui components

**Design doc:** `docs/plans/2026-03-11-contracts-design.md`

---

### Task 1: Add `contracts` table to Convex schema

**Files:**
- Modify: `apps/ops/convex/schema.ts:31` (after projects table)

**Step 1: Add the contracts table definition**

Insert after line 31 (after projects table closing `.index("by_status", ["status"]),`):

```ts
	contracts: defineTable({
		projectId: v.id("projects"),
		type: v.union(v.literal("tma"), v.literal("forfait")),
		daysPerMonth: v.optional(v.number()),
		carryOver: v.boolean(),
		startDate: v.string(),
		endDate: v.string(),
		status: v.union(
			v.literal("active"),
			v.literal("completed"),
			v.literal("cancelled")
		),
		notes: v.optional(v.string()),
		createdAt: v.number(),
	})
		.index("by_project", ["projectId"])
		.index("by_status", ["status"]),
```

**Step 2: Verify schema syncs**

Run: `cd apps/ops && npx convex dev --once`
Expected: Schema push succeeds, new `contracts` table created.

**Step 3: Commit**

```bash
git add apps/ops/convex/schema.ts
git commit -m "feat(ops): add contracts table to Convex schema"
```

---

### Task 2: Create Convex queries & mutations for contracts

**Files:**
- Create: `apps/ops/convex/contracts.ts`

**Step 1: Create the contracts module with all queries and mutations**

Follow the exact patterns from `apps/ops/convex/projects.ts` (imports, `requireAuth`, validators).

```ts
import { mutation, query } from "./_generated/server"
import { v } from "convex/values"
import { requireAuth } from "./lib/auth"

const contractStatusValidator = v.union(
  v.literal("active"),
  v.literal("completed"),
  v.literal("cancelled")
)

const contractTypeValidator = v.union(
  v.literal("tma"),
  v.literal("forfait")
)

// ── Queries ────────────────────────────────────────

export const getActiveByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    await requireAuth(ctx)
    const contracts = await ctx.db
      .query("contracts")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect()
    return contracts.find((c) => c.status === "active") ?? null
  },
})

export const listByProject = query({
  args: { projectId: v.id("projects") },
  handler: async (ctx, { projectId }) => {
    await requireAuth(ctx)
    const contracts = await ctx.db
      .query("contracts")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .collect()
    return contracts.sort((a, b) => b.createdAt - a.createdAt)
  },
})

// ── Mutations ──────────────────────────────────────

export const create = mutation({
  args: {
    projectId: v.id("projects"),
    type: contractTypeValidator,
    daysPerMonth: v.optional(v.number()),
    carryOver: v.boolean(),
    startDate: v.string(),
    endDate: v.string(),
    status: contractStatusValidator,
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await requireAuth(ctx)

    // Enforce: only one active contract per project
    if (args.status === "active") {
      const existing = await ctx.db
        .query("contracts")
        .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
        .collect()
      const hasActive = existing.some((c) => c.status === "active")
      if (hasActive) {
        throw new Error("Ce projet a déjà un contrat actif. Clôturez-le d'abord.")
      }
    }

    // Enforce: daysPerMonth required for TMA
    if (args.type === "tma" && (!args.daysPerMonth || args.daysPerMonth <= 0)) {
      throw new Error("Le nombre de jours/mois est requis pour un contrat TMA.")
    }

    return ctx.db.insert("contracts", { ...args, createdAt: Date.now() })
  },
})

export const update = mutation({
  args: {
    id: v.id("contracts"),
    endDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...fields }) => {
    await requireAuth(ctx)
    return ctx.db.patch(id, fields)
  },
})

export const complete = mutation({
  args: { id: v.id("contracts") },
  handler: async (ctx, { id }) => {
    await requireAuth(ctx)
    return ctx.db.patch(id, { status: "completed" })
  },
})

export const cancel = mutation({
  args: { id: v.id("contracts") },
  handler: async (ctx, { id }) => {
    await requireAuth(ctx)
    return ctx.db.patch(id, { status: "cancelled" })
  },
})
```

**Step 2: Verify compilation**

Run: `cd apps/ops && npx convex dev --once`
Expected: Functions deployed successfully.

**Step 3: Commit**

```bash
git add apps/ops/convex/contracts.ts
git commit -m "feat(ops): add contracts queries and mutations"
```

---

### Task 3: Create `lib/contracts.ts` — monthly metrics computation

**Files:**
- Create: `apps/ops/lib/contracts.ts`

Follow the pattern from `apps/ops/lib/budget.ts` (types, compute function, health colors).

**Step 1: Create the contracts utility library**

```ts
import { type BudgetHealth, healthColor } from "./budget"

export { healthColor }
export type ContractHealth = BudgetHealth

export interface MonthRow {
  month: string          // "2026-03"
  allocated: number      // days available (base + carry)
  consumed: number       // days consumed
  carryIn: number        // days carried from previous month
  remaining: number      // allocated - consumed
  health: ContractHealth
}

export interface ContractMetrics {
  daysAllocatedThisMonth: number
  daysConsumedThisMonth: number
  daysRemainingThisMonth: number
  carryInThisMonth: number
  contractHealth: ContractHealth
  totalDaysAllocated: number
  totalDaysConsumed: number
  monthlyBreakdown: MonthRow[]
}

/**
 * Build month-by-month breakdown for a TMA contract.
 * Returns null if contract has no daysPerMonth.
 */
export function computeContractMetrics(opts: {
  daysPerMonth: number
  carryOver: boolean
  startDate: string       // ISO "2026-01-01"
  endDate: string         // ISO "2026-12-31"
  hoursPerDay: number
  /** All billable time entries for the project within the contract period */
  entries: Array<{ date: string; minutes: number; billable: boolean }>
}): ContractMetrics | null {
  if (opts.daysPerMonth <= 0) return null

  const start = new Date(opts.startDate)
  const end = new Date(opts.endDate)
  const now = new Date()
  const effectiveEnd = end < now ? end : now

  // Build list of months: "2026-01", "2026-02", ...
  const months: string[] = []
  const cursor = new Date(start.getFullYear(), start.getMonth(), 1)
  const lastMonth = new Date(effectiveEnd.getFullYear(), effectiveEnd.getMonth(), 1)
  while (cursor <= lastMonth) {
    months.push(
      `${cursor.getFullYear()}-${String(cursor.getMonth() + 1).padStart(2, "0")}`
    )
    cursor.setMonth(cursor.getMonth() + 1)
  }
  if (months.length === 0) return null

  // Group billable entries by month
  const minutesByMonth: Record<string, number> = {}
  for (const e of opts.entries) {
    if (!e.billable) continue
    const m = e.date.slice(0, 7)
    minutesByMonth[m] = (minutesByMonth[m] ?? 0) + e.minutes
  }

  // Build rows
  const minutesPerDay = opts.hoursPerDay * 60
  let carry = 0
  const rows: MonthRow[] = months.map((month) => {
    const allocated = opts.daysPerMonth + (opts.carryOver ? carry : 0)
    const consumed =
      minutesPerDay > 0
        ? Math.round(((minutesByMonth[month] ?? 0) / minutesPerDay) * 10) / 10
        : 0
    const remaining = Math.round((allocated - consumed) * 10) / 10
    const percentUsed = allocated > 0 ? (consumed / allocated) * 100 : 0

    let health: ContractHealth = "ok"
    if (percentUsed >= 100) health = "over"
    else if (percentUsed >= 90) health = "danger"
    else if (percentUsed >= 70) health = "warning"

    const carryIn = opts.carryOver ? carry : 0

    // Update carry for next month: only positive remaining carries over
    carry = opts.carryOver ? Math.max(0, remaining) : 0

    return { month, allocated, consumed, carryIn, remaining, health }
  })

  // Current month metrics
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const currentRow = rows.find((r) => r.month === currentMonth) ?? rows[rows.length - 1]

  const totalDaysAllocated = rows.reduce((s, r) => s + opts.daysPerMonth, 0)
  const totalDaysConsumed = rows.reduce((s, r) => s + r.consumed, 0)

  return {
    daysAllocatedThisMonth: currentRow.allocated,
    daysConsumedThisMonth: currentRow.consumed,
    daysRemainingThisMonth: currentRow.remaining,
    carryInThisMonth: currentRow.carryIn,
    contractHealth: currentRow.health,
    totalDaysAllocated,
    totalDaysConsumed: Math.round(totalDaysConsumed * 10) / 10,
    monthlyBreakdown: rows,
  }
}
```

**Step 2: Commit**

```bash
git add apps/ops/lib/contracts.ts
git commit -m "feat(ops): add contract metrics computation library"
```

---

### Task 4: Create `contract-form.tsx`

**Files:**
- Create: `apps/ops/components/contract-form.tsx`

Follow the exact pattern from `apps/ops/components/project-form.tsx` (react-hook-form + zod + Convex mutations + @blazz/ui components).

**Step 1: Create the contract form component**

```tsx
"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"
import { toast } from "sonner"
import { Button } from "@blazz/ui/components/ui/button"
import { DateRangeSelector } from "@blazz/ui/components/ui/date-selector"
import { DialogFooter } from "@blazz/ui/components/ui/dialog"
import { Input } from "@blazz/ui/components/ui/input"
import { Label } from "@blazz/ui/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@blazz/ui/components/ui/select"
import { Switch } from "@blazz/ui/components/ui/switch"
import { format, parseISO } from "date-fns"

const schema = z
  .object({
    type: z.enum(["tma", "forfait"]),
    daysPerMonth: z.preprocess(
      (v) => (v === "" || v === undefined ? undefined : Number(v)),
      z.number().positive("Requis pour TMA").optional()
    ),
    carryOver: z.boolean(),
    startDate: z.string().min(1, "Date de début requise"),
    endDate: z.string().min(1, "Date de fin requise"),
    status: z.enum(["active", "completed", "cancelled"]),
    notes: z.string().optional(),
  })
  .refine(
    (d) => d.type !== "tma" || (d.daysPerMonth && d.daysPerMonth > 0),
    { message: "Jours/mois requis pour un contrat TMA", path: ["daysPerMonth"] }
  )

type FormValues = z.infer<typeof schema>

interface Props {
  projectId: Id<"projects">
  defaultValues?: Partial<FormValues> & { id?: Id<"contracts"> }
  onSuccess?: () => void
  onCancel?: () => void
}

export function ContractForm({ projectId, defaultValues, onSuccess, onCancel }: Props) {
  const create = useMutation(api.contracts.create)
  const update = useMutation(api.contracts.update)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      type: "tma",
      carryOver: false,
      status: "active",
      ...defaultValues,
    },
  })

  const contractType = watch("type")

  const onSubmit = async (values: FormValues) => {
    try {
      if (defaultValues?.id) {
        await update({
          id: defaultValues.id,
          endDate: values.endDate,
          notes: values.notes,
        })
        toast.success("Contrat mis à jour")
      } else {
        await create({ projectId, ...values })
        toast.success("Contrat créé")
      }
      onSuccess?.()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Une erreur est survenue")
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Type */}
      <div className="space-y-1.5">
        <Label>Type *</Label>
        <Select
          value={watch("type")}
          onValueChange={(v) => setValue("type", v as "tma" | "forfait")}
          items={[
            { value: "tma", label: "TMA (jours/mois)" },
            { value: "forfait", label: "Forfait" },
          ]}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="tma" label="TMA (jours/mois)">TMA (jours/mois)</SelectItem>
            <SelectItem value="forfait" label="Forfait">Forfait</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Days per month — only for TMA */}
      {contractType === "tma" && (
        <div className="space-y-1.5">
          <Label htmlFor="daysPerMonth">Jours / mois *</Label>
          <Input
            id="daysPerMonth"
            type="number"
            step="0.5"
            placeholder="Ex: 5"
            {...register("daysPerMonth")}
          />
          {errors.daysPerMonth && (
            <p className="text-xs text-red-500">{errors.daysPerMonth.message}</p>
          )}
        </div>
      )}

      {/* Carry-over switch */}
      {contractType === "tma" && (
        <div className="flex items-center justify-between">
          <Label htmlFor="carryOver">Report des jours non consommés</Label>
          <Switch
            id="carryOver"
            checked={watch("carryOver")}
            onCheckedChange={(v) => setValue("carryOver", v)}
          />
        </div>
      )}

      {/* Period */}
      <div className="space-y-1.5">
        <Label>Période *</Label>
        <DateRangeSelector
          from={watch("startDate") ? parseISO(watch("startDate")) : undefined}
          to={watch("endDate") ? parseISO(watch("endDate")) : undefined}
          onRangeChange={({ from, to }) => {
            setValue("startDate", from ? format(from, "yyyy-MM-dd") : "")
            setValue("endDate", to ? format(to, "yyyy-MM-dd") : "")
          }}
          fromPlaceholder="Début…"
          toPlaceholder="Fin…"
          className="w-full"
        />
        {errors.startDate && (
          <p className="text-xs text-red-500">{errors.startDate.message}</p>
        )}
      </div>

      {/* Status */}
      <div className="space-y-1.5">
        <Label>Statut</Label>
        <Select
          value={watch("status")}
          onValueChange={(v) =>
            setValue("status", v as "active" | "completed" | "cancelled")
          }
          items={[
            { value: "active", label: "Actif" },
            { value: "completed", label: "Terminé" },
            { value: "cancelled", label: "Annulé" },
          ]}
        >
          <SelectTrigger className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active" label="Actif">Actif</SelectItem>
            <SelectItem value="completed" label="Terminé">Terminé</SelectItem>
            <SelectItem value="cancelled" label="Annulé">Annulé</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Notes */}
      <div className="space-y-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" placeholder="Optionnel…" {...register("notes")} />
      </div>

      <DialogFooter>
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
            Annuler
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {defaultValues?.id ? "Mettre à jour" : "Créer le contrat"}
        </Button>
      </DialogFooter>
    </form>
  )
}
```

**Step 2: Verify no TypeScript errors**

Run: `cd apps/ops && npx tsc --noEmit 2>&1 | head -20`
Expected: No errors related to contract-form.tsx (ignore Convex generated type errors if any).

**Step 3: Commit**

```bash
git add apps/ops/components/contract-form.tsx
git commit -m "feat(ops): add contract form component"
```

---

### Task 5: Create `contract-section.tsx` — display component

**Files:**
- Create: `apps/ops/components/contract-section.tsx`

Follow the pattern from `apps/ops/components/budget-section.tsx`.

**Step 1: Create the contract section display component**

```tsx
"use client"

import { Card, CardContent } from "@blazz/ui/components/ui/card"
import { type ContractMetrics, healthColor } from "@/lib/contracts"
import type { Doc } from "@/convex/_generated/dataModel"

interface ContractSectionProps {
  contract: Doc<"contracts">
  metrics: ContractMetrics
  daysPerMonth: number
}

const CONTRACT_STATUS_LABEL: Record<string, string> = {
  active: "Actif",
  completed: "Terminé",
  cancelled: "Annulé",
}

export function ContractSection({ contract, metrics, daysPerMonth }: ContractSectionProps) {
  const colors = healthColor(metrics.contractHealth)
  const percentThisMonth =
    metrics.daysAllocatedThisMonth > 0
      ? Math.round(
          (metrics.daysConsumedThisMonth / metrics.daysAllocatedThisMonth) * 100 * 10
        ) / 10
      : 0
  const clampedPercent = Math.min(percentThisMonth, 100)

  return (
    <div className="space-y-4">
      {/* Contract header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-fg">Contrat TMA</h3>
          <span className="text-xs text-fg-muted">
            {contract.startDate} → {contract.endDate}
          </span>
        </div>
        <span className="text-xs text-fg-muted">
          {CONTRACT_STATUS_LABEL[contract.status]}
        </span>
      </div>

      {/* Alert banner */}
      {metrics.contractHealth === "over" && (
        <div className={`px-4 py-2.5 rounded-lg text-sm font-medium ${colors.bg} ${colors.text}`}>
          Dépassement de {Math.abs(metrics.daysRemainingThisMonth)}j ce mois
        </div>
      )}
      {(metrics.contractHealth === "danger" || metrics.contractHealth === "warning") && (
        <div className={`px-4 py-2.5 rounded-lg text-sm font-medium ${colors.bg} ${colors.text}`}>
          {percentThisMonth}% des jours consommés ce mois
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-fg-muted mb-1">Ce mois</p>
            <p className="text-xl font-semibold font-mono">
              {metrics.daysConsumedThisMonth}
              <span className="text-sm text-fg-muted font-normal">/{metrics.daysAllocatedThisMonth}j</span>
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-fg-muted mb-1">Restant ce mois</p>
            <p className={`text-xl font-semibold font-mono ${
              metrics.daysRemainingThisMonth < 0
                ? "text-red-600 dark:text-red-400"
                : "text-green-600 dark:text-green-400"
            }`}>
              {metrics.daysRemainingThisMonth}j
            </p>
          </CardContent>
        </Card>
        {contract.carryOver && metrics.carryInThisMonth > 0 && (
          <Card>
            <CardContent className="p-4">
              <p className="text-xs text-fg-muted mb-1">Report entrant</p>
              <p className="text-xl font-semibold font-mono">
                +{metrics.carryInThisMonth}j
              </p>
            </CardContent>
          </Card>
        )}
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-fg-muted mb-1">Total contrat</p>
            <p className="text-xl font-semibold font-mono">
              {metrics.totalDaysConsumed}
              <span className="text-sm text-fg-muted font-normal">/{metrics.totalDaysAllocated}j</span>
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress bar — this month */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-fg-muted">Consommation du mois</span>
          <span className="text-fg font-mono font-medium">
            {metrics.daysConsumedThisMonth} / {metrics.daysAllocatedThisMonth}j ({percentThisMonth}%)
          </span>
        </div>
        <div className="h-2.5 bg-raised rounded-full overflow-hidden border border-edge">
          <div
            className={`h-full rounded-full transition-all ${colors.bar}`}
            style={{ width: `${clampedPercent}%` }}
          />
        </div>
      </div>

      {/* Monthly breakdown table */}
      {metrics.monthlyBreakdown.length > 1 && (
        <div className="space-y-2">
          <p className="text-xs text-fg-muted">Historique mensuel</p>
          <div className="border border-edge rounded-lg overflow-hidden">
            <table className="w-full text-xs">
              <thead>
                <tr className="bg-raised">
                  <th className="text-left px-3 py-2 font-medium text-fg-muted">Mois</th>
                  <th className="text-right px-3 py-2 font-medium text-fg-muted">Alloués</th>
                  <th className="text-right px-3 py-2 font-medium text-fg-muted">Consommés</th>
                  {contract.carryOver && (
                    <th className="text-right px-3 py-2 font-medium text-fg-muted">Report</th>
                  )}
                  <th className="text-right px-3 py-2 font-medium text-fg-muted">Restant</th>
                </tr>
              </thead>
              <tbody>
                {metrics.monthlyBreakdown.map((row) => {
                  const rowColors = healthColor(row.health)
                  return (
                    <tr key={row.month} className="border-t border-edge">
                      <td className="px-3 py-2 font-mono text-fg">{row.month}</td>
                      <td className="text-right px-3 py-2 font-mono text-fg-muted">{row.allocated}j</td>
                      <td className="text-right px-3 py-2 font-mono text-fg">{row.consumed}j</td>
                      {contract.carryOver && (
                        <td className="text-right px-3 py-2 font-mono text-fg-muted">
                          {row.carryIn > 0 ? `+${row.carryIn}j` : "—"}
                        </td>
                      )}
                      <td className={`text-right px-3 py-2 font-mono font-medium ${rowColors.text}`}>
                        {row.remaining}j
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
```

**Step 2: Commit**

```bash
git add apps/ops/components/contract-section.tsx
git commit -m "feat(ops): add contract section display component"
```

---

### Task 6: Integrate contracts into project detail page

**Files:**
- Modify: `apps/ops/app/(main)/clients/[id]/projects/[pid]/page.tsx`

**Step 1: Add imports**

Add after line 14 (`import { computeBudgetMetrics } from "@/lib/budget"`):

```ts
import { ContractSection } from "@/components/contract-section"
import { ContractForm } from "@/components/contract-form"
import { computeContractMetrics } from "@/lib/contracts"
```

**Step 2: Add query and state**

Add after line 42 (`const [editOpen, setEditOpen] = useState(false)`):

```ts
const [contractOpen, setContractOpen] = useState(false)
const activeContract = useQuery(api.contracts.getActiveByProject, {
  projectId: pid as Id<"projects">,
})
const allContracts = useQuery(api.contracts.listByProject, {
  projectId: pid as Id<"projects">,
})
```

**Step 3: Compute contract metrics**

Add after line 91 (after `budgetMetrics` computation, before `filteredEntries`):

```ts
const contractMetrics =
  activeContract && activeContract.type === "tma" && activeContract.daysPerMonth
    ? computeContractMetrics({
        daysPerMonth: activeContract.daysPerMonth,
        carryOver: activeContract.carryOver,
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
```

**Step 4: Add contract section in JSX**

Insert after the budget section block (after line 172, after `</BudgetSection>` closing `}`):

```tsx
{/* Contract TMA section */}
{activeContract && contractMetrics && (
  <ContractSection
    contract={activeContract}
    metrics={contractMetrics}
    daysPerMonth={activeContract.daysPerMonth!}
  />
)}

{/* Contract management */}
<div className="flex items-center justify-between">
  <h2 className="text-sm font-medium text-fg">Contrats</h2>
  <Button
    size="sm"
    variant="outline"
    onClick={() => setContractOpen(true)}
  >
    Nouveau contrat
  </Button>
</div>

{/* Past contracts list */}
{allContracts && allContracts.filter((c) => c.status !== "active").length > 0 && (
  <div className="space-y-1">
    {allContracts
      .filter((c) => c.status !== "active")
      .map((c) => (
        <div
          key={c._id}
          className="flex items-center justify-between py-2 border-b border-edge last:border-0 text-xs text-fg-muted"
        >
          <span className="font-mono">{c.startDate} → {c.endDate}</span>
          <span>
            {c.type === "tma" ? `${c.daysPerMonth}j/mois` : "Forfait"} ·{" "}
            {c.status === "completed" ? "Terminé" : "Annulé"}
          </span>
        </div>
      ))}
  </div>
)}
```

**Step 5: Add contract dialog**

Insert after the edit project dialog (after line 244, before `</>`):

```tsx
{/* New contract dialog */}
<Dialog open={contractOpen} onOpenChange={setContractOpen}>
  <DialogContent>
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
```

**Step 6: Add Button import if missing**

Verify `Button` is imported. If not, add:
```ts
import { Button } from "@blazz/ui/components/ui/button"
```

**Step 7: Verify the page renders**

Run: `pnpm dev:ops`
Navigate to a project detail page. Verify:
- "Contrats" section appears
- "Nouveau contrat" button opens the form dialog
- Creating a TMA contract shows the contract section with KPI cards and monthly table

**Step 8: Commit**

```bash
git add apps/ops/app/\(main\)/clients/\[id\]/projects/\[pid\]/page.tsx
git commit -m "feat(ops): integrate contracts into project detail page"
```

---

### Task 7: Add contract indicators to projects list page

**Files:**
- Modify: `apps/ops/app/(main)/projects/page.tsx`

**Step 1: Add contract query**

Add after line 31 (`const [filter, setFilter] = useState<StatusFilter>("active")`):

```ts
const contracts = useQuery(api.contracts.listByProject !== undefined ? undefined : undefined)
```

Actually, we need a new query for this. Two options:
- A) Enrich `projects.listAllWithBudget` to also return contract info
- B) Call `contracts.getActiveByProject` per project (N+1 — bad)

**Better approach: enrich `listAllWithBudget` in `convex/projects.ts`.**

Add to `apps/ops/convex/projects.ts`, inside `listAllWithBudget` handler, after computing budget data for each project (line 84):

```ts
// Inside the Promise.all map, after the return statement:
// Fetch active contract for this project
const contracts = await ctx.db
  .query("contracts")
  .withIndex("by_project", (q) => q.eq("projectId", project._id))
  .collect()
const activeContract = contracts.find((c) => c.status === "active")

// Add to the returned object:
// hasActiveContract: !!activeContract,
// contractDaysPerMonth: activeContract?.daysPerMonth ?? null,
// contractType: activeContract?.type ?? null,
```

Then in the projects list page, show the TMA badge when `project.hasActiveContract && project.contractType === "tma"`:

Add after line 116 (after the budget display, before the closing `</span>`):

```tsx
{project.hasActiveContract && project.contractType === "tma" && (
  <span className="text-xs font-medium text-brand">
    TMA {project.contractDaysPerMonth}j/mois
  </span>
)}
```

**Step 2: Verify**

Run: `pnpm dev:ops`, navigate to /projects.
Expected: Projects with active TMA contracts show "TMA Xj/mois" badge.

**Step 3: Commit**

```bash
git add apps/ops/convex/projects.ts apps/ops/app/\(main\)/projects/page.tsx
git commit -m "feat(ops): show TMA contract badge on projects list"
```

---

### Task 8: Smoke test & final verification

**Step 1: Full flow test**

1. Start dev: `pnpm dev:ops`
2. Go to a client → project
3. Click "Nouveau contrat"
4. Create a TMA contract: 5j/mois, carry-over off, dates 2026-01-01 → 2026-12-31
5. Verify: KPI cards show "0/5j ce mois", progress bar at 0%, monthly table appears
6. Add a time entry (billable, 4h) on today's date
7. Verify: KPI updates to show consumed days, progress bar moves, health color correct
8. Go to /projects → verify TMA badge visible
9. Complete the contract → verify it moves to "past contracts" list
10. Create another contract → verify it works (only one active at a time)

**Step 2: Test carry-over**

1. Create a TMA contract with carry-over ON, starting 2 months ago
2. Add entries in past months that don't fully consume the allocation
3. Verify the monthly table shows carry-in values for subsequent months

**Step 3: Final commit if any fixes needed**

```bash
git add -u
git commit -m "fix(ops): polish contracts integration"
```
