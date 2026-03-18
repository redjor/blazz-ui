# SegmentedProgress + BudgetCard Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Extract the segmented dot progress bar and budget card from apps/ops into reusable @blazz/pro blocks.

**Architecture:** Two new files in `packages/pro/src/components/blocks/`. `SegmentedProgress` is a standalone responsive dot bar using ResizeObserver. `BudgetCard` composes it with title, revenue, days and label. Both wrapped with `withProGuard`. Then refactor `apps/ops` dashboard to consume the new blocks.

**Tech Stack:** React 19, Tailwind v4, @blazz/ui primitives, withProGuard

---

### Task 1: Create SegmentedProgress block

**Files:**
- Create: `packages/pro/src/components/blocks/segmented-progress.tsx`

**Step 1: Write the component**

```tsx
"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@blazz/ui"
import { withProGuard } from "../../lib/with-pro-guard"

export interface SegmentedProgressProps {
  /** Percentage filled (0-100+) */
  percent: number
  /** Dot color — default "brand" */
  color?: "brand" | "caution" | "negative"
  /** Auto-switch color based on percent thresholds (75% caution, 90% negative) */
  autoColor?: boolean
  /** Dot size in px — default 6 */
  dotSize?: number
  /** Gap between dots in px — default 2 */
  gap?: number
  className?: string
}

function resolveColor(
  percent: number,
  color?: "brand" | "caution" | "negative",
  autoColor?: boolean
): string {
  if (autoColor) {
    if (percent > 90) return "bg-negative"
    if (percent > 75) return "bg-caution"
    return "bg-brand"
  }
  const colorMap = { brand: "bg-brand", caution: "bg-caution", negative: "bg-negative" }
  return colorMap[color ?? "brand"]
}

function SegmentedProgressBase({
  percent,
  color,
  autoColor = false,
  dotSize = 6,
  gap = 2,
  className,
}: SegmentedProgressProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [dotCount, setDotCount] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new ResizeObserver(([entry]) => {
      const width = entry.contentRect.width
      setDotCount(Math.floor((width + gap) / (dotSize + gap)))
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [dotSize, gap])

  const filled = Math.round((Math.min(percent, 100) / 100) * dotCount)
  const activeColor = resolveColor(percent, color, autoColor)

  return (
    <div ref={ref} className={cn("flex", className)} style={{ gap }}>
      {Array.from({ length: dotCount }, (_, i) => (
        <div
          key={i}
          className={cn("shrink-0 rounded-[1px]", i < filled ? activeColor : "bg-surface-3")}
          style={{ width: dotSize, height: dotSize }}
        />
      ))}
    </div>
  )
}

export const SegmentedProgress = withProGuard(SegmentedProgressBase, "SegmentedProgress")
```

**Step 2: Commit**

```bash
git add packages/pro/src/components/blocks/segmented-progress.tsx
git commit -m "feat(pro): add SegmentedProgress block component"
```

---

### Task 2: Create BudgetCard block

**Files:**
- Create: `packages/pro/src/components/blocks/budget-card.tsx`

**Step 1: Write the component**

```tsx
"use client"

import { cn } from "@blazz/ui"
import { Card, CardContent } from "@blazz/ui"
import { BlockStack } from "@blazz/ui"
import { Skeleton } from "@blazz/ui"
import { withProGuard } from "../../lib/with-pro-guard"
import { SegmentedProgress } from "./segmented-progress"

export interface BudgetCardProps {
  name: string
  /** Revenue amount (raw number, formatted internally) */
  revenue: number
  daysConsumed: number
  /** Budget consumption percentage */
  percent: number
  /** Label below the bar (e.g. "0.9 / 10j" or "budget €1 200") */
  budgetLabel?: string
  /** If provided, card renders as a link */
  href?: string
  /** Auto-switch bar color based on thresholds — default true */
  autoColor?: boolean
  loading?: boolean
  /** Currency formatter — default Intl fr-FR EUR */
  formatCurrency?: (amount: number) => string
  className?: string
}

const defaultFormat = (amount: number) =>
  `€${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(Math.round(amount))}`

function BudgetCardBase({
  name,
  revenue,
  daysConsumed,
  percent,
  budgetLabel,
  href,
  autoColor = true,
  loading = false,
  formatCurrency = defaultFormat,
  className,
}: BudgetCardProps) {
  if (loading) return <BudgetCardSkeleton className={className} />

  const isWarning = percent > 75 && percent <= 90
  const isDanger = percent > 90

  const content = (
    <Card className={cn("transition-colors duration-150", href && "hover:border-fg-muted/25", className)}>
      <CardContent className="p-4">
        <BlockStack gap="300">
          <span className="text-sm font-medium truncate">{name}</span>

          <div className="flex items-baseline justify-between gap-2">
            <span className="text-lg font-semibold tabular-nums tracking-tight">
              {formatCurrency(revenue)}
            </span>
            <span className="text-xs text-fg-muted tabular-nums">
              {daysConsumed}j
            </span>
          </div>

          <BlockStack gap="100">
            <SegmentedProgress percent={percent} autoColor={autoColor} />
            <div className="flex items-center justify-between">
              <span className="text-2xs text-fg-muted tabular-nums">
                {budgetLabel ?? "\u00A0"}
              </span>
              <span className={cn(
                "text-2xs font-medium tabular-nums",
                isDanger ? "text-negative" : isWarning ? "text-caution" : "text-fg-muted"
              )}>
                {Math.round(percent)}%
              </span>
            </div>
          </BlockStack>
        </BlockStack>
      </CardContent>
    </Card>
  )

  return content
}

function BudgetCardSkeleton({ className }: { className?: string }) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <BlockStack gap="300">
          <Skeleton className="h-4 w-28" />
          <div className="flex items-baseline justify-between">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-3 w-8" />
          </div>
          <Skeleton className="h-1.5 w-full" />
        </BlockStack>
      </CardContent>
    </Card>
  )
}

export const BudgetCard = withProGuard(BudgetCardBase, "BudgetCard")
```

**Step 2: Commit**

```bash
git add packages/pro/src/components/blocks/budget-card.tsx
git commit -m "feat(pro): add BudgetCard block component"
```

---

### Task 3: Export from barrel

**Files:**
- Modify: `packages/pro/src/components/blocks/index.ts`

**Step 1: Add exports**

Add after StatsStrip exports:

```ts
export type { SegmentedProgressProps } from "./segmented-progress"
export { SegmentedProgress } from "./segmented-progress"
export type { BudgetCardProps } from "./budget-card"
export { BudgetCard } from "./budget-card"
```

**Step 2: Commit**

```bash
git add packages/pro/src/components/blocks/index.ts
git commit -m "feat(pro): export SegmentedProgress and BudgetCard from barrel"
```

---

### Task 4: Refactor apps/ops to use new blocks

**Files:**
- Modify: `apps/ops/app/(main)/_client.tsx`

**Step 1: Replace local SegmentedBar and ProjectBudgetCard with imports from @blazz/pro**

- Remove: `DOT_SIZE`, `DOT_GAP`, `SegmentedBar`, `ProjectBudgetCard`, `ProjectBudgetCardSkeleton`
- Remove: `useEffect`, `useRef`, `useState` imports (if no longer used)
- Import: `BudgetCard` from `@blazz/pro/components/blocks/budget-card`
- Replace usage in the grid with `<BudgetCard>` props

**Step 2: Commit**

```bash
git add apps/ops/app/(main)/_client.tsx
git commit -m "refactor(ops): use BudgetCard from @blazz/pro"
```
